"use client";

import { Button } from "@/components/ui/button";
import { SavedRepair, useRepairHistory } from "@/hooks/useRepairHistory";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Profile Page - Operator Stats & Repair Archive
 *
 * Displays:
 * - Snake length visualization
 * - Total upcycled value & carbon offset
 * - Grid of saved repairs (case files)
 */

// ============================================
// SNAKE VISUALIZATION COMPONENT
// ============================================
function SnakeVisual({ length }: { length: number }) {
  const maxDisplay = Math.min(length, 20); // Cap visual at 20 segments

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Snake body */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxDisplay }).map((_, index) => {
          const isHead = index === maxDisplay - 1;
          const brightness = 0.4 + (index / maxDisplay) * 0.6;

          return (
            <div
              key={index}
              className={`w-6 h-6 transition-all duration-300 ${
                isHead ? "rounded-sm" : ""
              }`}
              style={{
                backgroundColor: `rgba(0, 255, 0, ${brightness})`,
                boxShadow: isHead ? "0 0 10px #00ff00" : "none",
                animation: isHead ? "pulse 1s ease-in-out infinite" : "none",
              }}
            >
              {isHead && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-[#0a0a0a] rounded-full" />
                    <div className="w-1 h-1 bg-[#0a0a0a] rounded-full" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Length indicator */}
      <div className="text-center">
        <div className="text-[#666] text-xs tracking-widest">SNAKE LENGTH</div>
        <div
          className="text-[#00ff00] text-4xl font-bold"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {length}
        </div>
        {length > 20 && (
          <div className="text-[#666] text-[10px]">
            (+{length - 20} segments not shown)
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// CASE FILE CARD COMPONENT
// ============================================
function CaseFileCard({ repair }: { repair: SavedRepair }) {
  return (
    <div className="nokia-border bg-[#0a0a0a] p-2 group hover:border-[#00ff00] transition-all">
      {/* Image */}
      <div className="aspect-square bg-[#1a1a1a] overflow-hidden mb-2 relative">
        <img
          src={repair.img}
          alt={repair.optionName}
          className="w-full h-full object-cover pixelated opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
        {/* Badge */}
        <div className="absolute bottom-1 left-1 right-1">
          <div className="bg-[#0a0a0a]/80 border border-[#333] px-1 py-0.5 text-[8px] text-[#00ff00] truncate">
            {repair.optionName}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-[#666]">PROFIT</span>
          <span className="text-[#00ff00]">+${repair.profit}</span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#666]">SCORE</span>
          <span className="text-[#00ffff]">+{repair.snakePoints}</span>
        </div>
        <div className="text-[8px] text-[#444] truncate">
          {new Date(repair.date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PROFILE PAGE
// ============================================
export default function ProfilePage() {
  const { getProfileStats, getHistory, isLoaded, clearHistory } =
    useRepairHistory();
  const [stats, setStats] = useState({
    totalProfit: 0,
    totalSaves: 0,
    snakeLength: 3,
    carbonOffset: 0,
  });
  const [history, setHistory] = useState<SavedRepair[]>([]);

  // Load data on mount
  useEffect(() => {
    if (isLoaded) {
      setStats(getProfileStats());
      setHistory(getHistory());
    }
  }, [isLoaded, getProfileStats, getHistory]);

  return (
    <main className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="nokia-border bg-[#0a0a0a] p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#B0B0B0] hover:text-[#00ff00] hover:bg-transparent p-0"
            >
              ◀ BACK
            </Button>
          </Link>
          <h1
            className="text-xl text-[#00ffff] tracking-widest"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            OPERATOR STATS
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Level Up Banner */}
      <div className="nokia-border bg-gradient-to-r from-[#124191]/20 to-[#00ff00]/10 p-6 mb-6 text-center">
        <div className="text-[#666] text-xs tracking-widest mb-2">
          MEND-AR OPERATOR LEVEL
        </div>
        <div
          className="text-[#00ff00] text-5xl font-bold mb-4 text-glow"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          LV.{Math.floor(stats.snakeLength / 3)}
        </div>

        {/* Snake Visualization */}
        <SnakeVisual length={stats.snakeLength} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Upcycled Value */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="text-[#666] text-xs tracking-widest mb-2">
            TOTAL UPCYCLED VALUE
          </div>
          <div
            className="text-[#00ff00] text-3xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            ${stats.totalProfit}
          </div>
          <div className="text-[#666] text-[10px] mt-1">
            FROM {stats.totalSaves} REPAIRS
          </div>
        </div>

        {/* Carbon Offset */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="text-[#666] text-xs tracking-widest mb-2">
            CARBON OFFSET
          </div>
          <div
            className="text-[#00ffff] text-3xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {stats.carbonOffset}kg
          </div>
          <div className="text-[#666] text-[10px] mt-1">CO₂ SAVED</div>
        </div>

        {/* Total Saves */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="text-[#666] text-xs tracking-widest mb-2">
            GARMENTS SAVED
          </div>
          <div
            className="text-[#ffaa00] text-3xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {stats.totalSaves}
          </div>
          <div className="text-[#666] text-[10px] mt-1">FROM LANDFILL</div>
        </div>

        {/* Snake Points */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="text-[#666] text-xs tracking-widest mb-2">
            TOTAL XP
          </div>
          <div
            className="text-[#ff00ff] text-3xl font-bold"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {history.reduce((sum, r) => sum + r.snakePoints, 0)}
          </div>
          <div className="text-[#666] text-[10px] mt-1">SNAKE POINTS</div>
        </div>
      </div>

      {/* Repair Archive */}
      <div className="nokia-border bg-[#0a0a0a] p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[#00ffff] text-sm tracking-widest">
            ▣ CASE FILE ARCHIVE
          </div>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (
                  confirm("Clear all repair history? This cannot be undone.")
                ) {
                  clearHistory();
                  setStats(getProfileStats());
                  setHistory([]);
                }
              }}
              className="text-[#ff0040] text-xs hover:underline"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-30">📁</div>
            <div className="text-[#666] text-sm mb-2">NO CASE FILES YET</div>
            <div className="text-[#444] text-xs mb-6">
              Complete repairs to build your archive
            </div>
            <Link href="/scan">
              <Button className="nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white">
                START SCANNING
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {history.map((repair) => (
              <CaseFileCard key={repair.id} repair={repair} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 nokia-border bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span className="text-[#124191]">MEND-AR</span> OPERATOR PROFILE
          </div>
          <Link href="/scan" className="text-[#00ffff] hover:text-[#00ff00]">
            NEW SCAN ▶
          </Link>
        </div>
      </footer>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </main>
  );
}
