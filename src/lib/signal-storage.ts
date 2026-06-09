import type { GeneratedSignal } from "./signal-engine";

const ACTIVE_KEY = "tab.active-signals.v1"; // map of pair -> signal
const HISTORY_KEY = "tab.signal-history.v1";
const API_KEY = "tab.tdkey.v1";

type ActiveMap = Record<string, GeneratedSignal>;

function readJSON<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getActiveSignal(pair: string): GeneratedSignal | null {
  const map = readJSON<ActiveMap>(ACTIVE_KEY, {});
  const sig = map[pair];
  if (!sig) return null;
  if (Date.now() >= sig.expiresAt) return null;
  return sig;
}

export function setActiveSignal(sig: GeneratedSignal) {
  const map = readJSON<ActiveMap>(ACTIVE_KEY, {});
  map[sig.pair] = sig;
  writeJSON(ACTIVE_KEY, map);
}

export function appendHistory(sig: GeneratedSignal) {
  const list = readJSON<GeneratedSignal[]>(HISTORY_KEY, []);
  // Avoid duplicate consecutive entries for same generatedAt+pair
  if (
    list.length &&
    list[0].pair === sig.pair &&
    list[0].generatedAt === sig.generatedAt
  ) {
    return;
  }
  list.unshift(sig);
  writeJSON(HISTORY_KEY, list.slice(0, 100));
}

export function getHistory(): GeneratedSignal[] {
  return readJSON<GeneratedSignal[]>(HISTORY_KEY, []);
}

export function clearHistory() {
  writeJSON(HISTORY_KEY, []);
}

export function getApiKey(): string {
  if (typeof localStorage === "undefined") return "";
  return localStorage.getItem(API_KEY) ?? "";
}

export function setApiKey(key: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(API_KEY, key);
}
