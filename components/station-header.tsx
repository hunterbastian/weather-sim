"use client";

interface StationHeaderProps {
  time: string;
  uptime: string;
}

export default function StationHeader({ time, uptime }: StationHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      {/* Top identifier bar */}
      <div
        className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span>{"SYS.WEATHER-SIM"}</span>
        <span>{"v2.4.1"}</span>
      </div>

      {/* Main title area */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1
            className="text-sm font-normal uppercase tracking-[0.3em]"
            style={{ color: "var(--foreground)" }}
          >
            {"Weather Station"}
          </h1>
          <p
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {"Atmospheric Monitoring // Remote Outpost"}
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
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {"UPTIME "}{uptime}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full" style={{ background: "var(--border)" }} />
    </header>
  );
}
