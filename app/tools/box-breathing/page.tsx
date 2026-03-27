"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
const DURATION = 4;

export default function BoxBreathingPage() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(DURATION);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const next = (p + 1) % 4;
            if (next === 0) setCycles((cy) => cy + 1);
            return next;
          });
          return DURATION;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  function reset() {
    setRunning(false);
    setPhase(0);
    setCount(DURATION);
    setCycles(0);
  }

  const phaseColors: Record<string, string> = {
    Inhale: "text-indigo-300",
    Exhale: "text-green-400",
    Hold: "text-amber-300",
  };

  const progress = ((DURATION - count) / DURATION) * 100;
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-zinc-400 hover:text-zinc-200 transition-colors text-sm">
        ← Tools
      </Link>

      <div>
        <h1 className="text-2xl font-bold">🌬️ Box Breathing</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          4-4-4-4 breathing to calm your nervous system in under 2 minutes.
        </p>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-8">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#27272a" strokeWidth="8" />
            <circle
              cx="80" cy="80" r="70" fill="none" stroke="#6366f1" strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (circumference * progress) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="text-center z-10">
            <div className={`text-2xl font-bold ${phaseColors[PHASES[phase]] ?? "text-zinc-100"}`}>
              {PHASES[phase]}
            </div>
            <div className="text-4xl font-bold text-zinc-100 mt-1">{count}</div>
          </div>
        </div>

        <div className="flex gap-4">
          {!running ? (
            <button
              onClick={() => setRunning(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              {cycles > 0 ? "Resume" : "Start"}
            </button>
          ) : (
            <button
              onClick={() => setRunning(false)}
              className="px-6 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold rounded-xl transition-colors"
            >
              Pause
            </button>
          )}
          {cycles > 0 && (
            <button
              onClick={reset}
              className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {cycles > 0 && (
          <p className="text-zinc-400 text-sm">
            {cycles} cycle{cycles !== 1 ? "s" : ""} complete
          </p>
        )}
      </div>

      <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-sm text-zinc-300">How it works</h3>
        <div className="grid grid-cols-2 gap-3">
          {PHASES.map((p, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl p-3">
              <div className="text-xs text-zinc-500 mb-0.5">Step {i + 1}</div>
              <div className={`font-semibold ${phaseColors[p] ?? ""}`}>{p}</div>
              <div className="text-xs text-zinc-400">{DURATION} seconds</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
