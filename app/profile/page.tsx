"use client";

import { Button } from "@/components/ui/button";
import { SavedRepair, useRepairHistory } from "@/hooks/useRepairHistory";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Profile Page - Nokia Clean Room Aesthetic
 * Operator Stats & Repair Archive
 */

// ============================================
// SNAKE VISUALIZATION COMPONENT - Nokia Style
// ============================================
function SnakeVisual({ length }: { length: number }) {
  const maxDisplay = Math.min(length, 20);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Snake body - Nokia green gradient */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxDisplay }).map((_, index) => {
          const isHead = index === maxDisplay - 1;
          const progress = index / maxDisplay;

          return (
            <div
              key={index}
              className="w-5 h-5 rounded-sm transition-all duration-300"
              style={{
                background: isHead
                  ? "#166534"
                  : `rgba(22, 101, 52, ${0.3 + progress * 0.7})`,
                border: "2px solid #1A1A1A",
                boxShadow: isHead ? "0 0 8px rgba(22, 101, 52, 0.5)" : "none",
              }}
            >
              {isHead && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="flex gap-0.5">
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: "#1A1A1A" }}
                    />
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: "#1A1A1A" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Length indicator */}
      <div className="text-center">
        <div
          className="text-xs tracking-widest mb-1 font-mono-tech"
          style={{ color: "#6B7280" }}
        >
          SNAKE LENGTH
        </div>
        <div
          className="text-4xl font-bold font-pixel"
          style={{ color: "#166534" }}
        >
          {length}
        </div>
        {length > 20 && (
          <div className="text-xs font-mono-tech" style={{ color: "#9CA3AF" }}>
            (+{length - 20} segments not shown)
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// CASE FILE CARD COMPONENT - Nokia Style
// ============================================
function CaseFileCard({ repair }: { repair: SavedRepair }) {
  return (
    <div className="tech-card group hover:shadow-hard-blue transition-shadow">
      {/* Image */}
      <div className="lcd-display m-2 aspect-square overflow-hidden relative">
        <img
          src={repair.img}
          alt={repair.optionName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge */}
        <div className="absolute bottom-1 left-1 right-1">
          <div
            className="px-2 py-1 text-[10px] truncate tracking-wider font-mono-tech"
            style={{
              background: "#124191",
              color: "#FFFFFF",
              border: "1px solid #1A1A1A",
            }}
          >
            {repair.optionName}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex justify-between text-xs font-mono-tech">
          <span style={{ color: "#6B7280" }}>PROFIT</span>
          <span className="font-bold" style={{ color: "#166534" }}>
            +${repair.profit}
          </span>
        </div>
        <div className="flex justify-between text-xs font-mono-tech">
          <span style={{ color: "#6B7280" }}>SCORE</span>
          <span className="font-bold" style={{ color: "#124191" }}>
            +{repair.snakePoints} XP
          </span>
        </div>
        <div
          className="text-[10px] font-mono-tech pt-1 border-t"
          style={{ color: "#9CA3AF", borderColor: "#E5E7EB" }}
        >
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
    <main className="min-h-screen flex flex-col dot-grid-bg">
      {/* ============================================ */}
      {/* NAV BAR - Same as main page */}
      {/* ============================================ */}
      <nav
        className="bg-white border-b-2 sticky top-0 z-50"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-lg font-bold">R</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold tracking-wider leading-none font-pixel"
                  style={{ color: "#1A1A1A" }}
                >
                  RETHREAD
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                HOME
              </Link>
              <Link
                href="/scan"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                SCAN
              </Link>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{ background: "#EEF2FF", border: "2px solid #124191" }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse-tech"
                  style={{ background: "#7C3AED" }}
                />
                <span
                  className="text-xs font-bold tracking-wider font-mono-tech"
                  style={{ color: "#124191" }}
                >
                  PROFILE
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="tech-badge tech-badge-blue mb-3">
              <span className="mr-2">👤</span>
              OPERATOR PROFILE
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Your Repair Journey
            </h1>
            <p className="text-sm font-mono-tech" style={{ color: "#6B7280" }}>
              Track your progress and environmental impact
            </p>
          </div>

          {/* Level Card with Snake */}
          <div className="tech-card mb-6">
            <div
              className="tech-card-header flex items-center justify-between"
              style={{ background: "#166534" }}
            >
              <span>/// OPERATOR_LEVEL</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px]">🐍 SNAKE MASTER</span>
              </div>
            </div>
            <div className="tech-card-body p-8 text-center dot-grid-bg-white">
              <div
                className="text-sm font-mono-tech tracking-widest mb-2"
                style={{ color: "#6B7280" }}
              >
                RETHREAD OPERATOR LEVEL
              </div>
              <div
                className="text-6xl font-bold font-pixel mb-8"
                style={{ color: "#124191" }}
              >
                LV.{Math.floor(stats.snakeLength / 3)}
              </div>

              {/* Snake Visualization */}
              <SnakeVisual length={stats.snakeLength} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Upcycled Value */}
            <div className="tech-card">
              <div
                className="tech-card-header"
                style={{ background: "#166534" }}
              >
                /// UPCYCLED_VALUE
              </div>
              <div className="tech-card-body p-4">
                <div
                  className="text-3xl font-bold font-pixel mb-1"
                  style={{ color: "#166534" }}
                >
                  ${stats.totalProfit}
                </div>
                <div
                  className="text-xs font-mono-tech"
                  style={{ color: "#6B7280" }}
                >
                  FROM {stats.totalSaves} REPAIRS
                </div>
              </div>
            </div>

            {/* Carbon Offset */}
            <div className="tech-card">
              <div
                className="tech-card-header"
                style={{ background: "#124191" }}
              >
                /// CARBON_OFFSET
              </div>
              <div className="tech-card-body p-4">
                <div
                  className="text-3xl font-bold font-pixel mb-1"
                  style={{ color: "#124191" }}
                >
                  {stats.carbonOffset}kg
                </div>
                <div
                  className="text-xs font-mono-tech"
                  style={{ color: "#6B7280" }}
                >
                  CO₂ SAVED
                </div>
              </div>
            </div>

            {/* Total Saves */}
            <div className="tech-card">
              <div
                className="tech-card-header"
                style={{ background: "#FF5500" }}
              >
                /// GARMENTS_SAVED
              </div>
              <div className="tech-card-body p-4">
                <div
                  className="text-3xl font-bold font-pixel mb-1"
                  style={{ color: "#FF5500" }}
                >
                  {stats.totalSaves}
                </div>
                <div
                  className="text-xs font-mono-tech"
                  style={{ color: "#6B7280" }}
                >
                  FROM LANDFILL
                </div>
              </div>
            </div>

            {/* Snake Points */}
            <div className="tech-card">
              <div
                className="tech-card-header"
                style={{ background: "#7C3AED" }}
              >
                /// TOTAL_XP
              </div>
              <div className="tech-card-body p-4">
                <div
                  className="text-3xl font-bold font-pixel mb-1"
                  style={{ color: "#7C3AED" }}
                >
                  {history.reduce((sum, r) => sum + r.snakePoints, 0)}
                </div>
                <div
                  className="text-xs font-mono-tech"
                  style={{ color: "#6B7280" }}
                >
                  SNAKE POINTS
                </div>
              </div>
            </div>
          </div>

          {/* Repair Archive */}
          <div className="tech-card">
            <div className="tech-card-header flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>/// CASE_FILE_ARCHIVE</span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Clear all repair history? This cannot be undone."
                      )
                    ) {
                      clearHistory();
                      setStats(getProfileStats());
                      setHistory([]);
                    }
                  }}
                  className="text-[10px] tracking-wider px-2 py-1 rounded-sm hover:bg-red-50 transition-colors"
                  style={{ color: "#DC2626" }}
                >
                  CLEAR ALL
                </button>
              )}
            </div>
            <div className="tech-card-body p-5">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 opacity-30">📁</div>
                  <div
                    className="font-bold font-pixel mb-2"
                    style={{ color: "#6B7280" }}
                  >
                    NO CASE FILES YET
                  </div>
                  <div
                    className="text-sm font-mono-tech mb-6"
                    style={{ color: "#9CA3AF" }}
                  >
                    Complete repairs to build your archive
                  </div>
                  <Link href="/scan">
                    <Button className="nokia-btn nokia-btn-primary px-6 py-3 text-sm font-pixel">
                      START SCANNING
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {history.map((repair) => (
                    <CaseFileCard key={repair.id} repair={repair} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact Message */}
          <div className="mt-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm"
              style={{ background: "#DCFCE7", border: "2px solid #166534" }}
            >
              <span>🌍</span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#166534" }}
              >
                Every repair helps reduce textile waste and save the planet!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer
        className="bg-white border-t-2 py-4 px-6"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span
                className="font-bold tracking-wider font-pixel"
                style={{ color: "#1A1A1A" }}
              >
                RETHREAD
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono-tech">
              <Link
                href="/scan"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#124191" }}
              >
                Scanner
              </Link>
              <Link
                href="/"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#166534" }}
              >
                Home
              </Link>
              <span style={{ color: "#D1D5DB" }}>|</span>
              <span className="font-bold" style={{ color: "#166534" }}>
                🌍 For the Planet
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
