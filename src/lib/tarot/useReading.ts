"use client";
import { READING_TIMEOUT_MS, READING_POLL_INTERVAL_MS, READING_WATCHDOG_MS } from "../config/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lang";
import { createReading, fetchReading, loadSpeakers, messagePath, normalizeInterpretation, readingPayload, record, tarotRequest, TarotError, type Reading, type Speaker } from "./reading";
import { connectReadingSocket, type AnswerEvent } from "./socket";
import { readingMessages } from "./messages";
import { useTarotStyle } from "@/components/TarotStyleProvider";
import { resolveSpeakerId } from "./styleStore";
import { clearReadingSession, completeLocaleSwitch, getReadingSession, isReadingOwnerHandedOff, isLocaleSwitchPending, registerReadingOwner, setReadingSession, subscribeReadingSession, unregisterReadingOwner } from "./readingSession";

const activeReadings = new Map<string, AbortController>();

export function useReading(locale: Locale, categoryId: string, spreadId: string, enabled = true, sessionKey = 0) {
  const key = `reading:${sessionKey}`;
  const restored = getReadingSession(key);
  const [speakers, setSpeakersState] = useState<Speaker[]>(restored?.speakers ?? []);
  const { speakerId: preferredSpeakerId, setSpeakerId, getSpeakerId } = useTarotStyle();
  const speakerId = resolveSpeakerId(speakers, preferredSpeakerId);
  const [question, setQuestionState] = useState(restored?.question ?? "");
  const [reading, setReadingState] = useState<Reading | null>(restored?.reading ?? null);
  const [busy, setBusyState] = useState(restored?.busy ?? false);
  const [error, setErrorState] = useState(restored?.error ?? "");
  const [speakerError, setSpeakerErrorState] = useState(restored?.speakerError ?? false);
  const [firstCycleComplete, setFirstCycleCompleteState] = useState(restored?.firstCycleComplete ?? false);
  const [speakerAttempt, setSpeakerAttempt] = useState(0);
  const owner = useRef<string | null>(null);
  const current = useRef<Reading | null>(restored?.reading ?? null);
  const retryRef = useRef<() => Promise<void>>(async () => {});
  const text = readingMessages[locale];
  const snapshot = useRef({ question, reading, busy, error, speakerError, firstCycleComplete, speakers });
  const save = () => setReadingSession(key, snapshot.current);
  const setQuestion = (value: string) => {
    snapshot.current.question = value;
    save();
    setQuestionState(value);
  };
  const setSpeakers = useCallback((value: Speaker[]) => {
    snapshot.current.speakers = value;
    setReadingSession(key, snapshot.current);
    setSpeakersState(value);
  }, [key]);
  const setReading = (value: Reading | null) => {
    snapshot.current.reading = value;
    save();
    setReadingState(value);
  };
  const setBusy = (value: boolean) => {
    snapshot.current.busy = value;
    save();
    setBusyState(value);
  };
  const setError = (value: string) => {
    snapshot.current.error = value;
    save();
    setErrorState(value);
  };
  const setSpeakerError = useCallback((value: boolean) => {
    snapshot.current.speakerError = value;
    setReadingSession(key, snapshot.current);
    setSpeakerErrorState(value);
  }, [key]);
  const setFirstCycleComplete = (value: boolean) => {
    snapshot.current.firstCycleComplete = value;
    save();
    setFirstCycleCompleteState(value);
  };

  useEffect(() => {
    const controller = new AbortController();
    loadSpeakers(locale, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setSpeakers(data);
      setSpeakerId(resolveSpeakerId(data, getSpeakerId()));
      setSpeakerError(false);
    }).catch(() => { if (!controller.signal.aborted) setSpeakerError(true); });
    return () => controller.abort();
  }, [locale, speakerAttempt, setSpeakerId, getSpeakerId, setSpeakerError, setSpeakers]);
  useEffect(() => {
    owner.current = registerReadingOwner(key);
    return () => {
      const keepActive = isReadingOwnerHandedOff(key, owner.current);
      if (!keepActive && !isLocaleSwitchPending()) {
        activeReadings.get(key)?.abort();
        activeReadings.delete(key);
        clearReadingSession(key);
      }
      unregisterReadingOwner(key, owner.current);
      owner.current = null;
    };
  }, [key]);
  useEffect(() => {
    if (categoryId && spreadId && isLocaleSwitchPending()) completeLocaleSwitch();
  }, [categoryId, spreadId]);
  useEffect(() => subscribeReadingSession(key, state => {
    if (!state) return;
    snapshot.current = state;
    current.current = state.reading;
    setQuestionState(state.question);
    setReadingState(state.reading);
    setBusyState(state.busy);
    setErrorState(state.error);
    setSpeakerErrorState(state.speakerError);
    setFirstCycleCompleteState(state.firstCycleComplete);
    setSpeakersState(state.speakers ?? []);
  }), [key]);
  // Exit animations may keep the old panel mounted; stop its flow immediately.
  useEffect(() => {
    if (!enabled && !isLocaleSwitchPending() && !isReadingOwnerHandedOff(key, owner.current)) {
      activeReadings.get(key)?.abort();
      activeReadings.delete(key);
    }
  }, [enabled, key]);

  const reset = useCallback(() => {
    activeReadings.get(key)?.abort(); activeReadings.delete(key); current.current = null;
    snapshot.current = { question: "", reading: null, busy: false, error: "", speakerError: false, firstCycleComplete: false, speakers: [] };
    clearReadingSession(key);
    setReadingState(null); setErrorState(""); setBusyState(false);
  }, [key]);

  async function submit() {
    if (!enabled || activeReadings.has(key) || !question.trim() || !speakers.some(s => s.id === speakerId)) return;
    const controller = new AbortController(); activeReadings.set(key, controller);
    const { signal } = controller;
    setBusy(true); setError("");
    let closeSocket: (() => void) | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let checking = false;
    let fallback = false;
    let deadline = Date.now() + READING_TIMEOUT_MS;
    const queued: AnswerEvent[] = [];
    const clean = () => { closeSocket?.(); clearTimeout(fallbackTimer); clearTimeout(watchdog); };
    signal.addEventListener("abort", clean, { once: true });
    const publish = (next: Reading) => {
      if (signal.aborted || next.id !== current.current?.id) return;
      if (current.current.reading && !next.reading) return;
      next = { ...next, question: current.current.question, cards: current.current.cards };
      current.current = next; setReading(next);
      if (next.reading) { setError(""); clean(); }
    };
    const report = (cause: unknown) => {
      if (!signal.aborted) setError(cause instanceof TarotError && cause.status ? cause.message : text.error);
    };
    const check = async () => {
      if (checking || signal.aborted || !current.current || current.current.reading) return;
      checking = true;
      try { publish(await fetchReading(current.current.id, locale, signal)); }
      catch (cause) { report(cause); }
      finally { checking = false; }
    };
    const poll = async () => {
      await check();
      if (signal.aborted || current.current?.reading) return;
      if (Date.now() >= deadline) { clean(); setError(text.waiting); return; }
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(poll, READING_POLL_INTERVAL_MS);
    };
    const startFallback = () => {
      fallback = true;
      if (!signal.aborted && current.current && !current.current.reading) {
        clearTimeout(fallbackTimer); fallbackTimer = setTimeout(poll, READING_POLL_INTERVAL_MS);
      }
    };
    const answer = async (event: AnswerEvent) => {
      if (signal.aborted || event.sender_type !== "tarot") return;
      const item = current.current;
      if (!item) { queued.push(event); return; }
      if (item.reading) return;
      const path = messagePath(event.url_message, item.chat_id);
      if (!path) return;
      try {
        const data = record(await tarotRequest(path, locale, { signal }));
        if (data.sender !== "tarot") return;
        const interpretation = normalizeInterpretation(data.message);
        if (interpretation) publish({ ...item, reading: interpretation });
        else await check();
      } catch (cause) { report(cause); startFallback(); }
    };
    retryRef.current = async () => {
      if (signal.aborted) return;
      setError(""); deadline = Date.now() + READING_TIMEOUT_MS;
      await check(); startFallback();
    };
    try {
      try { closeSocket = await connectReadingSocket(locale, signal, event => { void answer(event); }, () => { void check(); }, startFallback); }
      catch { signal.throwIfAborted(); fallback = true; }
      const next = await createReading(readingPayload(question, categoryId, spreadId, speakerId), locale, signal);
      if (signal.aborted) return;
      current.current = next; setReading(next);
      if (next.reading) clean();
      else {
        for (const event of queued) void answer(event);
        if (fallback) startFallback();
        // Recover a missed event even when the socket appears connected.
        watchdog = setTimeout(() => { void check(); startFallback(); }, READING_WATCHDOG_MS);
      }
    } catch (cause) {
      report(cause); clean();
      if (!signal.aborted) { activeReadings.delete(key); setBusy(false); controller.abort(); }
    } finally { if (!signal.aborted) setBusy(false); }
  }
  const errorKey = (["error", "waiting", "unavailable"] as const).find(key =>
    Object.values(readingMessages).some(messages => messages[key] === error));
  return { speakers, speakerId, setSpeakerId, question, firstCycleComplete, setFirstCycleComplete,
    setQuestion: (value: string) => { setQuestion(value); setError(""); }, reading, busy, error: errorKey ? text[errorKey] : error,
    speakerError, retrySpeakers: () => { setSpeakerError(false); setSpeakerAttempt(v => v + 1); },
    submit, reset, retry: () => { void retryRef.current(); } };
}
