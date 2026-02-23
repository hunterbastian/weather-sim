"use client";

interface StationHeaderProps {
  time: string;
  uptime: string;
}

export default function StationHeader({ time, uptime }: StationHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      {/* Main title area */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1
            className="font-sans text-xl font-light tracking-[0.15em]"
            style={{ color: "var(--foreground)" }}
          >
            {"Weather Observatory"}
          </h1>
          <p
            className="text-[10px] tracking-[0.2em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {"ATMOSPHERIC OBSERVATION"}
          </p>
        </div>

        {/* Time display */}
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-lg font-light tabular-nums tracking-wider"
            style={{ color: "var(--foreground)" }}
          >
            {time}
          </span>
          <span
            className="text-[10px] tracking-[0.2em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {uptime}
          </span>
        </div>
      </div>

      {/* Divider - thin ink line */}
      <div className="h-px w-full" style={{ background: "var(--border)" }} />
    </header>
  );
}
