"use client";

import React, { useEffect, useState } from "react";

interface BusinessCardProps {
  scrapValue: number;
  upcycledValue: number;
  fabric: string;
  damageType: string;
}

export default function BusinessCard({
  scrapValue,
  upcycledValue,
  fabric,
  damageType,
}: BusinessCardProps) {
  const [displayScrap, setDisplayScrap] = useState(0);
  const [displayUpcycled, setDisplayUpcycled] = useState(0);
  const [showProfit, setShowProfit] = useState(false);

  const profit = upcycledValue - scrapValue;
  const profitPercent =
    scrapValue > 0 ? Math.round((profit / scrapValue) * 100) : 0;

  // Animated counter effect
  useEffect(() => {
    const duration = 1500;
    const steps = 30;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setDisplayScrap(Math.round(scrapValue * eased));
      setDisplayUpcycled(Math.round(upcycledValue * eased));

      if (step >= steps) {
        clearInterval(timer);
        setShowProfit(true);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [scrapValue, upcycledValue]);

  return (
    <div className="tech-card">
      {/* Header - Nokia Style */}
      <div className="tech-card-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "#22C55E" }}
          />
          <span>/// VALUE_ANALYSIS</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse-tech"
            style={{ background: "#22C55E" }}
          />
          <span className="text-[10px]">LIVE</span>
        </div>
      </div>

      <div className="tech-card-body p-5">
        {/* Item Info */}
        <div
          className="p-4 mb-4 rounded-sm"
          style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span
                className="text-[10px] font-mono-tech tracking-wider"
                style={{ color: "#6B7280" }}
              >
                FABRIC
              </span>
              <div
                className="text-sm font-bold font-pixel mt-1"
                style={{ color: "#166534" }}
              >
                {fabric}
              </div>
            </div>
            <div>
              <span
                className="text-[10px] font-mono-tech tracking-wider"
                style={{ color: "#6B7280" }}
              >
                DAMAGE
              </span>
              <div
                className="text-sm font-bold font-pixel mt-1"
                style={{ color: "#FF5500" }}
              >
                {damageType}
              </div>
            </div>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="space-y-4">
          {/* Scrap Value */}
          <div
            className="p-4 rounded-sm"
            style={{ background: "#FEE2E2", border: "2px solid #DC2626" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-mono-tech tracking-wider"
                style={{ color: "#6B7280" }}
              >
                CURRENT SCRAP VALUE
              </span>
              <span
                className="text-xs font-mono-tech"
                style={{ color: "#DC2626" }}
              >
                ▼ DAMAGED
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-4xl font-bold font-pixel"
                style={{ color: "#DC2626" }}
              >
                ${displayScrap}
              </span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#6B7280" }}
              >
                .00
              </span>
            </div>
            <div
              className="mt-3 h-2 rounded-sm overflow-hidden"
              style={{ background: "#FCA5A5" }}
            >
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: `${(scrapValue / upcycledValue) * 100}%`,
                  background: "#DC2626",
                }}
              />
            </div>
          </div>

          {/* Arrow indicator */}
          <div className="flex justify-center">
            <div
              className="text-2xl animate-bounce font-pixel"
              style={{ color: "#166534" }}
            >
              ↓
            </div>
          </div>

          {/* Upcycled Value */}
          <div
            className="p-4 rounded-sm"
            style={{ background: "#DCFCE7", border: "2px solid #166534" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-mono-tech tracking-wider"
                style={{ color: "#6B7280" }}
              >
                UPCYCLED VALUE
              </span>
              <span
                className="text-xs font-mono-tech"
                style={{ color: "#166534" }}
              >
                ▲ REPAIRED
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className="text-5xl font-bold font-pixel"
                style={{ color: "#166534" }}
              >
                ${displayUpcycled}
              </span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#6B7280" }}
              >
                .00
              </span>
            </div>
            <div
              className="mt-3 h-2 rounded-sm overflow-hidden"
              style={{ background: "#86EFAC" }}
            >
              <div
                className="h-full transition-all duration-1000"
                style={{
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #166534 0%, #22C55E 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Profit Summary */}
        <div
          className={`mt-4 pt-4 border-t-2 transition-all duration-500 ${
            showProfit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ borderColor: "#E5E7EB" }}
        >
          <div
            className="p-4 rounded-sm"
            style={{ background: "#EEF2FF", border: "2px solid #124191" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <span
                  className="text-xs font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  POTENTIAL PROFIT
                </span>
                <span
                  className="text-3xl font-bold font-pixel"
                  style={{ color: "#124191" }}
                >
                  +${profit}
                </span>
              </div>
              <div className="text-right">
                <span
                  className="text-xs font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  ROI
                </span>
                <span
                  className="text-2xl font-bold font-pixel"
                  style={{ color: "#166534" }}
                >
                  +{profitPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker tape */}
        <div className="mt-4 overflow-hidden">
          <div
            className="flex text-xs font-mono-tech whitespace-nowrap animate-[marquee_15s_linear_infinite]"
            style={{ color: "#9CA3AF" }}
          >
            <span className="mx-4">● SUSTAINABLE FASHION ●</span>
            <span className="mx-4">● REDUCE WASTE ●</span>
            <span className="mx-4">● VISIBLE MENDING ●</span>
            <span className="mx-4">● UPCYCLE VALUE ●</span>
            <span className="mx-4">● NOKIA RETHREAD ●</span>
            <span className="mx-4">● SUSTAINABLE FASHION ●</span>
            <span className="mx-4">● REDUCE WASTE ●</span>
            <span className="mx-4">● VISIBLE MENDING ●</span>
            <span className="mx-4">● UPCYCLE VALUE ●</span>
            <span className="mx-4">● NOKIA RETHREAD ●</span>
          </div>
        </div>
      </div>
    </div>
  );
}
