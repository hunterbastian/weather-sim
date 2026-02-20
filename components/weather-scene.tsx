"use client";

import { useEffect, useRef, useMemo, useCallback } from "react";

interface WeatherSceneProps {
  sun: number;
  rain: number;
  storm: number;
}

function getSkyGradient(sun: number, rain: number, storm: number) {
  if (storm > 50) {
    return "linear-gradient(180deg, #2C3E50 0%, #4A5568 100%)";
  }
  if (rain > 50) {
    return "linear-gradient(180deg, #5D6D7E 0%, #85929E 100%)";
  }
  if (sun > 70) {
    return "linear-gradient(180deg, #4A90D9 0%, #87CEEB 100%)";
  }
  return "linear-gradient(180deg, #87CEEB 0%, #E0F6FF 100%)";
}

function getCloudOpacity(rain: number, storm: number) {
  if (rain > 0 || storm > 0) {
    return Math.max(rain / 100, storm / 100) * 0.9;
  }
  return 0;
}

function getCloudColor(rain: number, storm: number) {
  if (storm > 30) return "#5D6D7E";
  if (rain > 50 || storm > 50) return "#8B8B8B";
  return "#C0C0C0";
}

function Cloud({ className }: { className: string }) {
  return <div className={className} />;
}

function GrassBlade({ height }: { height: number }) {
  return (
    <div
      className="rounded-t-full"
      style={{
        width: 3,
        height,
        background: "#32CD32",
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
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        height: 10 + Math.random() * 15,
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

    lightningEl.style.background = "rgba(255, 255, 255, 0.9)";
    boltEl.style.opacity = "1";
    boltEl.style.left = `${20 + Math.random() * 60}%`;

    setTimeout(() => {
      lightningEl.style.background = "rgba(255, 255, 255, 0)";
      boltEl.style.opacity = "0";
    }, 100);

    if (Math.random() > 0.5) {
      setTimeout(() => {
        lightningEl.style.background = "rgba(255, 255, 255, 0.9)";
        boltEl.style.opacity = "1";
        setTimeout(() => {
          lightningEl.style.background = "rgba(255, 255, 255, 0)";
          boltEl.style.opacity = "0";
        }, 50);
      }, 150);
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
      drop.style.width = "2px";
      drop.style.height = "20px";
      drop.style.background =
        "linear-gradient(transparent, rgba(174, 194, 224, 0.8))";
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

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
      style={{
        aspectRatio: "350 / 300",
        maxWidth: 500,
        background: skyGradient,
        transition: "background 0.5s ease",
      }}
    >
      {/* Sun */}
      <div
        className="absolute top-[8%] right-[11%]"
        style={{
          width: "22%",
          aspectRatio: "1",
          background: "radial-gradient(circle, #FFD700 0%, #FFA500 100%)",
          borderRadius: "50%",
          boxShadow: "0 0 60px #FFD700, 0 0 100px #FFA500",
          opacity: sun / 100,
          transition: "opacity 0.3s ease",
          animation: sun > 0 ? "pulse-sun 3s ease-in-out infinite" : "none",
        }}
      />

      {/* Clouds */}
      <div className="pointer-events-none absolute inset-0">
        {[
          {
            w: "23%",
            h: "10%",
            top: "13%",
            left: "6%",
            beforeW: "40px",
            beforeH: "40px",
            beforeTop: "-20px",
            beforeLeft: "10px",
            afterW: "50px",
            afterH: "50px",
            afterTop: "-25px",
            afterLeft: "35px",
          },
          {
            w: "29%",
            h: "12%",
            top: "23%",
            left: "34%",
            beforeW: "50px",
            beforeH: "50px",
            beforeTop: "-25px",
            beforeLeft: "15px",
            afterW: "60px",
            afterH: "60px",
            afterTop: "-30px",
            afterLeft: "45px",
          },
          {
            w: "20%",
            h: "8%",
            top: "10%",
            right: "9%",
            left: undefined,
            beforeW: "35px",
            beforeH: "35px",
            beforeTop: "-18px",
            beforeLeft: "8px",
            afterW: "45px",
            afterH: "45px",
            afterTop: "-22px",
            afterLeft: "30px",
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
              right: c.right,
              background: cloudColor,
              opacity: cloudOpacity,
              transition: "opacity 0.3s ease, background 0.3s ease",
              // pseudo elements handled via CSS below
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
          width: 40px;
          height: 40px;
          top: -20px;
          left: 10px;
        }
        .cloud-shape:nth-child(1)::after {
          width: 50px;
          height: 50px;
          top: -25px;
          left: 35px;
        }
        .cloud-shape:nth-child(2)::before {
          width: 50px;
          height: 50px;
          top: -25px;
          left: 15px;
        }
        .cloud-shape:nth-child(2)::after {
          width: 60px;
          height: 60px;
          top: -30px;
          left: 45px;
        }
        .cloud-shape:nth-child(3)::before {
          width: 35px;
          height: 35px;
          top: -18px;
          left: 8px;
        }
        .cloud-shape:nth-child(3)::after {
          width: 45px;
          height: 45px;
          top: -22px;
          left: 30px;
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
          background: "rgba(255, 255, 255, 0)",
          transition: "background 0.1s",
        }}
      />

      {/* Lightning bolt */}
      <div
        ref={boltRef}
        className="absolute"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 30,
          height: 80,
          opacity: 0,
          filter: "drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px #87CEEB)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="#FFD700" className="h-full w-full">
          <path d="M13 0L0 13h9v11l13-13h-9z" />
        </svg>
      </div>

      {/* Ground */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-2xl"
        style={{
          height: "20%",
          background: "linear-gradient(180deg, #228B22 0%, #006400 100%)",
        }}
      >
        <div className="absolute -top-3 flex w-full justify-around px-1">
          {grassBlades.map((blade) => (
            <GrassBlade key={blade.id} height={blade.height} />
          ))}
        </div>
      </div>
    </div>
  );
}
