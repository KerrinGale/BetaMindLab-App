export interface MorningEntry {
  date: string; // YYYY-MM-DD
  mood: number;
  energy: number;
  focus: number;
  anxiety: number;
  sleep: number;
  note: string;
  toolsUsed: string[];
}

export interface EveningEntry {
  date: string;
  performance: number;
  focus: number;
  resilience: number;
  satisfaction: number;
  note: string;
}

export interface DayEntry {
  morning?: MorningEntry;
  evening?: EveningEntry;
}

const KEY = "mindloop-data";

export function getAll(): Record<string, DayEntry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function getDay(date: string): DayEntry {
  return getAll()[date] || {};
}

export function saveMorning(entry: MorningEntry) {
  const all = getAll();
  all[entry.date] = { ...all[entry.date], morning: entry };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function saveEvening(entry: EveningEntry) {
  const all = getAll();
  all[entry.date] = { ...all[entry.date], evening: entry };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function getStreak(): number {
  const all = getAll();
  const dates = Object.keys(all).sort().reverse();
  if (!dates.length) return 0;
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const date of dates) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000);
    if (diff > 1) break;
    streak++;
    cursor = d;
  }
  return streak;
}

export function getStorageUsedPct(): number {
  if (typeof window === "undefined") return 0;
  try {
    const used = new Blob([localStorage.getItem(KEY) || ""]).size;
    return Math.round((used / (5 * 1024 * 1024)) * 100);
  } catch {
    return 0;
  }
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
