"use client";
import { useState, useEffect } from "react";
import Slider from "@/components/Slider";
import {
  todayStr,
  getDay,
  saveMorning,
  saveEvening,
  getStreak,
  getStorageUsedPct,
  MorningEntry,
  EveningEntry,
} from "@/lib/storage";

const TOOLS = [
  "Box Breathing",
  "Cognitive Reframing",
  "Body Scan",
  "Pre-Performance Routine",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function TodayPage() {
  const [tab, setTab] = useState<"morning" | "evening">("morning");
  const [morningDone, setMorningDone] = useState(false);
  const [eveningDone, setEveningDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [storageFull, setStorageFull] = useState(false);

  // Morning form state
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [mFocus, setMFocus] = useState(5);
  const [anxiety, setAnxiety] = useState(5);
  const [sleep, setSleep] = useState(5);
  const [mNote, setMNote] = useState("");
  const [toolsUsed, setToolsUsed] = useState<string[]>([]);

  // Evening form state
  const [performance, setPerformance] = useState(5);
  const [eFocus, setEFocus] = useState(5);
  const [resilience, setResilience] = useState(5);
  const [satisfaction, setSatisfaction] = useState(5);
  const [eNote, setENote] = useState("");

  useEffect(() => {
    const today = todayStr();
    const day = getDay(today);
    if (day.morning) setMorningDone(true);
    if (day.evening) setEveningDone(true);
    setStreak(getStreak());
    setStorageFull(getStorageUsedPct() > 90);
  }, []);

  function toggleTool(t: string) {
    setToolsUsed((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function submitMorning() {
    const entry: MorningEntry = {
      date: todayStr(),
      mood,
      energy,
      focus: mFocus,
      anxiety,
      sleep,
      note: mNote,
      toolsUsed,
    };
    saveMorning(entry);
    setMorningDone(true);
    setStreak(getStreak());
  }

  function submitEvening() {
    const entry: EveningEntry = {
      date: todayStr(),
      performance,
      focus: eFocus,
      resilience,
      satisfaction,
      note: eNote,
    };
    saveEvening(entry);
    setEveningDone(true);
    setStreak(getStreak());
  }

  const today = todayStr();
  const day = getDay(today);

  return (
    <div className="space-y-6">
      {storageFull && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-xl px-4 py-3 text-amber-300 text-sm">
          ⚠️ Storage is full. Your data may not be saved.
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold">
          {greeting()}, ready to check in?
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl w-fit">
        <button
          onClick={() => setTab("morning")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "morning"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          ☀️ Morning
        </button>
        <button
          onClick={() => setTab("evening")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "evening"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          🌙 Evening
        </button>
      </div>

      {/* Morning panel */}
      {tab === "morning" && (
        <>
          {morningDone ? (
            <DoneCard
              label="Morning check-in complete!"
              streak={streak}
              values={[
                { label: "Mood", emoji: "😊", value: day.morning?.mood ?? 0 },
                { label: "Energy", emoji: "⚡", value: day.morning?.energy ?? 0 },
                { label: "Focus", emoji: "🎯", value: day.morning?.focus ?? 0 },
                { label: "Anxiety", emoji: "😰", value: day.morning?.anxiety ?? 0 },
                { label: "Sleep", emoji: "💤", value: day.morning?.sleep ?? 0 },
              ]}
            />
          ) : (
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">
                How are you feeling this morning?
              </h2>
              <Slider label="Mood" emoji="😊" value={mood} onChange={setMood} />
              <Slider label="Energy" emoji="⚡" value={energy} onChange={setEnergy} />
              <Slider label="Focus" emoji="🎯" value={mFocus} onChange={setMFocus} />
              <Slider label="Anxiety" emoji="😰" value={anxiety} onChange={setAnxiety} />
              <Slider label="Sleep Quality" emoji="💤" value={sleep} onChange={setSleep} />

              <div>
                <p className="text-sm font-medium text-zinc-300 mb-2">
                  Which tools did you use today?
                </p>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTool(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                        toolsUsed.includes(t)
                          ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  Optional note — what&apos;s on your mind?
                </label>
                <textarea
                  value={mNote}
                  onChange={(e) => setMNote(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Thoughts, goals, anything..."
                />
              </div>

              <button
                onClick={submitMorning}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Save Morning Check-in
              </button>
            </div>
          )}
        </>
      )}

      {/* Evening panel */}
      {tab === "evening" && (
        <>
          {eveningDone ? (
            <DoneCard
              label="Evening check-in complete!"
              streak={streak}
              values={[
                { label: "Performance", emoji: "🏆", value: day.evening?.performance ?? 0 },
                { label: "Focus", emoji: "🎯", value: day.evening?.focus ?? 0 },
                { label: "Resilience", emoji: "💪", value: day.evening?.resilience ?? 0 },
                { label: "Satisfaction", emoji: "😌", value: day.evening?.satisfaction ?? 0 },
              ]}
            />
          ) : (
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
              <h2 className="font-semibold text-lg">
                How did you perform today?
              </h2>
              <Slider label="Performance" emoji="🏆" value={performance} onChange={setPerformance} />
              <Slider label="Focus" emoji="🎯" value={eFocus} onChange={setEFocus} />
              <Slider label="Resilience" emoji="💪" value={resilience} onChange={setResilience} />
              <Slider label="Satisfaction" emoji="😌" value={satisfaction} onChange={setSatisfaction} />

              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-2">
                  What went well today?
                </label>
                <textarea
                  value={eNote}
                  onChange={(e) => setENote(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Wins, learnings, highlights..."
                />
              </div>

              <button
                onClick={submitEvening}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Save Evening Check-in
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function DoneCard({
  label,
  streak,
  values,
}: {
  label: string;
  streak: number;
  values: { label: string; emoji: string; value: number }[];
}) {
  return (
    <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-green-400 text-xl">✓</span>
        <h2 className="font-semibold text-lg">{label}</h2>
      </div>
      <p className="text-zinc-400 text-sm">
        Great job staying consistent. Here&apos;s what you logged:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.map((v) => (
          <div key={v.label} className="bg-zinc-900 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{v.emoji}</div>
            <div className="text-xs text-zinc-400">{v.label}</div>
            <div className="text-xl font-bold text-indigo-300">{v.value}</div>
          </div>
        ))}
      </div>
      {streak > 0 && (
        <p className="text-amber-300 text-sm font-medium">
          🔥 {streak}-day streak — keep it going!
        </p>
      )}
    </div>
  );
}
