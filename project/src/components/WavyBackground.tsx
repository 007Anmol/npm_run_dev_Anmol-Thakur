import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { cn } from "../lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  speed?: "slow" | "fast";
  waveOpacity?: number; // ✅ Added waveOpacity prop
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth = 60,
  backgroundFill = "white",
  speed = "fast",
  waveOpacity = 1, // ✅ Default to fully visible
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: CanvasRenderingContext2D | null;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getSpeed = () => (speed === "fast" ? 0.002 : 0.001);

  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    if (!ctx) return;
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = window.innerHeight;
    nt = 0;

    window.onresize = function () {
      w = ctx!.canvas.width = window.innerWidth;
      h = ctx!.canvas.height = window.innerHeight;
    };

    render();
  };

  const waveColors = colors ?? ["#4F46E5", "#6D28D9", "#9333EA", "#7C3AED"]; // Default bluish-purplish theme

  const drawWave = (n: number) => {
    if (!ctx) return;
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth;
      ctx.globalAlpha = waveOpacity; // ✅ Apply opacity dynamically
      ctx.strokeStyle = waveColors[i % waveColors.length];

      for (x = 0; x < w; x += 5) {
        let y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }

      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    if (!ctx) return;
    ctx.fillStyle = backgroundFill;
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);

    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      className={cn(
        "h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
