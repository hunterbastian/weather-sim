"use client";

import { useEffect, useRef, useCallback } from "react";

interface WeatherSceneProps {
  sun: number;
  rain: number;
  storm: number;
}

interface Raindrop {
  x: number;
  y: number;
  speed: number;
  length: number;
}

const W = 128;
const H = 112;

function lerpColor(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number,
  t: number
): [number, number, number] {
  return [
    Math.round(r1 + (r2 - r1) * t),
    Math.round(g1 + (g2 - g1) * t),
    Math.round(b1 + (b2 - b1) * t),
  ];
}

function drawPixelCloud(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.fillStyle = color;
  for (let dx = 0; dx < 20; dx++) {
    for (let dy = 0; dy < 6; dy++) {
      ctx.fillRect(x + dx, y + dy + 4, 1, 1);
    }
  }
  for (let dx = 3; dx < 11; dx++) {
    for (let dy = 0; dy < 5; dy++) {
      if ((dx - 7) * (dx - 7) + (dy - 4) * (dy - 4) < 20) {
        ctx.fillRect(x + dx, y + dy, 1, 1);
      }
    }
  }
  for (let dx = 9; dx < 18; dx++) {
    for (let dy = 0; dy < 6; dy++) {
      if ((dx - 13) * (dx - 13) + (dy - 5) * (dy - 5) < 22) {
        ctx.fillRect(x + dx, y + dy + 1, 1, 1);
      }
    }
  }
}

