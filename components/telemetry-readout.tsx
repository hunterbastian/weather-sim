"use client";

import { useEffect, useState } from "react";

interface TelemetryReadoutProps {
  sun: number;
  rain: number;
  storm: number;
  eclipse: number;
}

function deriveTempC(sun: number, rain: number, storm: number, eclipse: number) {
  const base = 12;
  const sunContrib = (sun / 100) * 22;
  const rainPenalty = (rain / 100) * 6;
  const stormPenalty = (storm / 100) * 10;
  const eclipsePenalty = (eclipse / 100) * 8;
  return (base + sunContrib - rainPenalty - stormPenalty - eclipsePenalty).toFixed(1);
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

function deriveVisibility(rain: number, storm: number, eclipse: number) {
  const base = 10;
  const rainDrop = (rain / 100) * 6;
  const stormDrop = (storm / 100) * 4;
  const eclipseDrop = (eclipse / 100) * 3;
  return Math.max(0.1, base - rainDrop - stormDrop - eclipseDrop).toFixed(1);
}

function deriveLux(sun: number, eclipse: number) {
  const baseLux = (sun / 100) * 100000;
  const eclipseFactor = 1 - (eclipse / 100) * 0.999;
  const lux = Math.max(0.1, baseLux * eclipseFactor);
  if (lux >= 1000) return `${(lux / 1000).toFixed(1)}k`;
  return lux.toFixed(0);
}

function deriveWindSpeed(storm: number) {
  const base = 4;
  const stormBoost = (storm / 100) * 56;
  return Math.round(base + stormBoost);
}

function deriveCondition(sun: number, rain: number, storm: number, eclipse: number): string {
  if (eclipse > 80) return "Total Eclipse";
  if (eclipse > 50) return "Partial Eclipse";
  if (eclipse > 20) return "Lunar Transit";
  if (storm > 60) return "Arashi";
  if (storm > 30) return "Kaminari";
  if (rain > 60) return "Ame";
  if (rain > 30) return "Kosame";
  if (sun > 70) return "Hare";
  if (sun > 40) return "Kumori";
  return "Donten";
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
        className="text-[8px] tracking-[0.25em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-0.5">
        <span
          className="font-sans text-sm font-light tabular-nums"
          style={{ color: "var(--foreground)" }}
        >
          {value}
        </span>
        <span
          className="text-[9px]"
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
  eclipse,
}: TelemetryReadoutProps) {
  const [flicker, setFlicker] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(true);
      setTimeout(() => setFlicker(false), 80);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const condition = deriveCondition(sun, rain, storm, eclipse);
  const temp = deriveTempC(sun, rain, storm, eclipse);
  const humidity = deriveHumidity(rain, storm);
  const pressure = derivePressure(storm);
  const visibility = deriveVisibility(rain, storm, eclipse);
  const windSpeed = deriveWindSpeed(storm);
  const lux = deriveLux(sun, eclipse);

  return (
    <div
      className="flex h-full flex-col gap-2.5 border-t p-3 transition-opacity duration-200"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        opacity: flicker ? 0.85 : 1,
      }}
    >
      {/* Condition status bar */}
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] tracking-[0.25em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {"READINGS"}
        </span>
        <span
          className="font-sans text-[10px] font-light tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          {condition}
        </span>
      </div>

      <div className="h-px w-full" style={{ background: "var(--border)" }} />

      {/* Data grid */}
      <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
        <DataCell label="TEMP" value={temp} unit="C" />
        <DataCell label="HUM" value={String(humidity)} unit="%" />
        <DataCell label="hPa" value={pressure} unit="" />
        <DataCell label="VIS" value={visibility} unit="km" />
        <DataCell label="WIND" value={String(windSpeed)} unit="km/h" />
        <DataCell label="LUX" value={lux} unit="lx" />
      </div>
    </div>
  );
}
