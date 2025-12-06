"use client";

import { useEffect, useState } from "react";

/**
 * WasteMonitor - Global Intel Dashboard
 *
 * Visualizes the textile waste crisis with Nokia retro-futurist aesthetic
 * Features: Live counter, truck animation, skill gap chart, system status
 */
export default function WasteMonitor() {
  // Live counter - starts at 92M tonnes, increments by 3 every 100ms
  const [wasteCount, setWasteCount] = useState(92000000);
  const [truckPulse, setTruckPulse] = useState(false);
  const [alertBlink, setAlertBlink] = useState(true);

  // Increment waste counter
  useEffect(() => {
    const interval = setInterval(() => {
      setWasteCount((prev) => prev + 3);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Truck pulse every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTruckPulse(true);
      setTimeout(() => setTruckPulse(false), 500);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Alert blink
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Dashboard Header */}
      <div className="nokia-border bg-[#0a0a0a] p-3 mb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 bg-[#ff0040] ${
                alertBlink ? "opacity-100" : "opacity-30"
              } transition-opacity`}
            />
            <span className="text-[#ff0040] text-xs tracking-widest font-mono">
              ◆ CRISIS MONITORING ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#666] text-xs">FEED:</span>
            <span className="text-[#00ff00] text-xs">LIVE</span>
            <div className="w-2 h-2 bg-[#00ff00] animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-1">
        {/* Metric 1: Live Waste Counter */}
        <div className="nokia-border bg-[#0a0a0a] p-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-2 h-2 bg-[#ff0040] ${
                alertBlink ? "opacity-100" : "opacity-20"
              }`}
            />
            <span className="text-[#ff0040] text-xs tracking-widest">
              GLOBAL TEXTILE WASTE (TONNES)
            </span>
          </div>
          <div className="bg-[#111] border border-[#333] p-4">
            <div
              className="text-4xl md:text-6xl text-[#ff0040] font-mono tracking-wider text-center"
              style={{
                fontFamily: "'Segment7', 'Courier New', monospace",
                textShadow:
                  "0 0 20px rgba(255, 0, 64, 0.5), 0 0 40px rgba(255, 0, 64, 0.3)",
                letterSpacing: "0.1em",
              }}
            >
              {formatNumber(wasteCount)}
            </div>
            <div className="flex justify-between items-center mt-3 text-xs">
              <span className="text-[#666]">
                +{Math.round((3 * 10 * 60 * 60 * 24) / 1000)}K TONNES/DAY
              </span>
              <span className="text-[#ff0040] animate-pulse">▲ RISING</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Truck Frequency */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#ffaa00] text-xs tracking-widest">
              INCINERATION RATE
            </span>
          </div>
          <div className="bg-[#111] border border-[#333] p-4 text-center">
            {/* Truck Icon */}
            <div
              className={`text-5xl mb-3 transition-all duration-200 ${
                truckPulse
                  ? "scale-110 text-[#ff0040]"
                  : "scale-100 text-[#ffaa00]"
              }`}
              style={{
                textShadow: truckPulse
                  ? "0 0 30px rgba(255, 0, 64, 0.8)"
                  : "none",
              }}
            >
              🚛
            </div>
            <div className="text-[#ffaa00] text-lg font-mono mb-1">
              1 TRUCKLOAD
            </div>
            <div className="text-[#ff0040] text-sm tracking-widest">
              BURNED / SEC
            </div>
            <div className="mt-3 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-4 ${
                    truckPulse && i === 4
                      ? "bg-[#ff0040]"
                      : i < 4
                      ? "bg-[#333]"
                      : "bg-[#222]"
                  } transition-colors`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Metric 3: Skill Gap Pie Chart */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#00ffff] text-xs tracking-widest">
              OPERATOR SKILL DEFICIT
            </span>
          </div>
          <div className="bg-[#111] border border-[#333] p-4">
            <div className="flex items-center justify-center gap-6">
              {/* CSS Conic Gradient Pie Chart */}
              <div
                className="w-20 h-20 rounded-full relative"
                style={{
                  background: `conic-gradient(
                    #ff0040 0deg 212deg,
                    #333 212deg 360deg
                  )`,
                  boxShadow:
                    "0 0 20px rgba(255, 0, 64, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div className="absolute inset-2 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                  <span className="text-[#ff0040] text-lg font-mono font-bold">
                    59%
                  </span>
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-[#ff0040]" />
                  <span className="text-[#B0B0B0] text-xs">NO SKILLS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#333]" />
                  <span className="text-[#666] text-xs">CAN REPAIR</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-[#666] text-xs">
                59% OF POPULATION LACKS REPAIR PROTOCOLS
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Solution Status */}
        <div className="nokia-border bg-[#0a0a0a] p-4 md:col-span-2">
          <div className="bg-[#111] border border-[#00ff00] p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-[#00ff00] flex items-center justify-center">
                    <span className="text-3xl">🐍</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff00] animate-pulse" />
                </div>
                <div>
                  <div className="text-[#00ffff] text-sm tracking-widest mb-1">
                    INTERVENTION REQUIRED
                  </div>
                  <div
                    className="text-[#00ff00] text-xl tracking-wider"
                    style={{ fontFamily: "var(--font-pixel)" }}
                  >
                    MEND-AR SYSTEM
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-1">
                  <div className="w-2 h-2 bg-[#00ff00] animate-pulse" />
                  <span className="text-[#00ff00] text-sm tracking-widest">
                    SYSTEM ONLINE
                  </span>
                </div>
                <div className="text-[#666] text-xs">
                  AI REPAIR MODULE: ACTIVE
                </div>
                <div className="text-[#666] text-xs">
                  SNAKE STITCH ALGO: READY
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <div className="nokia-border bg-[#0a0a0a] p-2 mt-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#666]">
            DATA: UNEP TEXTILE WASTE REPORT 2024
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#333]">│</span>
            <span className="text-[#ff0040]">◆ CRITICAL</span>
            <span className="text-[#333]">│</span>
            <span className="text-[#00ff00]">UPLINK: STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
