"use client";

import { Sun, CloudRain, CloudLightning, Eclipse } from "lucide-react";

interface WeatherControlsProps {
  sun: number;
  rain: number;
  storm: number;
  eclipse: number;
  onSunChange: (value: number) => void;
  onRainChange: (value: number) => void;
  onStormChange: (value: number) => void;
  onEclipseChange: (value: number) => void;
}

interface SliderRowProps {
  label: string;
  code: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  trackColor: string;
  thumbColor: string;
}

function SliderRow({
  label,
  code,
  value,
  onChange,
  icon,
  trackColor,
  thumbColor,
}: SliderRowProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-3 text-[10px] tracking-[0.2em]"
          style={{ color: "var(--muted-foreground)" }}
        >
          {icon}
          <span className="font-sans text-xs font-light" style={{ color: "var(--foreground)" }}>{label}</span>
          <span className="opacity-40">{code}</span>
        </span>
        <span
          className="font-sans min-w-10 text-right text-sm font-light tabular-nums"
          style={{ color: "var(--foreground)" }}
        >
          {value}
          <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>%</span>
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} intensity`}
          className="jp-slider w-full cursor-pointer"
          style={
            {
              "--track-color": trackColor,
              "--thumb-color": thumbColor,
            } as React.CSSProperties
          }
        />
      </div>
      <style jsx>{`
        .jp-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 1px;
          border-radius: 0;
          outline: none;
          background: var(--border);
          transition: background 0.3s;
        }
        .jp-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          box-shadow: 0 0 6px rgba(139, 69, 19, 0.15);
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .jp-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 10px rgba(139, 69, 19, 0.25);
          transform: scale(1.15);
        }
        .jp-slider::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 6px rgba(139, 69, 19, 0.15);
          transition: box-shadow 0.3s;
        }
        .jp-slider::-moz-range-thumb:hover {
          box-shadow: 0 0 10px rgba(139, 69, 19, 0.25);
        }
        .jp-slider::-moz-range-track {
          height: 1px;
          border-radius: 0;
          background: var(--border);
        }
      `}</style>
    </div>
  );
}

export default function WeatherControls({
  sun,
  rain,
  storm,
  eclipse,
  onSunChange,
  onRainChange,
  onStormChange,
  onEclipseChange,
}: WeatherControlsProps) {
  return (
    <div
      className="flex flex-col gap-6 border-t p-5"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Section label */}
      <div
        className="text-[10px] tracking-[0.25em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        {"CONTROLS"}
      </div>

      <div className="h-px w-full" style={{ background: "var(--border)" }} />

      <SliderRow
        label="Taiyou"
        code="Solar"
        value={sun}
        onChange={onSunChange}
        icon={
          <Sun
            className="h-3.5 w-3.5"
            style={{ color: "var(--sun-color)" }}
          />
        }
        trackColor="var(--sun-color)"
        thumbColor="var(--sun-color)"
      />
      <SliderRow
        label="Ame"
        code="Rain"
        value={rain}
        onChange={onRainChange}
        icon={
          <CloudRain
            className="h-3.5 w-3.5"
            style={{ color: "var(--rain-color)" }}
          />
        }
        trackColor="var(--rain-color)"
        thumbColor="var(--rain-color)"
      />
      <SliderRow
        label="Arashi"
        code="Storm"
        value={storm}
        onChange={onStormChange}
        icon={
          <CloudLightning
            className="h-3.5 w-3.5"
            style={{ color: "var(--storm-color)" }}
          />
        }
        trackColor="var(--storm-color)"
        thumbColor="var(--storm-color)"
      />
      <SliderRow
        label="Nisshoku"
        code="Eclipse"
        value={eclipse}
        onChange={onEclipseChange}
        icon={
          <Eclipse
            className="h-3.5 w-3.5"
            style={{ color: "var(--eclipse-color)" }}
          />
        }
        trackColor="var(--eclipse-color)"
        thumbColor="var(--eclipse-color)"
      />
    </div>
  );
}
