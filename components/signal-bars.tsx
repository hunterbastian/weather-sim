"use client";

import { useEffect, useState } from "react";

interface SignalBarsProps {
  sun: number;
  rain: number;
  storm: number;
}

interface BarRowProps {
  index: number;
  label: string;
  value: number;
  color: string;
  segments?: number;
}

function BarRow({ index, label, value, color, segments = 10 }: BarRowProps) {
  const filledCount = Math.round((value / 100) * segments);

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-4 text-right text-[10px] tabular-nums"
        style={{ color: "var(--muted-foreground)" }}
      >
        {index}.
      </span>
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: segments }, (_, i) => {
          const isFilled = i < filledCount;
          const distanceFromFilled = isFilled ? 0 : i - filledCount;
          const nearEdge = distanceFromFilled >= 0 && distanceFromFilled < 2;

          return (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: 8,
                height: 10,
                background: isFilled
                  ? color
                  : nearEdge
                    ? `color-mix(in srgb, ${color} 25%, transparent)`
                    : `color-mix(in srgb, ${color} 10%, transparent)`,
                opacity: isFilled ? 1 - i * 0.04 : 0.4,
              }}
            />
          );
        })}
      </div>
      <span
        className="text-[9px] uppercase tracking-[0.15em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SignalBars({ sun, rain, storm }: SignalBarsProps) {
  const [tick, setTick] = useState(false);

  // Subtle blink on the container edge every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(true);
      setTimeout(() => setTick(false), 150);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col gap-3 border p-4 transition-all duration-150"
      style={{
        background: "var(--card)",
        borderColor: tick
          ? "rgba(58, 125, 110, 0.15)"
          : "var(--border)",
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {"SIGNAL LEVELS"}
      </div>

      <div className="h-px w-full" style={{ background: "var(--border)" }} />

      <div className="flex flex-col gap-2">
        <BarRow
          index={1}
          label="SOL"
          value={sun}
          color="#d4a843"
        />
        <BarRow
          index={2}
          label="PRC"
          value={rain}
          color="#5a8a9e"
        />
        <BarRow
          index={3}
          label="ELC"
          value={storm}
          color="#9e7a5a"
        />
      </div>
    </div>
  );
}
