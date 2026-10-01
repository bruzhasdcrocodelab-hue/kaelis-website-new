export const STYLE_STORAGE_KEY = "kaelis.tarot.speaker";

/** Shared client preference; translated speaker records remain in the API catalog. */
export function createStyleStore() {
  let value = "";
  let hydrated = false;
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach(listener => listener());
  const valid = (next: unknown): string => typeof next === "string" && /^\d+$/.test(next) ? next : "";
  const read = () => {
    try { value = valid(window.localStorage.getItem(STYLE_STORAGE_KEY)); } catch { /* Keep the in-memory preference. */ }
    hydrated = true;
  };
  const storage = (event: StorageEvent) => {
    if (event.key !== STYLE_STORAGE_KEY && event.key !== null) return;
    value = valid(event.newValue);
    publish();
  };
  return {
    getSnapshot: () => value,
    getServerSnapshot: () => "",
    subscribe(listener: () => void) {
      if (!hydrated) read();
      if (!listeners.size) window.addEventListener("storage", storage);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (!listeners.size) window.removeEventListener("storage", storage);
      };
    },
    set(next: string) {
      if (!hydrated) read();
      next = valid(next);
      if (!next) return;
      value = next;
      try { window.localStorage.setItem(STYLE_STORAGE_KEY, next); } catch { /* Storage can be disabled. */ }
      publish();
    },
  };
}

export function resolveSpeakerId(speakers: { id: string; icon: string | null }[], preferred: string) {
  return speakers.find(speaker => speaker.id === preferred)?.id
    ?? speakers.find(speaker => speaker.icon === "analyst")?.id
    ?? speakers[0]?.id ?? "";
}
