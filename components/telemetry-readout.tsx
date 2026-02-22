"use client";

import { useEffect, useState } from "react";

interface TelemetryReadoutProps {
  sun: number;
  rain: number;
  storm: number;
}

function deriveTempC(sun: number, rain: number, storm: number) {
  const base = 12;
  const sunContrib = (sun / 100) * 22;
  const rainPenalty = (rain / 100) * 6;
  const stormPenalty = (storm / 100) * 10;
  return (base + sunContrib - rainPenalty - stormPenalty).toFixed(1);
}

function deriveHumidity(rain: number, storm: number) {
  const base = 35;
  const rainBoost = (rain / 100) * 50;
  const stormBoost = (storm / 100) * 15;
  return Math.min(99, Math.round(base + rainBoost + stormBoost));
}

function derivePressure(storm: number) {
  const base = 1013;
  const stormDrop = (storm / 100) * 40;
  return (base - stormDrop).toFixed(0);
}

function deriveVisibility(rain: number, storm: number) {
  const base = 10;
  const rainDrop = (rain / 100) * 6;
  const stormDrop = (storm / 100) * 4;
  return Math.max(0.1, base - rainDrop - stormDrop).toFixed(1);
}

function deriveWindSpeed(storm: number) {
  const base = 4;
  const stormBoost = (storm / 100) * 56;
  return Math.round(base + stormBoost);
}

function deriveCondition(sun: number, rain: number, storm: number): string {
  if (storm > 60) return "SEVERE STORM";
  if (storm > 30) return "THUNDERSTORM";
  if (rain > 60) return "HEAVY RAIN";
  if (rain > 30) return "LIGHT RAIN";
  if (sun > 70) return "CLEAR SKY";
  if (sun > 40) return "PARTLY CLOUDY";
  return "OVERCAST";
}

function DataCell({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[9px] uppercase tracking-[0.2em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className="text-sm tabular-nums"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function TelemetryReadout({
  sun,
  rain,
  storm,
}: TelemetryReadoutProps) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 80);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const condition = deriveCondition(sun, rain, storm);
  const temp = deriveTempC(sun, rain, storm);
  const humidity = deriveHumidity(rain, storm);
  const pressure = derivePressure(storm);
  const visibility = deriveVisibility(rain, storm);
  const windSpeed = deriveWindSpeed(storm);

  return (
    <div
      className="flex flex-col gap-3 border p-4 transition-opacity duration-75"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        opacity: flicker ? 0.7 : 1,
      }}
    >
      {/* Condition status bar */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {"TELEMETRY READOUT"}
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.15em]"
          style={{ color: "var(--signal)" }}
        >
          {condition}
        </span>
      </div>

      <div className="h-px w-full" style={{ background: "var(--border)" }} />

      {/* Data grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-3 md:grid-cols-5">
        <DataCell label="TEMP" value={temp} unit="C" />
        <DataCell label="HUMIDITY" value={String(humidity)} unit="%" />
        <DataCell label="PRESSURE" value={pressure} unit="hPa" />
        <DataCell label="VISIBILITY" value={visibility} unit="km" />
        <DataCell label="WIND" value={String(windSpeed)} unit="km/h" />
      </div>
    </div>
  );
}