export default function WeatherScene({ sun, rain, storm }: WeatherSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindropsRef = useRef<Raindrop[]>([]);
  const frameRef = useRef(0);
  const lightningRef = useRef(0);
  const lightningTimerRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    frameRef.current++;
    const frame = frameRef.current;

    const stormT = Math.min(storm / 100, 1);
    const rainT = Math.min(rain / 100, 1);
    const sunT = Math.min(sun / 100, 1);

    let skyR = 91, skyG = 140, skyB = 216;
    if (sunT > 0.5) {
      const t = (sunT - 0.5) * 2;
      [skyR, skyG, skyB] = lerpColor(skyR, skyG, skyB, 104, 176, 240, t);
    }
    if (rainT > 0.3) {
      const t = (rainT - 0.3) / 0.7;
      [skyR, skyG, skyB] = lerpColor(skyR, skyG, skyB, 112, 120, 136, t);
    }
    if (stormT > 0.2) {
      const t = (stormT - 0.2) / 0.8;
      [skyR, skyG, skyB] = lerpColor(skyR, skyG, skyB, 48, 48, 64, t);
    }

    // Sky
    for (let y = 0; y < H - 24; y++) {
      const grad = y / (H - 24);
      const r = Math.round(skyR + (skyR * 0.3) * grad);
      const g = Math.round(skyG + (skyG * 0.2) * grad);
      const b = Math.round(skyB - (skyB * 0.1) * grad);
      ctx.fillStyle = `rgb(${Math.min(r, 255)},${Math.min(g, 255)},${Math.max(b, 0)})`;
      ctx.fillRect(0, y, W, 1);
    }

    // Lightning flash
    if (lightningRef.current > 0) {
      ctx.fillStyle = `rgba(255,255,255,${lightningRef.current * 0.8})`;
      ctx.fillRect(0, 0, W, H);
      lightningRef.current = Math.max(0, lightningRef.current - 0.15);
    }

    // Sun
    if (sun > 5) {
      const opacity = sun / 100;
      const cx = 100, cy = 20;
      const pulse = Math.sin(frame * 0.05) * 1;
      const radius = 8 + pulse;

      ctx.fillStyle = `rgba(240,192,48,${opacity * 0.3})`;
      for (let dy = -radius - 4; dy <= radius + 4; dy++) {
        for (let dx = -radius - 4; dx <= radius + 4; dx++) {
          if (dx * dx + dy * dy < (radius + 4) * (radius + 4)) {
            ctx.fillRect(cx + dx, cy + dy, 1, 1);
          }
        }
      }
      ctx.fillStyle = `rgba(240,192,48,${opacity})`;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          if (dx * dx + dy * dy < radius * radius) {
            ctx.fillRect(cx + dx, cy + dy, 1, 1);
          }
        }
      }
      ctx.fillStyle = `rgba(255,240,160,${opacity})`;
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (dx * dx + dy * dy < 9) {
            ctx.fillRect(cx + dx, cy + dy, 1, 1);
          }
        }
      }
      if (sun > 30) {
        const rayLen = 4 + Math.sin(frame * 0.08) * 2;
        ctx.fillStyle = `rgba(240,192,48,${opacity * 0.6})`;
        for (let i = 0; i < rayLen; i++) {
          ctx.fillRect(cx + radius + 2 + i, cy, 1, 1);
          ctx.fillRect(cx - radius - 2 - i, cy, 1, 1);
          ctx.fillRect(cx, cy + radius + 2 + i, 1, 1);
          ctx.fillRect(cx, cy - radius - 2 - i, 1, 1);
          ctx.fillRect(cx + radius + i, cy - radius - i, 1, 1);
          ctx.fillRect(cx - radius - i, cy - radius - i, 1, 1);
          ctx.fillRect(cx + radius + i, cy + radius + i, 1, 1);
          ctx.fillRect(cx - radius - i, cy + radius + i, 1, 1);
        }
      }
    }

    // Clouds
    const cloudAlpha = Math.max(rainT, stormT) * 0.9 + 0.1;
    if (rain > 5 || storm > 5 || sun < 80) {
      const cloudColor = stormT > 0.3
        ? `rgba(96,104,120,${cloudAlpha})`
        : rainT > 0.3
          ? `rgba(160,164,168,${cloudAlpha})`
          : `rgba(192,192,192,${cloudAlpha * 0.5})`;
      drawPixelCloud(ctx, 8, 18, cloudColor);
      drawPixelCloud(ctx, 42, 12, cloudColor);
      drawPixelCloud(ctx, 78, 22, cloudColor);
      if (stormT > 0.3) {
        drawPixelCloud(ctx, 24, 28, cloudColor);
        drawPixelCloud(ctx, 58, 16, cloudColor);
      }
    }

    // Ground
    for (let y = H - 24; y < H; y++) {
      const gy = (y - (H - 24)) / 24;
      const r = Math.round(56 - gy * 24);
      const g = Math.round(168 - gy * 80);
      const b = Math.round(50 - gy * 26);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, y, W, 1);
    }

    // Grass
    for (let x = 0; x < W; x += 3) {
      const h = 3 + Math.sin(x * 1.7) * 2;
      const sway = Math.sin(frame * 0.03 + x * 0.5) * 1;
      ctx.fillStyle = "#50d848";
      for (let i = 0; i < h; i++) {
        ctx.fillRect(x + Math.round(sway * (i / h)), H - 24 - i, 1, 1);
      }
    }

    // Rain
    const targetDrops = Math.floor(Math.max(rain, storm * 0.5) * 0.8);
    const drops = raindropsRef.current;
    while (drops.length < targetDrops) {
      drops.push({
        x: Math.random() * W,
        y: Math.random() * (H - 24),
        speed: 2 + Math.random() * 2,
        length: 2 + Math.random() * 3,
      });
    }
    while (drops.length > targetDrops) drops.pop();

    const dropAlpha = Math.max(rain, storm * 0.5) / 100;
    ctx.fillStyle = `rgba(160,200,240,${dropAlpha})`;
    for (const drop of drops) {
      for (let i = 0; i < drop.length; i++) {
        ctx.fillRect(Math.floor(drop.x), Math.floor(drop.y) + i, 1, 1);
      }
      drop.y += drop.speed;
      if (drop.y > H - 24) {
        drop.y = -drop.length;
        drop.x = Math.random() * W;
      }
    }

    // Lightning bolt
    if (storm > 10) {
      lightningTimerRef.current--;
      if (lightningTimerRef.current <= 0 && Math.random() < storm / 3000) {
        lightningRef.current = 1;
        lightningTimerRef.current = 30 + Math.random() * 60;
        const bx = 20 + Math.random() * 80;
        ctx.fillStyle = "#ffffb0";
        let by = 10;
        for (let seg = 0; seg < 8; seg++) {
          const nx = bx + (Math.random() - 0.5) * 6;
          const ny = by + 5 + Math.random() * 4;
          const steps = Math.abs(ny - by);
          for (let s = 0; s < steps; s++) {
            const t = s / steps;
            const px = Math.round(bx + (nx - bx) * t);
            const py = Math.round(by + (ny - by) * t);
            ctx.fillRect(px, py, 2, 1);
          }
          by = ny;
        }
      }
    }

    // Scanlines
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    for (let y = 0; y < H; y += 2) {
      ctx.fillRect(0, y, W, 1);
    }

    requestAnimationFrame(draw);
  }, [sun, rain, storm]);

  useEffect(() => {
    const id = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(id);
  }, [draw]);

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
          weather_scene.exe
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
            aria-label="Maximize"
            className="flex h-[14px] w-[14px] items-center justify-center text-[8px] leading-none select-none"
            style={{
              background: "#c0c0c0",
              border: "2px solid",
              borderColor: "#ffffff #404040 #404040 #ffffff",
              color: "#000",
            }}
          >
            {"[]"}
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
      {/* Canvas */}
      <div style={{ background: "#c0c0c0", padding: 2 }}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block w-full"
          style={{
            aspectRatio: `${W}/${H}`,
            imageRendering: "pixelated",
            background: "#000",
          }}
        />
      </div>
    </div>
  );
}
