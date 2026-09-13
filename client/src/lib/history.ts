import type { Category, Tone } from "./analysis";

// ---------- History storage (localStorage) ----------

export type HistoryEmail = { id: string; sender: string; address: string; initials: string; time: string; score: number; category: Category; tone: Tone };

export const HISTORY_KEY = "phishlens_history_v1";

export function loadHistory(): HistoryEmail[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors, fall through to defaults
  }
  return [];
}

export function saveHistoryEntry(entry: HistoryEmail) {
  const current = loadHistory();
  const next = [entry, ...current].slice(0, 50);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // storage full or unavailable — fail silently, in-memory state still works
  }
}