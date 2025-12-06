"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showStart, setShowStart] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);

  const bootMessages = [
    "NOKIA MEND-AR SYSTEM v3.31.0",
    "INITIALIZING FABRIC SCANNER...",
    "LOADING AI REPAIR MODULE...",
    "CALIBRATING SNAKE STITCH ALGO...",
    "SYSTEM READY",
  ];

  useEffect(() => {
    const bootTimer = setInterval(() => {
      setBootSequence((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(bootTimer);
          setTimeout(() => setShowStart(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(bootTimer);
  }, [bootMessages.length]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #124191 1px, transparent 1px),
              linear-gradient(#124191 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div className="nokia-border bg-[#0a0a0a] p-8 max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="border-b-2 border-[#333] pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#00ff00] animate-pulse" />
              <span className="text-[#B0B0B0] text-xs">CONNECTED</span>
            </div>
            <div className="text-[#666] text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl md:text-7xl font-bold text-[#00ff00] text-glow tracking-tighter mb-2"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            MEND
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-[#00ffff]" />
            <span className="text-[#00ffff] text-2xl text-glow-cyan">AR</span>
            <div className="h-[2px] w-12 bg-gradient-to-l from-transparent to-[#00ffff]" />
          </div>
          <p className="text-[#B0B0B0] text-sm tracking-widest">
            FABRIC REPAIR SYSTEM
          </p>
        </div>

        {/* Boot Sequence */}
        <div className="bg-[#1a1a1a] border border-[#333] p-4 mb-6 font-mono">
          <div className="text-xs space-y-1">
            {bootMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 transition-opacity duration-300 ${
                  index <= bootSequence ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-[#124191]">&gt;</span>
                <span
                  className={
                    index === bootSequence && index < bootMessages.length - 1
                      ? "text-[#ffaa00]"
                      : index < bootSequence || index === bootMessages.length - 1
                      ? "text-[#00ff00]"
                      : "text-[#666]"
                  }
                >
                  {msg}
                </span>
                {index === bootSequence && index < bootMessages.length - 1 && (
                  <span className="blink">_</span>
                )}
                {index < bootSequence && (
                  <span className="text-[#00ff00] ml-auto">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div
          className={`text-center transition-all duration-500 ${
            showStart ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/scan">
            <Button className="nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white px-12 py-6 text-2xl tracking-widest transition-all">
              <span className="flex items-center gap-3">
                <span className="animate-pulse">▶</span>
                PRESS START
              </span>
            </Button>
          </Link>

          <p className="text-[#666] text-xs mt-4 blink">
            INSERT GARMENT TO BEGIN
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-[#333] flex justify-between items-center">
          <div className="text-[#666] text-xs">
            <span className="text-[#124191]">NOKIA</span> DESIGN ARCHIVE
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#00ff00]" />
            <div className="w-2 h-2 bg-[#00ffff]" />
            <div className="w-2 h-2 bg-[#124191]" />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-[#124191] text-xs opacity-50 hidden md:block">
        <div>SYS.32.BIT</div>
        <div>MEM.OK</div>
        <div>NET.ACTIVE</div>
      </div>

      <div className="absolute bottom-10 right-10 text-[#124191] text-xs opacity-50 hidden md:block">
        <div>AI.MODULE</div>
        <div>CAM.READY</div>
        <div>SNK.v2.0</div>
      </div>

      {/* Snake decoration */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-20">
        <svg width="200" height="40" viewBox="0 0 200 40">
          <path
            d="M10 20 Q30 5 50 20 T90 20 T130 20 T170 20 T190 20"
            fill="none"
            stroke="#00ff00"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="190" cy="20" r="6" fill="#00ff00" />
          <circle cx="186" cy="17" r="2" fill="#0a0a0a" />
          <circle cx="192" cy="17" r="2" fill="#0a0a0a" />
        </svg>
      </div>
    </main>
  );
}
