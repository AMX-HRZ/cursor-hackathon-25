"use client";

import { RepairOption } from "@/context/RepairContext";
import { useEffect, useState } from "react";

/**
 * RepairGuide - Nokia terminal-style execution protocol display
 *
 * Displays step-by-step repair instructions in clean room aesthetic
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
    <div className="tech-card">
      {/* Header */}
      <div className="tech-card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="animate-pulse-tech">▶</span>
          <span>/// EXECUTION_PROTOCOL</span>
        </div>
        <span className="text-[10px]">{selectedOption.name}</span>
      </div>

      <div className="tech-card-body p-5">
        {/* Terminal Window */}
        <div className="lcd-display p-4 min-h-[180px]">
          {/* Terminal Header */}
          <div
            className="flex items-center gap-2 mb-4 pb-2 border-b"
            style={{ borderColor: "#D1D5DB" }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#DC2626" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#FF5500" }}
            />
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: "#166534" }}
            />
            <span
              className="text-xs font-mono-tech ml-2"
              style={{ color: "#6B7280" }}
            >
              rethread-protocol.sh
            </span>
          </div>

          {/* Steps */}
          <div className="space-y-2 font-mono-tech text-sm">
            {selectedOption.steps.slice(0, visibleSteps).map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <span style={{ color: "#124191" }}>
                  &gt; {(index + 1).toString().padStart(2, "0")}:
                </span>
                <span style={{ color: "#166534" }}>{step}</span>
              </div>
            ))}

            {/* Typing cursor */}
            {visibleSteps < selectedOption.steps.length && (
              <div className="flex items-center gap-2">
                <span style={{ color: "#124191" }}>
                  &gt; {(visibleSteps + 1).toString().padStart(2, "0")}:
                </span>
                <span
                  style={{
                    color: "#FF5500",
                    opacity: showCursor ? 1 : 0,
                  }}
                >
                  █
                </span>
              </div>
            )}

            {/* Completion indicator */}
            {visibleSteps >= selectedOption.steps.length && (
              <div
                className="mt-4 pt-2 border-t"
                style={{ borderColor: "#D1D5DB" }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ color: "#124191" }}
                >
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
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartTimer}
              className={`nokia-btn px-4 py-2 text-xs tracking-widest font-pixel ${
                timerActive ? "nokia-btn-alert" : "nokia-btn-success"
              }`}
            >
              {timerActive ? "⏹ STOP" : "⏱ START TIMER"}
            </button>

            {/* Timer Display */}
            <div
              className={`text-xl font-pixel tracking-wider ${
                timerActive ? "animate-pulse-tech" : ""
              }`}
              style={{ color: timerActive ? "#166534" : "#6B7280" }}
            >
              {formatTime(timerSeconds)}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="text-right">
            <div
              className="text-[10px] font-mono-tech"
              style={{ color: "#6B7280" }}
            >
              EST. TIME
            </div>
            <div
              className="text-sm font-bold font-pixel"
              style={{ color: "#FF5500" }}
            >
              {selectedOption.time} MIN
            </div>
          </div>
        </div>

        {/* Progress hint */}
        <div
          className="mt-4 pt-3 border-t-2"
          style={{ borderColor: "#E5E7EB" }}
        >
          <div className="flex items-center justify-between text-xs font-mono-tech">
            <span style={{ color: "#6B7280" }}>
              DIFFICULTY:{" "}
              <span
                className="font-bold"
                style={{
                  color:
                    selectedOption.difficulty === "LOW"
                      ? "#166534"
                      : selectedOption.difficulty === "MED"
                      ? "#FF5500"
                      : "#DC2626",
                }}
              >
                {selectedOption.difficulty}
              </span>
            </span>
            <span style={{ color: "#6B7280" }}>
              {selectedOption.steps.length} STEPS • TYPE:{" "}
              <span className="font-bold" style={{ color: "#124191" }}>
                {selectedOption.type.toUpperCase()}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
