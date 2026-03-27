"use client";
import { useEffect, useState } from "react";
import { getAll, DayEntry } from "@/lib/storage";

interface Correlation {
  morningKey: string;
  correlation: number;
  strength: "strong" | "moderate" | "weak";
  direction: "positive" | "negative";
}

interface ToolEffect {
  tool: string;
  withTool: number;
  withoutTool: number;
  diff: number;
}

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  if (n < 3) return 0;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
  const den = Math.sqrt(
    xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0)
  );
  return den === 0 ? 0 : Math.round((num / den) * 100) / 100;
}

const MORNING_KEYS = ["mood", "energy", "focus", "anxiety", "sleep"] as const;
const TOOLS = ["Box Breathing", "Cognitive Reframing", "Body Scan", "Pre-Performance Routine"];

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;
}

export default function InsightsPage() {
  const [correlations, setCorrelations] = useState<Correlation[]>([]);
  const [toolEffects, setToolEffects] = useState<ToolEffect[]>([]);
  const [dayCount, setDayCount] = useState(0);
  const [locked, setLocked] = useState(true);

  useEffect(() => {
    const all = getAll();
    const entries = Object.values(all) as DayEntry[];
    const paired = entries.filter((e) => e.morning && e.evening);
    setDayCount(paired.length);
    if (paired.length < 5) { setLocked(true); return; }
    setLocked(false);

    const corrs: Correlation[] = [];
    for (const key of MORNING_KEYS) {
      const xs = paired.map((e) => (e.morning as unknown as Record<string, number>)[key]);
      const ys = paired.map((e) => e.evening!.performance);
      const r = pearson(xs, ys);
      const abs = Math.abs(r);
      if (abs < 0.2) continue;
      corrs.push({ morningKey: key, correlation: r, strength: abs >= 0.6 ? "strong" : abs >= 0.4 ? "moderate" : "weak", direction: r >= 0 ? "positive" : "negative" });
    }
    corrs.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
    setCorrelations(corrs);

    const effects: ToolEffect[] = [];
    for (const tool of TOOLS) {
      const withTool = paired.filter((e) => e.morning?.toolsUsed?.includes(tool)).map((e) => e.evening!.performance);
      const withoutTool = paired.filter((e) => !e.morning?.toolsUsed?.includes(tool)).map((e) => e.evening!.performance);
      if (withTool.length < 2) continue;
      effects.push({ tool, withTool: avg(withTool), withoutTool: avg(withoutTool), diff: Math.round((avg(withTool) - avg(withoutTool)) * 10) / 10 });
    }
    effects.sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
    setToolEffects(effects);
  }, []);

  const strengthColor = (s: string) =>
    s === "strong" ? "text-green-400 bg-green-500/10 border-green-500/30"
    : s === "moderate" ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
    : "text-zinc-400 bg-zinc-700/30 border-zinc-600/30";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-zinc-400 mt-1 text-sm">Discover patterns between your mental state and performance.</p>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-300">Data collected</span>
          <span className="text-sm font-bold text-indigo-300">{dayCount}/5 days</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${Math.min((dayCount / 5) * 100, 100)}%` }} />
        </div>
        {locked && <p className="text-zinc-500 text-sm">Complete both morning and evening check-ins for at least 5 days to unlock insights.</p>}
      </div>

      {locked ? (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 text-center space-y-2">
          <div className="text-4xl mb-3">🔒</div>
          <h2 className="font-semibold">Need more data to find patterns</h2>
          <p className="text-zinc-500 text-sm">Keep checking in — insights unlock after 5 paired days.</p>
        </div>
      ) : (
        <>
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold">State → Performance Correlations</h2>
            <p className="text-xs text-zinc-500">Which morning metrics predict your evening performance score.</p>
            {correlations.length === 0 ? (
              <p className="text-zinc-500 text-sm">No significant correlations found yet. Keep logging — patterns emerge with more data.</p>
            ) : (
              <div className="space-y-3">
                {correlations.map((c) => (
                  <div key={c.morningKey} className="flex items-center gap-3 bg-zinc-900 rounded-xl px-4 py-3">
                    <div className="flex-1">
                      <span className="font-medium capitalize text-zinc-200">{c.morningKey}</span>
                      <span className="text-zinc-500 text-sm"> → Performance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${strengthColor(c.strength)}`}>{c.strength}</span>
                      <span className={`text-sm font-mono font-bold ${c.direction === "positive" ? "text-green-400" : "text-red-400"}`}>
                        {c.direction === "positive" ? "+" : ""}{c.correlation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {toolEffects.length > 0 && (
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h2 className="font-semibold">Tool Effectiveness</h2>
              <p className="text-xs text-zinc-500">Average performance on days each tool was used vs. not used.</p>
              <div className="space-y-3">
                {toolEffects.map((t) => (
                  <div key={t.tool} className="bg-zinc-900 rounded-xl px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-zinc-200">{t.tool}</span>
                      <span className={`text-sm font-bold ${t.diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {t.diff >= 0 ? "+" : ""}{t.diff} pts
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-zinc-500">
                      <span>With: {t.withTool}/10</span>
                      <span>Without: {t.withoutTool}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
