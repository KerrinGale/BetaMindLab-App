"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Today", href: "/" },
  { label: "Goals", href: "/goals" },
  { label: "Tools", href: "/tools" },
  { label: "Trends", href: "/dashboard" },
  { label: "Insights", href: "/insights" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-lg tracking-tight">
          <span className="text-zinc-100">Mind</span>
          <span className="text-indigo-400">Loop</span>
        </Link>
        <div className="flex gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
