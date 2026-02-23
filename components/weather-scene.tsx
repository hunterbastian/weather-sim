"use client";

import { useEffect, useRef, useCallback } from "react";

interface WeatherSceneProps {
  sun: number;
  rain: number;
  storm: number;
  eclipse: number;
}

function getSkyGradient(sun: number, rain: number, storm: number, eclipse: number) {
  if (eclipse > 70) {
    return "linear-gradient(180deg, #3a3540 0%, #4a4550 40%, #2e2a32 100%)";
  }
  if (eclipse > 30) {
    const t = (eclipse - 30) / 70;
    const r = Math.round(190 - t * 120);
    const g = Math.round(185 - t * 115);
    const b = Math.round(175 - t * 100);
    return `linear-gradient(180deg, rgb(${r - 30},${g - 25},${b - 20}) 0%, rgb(${r},${g},${b}) 50%, rgb(${r - 15},${g - 10},${b - 5}) 100%)`;
  }
  if (storm > 50) {
    return "linear-gradient(180deg, #8a8078 0%, #9a9088 40%, #7a7068 100%)";
  }
  if (rain > 50) {
    return "linear-gradient(180deg, #a0a098 0%, #b5b0a8 40%, #908880 100%)";
  }
  if (sun > 70) {
    return "linear-gradient(180deg, #c8c0b0 0%, #ddd5c5 40%, #e8dfd0 100%)";
  }
  return "linear-gradient(180deg, #b8b0a5 0%, #ccc5b8 40%, #bfb8ad 100%)";
}

function getCloudOpacity(rain: number, storm: number) {
  if (rain > 0 || storm > 0) {
    return Math.max(rain / 100, storm / 100) * 0.6;
  }
  return 0;
}

function getCloudColor(rain: number, storm: number) {
  if (storm > 30) return "#9a9590";
  if (rain > 50 || storm > 50) return "#a8a298";
  return "#c5bfb5";
}

