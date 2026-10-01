"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lang";
import { createReading, fetchReading, loadSpeakers, messagePath, normalizeInterpretation, readingPayload, record, tarotRequest, TarotError, type Reading, type Speaker } from "./reading";
import { connectReadingSocket, type AnswerEvent } from "./socket";
import { readingMessages } from "./messages";
import { useTarotStyle } from "@/components/TarotStyleProvider";
import { resolveSpeakerId } from "./styleStore";

export function useReading(locale: Locale, categoryId: string, spreadId: string, enabled = true) {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const { speakerId: preferredSpeakerId, setSpeakerId, getSpeakerId } = useTarotStyle();
  const speakerId = resolveSpeakerId(speakers, preferredSpeakerId);
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<Reading | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [speakerError, setSpeakerError] = useState(false);
  const [speakerAttempt, setSpeakerAttempt] = useState(0);
  const active = useRef<AbortController | null>(null);
  const current = useRef<Reading | null>(null);
  const retryRef = useRef<() => Promise<void>>(async () => {});
  const text = readingMessages[locale];

  useEffect(() => {
    const controller = new AbortController();
    loadSpeakers(locale, controller.signal).then(data => {
      if (controller.signal.aborted) return;
      setSpeakers(data);
      setSpeakerId(resolveSpeakerId(data, getSpeakerId()));
      setSpeakerError(false);
    }).catch(() => { if (!controller.signal.aborted) setSpeakerError(true); });
    return () => controller.abort();
  }, [locale, speakerAttempt, setSpeakerId, getSpeakerId]);
  useEffect(() => () => active.current?.abort(), []);
  // Exit animations may keep the old panel mounted; stop its flow immediately.
  useEffect(() => { if (!enabled) active.current?.abort(); }, [enabled]);

  const reset = useCallback(() => {
    active.current?.abort(); active.current = null; current.current = null;
    setReading(null); setError(""); setBusy(false);
  }, []);

  async function submit() {
    if (!enabled || active.current || !question.trim() || !speakers.some(s => s.id === speakerId)) return;
    const controller = new AbortController(); active.current = controller;
    const { signal } = controller;
    setBusy(true); setError("");
    let closeSocket: (() => void) | undefined;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    let checking = false;
    let fallback = false;
    let deadline = Date.now() + 180_000;
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
      fallbackTimer = setTimeout(poll, 3000);
    };
    const startFallback = () => {
      fallback = true;
      if (!signal.aborted && current.current && !current.current.reading) {
        clearTimeout(fallbackTimer); fallbackTimer = setTimeout(poll, 3000);
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
      setError(""); deadline = Date.now() + 180_000;
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
        watchdog = setTimeout(() => { void check(); startFallback(); }, 60_000);
      }
    } catch (cause) {
      report(cause); clean();
      if (!signal.aborted) { active.current = null; setBusy(false); controller.abort(); }
    } finally { if (!signal.aborted) setBusy(false); }
  }
  const errorKey = (["error", "waiting", "unavailable"] as const).find(key =>
    Object.values(readingMessages).some(messages => messages[key] === error));
  return { speakers, speakerId, setSpeakerId, question,
    setQuestion: (value: string) => { setQuestion(value); setError(""); }, reading, busy, error: errorKey ? text[errorKey] : error,
    speakerError, retrySpeakers: () => { setSpeakerError(false); setSpeakerAttempt(v => v + 1); },
    submit, reset, retry: () => { void retryRef.current(); } };
}
