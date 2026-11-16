"use client";
import { READING_TIMEOUT_MS, READING_POLL_INTERVAL_MS, READING_WATCHDOG_MS } from "../config/constants";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lang";
import { createReading, fetchReading, loadSpeakers, messagePath, normalizeInterpretation, readingPayload, record, tarotRequest, TarotError, type Reading, type Speaker } from "./reading";
import { connectReadingSocket, type AnswerEvent } from "./socket";
import { readingMessages } from "./messages";
import { useTarotStyle } from "@/components/TarotStyleProvider";
import { resolveSpeakerId } from "./styleStore";
import { clearReadingSession, completeLocaleSwitch, getReadingSession, isReadingOwnerHandedOff, isLocaleSwitchPending, registerReadingOwner, resetReadingSession, setReadingSession, subscribeReadingSession, unregisterReadingOwner, updateReadingSession } from "./readingSession";

type ActiveReading = {
  controller: AbortController;
  current: Reading | null;
  retry: () => Promise<void>;
};

const activeReadings = new Map<string, ActiveReading>();

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
        activeReadings.get(key)?.controller.abort();
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
      activeReadings.get(key)?.controller.abort();
      activeReadings.delete(key);
    }
  }, [enabled, key]);

  const reset = useCallback(() => {
    activeReadings.get(key)?.controller.abort(); activeReadings.delete(key);
    snapshot.current = {
      question: "", reading: null, busy: false, error: "", speakerError: false,
      firstCycleComplete: false, speakers: snapshot.current.speakers,
    };
    resetReadingSession(key, snapshot.current);
    setQuestionState(""); setReadingState(null); setErrorState(""); setBusyState(false);
    setSpeakerErrorState(false); setFirstCycleCompleteState(false);
  }, [key]);

  async function submit() {
    if (!enabled || activeReadings.has(key) || !question.trim() || !speakers.some(s => s.id === speakerId)) return;
    const controller = new AbortController();
    const task: ActiveReading = { controller, current: null, retry: async () => {} };
    activeReadings.set(key, task);
    const { signal } = controller;
    updateReadingSession(key, state => ({ ...state, busy: true, error: "" }));
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
      if (signal.aborted || next.id !== task.current?.id) return;
      if (task.current.reading && !next.reading) return;
      next = { ...next, question: getReadingSession(key)?.question ?? task.current.question, cards: task.current.cards };
      task.current = next;
      updateReadingSession(key, state => ({ ...state, reading: next, error: next.reading ? "" : state.error }));
      if (next.reading) clean();
    };
    const report = (cause: unknown) => {
      if (!signal.aborted) updateReadingSession(key, state => ({ ...state, error: cause instanceof TarotError && cause.status ? cause.message : text.error }));
    };
    const check = async () => {
      if (checking || signal.aborted || !task.current || task.current.reading) return;
      checking = true;
      try { publish(await fetchReading(task.current.id, locale, signal)); }
      catch (cause) { report(cause); }
      finally { checking = false; }
    };
    const poll = async () => {
      await check();
      if (signal.aborted || task.current?.reading) return;
      if (Date.now() >= deadline) { clean(); updateReadingSession(key, state => ({ ...state, error: text.waiting })); return; }
      clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(poll, READING_POLL_INTERVAL_MS);
    };
    const startFallback = () => {
      fallback = true;
      if (!signal.aborted && task.current && !task.current.reading) {
        clearTimeout(fallbackTimer); fallbackTimer = setTimeout(poll, READING_POLL_INTERVAL_MS);
      }
    };
    const answer = async (event: AnswerEvent) => {
      if (signal.aborted || event.sender_type !== "tarot") return;
      const item = task.current;
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
    task.retry = async () => {
      if (signal.aborted) return;
      updateReadingSession(key, state => ({ ...state, error: "" })); deadline = Date.now() + READING_TIMEOUT_MS;
      await check(); startFallback();
    };
    try {
      try { closeSocket = await connectReadingSocket(locale, signal, event => { void answer(event); }, () => { void check(); }, startFallback); }
      catch { signal.throwIfAborted(); fallback = true; }
      const next = await createReading(readingPayload(question, categoryId, spreadId, speakerId), locale, signal);
      if (signal.aborted) return;
      task.current = next;
      updateReadingSession(key, state => ({ ...state, reading: next }));
      if (next.reading) clean();
      else {
        for (const event of queued) void answer(event);
        if (fallback) startFallback();
        // Recover a missed event even when the socket appears connected.
        watchdog = setTimeout(() => { void check(); startFallback(); }, READING_WATCHDOG_MS);
      }
    } catch (cause) {
      report(cause); clean();
      if (!signal.aborted) { activeReadings.delete(key); updateReadingSession(key, state => ({ ...state, busy: false })); controller.abort(); }
    } finally { if (!signal.aborted) updateReadingSession(key, state => ({ ...state, busy: false })); }
  }
  const errorKey = (["error", "waiting", "unavailable"] as const).find(key =>
    Object.values(readingMessages).some(messages => messages[key] === error));
  return { speakers, speakerId, setSpeakerId, question, firstCycleComplete, setFirstCycleComplete,
    setQuestion: (value: string) => { setQuestion(value); setError(""); }, reading, busy, error: errorKey ? text[errorKey] : error,
    speakerError, retrySpeakers: () => { setSpeakerError(false); setSpeakerAttempt(v => v + 1); },
    submit, reset, retry: () => { void activeReadings.get(key)?.retry(); } };
}
