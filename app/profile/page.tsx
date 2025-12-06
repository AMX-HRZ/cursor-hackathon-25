"use client";

import { Button } from "@/components/ui/button";
import { SavedRepair, useRepairHistory } from "@/hooks/useRepairHistory";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Profile Page - Y2K Nokia Edgy Aesthetic
 * Operator Stats & Repair Archive
 */

// ============================================
// SNAKE VISUALIZATION COMPONENT - Y2K Style
// ============================================
function SnakeVisual({ length }: { length: number }) {
  const maxDisplay = Math.min(length, 20);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Snake body - Y2K gradient */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxDisplay }).map((_, index) => {
          const isHead = index === maxDisplay - 1;
          const progress = index / maxDisplay;
          
          // Y2K gradient from blue to cyan to green
          const colors = [
            `rgba(0, 59, 122, ${0.4 + progress * 0.6})`,
            `rgba(0, 229, 255, ${0.4 + progress * 0.6})`,
            `rgba(57, 255, 20, ${0.4 + progress * 0.6})`,
          ];
          const colorIndex = Math.floor(progress * 2.99);

          return (
            <div
              key={index}
              className="w-6 h-6 transition-all duration-300"
              style={{
                backgroundColor: isHead ? '#39ff14' : colors[colorIndex],
                boxShadow: isHead 
                  ? '0 0 15px #39ff14, 0 0 30px rgba(57, 255, 20, 0.5)' 
                  : `0 0 ${5 + progress * 10}px ${colors[colorIndex]}`,
              }}
            >
              {isHead && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#040810] rounded-full" />
                    <div className="w-1.5 h-1.5 bg-[#040810] rounded-full" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Length indicator */}
      <div className="text-center">
        <div className="text-[#666] text-xs tracking-[0.3em]">SNAKE LENGTH</div>
        <div
          className="text-5xl font-bold"
          style={{ 
            fontFamily: "var(--font-pixel)",
            color: '#39ff14',
            textShadow: '0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4)'
          }}
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
// CASE FILE CARD COMPONENT - Y2K Style
// ============================================
function CaseFileCard({ repair }: { repair: SavedRepair }) {
  return (
    <div 
      className="nokia-border bg-[rgba(0,20,40,0.9)] p-2 group transition-all hover:border-[#00e5ff]"
      style={{
        boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)'
      }}
    >
      {/* Image */}
      <div className="aspect-square bg-[#001020] overflow-hidden mb-2 relative">
        <img
          src={repair.img}
          alt={repair.optionName}
          className="w-full h-full object-cover pixelated opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {/* Overlay */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(0, 229, 255, 0.1) 70%, rgba(4, 8, 16, 0.9) 100%)'
          }}
        />
        {/* Badge */}
        <div className="absolute bottom-1 left-1 right-1">
          <div 
            className="px-1 py-0.5 text-[8px] truncate tracking-wider"
            style={{
              backgroundColor: 'rgba(0, 20, 40, 0.9)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              color: '#00e5ff'
            }}
          >
            {repair.optionName}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-[#666]">PROFIT</span>
          <span style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)' }}>
            +${repair.profit}
          </span>
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-[#666]">SCORE</span>
          <span style={{ color: '#00e5ff', textShadow: '0 0 5px rgba(0, 229, 255, 0.5)' }}>
            +{repair.snakePoints}
          </span>
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
      {/* Header - Y2K Style */}
      <header className="nokia-border bg-[rgba(0,20,40,0.9)] p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#c0c0c0] hover:text-[#00e5ff] hover:bg-transparent p-0"
            >
              ◀ BACK
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 animate-pulse"
              style={{
                backgroundColor: '#9d00ff',
                boxShadow: '0 0 10px #9d00ff'
              }}
            />
            <h1
              className="text-xl tracking-widest"
              style={{ 
                fontFamily: "var(--font-pixel)",
                color: '#00e5ff',
                textShadow: '0 0 20px rgba(0, 229, 255, 0.5), -1px 0 #ff00aa, 1px 0 #9d00ff'
              }}
            >
              OPERATOR STATS
            </h1>
          </div>
          <div className="w-16" />
        </div>
      </header>

      {/* Level Up Banner - Y2K Gradient */}
      <div 
        className="nokia-border p-6 mb-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.3) 0%, rgba(157, 0, 255, 0.2) 50%, rgba(57, 255, 20, 0.1) 100%)',
          boxShadow: '0 0 40px rgba(0, 229, 255, 0.1), inset 0 0 60px rgba(157, 0, 255, 0.05)'
        }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute top-0 left-1/4 w-[1px] h-full"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #00e5ff 50%, transparent 100%)',
              animation: 'dataStream 3s linear infinite'
            }}
          />
          <div 
            className="absolute top-0 right-1/3 w-[1px] h-full"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, #ff00aa 50%, transparent 100%)',
              animation: 'dataStream 4s linear infinite'
            }}
          />
        </div>

        <div className="relative z-10">
          <div className="text-[#666] text-xs tracking-[0.3em] mb-2">
            MEND-AR OPERATOR LEVEL
          </div>
          <div
            className="text-6xl font-bold mb-6"
            style={{ 
              fontFamily: "var(--font-pixel)",
              background: 'linear-gradient(180deg, #00e5ff 0%, #39ff14 50%, #ff00aa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.5))'
            }}
          >
            LV.{Math.floor(stats.snakeLength / 3)}
          </div>

          {/* Snake Visualization */}
          <SnakeVisual length={stats.snakeLength} />
        </div>
      </div>

      {/* Stats Grid - Y2K Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {/* Total Upcycled Value */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
          <div className="text-[#666] text-xs tracking-[0.2em] mb-2">
            TOTAL UPCYCLED VALUE
          </div>
          <div
            className="text-3xl font-bold"
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#39ff14',
              textShadow: '0 0 15px rgba(57, 255, 20, 0.6)'
            }}
          >
            ${stats.totalProfit}
          </div>
          <div className="text-[#666] text-[10px] mt-1">
            FROM {stats.totalSaves} REPAIRS
          </div>
          <div className="mt-2 h-[2px] bg-gradient-to-r from-[#39ff14] to-transparent" />
        </div>

        {/* Carbon Offset */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
          <div className="text-[#666] text-xs tracking-[0.2em] mb-2">
            CARBON OFFSET
          </div>
          <div
            className="text-3xl font-bold"
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#00e5ff',
              textShadow: '0 0 15px rgba(0, 229, 255, 0.6)'
            }}
          >
            {stats.carbonOffset}kg
          </div>
          <div className="text-[#666] text-[10px] mt-1">CO₂ SAVED</div>
          <div className="mt-2 h-[2px] bg-gradient-to-r from-[#00e5ff] to-transparent" />
        </div>

        {/* Total Saves */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
          <div className="text-[#666] text-xs tracking-[0.2em] mb-2">
            GARMENTS SAVED
          </div>
          <div
            className="text-3xl font-bold"
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#ffaa00',
              textShadow: '0 0 15px rgba(255, 170, 0, 0.6)'
            }}
          >
            {stats.totalSaves}
          </div>
          <div className="text-[#666] text-[10px] mt-1">FROM LANDFILL</div>
          <div className="mt-2 h-[2px] bg-gradient-to-r from-[#ffaa00] to-transparent" />
        </div>

        {/* Snake Points */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
          <div className="text-[#666] text-xs tracking-[0.2em] mb-2">
            TOTAL XP
          </div>
          <div
            className="text-3xl font-bold"
            style={{ 
              fontFamily: "var(--font-pixel)",
              color: '#ff00aa',
              textShadow: '0 0 15px rgba(255, 0, 170, 0.6)'
            }}
          >
            {history.reduce((sum, r) => sum + r.snakePoints, 0)}
          </div>
          <div className="text-[#666] text-[10px] mt-1">SNAKE POINTS</div>
          <div className="mt-2 h-[2px] bg-gradient-to-r from-[#ff00aa] to-transparent" />
        </div>
      </div>

      {/* Repair Archive - Y2K Grid */}
      <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2"
              style={{
                backgroundColor: '#00e5ff',
                boxShadow: '0 0 5px #00e5ff'
              }}
            />
            <span 
              className="text-sm tracking-[0.2em]"
              style={{ color: '#00e5ff' }}
            >
              CASE FILE ARCHIVE
            </span>
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
              className="text-xs hover:underline tracking-wider"
              style={{ color: '#ff0055' }}
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div 
              className="text-6xl mb-4 opacity-30"
              style={{ filter: 'grayscale(100%)' }}
            >
              📁
            </div>
            <div className="text-[#666] text-sm mb-2 tracking-wider">NO CASE FILES YET</div>
            <div className="text-[#444] text-xs mb-6">
              Complete repairs to build your archive
            </div>
            <Link href="/scan">
              <Button>
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

      {/* Footer - Y2K Style */}
      <footer className="mt-6 nokia-border bg-[rgba(0,20,40,0.9)] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span 
              className="font-bold tracking-widest"
              style={{
                background: 'linear-gradient(90deg, #00e5ff 0%, #ff00aa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MEND-AR
            </span>
            <span className="ml-2 tracking-wider">OPERATOR PROFILE</span>
          </div>
          <Link 
            href="/scan" 
            className="tracking-widest hover:text-[#39ff14] transition-colors"
            style={{ color: '#00e5ff' }}
          >
            NEW SCAN ▶
          </Link>
        </div>
      </footer>

      {/* Decorative Elements */}
      <div className="fixed top-1/4 left-4 hidden lg:block">
        <div className="w-[1px] h-24 bg-gradient-to-b from-[#9d00ff] to-transparent" />
      </div>
      <div className="fixed top-1/3 right-4 hidden lg:block">
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#00e5ff] to-transparent" />
      </div>
    </main>
  );
}
