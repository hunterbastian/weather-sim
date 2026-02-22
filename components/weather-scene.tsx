"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";

interface WeatherSceneProps {
  sun: number;
  rain: number;
  storm: number;
}

function getSkyGradient(sun: number, rain: number, storm: number) {
  if (storm > 50) {
    return "linear-gradient(180deg, #0d0d12 0%, #1a1a22 40%, #151518 100%)";
  }
  if (rain > 50) {
    return "linear-gradient(180deg, #121218 0%, #1e1e28 40%, #171720 100%)";
  }
  if (sun > 70) {
    return "linear-gradient(180deg, #0f1520 0%, #1a2535 40%, #15202e 100%)";
  }
  return "linear-gradient(180deg, #0e0e14 0%, #161620 40%, #111116 100%)";
}

function getCloudOpacity(rain: number, storm: number) {
  if (rain > 0 || storm > 0) {
    return Math.max(rain / 100, storm / 100) * 0.7;
  }
  return 0;
}

function getCloudColor(rain: number, storm: number) {
  if (storm > 30) return "#1e1e28";
  if (rain > 50 || storm > 50) return "#252530";
  return "#2a2a35";
}

function GrassBlade({ height }: { height: number }) {
  return (
    <div
      className="rounded-t-full"
      style={{
        width: 2,
        height,
        background:
          "linear-gradient(180deg, rgba(40,60,40,0.8) 0%, rgba(25,40,25,0.6) 100%)",
        transformOrigin: "bottom center",
      }}
    />
  );
}

