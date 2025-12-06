"use client";

/**
 * CRTEffect - Global CRT monitor visual effect overlay
 *
 * Applies retro CRT aesthetics:
 * - Animated horizontal scanlines
 * - Vignette (darkened corners)
 * - Subtle screen flicker
 *
 * This component should be rendered once in the root layout.
 */

export default function CRTEffect() {
  return (
    <div
      className="crt-overlay pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      {/* Scanlines Layer */}
      <div className="crt-scanlines absolute inset-0" />

      {/* Moving Scanline */}
      <div className="crt-scanline-moving absolute inset-x-0 h-[2px]" />

      {/* Vignette Layer - Dark corners */}
      <div className="crt-vignette absolute inset-0" />

      {/* Screen Flicker */}
      <div className="crt-flicker absolute inset-0" />

      <style jsx>{`
        /* Static Scanlines */
        .crt-scanlines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          );
        }

        /* Moving Scanline - Sweeps down the screen */
        .crt-scanline-moving {
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 255, 0, 0.03) 50%,
            transparent 100%
          );
          animation: scanline-sweep 8s linear infinite;
        }

        @keyframes scanline-sweep {
          0% {
            top: -4px;
          }
          100% {
            top: 100%;
          }
        }

        /* Vignette - Radial gradient for darkened corners */
        .crt-vignette {
          background: radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 50%,
            rgba(0, 0, 0, 0.3) 80%,
            rgba(0, 0, 0, 0.6) 100%
          );
        }

        /* Subtle Screen Flicker */
        .crt-flicker {
          background: transparent;
          animation: flicker 0.15s infinite;
          opacity: 0;
        }

        @keyframes flicker {
          0% {
            opacity: 0;
          }
          5% {
            opacity: 0.02;
            background: rgba(255, 255, 255, 0.01);
          }
          10% {
            opacity: 0;
          }
          15% {
            opacity: 0.01;
          }
          20% {
            opacity: 0;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
