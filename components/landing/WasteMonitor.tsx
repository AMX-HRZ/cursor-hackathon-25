"use client";

import { useEffect, useState } from "react";

/**
 * WasteMonitor - Global Intel Dashboard
 *
 * Y2K Nokia Edgy Aesthetic - Cyber Crisis Monitor
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
      {/* Dashboard Header - Y2K Crisis Bar */}
      <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-3 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 ${
                alertBlink ? "opacity-100" : "opacity-30"
              } transition-opacity`}
              style={{
                backgroundColor: '#ff0055',
                boxShadow: alertBlink ? '0 0 10px #ff0055, 0 0 20px #ff0055' : 'none'
              }}
            />
            <span 
              className="text-xs tracking-widest font-mono"
              style={{
                color: '#ff0055',
                textShadow: '0 0 10px rgba(255, 0, 85, 0.5)'
              }}
            >
              ◆ CRISIS MONITORING ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#666] text-xs">FEED:</span>
            <span 
              className="text-xs tracking-wider"
              style={{
                color: '#39ff14',
                textShadow: '0 0 5px #39ff14'
              }}
            >
              LIVE
            </span>
            <div 
              className="w-2 h-2 animate-pulse"
              style={{
                backgroundColor: '#39ff14',
                boxShadow: '0 0 10px #39ff14'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-2">
        {/* Metric 1: Live Waste Counter - Full Width */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-5 md:col-span-2 relative overflow-hidden">
          {/* Animated background bars */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-[2px]"
                style={{
                  left: `${i * 5}%`,
                  background: `linear-gradient(180deg, transparent 0%, ${i % 2 === 0 ? '#ff0055' : '#00e5ff'} 50%, transparent 100%)`,
                  animation: `dataStream ${2 + (i * 0.1)}s linear infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-2 h-2 ${
                  alertBlink ? "opacity-100" : "opacity-20"
                }`}
                style={{
                  backgroundColor: '#ff0055',
                  boxShadow: alertBlink ? '0 0 10px #ff0055' : 'none'
                }}
              />
              <span 
                className="text-xs tracking-[0.2em]"
                style={{ color: '#ff0055' }}
              >
                GLOBAL TEXTILE WASTE (TONNES)
              </span>
            </div>

            <div 
              className="lcd-screen p-5"
              style={{
                background: 'linear-gradient(180deg, #001020 0%, #001a33 50%, #001020 100%)'
              }}
            >
              <div
                className="text-4xl md:text-7xl font-mono tracking-wider text-center"
                style={{
                  fontFamily: "'Segment7', 'Courier New', monospace",
                  color: '#ff0055',
                  textShadow: `
                    0 0 20px rgba(255, 0, 85, 0.8),
                    0 0 40px rgba(255, 0, 85, 0.6),
                    0 0 60px rgba(255, 0, 85, 0.4)
                  `,
                  letterSpacing: "0.15em",
                }}
              >
                {formatNumber(wasteCount)}
              </div>
              <div className="flex justify-between items-center mt-4 text-xs">
                <span className="text-[#666]">
                  +{Math.round((3 * 10 * 60 * 60 * 24) / 1000)}K TONNES/DAY
                </span>
                <div className="flex items-center gap-2">
                  <span 
                    className="animate-pulse tracking-widest"
                    style={{
                      color: '#ff0055',
                      textShadow: '0 0 5px #ff0055'
                    }}
                  >
                    ▲ RISING
                  </span>
                  <div className="flex gap-[2px]">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-1 transition-all"
                        style={{
                          height: `${8 + i * 3}px`,
                          backgroundColor: i < 4 ? '#ff0055' : '#333',
                          boxShadow: i < 4 ? '0 0 5px #ff0055' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Truck Frequency */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="text-xs tracking-[0.2em]"
              style={{ color: '#ffaa00' }}
            >
              INCINERATION RATE
            </span>
          </div>
          <div 
            className="lcd-screen p-5 text-center"
            style={{
              background: 'linear-gradient(180deg, #001020 0%, #0a1520 50%, #001020 100%)'
            }}
          >
            {/* Truck Icon */}
            <div
              className={`text-5xl mb-4 transition-all duration-200 ${
                truckPulse
                  ? "scale-125"
                  : "scale-100"
              }`}
              style={{
                filter: truckPulse
                  ? 'drop-shadow(0 0 20px #ff0055) drop-shadow(0 0 40px #ff0055)'
                  : 'drop-shadow(0 0 10px #ffaa00)',
                color: truckPulse ? '#ff0055' : '#ffaa00'
              }}
            >
              🚛
            </div>
            <div 
              className="text-lg font-mono mb-1"
              style={{
                color: '#ffaa00',
                textShadow: '0 0 10px rgba(255, 170, 0, 0.5)'
              }}
            >
              1 TRUCKLOAD
            </div>
            <div 
              className="text-sm tracking-[0.2em]"
              style={{
                color: '#ff0055',
                textShadow: '0 0 5px rgba(255, 0, 85, 0.5)'
              }}
            >
              BURNED / SEC
            </div>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-5 transition-all duration-200"
                  style={{
                    backgroundColor: truckPulse && i === 5
                      ? '#ff0055'
                      : i < 5
                        ? '#ffaa00'
                        : '#1a2530',
                    boxShadow: (truckPulse && i === 5) || i < 5
                      ? `0 0 10px ${truckPulse && i === 5 ? '#ff0055' : '#ffaa00'}`
                      : 'none',
                    opacity: i < 5 ? 0.3 + (i * 0.15) : 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Metric 3: Skill Gap Pie Chart */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span 
              className="text-xs tracking-[0.2em]"
              style={{ color: '#00e5ff' }}
            >
              OPERATOR SKILL DEFICIT
            </span>
          </div>
          <div 
            className="lcd-screen p-5"
            style={{
              background: 'linear-gradient(180deg, #001020 0%, #0a1520 50%, #001020 100%)'
            }}
          >
            <div className="flex items-center justify-center gap-6">
              {/* CSS Conic Gradient Pie Chart - Y2K Style */}
              <div
                className="w-24 h-24 rounded-full relative"
                style={{
                  background: `conic-gradient(
                    #ff0055 0deg 212deg,
                    #1a2530 212deg 360deg
                  )`,
                  boxShadow: `
                    0 0 20px rgba(255, 0, 85, 0.4),
                    0 0 40px rgba(255, 0, 85, 0.2),
                    inset 0 0 20px rgba(0, 0, 0, 0.5)
                  `,
                }}
              >
                <div 
                  className="absolute inset-2 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(180deg, #001020 0%, #0a1520 100%)'
                  }}
                >
                  <span 
                    className="text-xl font-mono font-bold"
                    style={{
                      color: '#ff0055',
                      textShadow: '0 0 10px rgba(255, 0, 85, 0.8)'
                    }}
                  >
                    59%
                  </span>
                </div>
              </div>
              <div className="text-left space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4"
                    style={{
                      backgroundColor: '#ff0055',
                      boxShadow: '0 0 5px #ff0055'
                    }}
                  />
                  <span className="text-[#c0c0c0] text-xs tracking-wider">NO SKILLS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4"
                    style={{ backgroundColor: '#1a2530' }}
                  />
                  <span className="text-[#666] text-xs tracking-wider">CAN REPAIR</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-[#666] text-[10px] tracking-wider">
                59% OF POPULATION LACKS REPAIR PROTOCOLS
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Solution Status - Full Width */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-5 md:col-span-2">
          <div 
            className="p-5 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.3) 0%, rgba(57, 255, 20, 0.1) 100%)',
              border: '1px solid rgba(57, 255, 20, 0.3)',
              boxShadow: '0 0 30px rgba(57, 255, 20, 0.1), inset 0 0 30px rgba(57, 255, 20, 0.05)'
            }}
          >
            {/* Animated scan line */}
            <div 
              className="absolute inset-x-0 h-[2px] opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #39ff14 50%, transparent 100%)',
                animation: 'scanline 3s linear infinite'
              }}
            />

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div 
                    className="w-20 h-20 flex items-center justify-center"
                    style={{
                      border: '2px solid #39ff14',
                      boxShadow: '0 0 20px rgba(57, 255, 20, 0.3), inset 0 0 20px rgba(57, 255, 20, 0.1)'
                    }}
                  >
                    <span className="text-4xl">🐍</span>
                  </div>
                  <div 
                    className="absolute -top-1 -right-1 w-4 h-4 animate-pulse"
                    style={{
                      backgroundColor: '#39ff14',
                      boxShadow: '0 0 10px #39ff14, 0 0 20px #39ff14'
                    }}
                  />
                </div>
                <div>
                  <div 
                    className="text-sm tracking-[0.2em] mb-2"
                    style={{ color: '#00e5ff' }}
                  >
                    INTERVENTION REQUIRED
                  </div>
                  <div
                    className="text-2xl tracking-wider"
                    style={{ 
                      fontFamily: "var(--font-pixel)",
                      color: '#39ff14',
                      textShadow: '0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4)'
                    }}
                  >
                    MEND-AR SYSTEM
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <div 
                    className="w-3 h-3 animate-pulse"
                    style={{
                      backgroundColor: '#39ff14',
                      boxShadow: '0 0 10px #39ff14'
                    }}
                  />
                  <span 
                    className="text-sm tracking-[0.2em]"
                    style={{
                      color: '#39ff14',
                      textShadow: '0 0 5px rgba(57, 255, 20, 0.5)'
                    }}
                  >
                    SYSTEM ONLINE
                  </span>
                </div>
                <div className="text-[#666] text-xs space-y-1">
                  <div className="flex items-center gap-2 justify-end">
                    <span>AI REPAIR MODULE:</span>
                    <span style={{ color: '#00e5ff' }}>ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <span>SNAKE STITCH ALGO:</span>
                    <span style={{ color: '#39ff14' }}>READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Footer */}
      <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-3 mt-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#666]">
            DATA: UNEP TEXTILE WASTE REPORT 2024
          </span>
          <div className="flex items-center gap-4">
            <span className="text-[#333]">│</span>
            <span 
              style={{
                color: '#ff0055',
                textShadow: '0 0 5px rgba(255, 0, 85, 0.5)'
              }}
            >
              ◆ CRITICAL
            </span>
            <span className="text-[#333]">│</span>
            <span 
              style={{
                color: '#39ff14',
                textShadow: '0 0 5px rgba(57, 255, 20, 0.5)'
              }}
            >
              UPLINK: STABLE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
