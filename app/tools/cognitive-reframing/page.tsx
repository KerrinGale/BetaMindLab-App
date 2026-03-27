"use client";
import { useState } from "react";
import Link from "next/link";

const PROMPTS = [
  { q: "What is the unhelpful thought?", placeholder: "e.g. I'm going to mess this up completely..." },
  { q: "What evidence supports this thought?", placeholder: "e.g. I made a mistake last time..." },
  { q: "What evidence contradicts this thought?", placeholder: "e.g. I've succeeded in similar situations before..." },
  { q: "What would you tell a friend thinking this?", placeholder: "e.g. One mistake doesn't define you..." },
  { q: "What is a more balanced thought?", placeholder: "e.g. I'm prepared and I'll do my best..." },
];

export default function CognitiveReframingPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(PROMPTS.length).fill(""));
  const [done, setDone] = useState(false);

  function update(val: string) {
    setAnswers((prev) => { const next = [...prev]; next[step] = val; return next; });
  }

  function next() {
    if (step < PROMPTS.length - 1) setStep(step + 1);
    else setDone(true);
  }

  function reset() {
    setStep(0);
    setAnswers(Array(PROMPTS.length).fill(""));
    setDone(false);
  }

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-zinc-400 hover:text-zinc-200 text-sm">← Tools</Link>

      <div>
        <h1 className="text-2xl font-bold">🧠 Cognitive Reframing</h1>
        <p className="text-zinc-400 mt-1 text-sm">Challenge unhelpful thoughts using CBT techniques.</p>
      </div>

      {done ? (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h2 className="font-semibold text-green-400">✓ Reframing complete</h2>
          <div className="space-y-4">
            {PROMPTS.map((p, i) => (
              <div key={i}>
                <p className="text-xs text-zinc-500 mb-1">{p.q}</p>
                <p className="text-sm text-zinc-200 bg-zinc-900 rounded-xl px-4 py-3">{answers[i] || "—"}</p>
              </div>
            ))}
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
            <p className="text-sm text-indigo-200 font-medium">New thought: &ldquo;{answers[4]}&rdquo;</p>
          </div>
          <button onClick={reset} className="w-full py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl transition-colors">
            Start over
          </button>
        </div>
      ) : (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-5">
          <div className="flex gap-1.5">
            {PROMPTS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? "bg-indigo-500" : "bg-zinc-700"}`} />
            ))}
          </div>
          <p className="text-xs text-zinc-500">Step {step + 1} of {PROMPTS.length}</p>
          <h2 className="font-semibold text-lg">{PROMPTS[step].q}</h2>
          <textarea
            value={answers[step]}
            onChange={(e) => update(e.target.value)}
            rows={4}
            placeholder={PROMPTS[step].placeholder}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
          />
          <button
            onClick={next}
            disabled={!answers[step].trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            {step < PROMPTS.length - 1 ? "Next →" : "Finish"}
          </button>
        </div>
      )}
    </div>
  );
}
