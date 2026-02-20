"use client";

import { useState } from "react";
import WeatherScene from "@/components/weather-scene";
import WeatherControls from "@/components/weather-controls";

export default function WeatherSimulator() {
  const [sun, setSun] = useState(50);
  const [rain, setRain] = useState(0);
  const [storm, setStorm] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-5">
      <h1 className="text-balance text-center text-3xl font-bold tracking-tight text-[var(--foreground)] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
        Weather Simulation
      </h1>

      <WeatherScene sun={sun} rain={rain} storm={storm} />

      <WeatherControls
        sun={sun}
        rain={rain}
        storm={storm}
        onSunChange={setSun}
        onRainChange={setRain}
        onStormChange={setStorm}
      />
    </main>
  );
}