export default function WeatherScene({ sun, rain, storm }: WeatherSceneProps) {
  const rainContainerRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<HTMLDivElement>(null);
  const stormIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const raindropsRef = useRef<HTMLDivElement[]>([]);

  const grassBlades = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        height: 8 + Math.random() * 12,
      })),
    []
  );

  const skyGradient = getSkyGradient(sun, rain, storm);
  const cloudOpacity = getCloudOpacity(rain, storm);
  const cloudColor = getCloudColor(rain, storm);

  const triggerLightning = useCallback(() => {
    const lightningEl = lightningRef.current;
    const boltEl = boltRef.current;
    if (!lightningEl || !boltEl) return;

    lightningEl.style.background = "rgba(200, 200, 220, 0.15)";
    boltEl.style.opacity = "0.7";
    boltEl.style.left = `${20 + Math.random() * 60}%`;

    setTimeout(() => {
      lightningEl.style.background = "rgba(200, 200, 220, 0)";
      boltEl.style.opacity = "0";
    }, 80);

    if (Math.random() > 0.5) {
      setTimeout(() => {
        lightningEl.style.background = "rgba(200, 200, 220, 0.1)";
        boltEl.style.opacity = "0.5";
        setTimeout(() => {
          lightningEl.style.background = "rgba(200, 200, 220, 0)";
          boltEl.style.opacity = "0";
        }, 40);
      }, 120);
    }
  }, []);

  // Manage raindrops
  useEffect(() => {
    const container = rainContainerRef.current;
    if (!container) return;

    const targetCount = Math.floor(Math.max(rain, storm * 0.5) * 1.5);
    const drops = raindropsRef.current;

    while (drops.length < targetCount) {
      const drop = document.createElement("div");
      drop.style.position = "absolute";
      drop.style.width = "1px";
      drop.style.height = "16px";
      drop.style.background =
        "linear-gradient(transparent, rgba(90, 138, 158, 0.5))";
      drop.style.animation = `fall ${0.5 + Math.random() * 0.5}s linear infinite`;
      drop.style.animationDelay = `${Math.random() * 0.5}s`;
      drop.style.left = `${Math.random() * 100}%`;
      container.appendChild(drop);
      drops.push(drop);
    }

    while (drops.length > targetCount) {
      const drop = drops.pop();
      drop?.remove();
    }

    const opacity = Math.max(rain, storm * 0.5) / 100;
    drops.forEach((drop) => {
      drop.style.opacity = String(opacity);
    });
  }, [rain, storm]);

  // Manage storm lightning
  useEffect(() => {
    if (stormIntervalRef.current) {
      clearInterval(stormIntervalRef.current);
      stormIntervalRef.current = null;
    }

    if (storm > 0) {
      const maxInterval = 5000;
      const minInterval = 500;
      const interval =
        maxInterval - (storm / 100) * (maxInterval - minInterval);

      stormIntervalRef.current = setInterval(() => {
        if (Math.random() < storm / 100) {
          triggerLightning();
        }
      }, interval);
    }

    return () => {
      if (stormIntervalRef.current) {
        clearInterval(stormIntervalRef.current);
      }
    };
  }, [storm, triggerLightning]);

  // Ambient glow intensity based on sun
  const ambientGlow = sun / 100;

  return (
    <div className="relative flex flex-col">
      {/* Scene label */}
      <div
        className="flex items-center justify-between px-1 pb-2 text-[9px] uppercase tracking-[0.2em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span>{"VISUAL FEED"}</span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block h-1 w-1 rounded-full"
            style={{
              background: "var(--signal)",
              animation: "blink 3s ease-in-out infinite",
            }}
          />
          {"LIVE"}
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden border"
        style={{
          aspectRatio: "16 / 9",
          background: skyGradient,
          borderColor: "var(--border)",
          transition: "background 1s ease",
        }}
      >
        {/* Ambient atmospheric glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 75% 25%, rgba(212, 168, 67, ${ambientGlow * 0.08}) 0%, transparent 60%)`,
            transition: "background 0.5s ease",
          }}
        />

        {/* Sun - more muted, like through haze */}
        <div
          className="absolute top-[10%] right-[12%]"
          style={{
            width: "15%",
            aspectRatio: "1",
            background: `radial-gradient(circle, rgba(212, 168, 67, 0.8) 0%, rgba(212, 168, 67, 0.2) 50%, transparent 70%)`,
            borderRadius: "50%",
            opacity: sun / 100,
            transition: "opacity 0.5s ease",
            animation: sun > 0 ? "pulse-sun 4s ease-in-out infinite" : "none",
          }}
        />

        {/* Horizon haze line */}
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: "20%",
            height: "8%",
            background: `linear-gradient(180deg, transparent, rgba(200, 200, 210, ${0.02 + ambientGlow * 0.03}), transparent)`,
          }}
        />

        {/* Clouds */}
        <div className="pointer-events-none absolute inset-0">
          {[
            {
              w: "25%",
              h: "8%",
              top: "15%",
              left: "5%",
            },
            {
              w: "30%",
              h: "10%",
              top: "22%",
              left: "35%",
            },
            {
              w: "22%",
              h: "7%",
              top: "12%",
              left: "70%",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="cloud-shape absolute rounded-[50px]"
              style={{
                width: c.w,
                height: c.h,
                top: c.top,
                left: c.left,
                background: cloudColor,
                opacity: cloudOpacity,
                transition: "opacity 0.5s ease, background 0.5s ease",
                animation: `drift ${6 + i * 2}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        <style jsx>{`
          .cloud-shape::before,
          .cloud-shape::after {
            content: "";
            position: absolute;
            border-radius: 50%;
            background: inherit;
          }
          .cloud-shape:nth-child(1)::before {
            width: 35px;
            height: 35px;
            top: -18px;
            left: 10px;
          }
          .cloud-shape:nth-child(1)::after {
            width: 45px;
            height: 45px;
            top: -22px;
            left: 30px;
          }
          .cloud-shape:nth-child(2)::before {
            width: 45px;
            height: 45px;
            top: -22px;
            left: 15px;
          }
          .cloud-shape:nth-child(2)::after {
            width: 55px;
            height: 55px;
            top: -28px;
            left: 42px;
          }
          .cloud-shape:nth-child(3)::before {
            width: 30px;
            height: 30px;
            top: -15px;
            left: 8px;
          }
          .cloud-shape:nth-child(3)::after {
            width: 40px;
            height: 40px;
            top: -20px;
            left: 28px;
          }
        `}</style>

        {/* Rain */}
        <div
          ref={rainContainerRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
        />

        {/* Lightning overlay */}
        <div
          ref={lightningRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background: "rgba(200, 200, 220, 0)",
            transition: "background 0.08s",
          }}
        />

        {/* Lightning bolt */}
        <div
          ref={boltRef}
          className="absolute"
          style={{
            top: "18%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 24,
            height: 70,
            opacity: 0,
            filter:
              "drop-shadow(0 0 6px rgba(200,200,220,0.5)) drop-shadow(0 0 12px rgba(90,138,158,0.3))",
          }}
        >
          <svg viewBox="0 0 24 24" fill="#c8c8d0" className="h-full w-full">
            <path d="M13 0L0 13h9v11l13-13h-9z" />
          </svg>
        </div>

        {/* Ground - dark muted terrain */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "18%",
            background:
              "linear-gradient(180deg, #151a15 0%, #0d120d 50%, #0a0f0a 100%)",
          }}
        >
          <div className="absolute -top-2 flex w-full justify-around px-1">
            {grassBlades.map((blade) => (
              <GrassBlade key={blade.id} height={blade.height} />
            ))}
          </div>
        </div>

        {/* CRT scan lines overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          }}
        />

        {/* Corner markers - outpost monitoring feel */}
        <svg
          className="pointer-events-none absolute top-2 left-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path d="M0 6V0h6" stroke="rgba(200,200,210,0.15)" strokeWidth="1" />
        </svg>
        <svg
          className="pointer-events-none absolute top-2 right-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M16 6V0h-6"
            stroke="rgba(200,200,210,0.15)"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="pointer-events-none absolute bottom-2 left-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M0 10v6h6"
            stroke="rgba(200,200,210,0.15)"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="pointer-events-none absolute right-2 bottom-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M16 10v6h-6"
            stroke="rgba(200,200,210,0.15)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}
