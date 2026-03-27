"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface RoutineStep { id: string; text: string; }
const STORAGE_KEY = "mindloop-pre-performance";

export default function PrePerformancePage() {
  const [steps, setSteps] = useState<RoutineStep[]>([]);
  const [newStep, setNewStep] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try { setSteps(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch {}
  }, []);

  function save(s: RoutineStep[]) {
    setSteps(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }

  function addStep() {
    if (!newStep.trim()) return;
    save([...steps, { id: Date.now().toString(), text: newStep.trim() }]);
    setNewStep("");
  }

  function removeStep(id: string) { save(steps.filter((s) => s.id !== id)); }

  function startRoutine() { setCurrentStep(0); setChecked(new Set()); setRunning(true); }

  function check(id: string) {
    const next = new Set(checked);
    next.add(id);
    setChecked(next);
    if (currentStep < steps.length - 1) setTimeout(() => setCurrentStep(currentStep + 1), 400);
  }

  const allDone = checked.size === steps.length && steps.length > 0;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-zinc-400 hover:text-zinc-200 text-sm">← Tools</Link>
      <div>
        <h1 className="text-2xl font-bold">🏆 Pre-Performance Routine</h1>
        <p className="text-zinc-400 mt-1 text-sm">Build your personalised pre-game ritual and run through it step by step.</p>
      </div>

      {!running ? (
        <>
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold">Your Routine</h2>
            {steps.length === 0 && <p className="text-zinc-500 text-sm">No steps yet — add some below.</p>}
            <div className="space-y-2">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 bg-zinc-900 rounded-xl px-4 py-3">
                  <span className="text-zinc-600 text-sm font-mono w-5">{i + 1}.</span>
                  <span className="flex-1 text-sm text-zinc-200">{s.text}</span>
                  <button onClick={() => removeStep(s.id)} className="text-zinc-600 hover:text-red-400 transition-colors text-sm">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addStep()}
                placeholder="Add a step..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
              />
              <button onClick={addStep} disabled={!newStep.trim()} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors text-sm">
                Add
              </button>
            </div>
          </div>
          {steps.length > 0 && (
            <button onClick={startRoutine} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
              Run Routine →
            </button>
          )}
        </>
      ) : (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
          {allDone ? (
            <div className="text-center space-y-3 py-4">
              <div className="text-5xl">🎯</div>
              <h2 className="text-xl font-bold">Routine complete!</h2>
              <p className="text-zinc-400 text-sm">You&apos;re locked in. Go perform.</p>
              <button onClick={() => setRunning(false)} className="px-6 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold rounded-xl transition-colors">
                Back to routine
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-1">
                {steps.map((s, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${checked.has(s.id) ? "bg-green-500" : i === currentStep ? "bg-indigo-500" : "bg-zinc-700"}`} />
                ))}
              </div>
              <p className="text-xs text-zinc-500">Step {Math.min(currentStep + 1, steps.length)} of {steps.length}</p>
              <div className="space-y-2">
                {steps.map((s, i) => {
                  const isDone = checked.has(s.id);
                  const isCurrent = i === currentStep && !isDone;
                  return (
                    <button
                      key={s.id}
                      onClick={() => !isDone && check(s.id)}
                      disabled={isDone || i > currentStep}
                      className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                        isDone ? "bg-green-500/10 border border-green-500/20 text-zinc-400"
                        : isCurrent ? "bg-indigo-600/20 border border-indigo-500 text-zinc-100 cursor-pointer hover:bg-indigo-600/30"
                        : "bg-zinc-900 border border-zinc-800 text-zinc-600"
                      }`}
                    >
                      <span className="text-lg">{isDone ? "✅" : isCurrent ? "○" : "·"}</span>
                      <span className="text-sm">{s.text}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
