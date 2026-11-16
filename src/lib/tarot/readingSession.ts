import type { Reading } from "./reading";
import type { HomeCardSlug } from "./homeCards";

type ReadingSnapshot = {
  question: string;
  reading: Reading | null;
  busy: boolean;
  error: string;
  speakerError: boolean;
  firstCycleComplete: boolean;
};

type HomeSnapshot = {
  slug: HomeCardSlug;
  session: number;
  opening: number;
  entranceComplete: boolean;
};

const readings = new Map<string, ReadingSnapshot>();
const listeners = new Map<string, Set<(state: ReadingSnapshot | null) => void>>();
let home: HomeSnapshot | null = null;
let localeSwitchPending = false;
const HANDOFF_KEY = "kaelis.tarot.locale-switch";
const READING_KEY = "kaelis.tarot.reading.";
const HOME_KEY = "kaelis.tarot.home-reading";

function read<T>(key: string): T | null {
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function remove(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {}
}

function publish(key: string, state: ReadingSnapshot | null) {
  listeners.get(key)?.forEach(listener => listener(state));
}

export function prepareLocaleSwitch() {
  localeSwitchPending = true;
  write(HANDOFF_KEY, true);
}

export function isLocaleSwitchPending() {
  return localeSwitchPending || read<boolean>(HANDOFF_KEY) === true;
}

export function completeLocaleSwitch() {
  localeSwitchPending = false;
  remove(HANDOFF_KEY);
}

export function getReadingSession(key: string) {
  if (!isLocaleSwitchPending()) return undefined;
  return readings.get(key) ?? read<ReadingSnapshot>(READING_KEY + key) ?? undefined;
}

export function setReadingSession(key: string, state: ReadingSnapshot) {
  readings.set(key, state);
  write(READING_KEY + key, state);
  publish(key, state);
}

export function clearReadingSession(key: string) {
  readings.delete(key);
  remove(READING_KEY + key);
  publish(key, null);
}

export function subscribeReadingSession(key: string, listener: (state: ReadingSnapshot | null) => void) {
  let subscribers = listeners.get(key);
  if (!subscribers) {
    subscribers = new Set();
    listeners.set(key, subscribers);
  }
  subscribers.add(listener);
  return () => {
    subscribers?.delete(listener);
    if (!subscribers?.size) listeners.delete(key);
  };
}

export function getHomeSession() {
  if (!isLocaleSwitchPending()) return null;
  return home ?? read<HomeSnapshot>(HOME_KEY);
}

export function setHomeSession(state: HomeSnapshot | null) {
  home = state;
  if (state) write(HOME_KEY, state);
  else remove(HOME_KEY);
}

export function clearHomeSession() {
  home = null;
  remove(HOME_KEY);
}
