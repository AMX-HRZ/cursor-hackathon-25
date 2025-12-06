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
  const profitPercent = scrapValue > 0 ? Math.round((profit / scrapValue) * 100) : 0;

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
    <div className="nokia-border bg-[#0a0a0a] p-4">
      {/* Header - Financial Ticker Style */}
      <div className="flex items-center justify-between mb-4 border-b border-[#333] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[#00ffff] text-sm tracking-widest">▣ VALUE ANALYSIS</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#00ff00] animate-pulse" />
          <span className="text-[#666] text-xs">LIVE</span>
        </div>
      </div>

      {/* Item Info */}
      <div className="bg-[#1a1a1a] border border-[#333] p-3 mb-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#666]">FABRIC</span>
            <div className="text-[#00ff00] text-sm mt-1">{fabric}</div>
          </div>
          <div>
            <span className="text-[#666]">DAMAGE</span>
            <div className="text-[#ffaa00] text-sm mt-1">{damageType}</div>
          </div>
        </div>
      </div>

      {/* Value Comparison */}
      <div className="space-y-4">
        {/* Scrap Value */}
        <div className="bg-[#1a1a1a] border border-[#ff0040]/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#666] text-xs tracking-wider">CURRENT SCRAP VALUE</span>
            <span className="text-[#ff0040] text-xs">▼ DAMAGED</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[#ff0040] text-4xl font-bold" style={{ fontFamily: "var(--font-pixel)" }}>
              ${displayScrap}
            </span>
            <span className="text-[#666] text-sm">.00</span>
          </div>
          <div className="mt-2 h-2 bg-[#333] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#ff0040] to-[#ff4060] transition-all duration-1000"
              style={{ width: `${(scrapValue / upcycledValue) * 100}%` }}
            />
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex justify-center">
          <div className="text-[#00ff00] text-2xl animate-bounce">↓</div>
        </div>

        {/* Upcycled Value */}
        <div className="bg-[#1a1a1a] border border-[#00ff00]/30 p-4 relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff00]/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#666] text-xs tracking-wider">UPCYCLED VALUE</span>
              <span className="text-[#00ff00] text-xs">▲ REPAIRED</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-[#00ff00] text-5xl font-bold text-glow" 
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                ${displayUpcycled}
              </span>
              <span className="text-[#666] text-sm">.00</span>
            </div>
            <div className="mt-2 h-2 bg-[#333] overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00ff00] to-[#00ffff] transition-all duration-1000"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div 
        className={`mt-4 pt-4 border-t border-[#333] transition-all duration-500 ${
          showProfit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="bg-gradient-to-r from-[#124191]/20 to-[#00ffff]/20 border border-[#124191] p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#666] text-xs block mb-1">POTENTIAL PROFIT</span>
              <span className="text-[#00ffff] text-3xl font-bold text-glow-cyan">
                +${profit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#666] text-xs block mb-1">ROI</span>
              <span className="text-[#00ff00] text-2xl font-bold">
                +{profitPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="mt-4 overflow-hidden">
        <div className="flex animate-marquee text-xs text-[#666] whitespace-nowrap">
          <span className="mx-4">● SUSTAINABLE FASHION ●</span>
          <span className="mx-4">● REDUCE WASTE ●</span>
          <span className="mx-4">● VISIBLE MENDING ●</span>
          <span className="mx-4">● UPCYCLE VALUE ●</span>
          <span className="mx-4">● NOKIA MEND-AR ●</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}

