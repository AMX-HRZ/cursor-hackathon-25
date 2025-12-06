"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

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

export default function ScanningOverlay({ isActive, onComplete }: ScanningOverlayProps) {
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
    const totalDuration = SCAN_MESSAGES.reduce((sum, msg) => sum + msg.duration, 0);

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
    <div className="fixed inset-0 z-50 bg-[#0a0a0a]/95 flex items-center justify-center">
      {/* Scan grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #00ff00 1px, transparent 1px),
            linear-gradient(#00ff00 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      
      {/* Scan beam animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff00] to-transparent opacity-50"
          style={{
            animation: "scanBeam 2s ease-in-out infinite",
            top: `${(progress % 100)}%`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="nokia-border bg-[#0a0a0a] p-8 max-w-xl w-full mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#333] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#00ff00] animate-pulse" />
            <span className="text-[#00ff00] text-sm tracking-widest">MEND-AR SCANNER</span>
          </div>
          <span className="text-[#666] text-xs">v3.31.0</span>
        </div>

        {/* ASCII Art Scanner */}
        <div className="text-center mb-6 text-[#00ff00] opacity-60">
          <pre className="text-xs leading-tight inline-block">
{`    ╔══════════════════╗
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ║  ▓  SCANNING   ▓  ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ╚══════════════════╝`}
          </pre>
        </div>

        {/* Terminal Output */}
        <div className="bg-[#1a1a1a] border border-[#333] p-4 mb-6 h-48 overflow-hidden font-mono">
          <div className="space-y-1 text-xs">
            {completedMessages.map((msg, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#124191]">&gt;</span>
                <span className="text-[#00ff00]">{msg}</span>
                <span className="text-[#00ff00] ml-auto">✓</span>
              </div>
            ))}
            {currentMessageIndex < SCAN_MESSAGES.length && (
              <div className="flex items-center gap-2">
                <span className="text-[#124191]">&gt;</span>
                <span className="text-[#ffaa00]">{currentMessage?.text}</span>
                <span className={`text-[#ffaa00] ${showCursor ? "opacity-100" : "opacity-0"}`}>
                  _
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#666]">PROGRESS</span>
            <span className="text-[#00ff00]">{Math.round(progress)}%</span>
          </div>
          <div className="nokia-progress">
            <div
              className="nokia-progress-fill h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status indicators */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs">
          <div className="bg-[#1a1a1a] border border-[#333] p-2">
            <div className="text-[#666] mb-1">CPU</div>
            <div className="text-[#00ff00] animate-pulse">87%</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] p-2">
            <div className="text-[#666] mb-1">NET</div>
            <div className="text-[#00ffff]">●●●○</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] p-2">
            <div className="text-[#666] mb-1">MEM</div>
            <div className="text-[#ffaa00]">64MB</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#333] text-center">
          <p className="text-[#666] text-xs">
            PLEASE WAIT • DO NOT CLOSE THIS WINDOW
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanBeam {
          0%, 100% { transform: translateY(-100vh); }
          50% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

