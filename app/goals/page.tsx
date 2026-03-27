"use client";
import { useState, useEffect } from "react";
import { getGoals, addGoal, toggleGoal, deleteGoal, todayStr, Goal } from "@/lib/storage";

const CATEGORIES = ["Health", "Career", "Mindset", "Relationships", "Learning", "Finance", "Other"];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tab, setTab] = useState<"daily" | "longterm">("daily");

  // New goal form
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Other");
  const [adding, setAdding] = useState(false);

  const today = todayStr();

  function refresh() {
    setGoals(getGoals());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleAdd() {
    if (!text.trim()) return;
    addGoal({
      text: text.trim(),
      type: tab,
      date: tab === "daily" ? today : undefined,
      completed: false,
      category: tab === "longterm" ? category : undefined,
    });
    setText("");
    setAdding(false);
    refresh();
  }

  function handleToggle(id: string) {
    toggleGoal(id);
    refresh();
  }

  function handleDelete(id: string) {
    deleteGoal(id);
    refresh();
  }

  const dailyGoals = goals.filter((g) => g.type === "daily" && g.date === today);
  const longtermGoals = goals.filter((g) => g.type === "longterm");

  const dailyDone = dailyGoals.filter((g) => g.completed).length;
  const longtermDone = longtermGoals.filter((g) => g.completed).length;

  const displayed = tab === "daily" ? dailyGoals : longtermGoals;
  const pending = displayed.filter((g) => !g.completed);
  const done = displayed.filter((g) => g.completed);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Goals</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Set your intentions for today and for the long run.
        </p>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 bg-zinc-900 p-1 rounded-xl w-fit">
        <button
          onClick={() => { setTab("daily"); setAdding(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "daily" ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          📅 Today
        </button>
        <button
          onClick={() => { setTab("longterm"); setAdding(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "longterm" ? "bg-zinc-700 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          🎯 Long-term
        </button>
      </div>

      {/* Progress bar */}
      {displayed.length > 0 && (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">
              {tab === "daily" ? "Today's progress" : "Overall progress"}
            </span>
            <span className="font-semibold text-indigo-300">
              {tab === "daily" ? dailyDone : longtermDone} / {displayed.length}
            </span>
          </div>
          <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${displayed.length ? ((tab === "daily" ? dailyDone : longtermDone) / displayed.length) * 100 : 0}%` }}
            />
          </div>
          {tab === "daily" && dailyDone === dailyGoals.length && dailyGoals.length > 0 && (
            <p className="text-green-400 text-sm font-medium">🎉 All done for today!</p>
          )}
        </div>
      )}

      {/* Goal list */}
      <div className="space-y-2">
        {pending.length === 0 && done.length === 0 && (
          <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-8 text-center space-y-2">
            <div className="text-4xl">{tab === "daily" ? "📅" : "🎯"}</div>
            <p className="text-zinc-400 text-sm">
              {tab === "daily"
                ? "No goals set for today yet — add one below."
                : "No long-term goals yet — add one below."}
            </p>
          </div>
        )}

        {pending.map((g) => (
          <GoalItem key={g.id} goal={g} onToggle={handleToggle} onDelete={handleDelete} />
        ))}

        {done.length > 0 && (
          <>
            {pending.length > 0 && <div className="border-t border-zinc-800 my-3" />}
            <p className="text-xs text-zinc-600 px-1">Completed</p>
            {done.map((g) => (
              <GoalItem key={g.id} goal={g} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </>
        )}
      </div>

      {/* Add goal */}
      {adding ? (
        <div className="bg-zinc-800/50 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-sm">
            {tab === "daily" ? "Add today's goal" : "Add long-term goal"}
          </h3>
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={tab === "daily" ? "e.g. Complete my morning workout" : "e.g. Run a half marathon by December"}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
          />
          {tab === "longterm" && (
            <div>
              <p className="text-xs text-zinc-500 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                      category === c
                        ? "bg-indigo-600/30 border-indigo-500 text-indigo-200"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!text.trim()}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Add Goal
            </button>
            <button
              onClick={() => { setAdding(false); setText(""); }}
              className="px-4 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 rounded-xl transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-3 border border-dashed border-zinc-700 hover:border-indigo-500 text-zinc-500 hover:text-indigo-300 rounded-2xl transition-colors text-sm font-medium"
        >
          + Add {tab === "daily" ? "today's" : "long-term"} goal
        </button>
      )}
    </div>
  );
}

function GoalItem({
  goal,
  onToggle,
  onDelete,
}: {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 border transition-all group ${
      goal.completed
        ? "bg-zinc-900/50 border-zinc-800/50"
        : "bg-zinc-800/50 border-zinc-800 hover:border-zinc-700"
    }`}>
      <button
        onClick={() => onToggle(goal.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          goal.completed
            ? "bg-green-500 border-green-500"
            : "border-zinc-600 hover:border-indigo-400"
        }`}
      >
        {goal.completed && <span className="text-white text-xs">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${goal.completed ? "line-through text-zinc-600" : "text-zinc-200"}`}>
          {goal.text}
        </p>
        {goal.category && (
          <span className="text-xs text-zinc-600 mt-0.5 inline-block">{goal.category}</span>
        )}
      </div>

      <button
        onClick={() => onDelete(goal.id)}
        className="text-zinc-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-sm flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}
