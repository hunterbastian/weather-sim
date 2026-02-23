"use client";

import { useEffect, useState } from "react";

interface SignalBarsProps {
  sun: number;
  rain: number;
  storm: number;
  eclipse: number;
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
              className="transition-all duration-500"
              style={{
                width: 6,
                height: 8,
                borderRadius: "1px",
                background: isFilled
                  ? color
                  : nearEdge
                    ? `color-mix(in srgb, ${color} 20%, transparent)`
                    : `color-mix(in srgb, ${color} 8%, transparent)`,
                opacity: isFilled ? 1 - i * 0.04 : 0.3,
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

export default function SignalBars({ sun, rain, storm, eclipse }: SignalBarsProps) {
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
      className="flex flex-col gap-3 border-t p-5 transition-all duration-300"
      style={{
        background: "var(--card)",
        borderColor: tick
          ? "rgba(139, 69, 19, 0.12)"
          : "var(--border)",
      }}
    >
      <div
        className="text-[10px] tracking-[0.25em]"
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
          color="#c4956a"
        />
        <BarRow
          index={2}
          label="PRC"
          value={rain}
          color="#7a9eb2"
        />
        <BarRow
          index={3}
          label="ELC"
          value={storm}
          color="#8a7060"
        />
        <BarRow
          index={4}
          label="ECL"
          value={eclipse}
          color="#6b5b73"
        />
      </div>
    </div>
  );
}
