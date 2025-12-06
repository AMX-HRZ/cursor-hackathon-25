"use client";

import { RepairOption } from "@/context/RepairContext";
import { useEffect, useState } from "react";

/**
 * RepairGuide - Terminal-style execution protocol display
 *
 * Displays step-by-step repair instructions in retro terminal aesthetic
 */

interface RepairGuideProps {
  selectedOption: RepairOption;
}

export default function RepairGuide({ selectedOption }: RepairGuideProps) {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation for steps
  useEffect(() => {
    setVisibleSteps(0);

    const interval = setInterval(() => {
      setVisibleSteps((prev) => {
        if (prev >= selectedOption.steps.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [selectedOption]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Timer logic
  useEffect(() => {
    if (!timerActive) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      setTimerSeconds(0);
    } else {
      setTimerActive(true);
    }
  };

  return (
    <div className="nokia-border bg-[#0a0a0a] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#00ff00] animate-pulse">▶</span>
          <span className="text-[#00ff00] text-sm tracking-widest">
            EXECUTION PROTOCOL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#666] text-xs">{selectedOption.name}</span>
        </div>
      </div>

      {/* Terminal Window */}
      <div
        className="bg-[#0f0f0f] border border-[#333] p-4 font-mono text-sm min-h-[180px]"
        style={{ fontFamily: "monospace" }}
      >
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#222]">
          <div className="w-2 h-2 rounded-full bg-[#ff0040]" />
          <div className="w-2 h-2 rounded-full bg-[#ffaa00]" />
          <div className="w-2 h-2 rounded-full bg-[#00ff00]" />
          <span className="text-[#666] text-xs ml-2">mend-ar-protocol.sh</span>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {selectedOption.steps.slice(0, visibleSteps).map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-[#124191] shrink-0">
                &gt; {(index + 1).toString().padStart(2, "0")}:
              </span>
              <span className="text-[#00ff00]">{step}</span>
            </div>
          ))}

          {/* Typing cursor */}
          {visibleSteps < selectedOption.steps.length && (
            <div className="flex items-center gap-2">
              <span className="text-[#124191]">
                &gt; {(visibleSteps + 1).toString().padStart(2, "0")}:
              </span>
              <span
                className={`text-[#ffaa00] ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              >
                █
              </span>
            </div>
          )}

          {/* Completion indicator */}
          {visibleSteps >= selectedOption.steps.length && (
            <div className="mt-4 pt-2 border-t border-[#222]">
              <div className="flex items-center gap-2 text-[#00ffff]">
                <span>✓</span>
                <span className="text-xs">
                  PROTOCOL LOADED. READY FOR EXECUTION.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer Section */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleStartTimer}
            className={`nokia-button px-4 py-2 text-xs tracking-widest transition-all ${
              timerActive
                ? "bg-[#ff0040] text-white"
                : "bg-[#1a1a1a] text-[#00ff00] border-[#00ff00]"
            }`}
          >
            {timerActive ? "⏹ STOP" : "⏱ START TIMER"}
          </button>

          {/* Timer Display */}
          <div
            className={`text-xl tracking-wider ${
              timerActive ? "text-[#00ff00] animate-pulse" : "text-[#666]"
            }`}
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {formatTime(timerSeconds)}
          </div>
        </div>

        {/* Estimated Time */}
        <div className="text-right">
          <div className="text-[#666] text-[10px]">EST. TIME</div>
          <div className="text-[#ffaa00] text-sm">
            {selectedOption.time} MIN
          </div>
        </div>
      </div>

      {/* Progress hint */}
      <div className="mt-4 pt-3 border-t border-[#333]">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-[#666]">
            DIFFICULTY:{" "}
            <span
              style={{
                color:
                  selectedOption.difficulty === "LOW"
                    ? "#00ff00"
                    : selectedOption.difficulty === "MED"
                    ? "#ffaa00"
                    : "#ff0040",
              }}
            >
              {selectedOption.difficulty}
            </span>
          </span>
          <span className="text-[#666]">
            {selectedOption.steps.length} STEPS • TYPE:{" "}
            {selectedOption.type.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
