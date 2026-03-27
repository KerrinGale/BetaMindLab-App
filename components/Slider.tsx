"use client";

interface Props {
  label: string;
  emoji: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

export default function Slider({
  label,
  emoji,
  value,
  onChange,
  min = 1,
  max = 10,
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">
          {emoji} {label}
        </span>
        <span className="text-sm font-bold text-indigo-300 w-6 text-right">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-zinc-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
