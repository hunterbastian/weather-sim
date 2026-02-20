"use client";

import { Sun, CloudRain, CloudLightning } from "lucide-react";

interface WeatherControlsProps {
  sun: number;
  rain: number;
  storm: number;
  onSunChange: (value: number) => void;
  onRainChange: (value: number) => void;
  onStormChange: (value: number) => void;
}

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  trackColor: string;
  thumbColor: string;
}

function SliderRow({
  label,
  value,
  onChange,
  icon,
  trackColor,
  thumbColor,
}: SliderRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
          {icon}
          {label}
        </span>
        <span className="min-w-[40px] text-right text-sm text-[var(--muted-foreground)]">
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} intensity`}
        className="weather-slider w-full cursor-pointer"
        style={
          {
            "--track-color": trackColor,
            "--thumb-color": thumbColor,
          } as React.CSSProperties
        }
      />
      <style jsx>{`
        .weather-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
          background: linear-gradient(
            90deg,
            #2c3e50 0%,
            var(--track-color) 100%
          );
          transition: background 0.3s;
        }
        .weather-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }
        .weather-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .weather-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--thumb-color);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s;
        }
        .weather-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
        .weather-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(
            90deg,
            #2c3e50 0%,
            var(--track-color) 100%
          );
        }
      `}</style>
    </div>
  );
}

export default function WeatherControls({
  sun,
  rain,
  storm,
  onSunChange,
  onRainChange,
  onStormChange,
}: WeatherControlsProps) {
  return (
    <div
      className="flex w-full max-w-[500px] flex-col gap-5 rounded-2xl p-6"
      style={{
        background: "var(--card)",
        backdropFilter: "blur(10px)",
      }}
    >
      <SliderRow
        label="Sun"
        value={sun}
        onChange={onSunChange}
        icon={<Sun className="h-5 w-5 text-[var(--sun-color)]" />}
        trackColor="#FFD700"
        thumbColor="linear-gradient(135deg, #FFD700, #FFA500)"
      />
      <SliderRow
        label="Rain"
        value={rain}
        onChange={onRainChange}
        icon={<CloudRain className="h-5 w-5 text-[var(--rain-color)]" />}
        trackColor="#4A90D9"
        thumbColor="linear-gradient(135deg, #4A90D9, #2E5984)"
      />
      <SliderRow
        label="Storm"
        value={storm}
        onChange={onStormChange}
        icon={<CloudLightning className="h-5 w-5 text-[var(--storm-color)]" />}
        trackColor="#8B5CF6"
        thumbColor="linear-gradient(135deg, #8B5CF6, #6D28D9)"
      />
    </div>
  );
}
