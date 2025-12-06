"use client";

import SnakeLoader from "@/components/ui/SnakeLoader";
import { useEffect, useState } from "react";

interface ScanningOverlayProps {
  isActive: boolean;
  onComplete?: () => void;
}

// Retro terminal messages sequence
const SCAN_MESSAGES = [
  { text: "INITIALIZING NOKIA VISION AI...", duration: 400 },
  { text: "UPLOADING TO NOKIA CLOUD...", duration: 500 },
  { text: "CONNECTING TO SATELLITE...", duration: 300 },
  { text: "ANALYZING FABRIC MATRIX...", duration: 600 },
  { text: "DETECTING DAMAGE PATTERNS...", duration: 500 },
  { text: "CALCULATING VINTAGE VALUE...", duration: 400 },
  { text: "RUNNING SNAKE STITCH ALGORITHM...", duration: 500 },
  { text: "OPTIMIZING REPAIR PATH...", duration: 400 },
  { text: "GENERATING AR OVERLAY...", duration: 300 },
  { text: "ANALYSIS COMPLETE!", duration: 400 },
];

export default function ScanningOverlay({
  isActive,
  onComplete,
}: ScanningOverlayProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Message sequence animation
  useEffect(() => {
    if (!isActive) {
      setCurrentMessageIndex(0);
      setProgress(0);
      setCompletedMessages([]);
      return;
    }

    let messageIndex = 0;
    let totalElapsed = 0;
    const totalDuration = SCAN_MESSAGES.reduce(
      (sum, msg) => sum + msg.duration,
      0
    );

    const advanceMessage = () => {
      if (messageIndex >= SCAN_MESSAGES.length) {
        setTimeout(() => onComplete?.(), 300);
        return;
      }

      const currentMsg = SCAN_MESSAGES[messageIndex];
      setCurrentMessageIndex(messageIndex);

      setTimeout(() => {
        setCompletedMessages((prev) => [...prev, currentMsg.text]);
        totalElapsed += currentMsg.duration;
        setProgress((totalElapsed / totalDuration) * 100);
        messageIndex++;
        advanceMessage();
      }, currentMsg.duration);
    };

    advanceMessage();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  const currentMessage = SCAN_MESSAGES[currentMessageIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(242, 243, 245, 0.98)",
      }}
    >
      {/* Grid background - Nokia style */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, #c8ccd4 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Scan beam animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-1 opacity-50 animate-[scanBeam_2s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(90deg, transparent, #124191, transparent)",
            top: `${progress % 100}%`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="tech-card max-w-xl w-full mx-4 relative">
        {/* Header */}
        <div className="tech-card-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full animate-pulse-tech"
              style={{ background: "#22C55E" }}
            />
            <span>/// RETHREAD_SCANNER</span>
          </div>
          <span className="text-[10px]">v3.31.0</span>
        </div>

        <div className="tech-card-body p-6">
          {/* Snake Game Loader */}
          <div className="mb-6">
            <SnakeLoader message={currentMessage?.text || "PROCESSING..."} />
          </div>

          {/* Terminal Output - Nokia Style */}
          <div className="lcd-display p-4 mb-4">
            <div className="space-y-1 text-xs font-mono-tech">
              {completedMessages.slice(-4).map((msg, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span style={{ color: "#124191" }}>&gt;</span>
                  <span className="truncate" style={{ color: "#166534" }}>
                    {msg}
                  </span>
                  <span className="ml-auto" style={{ color: "#166534" }}>
                    ✓
                  </span>
                </div>
              ))}
              {currentMessageIndex < SCAN_MESSAGES.length && (
                <div className="flex items-center gap-2">
                  <span style={{ color: "#124191" }}>&gt;</span>
                  <span className="truncate" style={{ color: "#FF5500" }}>
                    {currentMessage?.text}
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
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2 font-mono-tech">
              <span style={{ color: "#6B7280" }}>PROGRESS</span>
              <span style={{ color: "#166534" }}>{Math.round(progress)}%</span>
            </div>
            <div
              className="h-3 rounded-sm overflow-hidden"
              style={{ background: "#E5E7EB", border: "2px solid #1A1A1A" }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #124191 0%, #166534 100%)",
                }}
              />
            </div>
          </div>

          {/* Status indicators */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div
              className="p-3 rounded-sm"
              style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
            >
              <div
                className="text-[10px] font-mono-tech mb-1"
                style={{ color: "#6B7280" }}
              >
                CPU
              </div>
              <div
                className="text-sm font-bold font-pixel animate-pulse-tech"
                style={{ color: "#166534" }}
              >
                87%
              </div>
            </div>
            <div
              className="p-3 rounded-sm"
              style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
            >
              <div
                className="text-[10px] font-mono-tech mb-1"
                style={{ color: "#6B7280" }}
              >
                NET
              </div>
              <div
                className="text-sm font-bold font-pixel"
                style={{ color: "#124191" }}
              >
                ●●●○
              </div>
            </div>
            <div
              className="p-3 rounded-sm"
              style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
            >
              <div
                className="text-[10px] font-mono-tech mb-1"
                style={{ color: "#6B7280" }}
              >
                MEM
              </div>
              <div
                className="text-sm font-bold font-pixel"
                style={{ color: "#FF5500" }}
              >
                64MB
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="mt-6 pt-4 text-center border-t-2"
            style={{ borderColor: "#E5E7EB" }}
          >
            <p
              className="text-xs font-mono-tech tracking-wider"
              style={{ color: "#6B7280" }}
            >
              PLEASE WAIT • DO NOT CLOSE THIS WINDOW
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
