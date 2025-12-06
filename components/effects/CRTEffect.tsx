"use client";

/**
 * CRTEffect - Y2K Nokia Edgy CRT Monitor Visual Effect
 *
 * Enhanced retro CRT aesthetics with Y2K cyber vibes:
 * - Animated RGB scanlines with color shift
 * - Aggressive vignette with colored edges
 * - Chromatic aberration glitch
 * - Digital noise interference
 * - Screen flicker with color variation
 */

export default function CRTEffect() {
  return (
    <div
      className="crt-overlay pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      {/* Primary Scanlines - Thicker, more visible */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.25) 1px,
            transparent 1px,
            transparent 3px
          )`,
          mixBlendMode: "multiply",
        }}
      />

      {/* RGB Chromatic Scanline - Moving */}
      <div
        className="absolute inset-x-0 h-[4px] animate-[rgb-scanline-sweep_5s_linear_infinite]"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 229, 255, 0.08) 20%,
            rgba(255, 0, 170, 0.06) 50%,
            rgba(157, 0, 255, 0.08) 80%,
            transparent 100%
          )`,
          filter: "blur(1px)",
        }}
      />

      {/* Secondary Color Scanline */}
      <div
        className="absolute inset-x-0 h-[2px] animate-[secondary-sweep_8s_linear_infinite]"
        style={{
          background: `linear-gradient(
            180deg,
            transparent 0%,
            rgba(57, 255, 20, 0.04) 50%,
            transparent 100%
          )`,
          animationDelay: "2.5s",
        }}
      />

      {/* Vignette Layer - Y2K colored corners */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(
              ellipse at center,
              transparent 0%,
              transparent 40%,
              rgba(0, 0, 0, 0.2) 70%,
              rgba(0, 0, 0, 0.5) 100%
            ),
            radial-gradient(
              ellipse at top left,
              rgba(0, 229, 255, 0.05) 0%,
              transparent 50%
            ),
            radial-gradient(
              ellipse at bottom right,
              rgba(255, 0, 170, 0.05) 0%,
              transparent 50%
            )
          `,
        }}
      />

      {/* RGB Fringe Effect - Edge chromatic aberration */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, 
              rgba(255, 0, 170, 0.03) 0%, 
              transparent 3%, 
              transparent 97%, 
              rgba(0, 229, 255, 0.03) 100%
            ),
            linear-gradient(180deg, 
              rgba(0, 229, 255, 0.02) 0%, 
              transparent 3%, 
              transparent 97%, 
              rgba(255, 0, 170, 0.02) 100%
            )
          `,
        }}
      />

      {/* Digital Noise Layer */}
      <div
        className="absolute inset-0 animate-[noise-shift_0.2s_steps(10)_infinite]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.015,
        }}
      />

      {/* Screen Flicker */}
      <div
        className="absolute inset-0 animate-[aggressive-flicker_0.1s_infinite]"
        style={{
          background: "transparent",
          opacity: 0,
        }}
      />

      {/* Horizontal Distortion Lines */}
      <div
        className="absolute inset-0 animate-[distortion-shift_10s_linear_infinite]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 100px,
            rgba(0, 229, 255, 0.02) 100px,
            rgba(0, 229, 255, 0.02) 101px,
            transparent 101px,
            transparent 200px
          )`,
        }}
      />
    </div>
  );
}
