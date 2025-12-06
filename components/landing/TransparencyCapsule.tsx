"use client";

import { useEffect, useState } from "react";

/**
 * TransparencyCapsule - Floating Glass Card Waste Monitor
 *
 * Minimal, elegant live counter that doesn't ruin the editorial aesthetic
 * Styled as a frosted glass card with subtle borders
 */

export default function TransparencyCapsule() {
  const [wasteCount, setWasteCount] = useState(92000000);

  // Increment waste counter (3 tonnes every 100ms = ~2.6M/day)
  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCount((prev) => prev + 3);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="
        backdrop-blur-md bg-white/60 
        border border-dotted border-[#15803D]
        rounded-2xl 
        px-5 py-4 
        shadow-lg
        min-w-[220px]
      "
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-[#15803D] rounded-full animate-pulse" />
        <span className="text-[#15803D] text-[10px] uppercase tracking-[0.2em] font-medium">
          Live Waste Tracker
        </span>
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-1">
        <span
          className="text-[#292524] text-2xl font-bold tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {wasteCount.toLocaleString("en-US")}
        </span>
        <span className="text-[#78716C] text-xs uppercase tracking-wider">
          tonnes
        </span>
      </div>

      {/* Subtext */}
      <div className="mt-2 pt-2 border-t border-[#E7E5E4]">
        <span className="text-[#A8A29E] text-[10px]">
          Global textile waste accumulating
        </span>
      </div>
    </div>
  );
}

