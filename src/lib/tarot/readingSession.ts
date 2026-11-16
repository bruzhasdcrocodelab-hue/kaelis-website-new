import type { Reading } from "./reading";
import type { HomeCardSlug } from "./homeCards";
import type { Speaker } from "./reading";

type ReadingSnapshot = {
  question: string;
  reading: Reading | null;
  busy: boolean;
  error: string;
  speakerError: boolean;
  firstCycleComplete: boolean;
  speakers: Speaker[];
  ui?: ReadingUiState;
};

export type ReadingUiState = {
  choose?: { completedCycles: number };
  reveal?: {
    phase: "preparing" | "dealing" | "flipping" | "focusing" | "ready";
    selectedPosition: string | null;
    answerVisible: boolean;
    sheet: "card" | "answer" | null;
    openSections: string[];
    scrollTops: Record<string, number>;
    viewport?: { x: number; y: number; scale: number };
  };
};

type HomeSnapshot = {
  slug: HomeCardSlug;
  session: number;
  opening: number;
  entranceComplete: boolean;
};

const readings = new Map<string, ReadingSnapshot>();
const listeners = new Map<string, Set<(state: ReadingSnapshot | null) => void>>();
const owners = new Map<string, Set<string>>();
const handedOffOwners = new Set<string>();
let home: HomeSnapshot | null = null;
let localeSwitchPending = false;
let ownerSequence = 0;
let localeSwitchTimer: ReturnType<typeof setTimeout> | undefined;
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
  clearTimeout(localeSwitchTimer);
  localeSwitchPending = true;
  readings.forEach((state, key) => write(READING_KEY + key, state));
  owners.forEach((keyOwners, key) => {
    keyOwners.forEach(owner => handedOffOwners.add(`${key}:${owner}`));
  });
  write(HANDOFF_KEY, true);
}

export function isLocaleSwitchPending() {
  return localeSwitchPending || read<boolean>(HANDOFF_KEY) === true;
}

export function completeLocaleSwitch() {
  clearTimeout(localeSwitchTimer);
  localeSwitchTimer = setTimeout(() => {
    localeSwitchPending = false;
    remove(HANDOFF_KEY);
  }, 500);
}

export function getReadingSession(key: string) {
  const state = readings.get(key);
  if (state || !isLocaleSwitchPending()) return state;
  const restored = read<ReadingSnapshot>(READING_KEY + key);
  if (restored) readings.set(key, restored);
  return restored;
}

export function setReadingSession(key: string, state: ReadingSnapshot) {
  const existing = readings.get(key);
  if (existing?.ui && !state.ui) state.ui = existing.ui;
  readings.set(key, state);
  write(READING_KEY + key, state);
  publish(key, state);
}

export function clearReadingSession(key: string) {
  readings.delete(key);
  remove(READING_KEY + key);
  publish(key, null);
}

export function resetReadingSession(key: string, state: ReadingSnapshot) {
  readings.set(key, state);
  write(READING_KEY + key, state);
  publish(key, state);
}

export function registerReadingOwner(key: string) {
  const owner = String(++ownerSequence);
  let keyOwners = owners.get(key);
  if (!keyOwners) {
    keyOwners = new Set();
    owners.set(key, keyOwners);
  }
  keyOwners.add(owner);
  return owner;
}

export function isReadingOwnerHandedOff(key: string, owner: string | null) {
  return owner !== null && handedOffOwners.has(`${key}:${owner}`);
}

export function unregisterReadingOwner(key: string, owner: string | null) {
  if (owner === null) return;
  owners.get(key)?.delete(owner);
  if (!owners.get(key)?.size) owners.delete(key);
  queueMicrotask(() => handedOffOwners.delete(`${key}:${owner}`));
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

export function getReadingUi(key: string) {
  return readings.get(key)?.ui ?? read<ReadingSnapshot>(READING_KEY + key)?.ui;
}

export function setReadingUi(key: string, ui: ReadingUiState) {
  const state = readings.get(key) ?? read<ReadingSnapshot>(READING_KEY + key);
  if (!state) return;
  state.ui = ui;
  readings.set(key, state);
  if (isLocaleSwitchPending()) write(READING_KEY + key, state);
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
