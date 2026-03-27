"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const STEPS = [
  { area: "Feet & Toes", instruction: "Notice any tension in your feet. Let them relax and sink into the surface below.", duration: 20 },
  { area: "Calves & Shins", instruction: "Bring awareness to your lower legs. Release any tightness.", duration: 20 },
  { area: "Thighs & Knees", instruction: "Scan your upper legs. Let the muscles soften and release.", duration: 20 },
  { area: "Hips & Lower Back", instruction: "Notice the contact with your seat. Let your lower back release.", duration: 20 },
  { area: "Abdomen", instruction: "Feel your belly rise and fall. Let go of any holding in your core.", duration: 20 },
  { area: "Chest & Upper Back", instruction: "Breathe into your chest. Let your shoulders drop away from your ears.", duration: 20 },
  { area: "Hands & Arms", instruction: "Relax your hands — fingers, palms, wrists, forearms, and upper arms.", duration: 20 },
  { area: "Neck & Shoulders", instruction: "Release all tension in your neck and shoulder muscles.", duration: 20 },
  { area: "Face & Head", instruction: "Soften your jaw, your eyes, your forehead. Let your scalp relax.", duration: 20 },
  { area: "Whole Body", instruction: "Rest in awareness of your whole body. Feel completely at ease.", duration: 30 },
];

export default function BodyScanPage() {
  const [running, setRunning] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [count, setCount] = useState(STEPS[0].duration);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          setStepIdx((s) => {
            const next = s + 1;
            if (next >= STEPS.length) { setRunning(false); setDone(true); return s; }
            setCount(STEPS[next].duration);
            return next;
          });
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function reset() { setRunning(false); setStepIdx(0); setCount(STEPS[0].duration); setDone(false); }

  const step = STEPS[stepIdx];
  const progress = step ? ((step.duration - count) / step.duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <Link href="/tools" className="text-zinc-400 hover:text-zinc-200 text-sm">← Tools</Link>
      <div>
        <h1 className="text-2xl font-bold">🧘 Body Scan</h1>
        <p className="text-zinc-400 mt-1 text-sm">Progressive muscle relaxation — about 3 minutes.</p>
      </div>

      {done ? (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <div className="text-5xl">✨</div>
          <h2 className="text-xl font-bold">Body scan complete</h2>
          <p className="text-zinc-400 text-sm">You&apos;ve released tension from head to toe. Carry this calm into your day.</p>
          <button onClick={reset} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
            Do it again
          </button>
        </div>
      ) : (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i < stepIdx ? "bg-green-500" : i === stepIdx ? "bg-indigo-500" : "bg-zinc-700"}`} />
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs text-zinc-500">Area {stepIdx + 1} of {STEPS.length}</p>
            <h2 className="text-2xl font-bold">{step.area}</h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">{step.instruction}</p>
          </div>

          <div>
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-center text-zinc-500 text-sm mt-2">{count}s</p>
          </div>

          <div className="flex gap-3">
            {!running ? (
              <button onClick={() => setRunning(true)} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors">
                {stepIdx > 0 ? "Resume" : "Begin"}
              </button>
            ) : (
              <button onClick={() => setRunning(false)} className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 text-zinc-100 font-semibold rounded-xl transition-colors">
                Pause
              </button>
            )}
            <button onClick={reset} className="px-5 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl transition-colors">
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
