"use client";

import { useId } from "react";

interface WeatherControlsProps {
  sun: number;
  rain: number;
  storm: number;
  onSunChange: (value: number) => void;
  onRainChange: (value: number) => void;
  onStormChange: (value: number) => void;
}

interface RetroSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: string;
  trackFill: string;
}

function RetroSlider({ label, value, onChange, icon, trackFill }: RetroSliderProps) {
  const id = useId();
  const className = `retro-range-${id.replace(/:/g, "")}`;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[10px] leading-none select-none" style={{ color: "#000" }}>
          <span className="text-xs">{icon}</span>
          {label}
        </span>
        <span
          className="text-[10px] leading-none select-none"
          style={{
            color: "#000",
            background: "#fff",
            border: "1px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            padding: "1px 4px",
            minWidth: 36,
            textAlign: "right",
            display: "inline-block",
          }}
        >
          {value}%
        </span>
      </div>
      <div
        className="relative flex items-center"
        style={{ height: 20 }}
      >
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2"
          style={{
            height: 6,
            background: "#808080",
            border: "2px solid",
            borderColor: "#404040 #ffffff #ffffff #404040",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${value}%`,
              background: trackFill,
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={`${label} intensity`}
          className={`${className} relative z-10 w-full cursor-pointer`}
          style={{ height: 20 }}
        />
      </div>
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
      className="flex w-full max-w-[512px] flex-col"
      style={{
        border: "3px solid",
        borderColor: "#ffffff #404040 #404040 #ffffff",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-1 py-px"
        style={{
          background: "linear-gradient(90deg, #000080, #1084d0)",
          height: 20,
        }}
      >
        <span className="text-[10px] text-white leading-none select-none tracking-wider">
          controls.exe
        </span>
        <div className="flex gap-px">
          <button
            aria-label="Minimize"
            className="flex h-[14px] w-[14px] items-center justify-center text-[8px] leading-none select-none"
            style={{
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #404040 #404040 #ffffff",
              color: "#000",
            }}
          >
            _
          </button>
          <button
            aria-label="Close"
            className="flex h-[14px] w-[14px] items-center justify-center text-[8px] leading-none select-none"
            style={{
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #404040 #404040 #ffffff",
              color: "#000",
            }}
          >
            x
          </button>
        </div>
      </div>
      {/* Content area */}
      <div
        className="flex flex-col gap-3 p-3"
        style={{ background: "#c0c0c0" }}
      >
        {/* Group box */}
        <fieldset
          style={{
            border: "2px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            padding: "8px 10px 10px",
          }}
        >
          <legend
            className="px-1 text-[10px] leading-none select-none"
            style={{ color: "#000" }}
          >
            Weather Parameters
          </legend>
          <div className="flex flex-col gap-3">
            <RetroSlider
              label="SUN"
              value={sun}
              onChange={onSunChange}
              icon="*"
              trackFill="#f0c030"
            />
            <RetroSlider
              label="RAIN"
              value={rain}
              onChange={onRainChange}
              icon=","
              trackFill="#5b8cd8"
            />
            <RetroSlider
              label="STORM"
              value={storm}
              onChange={onStormChange}
              icon="!"
              trackFill="#c05050"
            />
          </div>
        </fieldset>

        {/* Status bar */}
        <div
          className="flex items-center gap-2 px-1 py-px text-[9px] leading-none select-none"
          style={{
            border: "2px solid",
            borderColor: "#808080 #ffffff #ffffff #808080",
            color: "#000",
            height: 18,
          }}
        >
          <span>Ready</span>
          <span style={{ color: "#808080" }}>|</span>
          <span>
            {sun > 60
              ? "Sunny"
              : storm > 40
                ? "Stormy"
                : rain > 40
                  ? "Rainy"
                  : "Clear"}
          </span>
        </div>
      </div>
    </div>
  );
}
