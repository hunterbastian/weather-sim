"use client";

import { useState, useEffect } from "react";
import WeatherScene from "@/components/weather-scene";
import WeatherControls from "@/components/weather-controls";
import StationHeader from "@/components/station-header";
import TelemetryReadout from "@/components/telemetry-readout";
import SignalBars from "@/components/signal-bars";

export default function WeatherSimulator() {
  const [sun, setSun] = useState(50);
  const [rain, setRain] = useState(0);
  const [storm, setStorm] = useState(0);
  const [eclipse, setEclipse] = useState(0);
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      {/* Subtle noise texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          animation: "noise-grain 0.5s steps(10) infinite",
        }}
      />

      {/* Subtle vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-6">
        <StationHeader time={time} uptime={formatUptime(uptime)} />

        <div className="flex flex-col gap-1">
          <WeatherScene sun={sun} rain={rain} storm={storm} eclipse={eclipse} />

          {/* Scanline bar under scene */}
          <div
            className="h-px w-full"
            style={{ background: "var(--border)" }}
          />
        </div>

        <TelemetryReadout sun={sun} rain={rain} storm={storm} eclipse={eclipse} />

        <SignalBars sun={sun} rain={rain} storm={storm} eclipse={eclipse} />

        <WeatherControls
          sun={sun}
          rain={rain}
          storm={storm}
          eclipse={eclipse}
          onSunChange={setSun}
          onRainChange={setRain}
          onStormChange={setStorm}
          onEclipseChange={setEclipse}
        />

        {/* Footer status line */}
        <div
          className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          <span>{"OUTPOST // WEATHER MONITORING STATION"}</span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: "var(--signal)",
                animation: "blink 2s ease-in-out infinite",
              }}
            />
            {"RECORDING"}
          </span>
        </div>
      </div>
    </main>
  );
}
