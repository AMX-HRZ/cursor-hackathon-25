"use client";

import WasteMonitor from "@/components/landing/WasteMonitor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);
  const [glitchText, setGlitchText] = useState(false);

  const bootMessages = [
    "NOKIA MEND-AR SYSTEM v3.31.0",
    "INITIALIZING Y2K PROTOCOLS...",
    "LOADING AI REPAIR MODULE...",
    "CALIBRATING SNAKE STITCH ALGO...",
    ">>> SYSTEM ONLINE <<<",
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

  // Glitch effect on title
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 5000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col p-4 relative overflow-x-hidden">
      {/* ============================================ */}
      {/* HERO SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Bar - Y2K Status Bar */}
          <div className="nokia-border bg-[rgba(0,20,40,0.8)] p-3 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#39ff14] animate-pulse shadow-[0_0_10px_#39ff14]" />
                <span className="text-[#c0c0c0] text-xs tracking-wider uppercase">
                  System Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-3"
                      style={{
                        backgroundColor: i < 3 ? "#00e5ff" : "#333",
                        boxShadow: i < 3 ? "0 0 5px #00e5ff" : "none",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[#666] text-xs font-mono ml-2">
                  {new Date()
                    .toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })
                    .toUpperCase()}
                </span>
              </div>
              <Link
                href="/profile"
                className="text-[#00e5ff] text-xs hover:text-[#ff00aa] transition-colors tracking-widest"
              >
                PROFILE ▶
              </Link>
            </div>
          </div>

          {/* Main Hero Card - Y2K Cyber Style */}
          <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-6 md:p-10 relative overflow-hidden">
            {/* Animated corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20">
              <div className="absolute top-2 left-2 w-12 h-[2px] bg-gradient-to-r from-[#00e5ff] to-transparent" />
              <div className="absolute top-2 left-2 w-[2px] h-12 bg-gradient-to-b from-[#00e5ff] to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-20 h-20">
              <div className="absolute top-2 right-2 w-12 h-[2px] bg-gradient-to-l from-[#ff00aa] to-transparent" />
              <div className="absolute top-2 right-2 w-[2px] h-12 bg-gradient-to-b from-[#ff00aa] to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-20 h-20">
              <div className="absolute bottom-2 left-2 w-12 h-[2px] bg-gradient-to-r from-[#9d00ff] to-transparent" />
              <div className="absolute bottom-2 left-2 w-[2px] h-12 bg-gradient-to-t from-[#9d00ff] to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-20 h-20">
              <div className="absolute bottom-2 right-2 w-12 h-[2px] bg-gradient-to-l from-[#39ff14] to-transparent" />
              <div className="absolute bottom-2 right-2 w-[2px] h-12 bg-gradient-to-t from-[#39ff14] to-transparent" />
            </div>

            {/* Nokia Branding - Chrome Style */}
            <div className="text-center mb-6">
              <div
                className="text-sm tracking-[0.8em] mb-3 font-bold"
                style={{
                  background:
                    "linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 30%, #808080 50%, #c0c0c0 70%, #e8e8e8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                }}
              >
                N O K I A
              </div>

              {/* Main Title with RGB Shift */}
              <h1
                className={`text-5xl md:text-8xl font-bold tracking-tight mb-3 ${
                  glitchText ? "text-glitch" : ""
                }`}
                style={{
                  fontFamily: "var(--font-pixel)",
                  color: "#39ff14",
                  textShadow: `
                    0 0 20px rgba(57, 255, 20, 0.8),
                    0 0 40px rgba(57, 255, 20, 0.6),
                    0 0 60px rgba(57, 255, 20, 0.4),
                    -2px 0 #ff00aa,
                    2px 0 #00e5ff
                  `,
                }}
              >
                MEND-AR
              </h1>

              {/* Subtitle with Gradient */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
                <span
                  className="text-lg tracking-[0.3em] uppercase"
                  style={{
                    background:
                      "linear-gradient(90deg, #00e5ff 0%, #ff00aa 50%, #9d00ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Augmented Repair System
                </span>
                <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#ff00aa] to-transparent" />
              </div>

              {/* Y2K Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1 border border-[#00e5ff]/30 bg-[#00e5ff]/5">
                <span className="text-[#00e5ff] text-xs tracking-widest">
                  Y2K
                </span>
                <span className="text-[#666] text-xs">|</span>
                <span className="text-[#ff00aa] text-xs tracking-widest">
                  EDITION
                </span>
                <span className="text-[#666] text-xs">|</span>
                <span className="text-[#9d00ff] text-xs tracking-widest">
                  2025
                </span>
              </div>
            </div>

            {/* Boot Sequence - LCD Style */}
            <div className="lcd-screen p-4 mb-6 font-mono max-w-lg mx-auto">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#00e5ff]/20">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#ff0055]" />
                  <div className="w-2 h-2 rounded-full bg-[#ffaa00]" />
                  <div className="w-2 h-2 rounded-full bg-[#39ff14]" />
                </div>
                <span className="text-[#00e5ff] text-[10px] tracking-widest">
                  SYSTEM TERMINAL
                </span>
              </div>
              <div className="text-xs space-y-1.5">
                {bootMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      index <= bootSequence ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="text-[#ff00aa]">&gt;</span>
                    <span
                      className={
                        index === bootSequence &&
                        index < bootMessages.length - 1
                          ? "text-[#ffaa00]"
                          : index < bootSequence ||
                            index === bootMessages.length - 1
                          ? "text-[#39ff14]"
                          : "text-[#666]"
                      }
                      style={{
                        textShadow:
                          index === bootMessages.length - 1 &&
                          index <= bootSequence
                            ? "0 0 10px #39ff14"
                            : "none",
                      }}
                    >
                      {msg}
                    </span>
                    {index === bootSequence &&
                      index < bootMessages.length - 1 && (
                        <span className="text-[#00e5ff] animate-pulse">█</span>
                      )}
                    {index < bootSequence && (
                      <span className="text-[#39ff14] ml-auto">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button - Y2K Chrome Style */}
            <div
              className={`text-center transition-all duration-700 ${
                showContent
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/scan">
                <Button
                  className="nokia-button px-12 py-7 text-xl md:text-2xl tracking-widest transition-all group relative overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, #003b7a 0%, #001a33 50%, #003b7a 100%)",
                    border: "2px solid #00e5ff",
                    color: "#00e5ff",
                    boxShadow:
                      "0 0 30px rgba(0, 229, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="flex items-center gap-3 relative z-10">
                    <span
                      className="group-hover:animate-pulse text-[#39ff14]"
                      style={{ textShadow: "0 0 10px #39ff14" }}
                    >
                      ▶
                    </span>
                    <span className="group-hover:text-[#39ff14] transition-colors">
                      INITIALIZE SCANNER
                    </span>
                  </span>
                </Button>
              </Link>
              <p className="text-[#666] text-xs mt-4 tracking-wider">
                <span className="text-[#00e5ff]">◆</span> POINT CAMERA AT
                DAMAGED FABRIC TO BEGIN{" "}
                <span className="text-[#ff00aa]">◆</span>
              </p>
            </div>

            {/* Snake Animation - Y2K Style */}
            <div className="mt-8 flex justify-center">
              <svg
                width="240"
                height="40"
                viewBox="0 0 240 40"
                className="opacity-60"
              >
                {/* Snake body gradient */}
                <defs>
                  <linearGradient
                    id="snakeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#003b7a" />
                    <stop offset="50%" stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#39ff14" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <path
                  d="M10 20 Q35 5 60 20 T110 20 T160 20 T210 20 T230 20"
                  fill="none"
                  stroke="url(#snakeGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  className="animate-[snake-crawl_3s_ease-in-out_infinite]"
                />
                {/* Snake head */}
                <circle
                  cx="230"
                  cy="20"
                  r="6"
                  fill="#39ff14"
                  filter="url(#glow)"
                />
                {/* Snake eyes */}
                <circle cx="228" cy="17" r="1.5" fill="#040810" />
                <circle cx="232" cy="17" r="1.5" fill="#040810" />
                {/* Tongue */}
                <path
                  d="M236 20 L242 17 M236 20 L242 23"
                  stroke="#ff0055"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SECTION DIVIDER */}
      {/* ============================================ */}
      <div
        className={`max-w-4xl mx-auto w-full my-8 transition-all duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />
          <div className="flex items-center gap-2 px-4 py-1 border border-[#00e5ff]/20 bg-[#00e5ff]/5">
            <span className="w-2 h-2 bg-[#ff0055] animate-pulse" />
            <span className="text-[#c0c0c0] text-xs tracking-[0.3em]">
              GLOBAL INTEL
            </span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#ff00aa] to-transparent" />
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
        className={`max-w-4xl mx-auto w-full my-8 transition-all duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#9d00ff] to-transparent" />
          <div className="flex items-center gap-2 px-4 py-1 border border-[#9d00ff]/20 bg-[#9d00ff]/5">
            <span className="text-[#c0c0c0] text-xs tracking-[0.3em]">
              PROTOCOL
            </span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#39ff14] to-transparent" />
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
          <div className="grid md:grid-cols-3 gap-2">
            {/* Step 1 */}
            <div className="nokia-border bg-[rgba(0,20,40,0.8)] p-5 group hover:border-[#00e5ff] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-xs tracking-widest px-2 py-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, #00e5ff 0%, transparent 100%)",
                    color: "#040810",
                  }}
                >
                  STEP.01
                </div>
                <div className="w-8 h-8 border border-[#00e5ff]/30 flex items-center justify-center">
                  <span className="text-[#00e5ff] text-lg group-hover:animate-pulse">
                    📷
                  </span>
                </div>
              </div>
              <div
                className="text-[#00e5ff] text-xl mb-2 tracking-wider"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                SCAN
              </div>
              <div className="text-[#6b7280] text-xs leading-relaxed">
                Point camera at damaged fabric. AI identifies tear type &
                material composition.
              </div>
              <div className="mt-3 h-[2px] bg-gradient-to-r from-[#00e5ff] to-transparent w-1/2 group-hover:w-full transition-all" />
            </div>

            {/* Step 2 */}
            <div className="nokia-border bg-[rgba(0,20,40,0.8)] p-5 group hover:border-[#ff00aa] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-xs tracking-widest px-2 py-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, #ff00aa 0%, transparent 100%)",
                    color: "#040810",
                  }}
                >
                  STEP.02
                </div>
                <div className="w-8 h-8 border border-[#ff00aa]/30 flex items-center justify-center">
                  <span className="text-[#ff00aa] text-lg group-hover:animate-pulse">
                    🎯
                  </span>
                </div>
              </div>
              <div
                className="text-[#ff00aa] text-xl mb-2 tracking-wider"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                SELECT
              </div>
              <div className="text-[#6b7280] text-xs leading-relaxed">
                Choose repair strategy: Basic, Trend, or Cyber-Weave. Preview
                value increase.
              </div>
              <div className="mt-3 h-[2px] bg-gradient-to-r from-[#ff00aa] to-transparent w-1/2 group-hover:w-full transition-all" />
            </div>

            {/* Step 3 */}
            <div className="nokia-border bg-[rgba(0,20,40,0.8)] p-5 group hover:border-[#39ff14] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="text-xs tracking-widest px-2 py-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, #39ff14 0%, transparent 100%)",
                    color: "#040810",
                  }}
                >
                  STEP.03
                </div>
                <div className="w-8 h-8 border border-[#39ff14]/30 flex items-center justify-center">
                  <span className="text-[#39ff14] text-lg group-hover:animate-pulse">
                    🐍
                  </span>
                </div>
              </div>
              <div
                className="text-[#39ff14] text-xl mb-2 tracking-wider"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                EXECUTE
              </div>
              <div className="text-[#6b7280] text-xs leading-relaxed">
                Follow AR overlay to repair. Earn Snake XP. Archive to Digital
                Wardrobe.
              </div>
              <div className="mt-3 h-[2px] bg-gradient-to-r from-[#39ff14] to-transparent w-1/2 group-hover:w-full transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="relative z-10 mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="nokia-border bg-[rgba(0,20,40,0.8)] p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span
                  className="font-bold tracking-widest"
                  style={{
                    background:
                      "linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 50%, #808080 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  NOKIA
                </span>
                <span className="text-[#666] text-xs tracking-widest">
                  Y2K ARCHIVE
                </span>
                <span className="text-[#333]">│</span>
                <span className="text-[#00e5ff] text-xs">2025</span>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/scan"
                  className="text-[#00e5ff] text-xs hover:text-[#39ff14] transition-colors tracking-widest"
                >
                  SCANNER
                </Link>
                <span className="text-[#333]">│</span>
                <Link
                  href="/profile"
                  className="text-[#ff00aa] text-xs hover:text-[#39ff14] transition-colors tracking-widest"
                >
                  PROFILE
                </Link>
                <span className="text-[#333]">│</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#39ff14] shadow-[0_0_5px_#39ff14]" />
                  <div className="w-2 h-2 bg-[#00e5ff] shadow-[0_0_5px_#00e5ff]" />
                  <div className="w-2 h-2 bg-[#ff00aa] shadow-[0_0_5px_#ff00aa]" />
                  <div className="w-2 h-2 bg-[#9d00ff] shadow-[0_0_5px_#9d00ff]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Decorative Corner Elements - Y2K Style */}
      <div className="fixed top-10 left-10 text-xs opacity-40 hidden lg:block font-mono">
        <div className="text-[#00e5ff]">SYS.32.BIT</div>
        <div className="text-[#39ff14]">MEM.512KB</div>
        <div className="text-[#ff00aa]">NET.ACTIVE</div>
      </div>

      <div className="fixed bottom-10 right-10 text-xs opacity-40 hidden lg:block font-mono text-right">
        <div className="text-[#9d00ff]">AI.MODULE</div>
        <div className="text-[#00e5ff]">CAM.READY</div>
        <div className="text-[#39ff14]">SNK.v2.0</div>
      </div>

      {/* Y2K Decorative Elements */}
      <div className="fixed top-1/4 left-4 w-[1px] h-32 bg-gradient-to-b from-transparent via-[#00e5ff]/30 to-transparent hidden lg:block" />
      <div className="fixed top-1/3 right-4 w-[1px] h-24 bg-gradient-to-b from-transparent via-[#ff00aa]/30 to-transparent hidden lg:block" />
    </main>
  );
}
