"use client";

import WasteMonitor from "@/components/landing/WasteMonitor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);

  const bootMessages = [
    "NOKIA MEND-AR SYSTEM v3.31.0",
    "CONNECTING TO GLOBAL WASTE FEED...",
    "LOADING AI REPAIR MODULE...",
    "CALIBRATING SNAKE STITCH ALGO...",
    "SYSTEM READY",
  ];

  useEffect(() => {
    const bootTimer = setInterval(() => {
      setBootSequence((prev) => {
        if (prev >= bootMessages.length - 1) {
          clearInterval(bootTimer);
          setTimeout(() => setShowContent(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(bootTimer);
  }, [bootMessages.length]);

  return (
    <main className="min-h-screen flex flex-col p-4 relative overflow-x-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
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

      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="nokia-border bg-[#0a0a0a] p-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00ff00] animate-pulse" />
                <span className="text-[#B0B0B0] text-xs tracking-wider">
                  CONNECTED
                </span>
              </div>
              <div className="text-[#666] text-xs font-mono">
                {new Date()
                  .toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                  .toUpperCase()}
              </div>
              <Link
                href="/profile"
                className="text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
              >
                PROFILE ▶
              </Link>
            </div>
          </div>

          {/* Main Hero Card */}
          <div className="nokia-border bg-[#0a0a0a] p-6 md:p-10">
            {/* Nokia Branding */}
            <div className="text-center mb-6">
              <div className="text-[#124191] text-sm tracking-[0.5em] mb-2">
                N O K I A
              </div>
              <h1
                className="text-5xl md:text-7xl font-bold text-[#00ff00] tracking-tight mb-2"
                style={{
                  fontFamily: "var(--font-pixel)",
                  textShadow:
                    "0 0 30px rgba(0, 255, 0, 0.5), 0 0 60px rgba(0, 255, 0, 0.3)",
                }}
              >
                MEND-AR
              </h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#00ffff]" />
                <span className="text-[#00ffff] text-lg tracking-[0.3em]">
                  AUGMENTED REPAIR SYSTEM
                </span>
                <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#00ffff]" />
              </div>
            </div>

            {/* Boot Sequence */}
            <div className="bg-[#111] border border-[#333] p-4 mb-6 font-mono max-w-md mx-auto">
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
                        index === bootSequence &&
                        index < bootMessages.length - 1
                          ? "text-[#ffaa00]"
                          : index < bootSequence ||
                            index === bootMessages.length - 1
                          ? "text-[#00ff00]"
                          : "text-[#666]"
                      }
                    >
                      {msg}
                    </span>
                    {index === bootSequence &&
                      index < bootMessages.length - 1 && (
                        <span className="text-[#00ff00] animate-pulse">_</span>
                      )}
                    {index < bootSequence && (
                      <span className="text-[#00ff00] ml-auto">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div
              className={`text-center transition-all duration-700 ${
                showContent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/scan">
                <Button className="nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white px-10 py-6 text-xl md:text-2xl tracking-widest transition-all group">
                  <span className="flex items-center gap-3">
                    <span className="group-hover:animate-pulse">▶</span>
                    INITIALIZE SCANNER
                  </span>
                </Button>
              </Link>
              <p className="text-[#666] text-xs mt-4 animate-pulse">
                POINT CAMERA AT DAMAGED FABRIC TO BEGIN
              </p>
            </div>

            {/* Snake Decoration */}
            <div className="mt-8 flex justify-center opacity-40">
              <svg width="200" height="30" viewBox="0 0 200 30">
                <path
                  d="M10 15 Q30 5 50 15 T90 15 T130 15 T170 15 T190 15"
                  fill="none"
                  stroke="#00ff00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-[snake-crawl_3s_ease-in-out_infinite]"
                />
                <circle cx="190" cy="15" r="5" fill="#00ff00" />
                <circle cx="187" cy="12" r="1.5" fill="#0a0a0a" />
                <circle cx="192" cy="12" r="1.5" fill="#0a0a0a" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION DIVIDER */}
      {/* ============================================ */}
      <div
        className={`max-w-4xl mx-auto w-full my-6 transition-all duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-[#1a3a1a]" />
          <span className="text-[#333] text-xs tracking-widest">
            GLOBAL INTEL
          </span>
          <hr className="flex-1 border-[#1a3a1a]" />
        </div>
      </div>

      {/* ============================================ */}
      {/* WASTE MONITOR DASHBOARD */}
      {/* ============================================ */}
      <section
        className={`relative z-10 pb-8 transition-all duration-1000 delay-300 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <WasteMonitor />
      </section>

      {/* ============================================ */}
      {/* SECTION DIVIDER */}
      {/* ============================================ */}
      <div
        className={`max-w-4xl mx-auto w-full my-6 transition-all duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-[#1a3a1a]" />
          <span className="text-[#333] text-xs tracking-widest">
            HOW IT WORKS
          </span>
          <hr className="flex-1 border-[#1a3a1a]" />
        </div>
      </div>

      {/* ============================================ */}
      {/* HOW IT WORKS - 3 STEPS */}
      {/* ============================================ */}
      <section
        className={`relative z-10 pb-8 transition-all duration-1000 delay-500 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-1">
            {/* Step 1 */}
            <div className="nokia-border bg-[#0a0a0a] p-4">
              <div className="text-[#124191] text-xs mb-2">STEP 01</div>
              <div className="text-4xl mb-3">📷</div>
              <div className="text-[#00ff00] text-lg mb-1">SCAN</div>
              <div className="text-[#666] text-xs">
                Point camera at damaged fabric. AI identifies tear type &
                material.
              </div>
            </div>

            {/* Step 2 */}
            <div className="nokia-border bg-[#0a0a0a] p-4">
              <div className="text-[#124191] text-xs mb-2">STEP 02</div>
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-[#00ffff] text-lg mb-1">SELECT</div>
              <div className="text-[#666] text-xs">
                Choose repair strategy: Basic, Trend, or Cyber-Weave. See value
                increase.
              </div>
            </div>

            {/* Step 3 */}
            <div className="nokia-border bg-[#0a0a0a] p-4">
              <div className="text-[#124191] text-xs mb-2">STEP 03</div>
              <div className="text-4xl mb-3">🐍</div>
              <div className="text-[#00ff00] text-lg mb-1">EXECUTE</div>
              <div className="text-[#666] text-xs">
                Follow AR overlay to repair. Earn Snake XP. Save to Digital
                Wardrobe.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="relative z-10 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="nokia-border bg-[#0a0a0a] p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-[#124191] font-bold">NOKIA</span>
                <span className="text-[#666] text-xs">DESIGN ARCHIVE</span>
                <span className="text-[#333]">│</span>
                <span className="text-[#666] text-xs">2025</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/scan"
                  className="text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
                >
                  SCANNER
                </Link>
                <span className="text-[#333]">│</span>
                <Link
                  href="/profile"
                  className="text-[#00ffff] text-xs hover:text-[#00ff00] transition-colors"
                >
                  PROFILE
                </Link>
                <span className="text-[#333]">│</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#00ff00]" />
                  <div className="w-2 h-2 bg-[#00ffff]" />
                  <div className="w-2 h-2 bg-[#124191]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Decorative Corner Elements */}
      <div className="fixed top-10 left-10 text-[#124191] text-xs opacity-30 hidden lg:block font-mono">
        <div>SYS.32.BIT</div>
        <div>MEM.OK</div>
        <div>NET.ACTIVE</div>
      </div>

      <div className="fixed bottom-10 right-10 text-[#124191] text-xs opacity-30 hidden lg:block font-mono text-right">
        <div>AI.MODULE</div>
        <div>CAM.READY</div>
        <div>SNK.v2.0</div>
      </div>
    </main>
  );
}
