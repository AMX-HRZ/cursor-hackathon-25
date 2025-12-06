"use client";

import { useEffect, useState } from "react";

/**
 * WasteMonitor - Nokia-styled Stats Dashboard
 * Clean, professional with retro touches
 */
export default function WasteMonitor() {
  const [wasteCount, setWasteCount] = useState(92000000);
  const [truckPulse, setTruckPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCount((prev) => prev + 3);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTruckPulse(true);
      setTimeout(() => setTruckPulse(false), 500);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Stats Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Live Waste Counter */}
        <div className="nokia-card nokia-card-pink p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 animate-pulse-nokia"
              style={{ background: "#cc3366" }}
            />
            <span
              className="text-sm font-bold tracking-[0.15em]"
              style={{ color: "#cc3366" }}
            >
              GLOBAL TEXTILE WASTE (TONNES)
            </span>
          </div>
          <div className="lcd-screen p-5">
            <div
              className="text-4xl md:text-6xl font-bold text-center stat-number"
              style={{
                color: "#cc3366",
                textShadow: "0 0 15px rgba(204, 51, 102, 0.5)",
              }}
            >
              {formatNumber(wasteCount)}
            </div>
            <div className="flex justify-between items-center mt-4 text-sm">
              <span style={{ color: "#64748b" }}>
                +{Math.round((3 * 10 * 60 * 60 * 24) / 1000)}K tonnes/day
              </span>
              <span
                className="font-bold animate-pulse-nokia tracking-wider"
                style={{ color: "#cc3366" }}
              >
                ▲ RISING
              </span>
            </div>
          </div>
        </div>

        {/* Truck Rate */}
        <div className="nokia-card p-5" style={{ borderColor: "#d97706" }}>
          <span
            className="text-sm font-bold tracking-[0.15em] mb-4 block"
            style={{ color: "#d97706" }}
          >
            INCINERATION RATE
          </span>
          <div className="lcd-screen p-5 text-center">
            <div
              className={`text-5xl mb-3 transition-transform duration-200 ${
                truckPulse ? "scale-110" : "scale-100"
              }`}
            >
              🚛
            </div>
            <div
              className="text-lg font-bold mb-1"
              style={{ color: "#d97706" }}
            >
              1 TRUCKLOAD
            </div>
            <div
              className="text-sm tracking-[0.15em]"
              style={{ color: "#cc3366" }}
            >
              BURNED / SECOND
            </div>
          </div>
        </div>

        {/* Skill Gap */}
        <div className="nokia-card nokia-card-cyan p-5">
          <span
            className="text-sm font-bold tracking-[0.15em] mb-4 block"
            style={{ color: "#0099cc" }}
          >
            REPAIR SKILL DEFICIT
          </span>
          <div className="lcd-screen p-5">
            <div className="flex items-center justify-center gap-5">
              {/* Pie Chart */}
              <div
                className="w-20 h-20 rounded-full relative"
                style={{
                  background:
                    "conic-gradient(#cc3366 0deg 212deg, #2a3a5c 212deg 360deg)",
                }}
              >
                <div
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{ background: "#0f1729" }}
                >
                  <span
                    className="text-lg font-bold"
                    style={{ color: "#cc3366" }}
                  >
                    59%
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: "#cc3366" }} />
                  <span style={{ color: "#a0aec0" }}>No repair skills</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ background: "#2a3a5c" }} />
                  <span style={{ color: "#64748b" }}>Can repair</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="nokia-card nokia-card-green p-5 md:col-span-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 flex items-center justify-center"
                style={{
                  border: "3px solid #00aa66",
                  background: "#e0fff0",
                }}
              >
                <span className="text-2xl">🐍</span>
              </div>
              <div>
                <div
                  className="text-sm font-bold tracking-[0.15em] mb-1"
                  style={{ color: "#0099cc" }}
                >
                  THE SOLUTION
                </div>
                <div
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: "#00aa66",
                  }}
                >
                  RETHREAD SYSTEM
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 animate-pulse-nokia"
                  style={{ background: "#00aa66" }}
                />
                <span className="font-bold" style={{ color: "#00aa66" }}>
                  ONLINE
                </span>
              </div>
              <div style={{ color: "#64748b" }}>
                AI Module: <span style={{ color: "#0099cc" }}>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source */}
      <div className="mt-4 text-center text-xs" style={{ color: "#64748b" }}>
        Source: UNEP Textile Waste Report 2024
      </div>
    </div>
  );
}
