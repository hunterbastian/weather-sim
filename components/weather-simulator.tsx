"use client";

import { useState, useEffect } from "react";
import WeatherScene from "@/components/weather-scene";
import WeatherControls from "@/components/weather-controls";

export default function WeatherSimulator() {
  const [sun, setSun] = useState(50);
  const [rain, setRain] = useState(0);
  const [storm, setStorm] = useState(0);

  useEffect(() => {
    console.log("[v0] WeatherSimulator mounted");
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-4 p-4"
      style={{
        background: "repeating-conic-gradient(#2a2a4a 0% 25%, #262644 0% 50%) 50% / 16px 16px",
      }}
    >
      {/* Desktop icon title */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="text-center text-xs tracking-widest text-white select-none"
          style={{
            textShadow: "2px 2px 0 #000080",
          }}
        >
          WEATHER SIM v1.0
        </div>
        <div
          className="text-center text-[9px] tracking-wide select-none"
          style={{ color: "#8888cc" }}
        >
          32-BIT EDITION
        </div>
      </div>

      <WeatherScene sun={sun} rain={rain} storm={storm} />

      <WeatherControls
        sun={sun}
        rain={rain}
        storm={storm}
        onSunChange={setSun}
        onRainChange={setRain}
        onStormChange={setStorm}
      />

      {/* Retro taskbar */}
      <div
        className="fixed inset-x-0 bottom-0 flex items-center justify-between px-1"
        style={{
          height: 28,
          background: "#c0c0c0",
          borderTop: "2px solid #ffffff",
        }}
      >
        <button
          className="flex items-center gap-1 px-2 text-[10px] leading-none select-none"
          style={{
            height: 22,
            background: "#c0c0c0",
            border: "2px solid",
            borderColor: "#ffffff #404040 #404040 #ffffff",
            color: "#000",
          }}
        >
          <span style={{ fontWeight: 700 }}>Start</span>
        </button>
        <div
          className="flex items-center px-2 text-[10px] leading-none select-none"
          style={{
            height: 22,
            border: "2px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            color: "#000",
          }}
        >
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </main>
  );
}
