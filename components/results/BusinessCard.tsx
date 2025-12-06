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
    <div 
      className="nokia-border p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.2) 0%, rgba(0, 20, 40, 0.9) 100%)',
      }}
    >
      {/* Header - Financial Ticker Style */}
      <div className="flex items-center justify-between mb-4 border-b border-[#00e5ff]/20 pb-3">
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
            VALUE ANALYSIS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span 
            className="w-2 h-2 animate-pulse"
            style={{
              backgroundColor: '#39ff14',
              boxShadow: '0 0 5px #39ff14'
            }}
          />
          <span className="text-[#666] text-xs tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Item Info */}
      <div 
        className="p-3 mb-4"
        style={{
          background: 'rgba(0, 30, 60, 0.6)',
          border: '1px solid rgba(0, 229, 255, 0.2)'
        }}
      >
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[#666] tracking-wider">FABRIC</span>
            <div 
              className="text-sm mt-1"
              style={{ color: '#39ff14' }}
            >
              {fabric}
            </div>
          </div>
          <div>
            <span className="text-[#666] tracking-wider">DAMAGE</span>
            <div 
              className="text-sm mt-1"
              style={{ color: '#ffaa00' }}
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
          className="p-4"
          style={{
            background: 'rgba(0, 30, 60, 0.6)',
            border: '1px solid rgba(255, 0, 85, 0.3)',
            boxShadow: '0 0 20px rgba(255, 0, 85, 0.1)'
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#666] text-xs tracking-wider">CURRENT SCRAP VALUE</span>
            <span 
              className="text-xs"
              style={{ color: '#ff0055' }}
            >
              ▼ DAMAGED
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span 
              className="text-4xl font-bold"
              style={{ 
                fontFamily: "var(--font-pixel)",
                color: '#ff0055',
                textShadow: '0 0 10px rgba(255, 0, 85, 0.5)'
              }}
            >
              ${displayScrap}
            </span>
            <span className="text-[#666] text-sm">.00</span>
          </div>
          <div 
            className="mt-2 h-2 overflow-hidden"
            style={{ background: 'rgba(0, 30, 60, 0.6)' }}
          >
            <div 
              className="h-full transition-all duration-1000"
              style={{ 
                width: `${(scrapValue / upcycledValue) * 100}%`,
                background: 'linear-gradient(90deg, #ff0055 0%, #ff3377 100%)',
                boxShadow: '0 0 10px #ff0055'
              }}
            />
          </div>
        </div>

        {/* Arrow indicator */}
        <div className="flex justify-center">
          <div 
            className="text-2xl animate-bounce"
            style={{ 
              color: '#39ff14',
              textShadow: '0 0 10px #39ff14'
            }}
          >
            ↓
          </div>
        </div>

        {/* Upcycled Value */}
        <div 
          className="p-4 relative overflow-hidden"
          style={{
            background: 'rgba(0, 30, 60, 0.6)',
            border: '1px solid rgba(57, 255, 20, 0.3)',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.1)'
          }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(57, 255, 20, 0.05) 0%, transparent 100%)'
            }}
          />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#666] text-xs tracking-wider">UPCYCLED VALUE</span>
              <span 
                className="text-xs"
                style={{ color: '#39ff14' }}
              >
                ▲ REPAIRED
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span 
                className="text-5xl font-bold text-glow" 
                style={{ 
                  fontFamily: "var(--font-pixel)",
                  color: '#39ff14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4)'
                }}
              >
                ${displayUpcycled}
              </span>
              <span className="text-[#666] text-sm">.00</span>
            </div>
            <div 
              className="mt-2 h-2 overflow-hidden"
              style={{ background: 'rgba(0, 30, 60, 0.6)' }}
            >
              <div 
                className="h-full transition-all duration-1000"
                style={{ 
                  width: "100%",
                  background: 'linear-gradient(90deg, #39ff14 0%, #00e5ff 100%)',
                  boxShadow: '0 0 10px #39ff14'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div 
        className={`mt-4 pt-4 border-t border-[#00e5ff]/20 transition-all duration-500 ${
          showProfit ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div 
          className="p-4"
          style={{
            background: 'linear-gradient(90deg, rgba(0, 59, 122, 0.3) 0%, rgba(0, 229, 255, 0.2) 100%)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#666] text-xs block mb-1 tracking-wider">POTENTIAL PROFIT</span>
              <span 
                className="text-3xl font-bold"
                style={{
                  color: '#00e5ff',
                  textShadow: '0 0 15px rgba(0, 229, 255, 0.8)'
                }}
              >
                +${profit}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#666] text-xs block mb-1 tracking-wider">ROI</span>
              <span 
                className="text-2xl font-bold"
                style={{
                  color: '#39ff14',
                  textShadow: '0 0 10px rgba(57, 255, 20, 0.5)'
                }}
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
          className="flex text-xs text-[#666] whitespace-nowrap animate-[marquee_15s_linear_infinite]"
        >
          <span className="mx-4">● SUSTAINABLE FASHION ●</span>
          <span className="mx-4">● REDUCE WASTE ●</span>
          <span className="mx-4">● VISIBLE MENDING ●</span>
          <span className="mx-4">● UPCYCLE VALUE ●</span>
          <span className="mx-4">● NOKIA MEND-AR ●</span>
          <span className="mx-4">● SUSTAINABLE FASHION ●</span>
          <span className="mx-4">● REDUCE WASTE ●</span>
          <span className="mx-4">● VISIBLE MENDING ●</span>
          <span className="mx-4">● UPCYCLE VALUE ●</span>
          <span className="mx-4">● NOKIA MEND-AR ●</span>
        </div>
      </div>
    </div>
  );
}