export default function WeatherScene({ sun, rain, storm, eclipse }: WeatherSceneProps) {
  const rainContainerRef = useRef<HTMLDivElement>(null);
  const lightningRef = useRef<HTMLDivElement>(null);
  const boltRef = useRef<HTMLDivElement>(null);
  const stormIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const raindropsRef = useRef<HTMLDivElement[]>([]);

  const skyGradient = getSkyGradient(sun, rain, storm, eclipse);
  const cloudOpacity = getCloudOpacity(rain, storm);
  const cloudColor = getCloudColor(rain, storm);

  const triggerLightning = useCallback(() => {
    const lightningEl = lightningRef.current;
    const boltEl = boltRef.current;
    if (!lightningEl || !boltEl) return;

    lightningEl.style.background = "rgba(220, 215, 200, 0.2)";
    boltEl.style.opacity = "0.6";
    boltEl.style.left = `${20 + Math.random() * 60}%`;

    setTimeout(() => {
      lightningEl.style.background = "rgba(220, 215, 200, 0)";
      boltEl.style.opacity = "0";
    }, 80);

    if (Math.random() > 0.5) {
      setTimeout(() => {
        lightningEl.style.background = "rgba(220, 215, 200, 0.12)";
        boltEl.style.opacity = "0.4";
        setTimeout(() => {
          lightningEl.style.background = "rgba(220, 215, 200, 0)";
          boltEl.style.opacity = "0";
        }, 40);
      }, 120);
    }
  }, []);

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
        "linear-gradient(transparent, rgba(122, 158, 178, 0.45))";
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

  const ambientGlow = sun / 100;

  return (
    <div className="relative flex flex-col">
      <div
        className="flex items-center justify-between px-1 pb-3 text-[9px] tracking-[0.25em]"
        style={{ color: "var(--muted-foreground)" }}
      >
        <span>{"OBSERVATION"}</span>
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
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          background: skyGradient,
          border: "1px solid var(--border)",
          transition: "background 1.2s ease",
        }}
      >
        {/* Ambient atmospheric glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 75% 25%, rgba(196, 149, 106, ${ambientGlow * 0.15}) 0%, transparent 60%)`,
            transition: "background 0.8s ease",
          }}
        />

        {/* Sun */}
        <div
          className="absolute top-[10%] right-[12%]"
          style={{
            width: "15%",
            aspectRatio: "1",
            background: `radial-gradient(circle, rgba(196, 149, 106, 0.7) 0%, rgba(196, 149, 106, 0.2) 50%, transparent 70%)`,
            borderRadius: "50%",
            opacity: sun / 100,
            transition: "opacity 0.8s ease",
            animation: sun > 0 ? "pulse-sun 5s ease-in-out infinite" : "none",
          }}
        />

        {/* Eclipse disc */}
        {eclipse > 0 && (
          <div
            className="absolute"
            style={{
              top: "8%",
              right: "10%",
              width: "17%",
              aspectRatio: "1",
              transform: `translate(${(1 - eclipse / 100) * 60}%, ${(1 - eclipse / 100) * -20}%)`,
              transition: "transform 0.8s ease, opacity 0.5s ease",
              zIndex: 2,
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                boxShadow:
                  eclipse > 40
                    ? `0 0 ${20 + eclipse * 0.4}px rgba(107, 91, 115, ${0.2 + (eclipse / 100) * 0.3}), 0 0 ${40 + eclipse * 0.6}px rgba(196, 149, 106, ${0.05 + (eclipse / 100) * 0.15})`
                    : "none",
                transition: "box-shadow 0.8s ease",
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, #3a3540 0%, #2e2a32 70%, rgba(46, 42, 50, 0.9) 100%)`,
                opacity: eclipse / 100,
              }}
            />
            {eclipse > 50 && (
              <div
                className="absolute inset-[-2px] rounded-full"
                style={{
                  border: `1px solid rgba(196, 149, 106, ${(eclipse - 50) / 200})`,
                  transition: "border-color 0.8s ease",
                }}
              />
            )}
          </div>
        )}

        {/* Eclipse darkening */}
        {eclipse > 20 && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `rgba(46, 42, 50, ${((eclipse - 20) / 80) * 0.4})`,
              transition: "background 0.8s ease",
            }}
          />
        )}

        {/* Horizon mist */}
        <div
          className="pointer-events-none absolute inset-x-0"
          style={{
            bottom: "22%",
            height: "12%",
            background: `linear-gradient(180deg, transparent, rgba(245, 240, 232, ${0.03 + ambientGlow * 0.05}), transparent)`,
          }}
        />

        {/* Clouds */}
        <div className="pointer-events-none absolute inset-0">
          {[
            { w: "25%", h: "8%", top: "15%", left: "5%" },
            { w: "30%", h: "10%", top: "22%", left: "35%" },
            { w: "22%", h: "7%", top: "12%", left: "70%" },
          ].map((c, i) => (
            <div
              key={i}
              className="cloud-shape absolute rounded-full"
              style={{
                width: c.w,
                height: c.h,
                top: c.top,
                left: c.left,
                background: cloudColor,
                opacity: cloudOpacity,
                transition: "opacity 0.8s ease, background 0.8s ease",
                animation: `drift ${8 + i * 3}s ease-in-out infinite`,
                filter: "blur(1px)",
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
            filter: blur(1px);
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
            background: "rgba(220, 215, 200, 0)",
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
              "drop-shadow(0 0 6px rgba(196,149,106,0.3)) drop-shadow(0 0 12px rgba(138,112,96,0.2))",
          }}
        >
          <svg viewBox="0 0 24 24" fill="#c4956a" className="h-full w-full">
            <path d="M13 0L0 13h9v11l13-13h-9z" />
          </svg>
        </div>

        {/* Ground - layered mountain silhouettes */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{ height: "28%" }}
        >
          <svg
            className="absolute inset-x-0 bottom-0 h-full w-full"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            fill="none"
          >
            <path
              d="M0 180 Q100 80 200 120 Q300 60 400 100 Q500 40 600 90 Q700 50 800 110 L800 200 L0 200 Z"
              fill="rgba(44, 44, 44, 0.08)"
            />
            <path
              d="M0 185 Q80 120 180 150 Q280 100 380 135 Q480 90 580 130 Q680 100 800 140 L800 200 L0 200 Z"
              fill="rgba(44, 44, 44, 0.12)"
            />
            <path
              d="M0 190 Q120 150 220 170 Q320 140 420 165 Q520 140 620 160 Q720 145 800 170 L800 200 L0 200 Z"
              fill="rgba(44, 44, 44, 0.18)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
