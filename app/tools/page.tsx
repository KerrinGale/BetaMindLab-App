import Link from "next/link";

const tools = [
  {
    id: "box-breathing",
    emoji: "🌬️",
    name: "Box Breathing",
    desc: "Calm down in 2 minutes with guided breathing",
  },
  {
    id: "cognitive-reframing",
    emoji: "🧠",
    name: "Cognitive Reframing",
    desc: "Challenge unhelpful thoughts with CBT techniques",
  },
  {
    id: "body-scan",
    emoji: "🧘",
    name: "Body Scan",
    desc: "Progressive muscle relaxation walkthrough",
  },
  {
    id: "pre-performance",
    emoji: "🏆",
    name: "Pre-Performance Routine",
    desc: "Build and run your custom routine",
  },
];

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Toolkit</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Tools to help you perform under pressure. Use them before a big
          moment, or anytime you need a reset.
        </p>
      </div>

      <div className="space-y-3">
        {tools.map((t) => (
          <Link
            key={t.id}
            href={`/tools/${t.id}`}
            className="group flex items-center gap-4 bg-zinc-800/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all duration-150"
          >
            <span className="text-3xl">{t.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold group-hover:text-indigo-300 transition-colors">
                {t.name}
              </div>
              <div className="text-sm text-zinc-400 mt-0.5">{t.desc}</div>
            </div>
            <span className="text-zinc-600 group-hover:text-indigo-400 transition-colors text-lg">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
