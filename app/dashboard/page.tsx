"use client";
import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { getAll, DayEntry } from "@/lib/storage";

type Range = "7d" | "30d" | "90d";
type Mode = "morning" | "evening";

const MORNING_KEYS = ["mood", "energy", "focus", "anxiety", "sleep"] as const;
const EVENING_KEYS = ["performance", "focus", "resilience", "satisfaction"] as const;
const COLORS = ["#818cf8", "#34d399", "#fbbf24", "#f87171", "#60a5fa"];

function average(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [range, setRange] = useState<Range>("7d");
  const [mode, setMode] = useState<Mode>("morning");
  const [chartData, setChartData] = useState<Record<string, number | string>[]>([]);

  useEffect(() => {
    const all = getAll();
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    const cutoff = daysAgo(days);
    const filtered = Object.entries(all).filter(([date]) => date >= cutoff).sort(([a], [b]) => a.localeCompare(b));
    const data = filtered.map(([date, entry]: [string, DayEntry]) => {
      const d: Record<string, number | string> = { date: date.slice(5) };
      if (mode === "morning" && entry.morning) {
        const m = entry.morning;
        d.mood = m.mood; d.energy = m.energy; d.focus = m.focus; d.anxiety = m.anxiety; d.sleep = m.sleep;
      }
      if (mode === "evening" && entry.evening) {
        const e = entry.evening;
        d.performance = e.performance; d.focus = e.focus; d.resilience = e.resilience; d.satisfaction = e.satisfaction;
      }
      return d;
    });
    setChartData(data);
  }, [range, mode]);

  const keys = mode === "morning" ? MORNING_KEYS : EVENING_KEYS;
  const all = getAll();
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = daysAgo(days);
  const filtered = Object.entries(all).filter(([d]) => d >= cutoff);

  const avgs: Record<string, number> = {};
  keys.forEach((k) => {
    const vals = filtered
      .map(([, e]) => mode === "morning" ? (e.morning as unknown as Record<string, number> | undefined)?.[k] : (e.evening as unknown as Record<string, number> | undefined)?.[k])
      .filter((v): v is number => v != null);
    avgs[k] = average(vals);
  });

  const entryCount = filtered.filter(([, e]) => mode === "morning" ? e.morning : e.evening).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trends</h1>
        <p className="text-zinc-400 mt-1 text-sm">Track how your mental state and performance evolve over time.</p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl">
          {(["7d", "30d", "90d"] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${range === r ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl">
          {(["morning", "evening"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"}`}>
              {m === "morning" ? "☀️ Morning" : "🌙 Evening"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5">
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg mb-1">No data for this time range</p>
            <p className="text-sm">Start checking in to see trends here.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fill: "#71717a", fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#f4f4f5" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {keys.map((k, i) => (
                <Line key={k} type="monotone" dataKey={k} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Averages</h2>
          <span className="text-xs text-zinc-500">Based on {entryCount} {entryCount === 1 ? "entry" : "entries"}</span>
        </div>
        {entryCount === 0 ? (
          <p className="text-zinc-500 text-sm">Your data will appear here once you have a few days of entries.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {keys.map((k, i) => (
              <div key={k} className="bg-zinc-900 rounded-xl p-3">
                <div className="text-xs text-zinc-500 capitalize mb-1">{k}</div>
                <div className="text-2xl font-bold" style={{ color: COLORS[i] }}>{avgs[k] || "—"}</div>
                <div className="text-xs text-zinc-600">/ 10</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
