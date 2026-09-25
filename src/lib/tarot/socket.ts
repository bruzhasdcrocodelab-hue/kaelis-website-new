import Echo from "laravel-echo";
import Pusher from "pusher-js";
import type { Locale } from "@/lang";
import { getGuestSession } from "../api";
import { record, tarotRequest, TarotError } from "./reading";

export type AnswerEvent = { sender_type?: string; sender_id?: string | number; url_message?: string };
export async function connectReadingSocket(locale: Locale, signal: AbortSignal,
  onAnswer: (event: AnswerEvent) => void, onReconnect: () => void, onDisconnect: () => void,
): Promise<() => void> {
  const session = await getGuestSession();
  const config = record(record(await tarotRequest("/configuration", locale, { signal })).web_socket);
  if (typeof config.host !== "string" || !config.host || typeof config.key !== "string" || !config.key) throw new TarotError("WebSocket configuration unavailable");
  const auth = new URL(String(config.auth), "https://stagtest.kaelisai.com");
  if (auth.href !== "https://stagtest.kaelisai.com/broadcasting/auth") throw new TarotError("Invalid WebSocket authorization endpoint");
  signal.throwIfAborted();
  const echo = new Echo({ broadcaster: "reverb", Pusher, key: config.key, wsHost: config.host,
    wsPort: Number(config.port) || 443, wssPort: Number(config.port) || 443,
    forceTLS: config.force_tls !== false, enabledTransports: ["ws", "wss"],
    authEndpoint: "/api/kaelis/broadcasting/auth",
    auth: { headers: { Authorization: `Bearer ${session.token}`, Accept: "application/json", "Accept-Language": locale, "X-Platform": "site" } },
  });
  let connected = false;
  let closed = false;
  let rejectReady: (error: Error) => void = () => {};
  const close = () => { if (closed) return; closed = true; echo.disconnect(); signal.removeEventListener("abort", abort); };
  const abort = () => { rejectReady(new DOMException("Aborted", "AbortError")); close(); };
  signal.addEventListener("abort", abort, { once: true });
  try {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new TarotError("WebSocket subscription timed out")), 15_000);
      rejectReady = (error) => { clearTimeout(timeout); reject(error); };
      echo.private(`guest.${session.guestId}`)
        .listen(".answer", (event: AnswerEvent) => { if (!closed) onAnswer(event); })
        .subscribed(() => {
          clearTimeout(timeout);
          if (connected) onReconnect();
          connected = true;
          resolve();
        })
        .error(() => { if (connected) onDisconnect(); else rejectReady(new TarotError("WebSocket authorization failed")); });
      echo.connector.pusher.connection.bind("disconnected", () => { if (connected && !closed) onDisconnect(); });
      echo.connector.pusher.connection.bind("unavailable", () => { if (connected && !closed) onDisconnect(); });
      echo.connector.pusher.connection.bind("error", () => { if (connected && !closed) onDisconnect(); });
    });
    return close;
  } catch (error) { close(); throw error; }
}
