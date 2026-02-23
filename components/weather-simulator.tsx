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
  const [time, setTime] = useState("--:--:--");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 md:p-12">
      {/* Subtle washi paper texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative z-10 flex w-full max-w-2xl flex-col gap-8">
        <StationHeader time={time} uptime={formatUptime(uptime)} />

        <div className="flex flex-col gap-2">
          <WeatherScene sun={sun} rain={rain} storm={storm} eclipse={eclipse} />
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

        {/* Footer */}
        <div
          className="flex items-center justify-between px-1 pb-4 text-[10px] tracking-[0.25em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          <span className="font-sans text-[10px] font-light tracking-widest">{"Atmospheric Observation"}</span>
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-1 w-1 rounded-full"
              style={{
                background: "var(--signal)",
                animation: "blink 3s ease-in-out infinite",
              }}
            />
            {"ACTIVE"}
          </span>
        </div>
      </div>
    </main>
  );
}
