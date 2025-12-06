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
        background: 'rgba(4, 8, 16, 0.98)',
      }}
    >
      {/* Scan grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #00e5ff 1px, transparent 1px),
            linear-gradient(#00e5ff 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Scan beam animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute left-0 right-0 h-1 opacity-50 animate-[scanBeam_2s_ease-in-out_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
            top: `${progress % 100}%`,
          }}
        />
      </div>

      {/* Main content */}
      <div 
        className="nokia-border p-8 max-w-xl w-full mx-4 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.2) 0%, rgba(0, 20, 40, 0.95) 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-[#00e5ff]/20 pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 animate-pulse"
              style={{
                backgroundColor: '#39ff14',
                boxShadow: '0 0 10px #39ff14'
              }}
            />
            <span 
              className="text-sm tracking-widest"
              style={{ color: '#00e5ff' }}
            >
              MEND-AR SCANNER
            </span>
          </div>
          <span className="text-[#666] text-xs">v3.31.0</span>
        </div>

        {/* Snake Game Loader */}
        <div className="mb-6">
          <SnakeLoader message={currentMessage?.text || "PROCESSING..."} />
        </div>

        {/* Terminal Output - Compact */}
        <div 
          className="border p-3 mb-4 h-24 overflow-hidden font-mono"
          style={{
            background: 'rgba(0, 30, 60, 0.6)',
            borderColor: 'rgba(0, 229, 255, 0.2)'
          }}
        >
          <div className="space-y-0.5 text-[10px]">
            {completedMessages.slice(-4).map((msg, index) => (
              <div key={index} className="flex items-center gap-2">
                <span style={{ color: '#ff00aa' }}>&gt;</span>
                <span className="truncate" style={{ color: '#39ff14' }}>{msg}</span>
                <span className="ml-auto" style={{ color: '#39ff14' }}>✓</span>
              </div>
            ))}
            {currentMessageIndex < SCAN_MESSAGES.length && (
              <div className="flex items-center gap-2">
                <span style={{ color: '#ff00aa' }}>&gt;</span>
                <span className="truncate" style={{ color: '#ffaa00' }}>
                  {currentMessage?.text}
                </span>
                <span
                  style={{ 
                    color: '#ffaa00',
                    opacity: showCursor ? 1 : 0 
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
          <div className="flex justify-between text-xs mb-2">
            <span className="text-[#666]">PROGRESS</span>
            <span style={{ color: '#39ff14' }}>{Math.round(progress)}%</span>
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
          <div 
            className="p-2"
            style={{
              background: 'rgba(0, 30, 60, 0.6)',
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}
          >
            <div className="text-[#666] mb-1">CPU</div>
            <div className="animate-pulse" style={{ color: '#39ff14' }}>87%</div>
          </div>
          <div 
            className="p-2"
            style={{
              background: 'rgba(0, 30, 60, 0.6)',
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}
          >
            <div className="text-[#666] mb-1">NET</div>
            <div style={{ color: '#00e5ff' }}>●●●○</div>
          </div>
          <div 
            className="p-2"
            style={{
              background: 'rgba(0, 30, 60, 0.6)',
              border: '1px solid rgba(0, 229, 255, 0.2)'
            }}
          >
            <div className="text-[#666] mb-1">MEM</div>
            <div style={{ color: '#ffaa00' }}>64MB</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#00e5ff]/20 text-center">
          <p className="text-[#666] text-xs tracking-wider">
            PLEASE WAIT • DO NOT CLOSE THIS WINDOW
          </p>
        </div>
      </div>
    </div>
  );
}
