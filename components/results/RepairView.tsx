"use client";

import React from "react";
import Image from "next/image";
import SnakeOverlay from "@/components/overlays/SnakeOverlay";

interface Coordinate {
  x: number;
  y: number;
}

interface RepairViewProps {
  imageSrc: string;
  coordinates: Coordinate[];
  repairTechnique: string;
  difficulty: string;
}

export default function RepairView({
  imageSrc,
  coordinates,
  repairTechnique,
  difficulty,
}: RepairViewProps) {
  return (
    <div className="nokia-border bg-[#0a0a0a] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-[#00ffff] tracking-widest">▣ AR REPAIR PREVIEW</span>
        <span className="text-[#666]">{difficulty}</span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-black overflow-hidden">
        {/* Captured Image */}
        <Image
          src={imageSrc}
          alt="Captured fabric for repair"
          fill
          className="object-cover"
          priority
        />

        {/* Snake Stitch Overlay */}
        <SnakeOverlay
          coordinates={coordinates}
          animated={true}
          glowIntensity="high"
        />

        {/* Viewfinder Corners */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="viewfinder-corner viewfinder-corner-tl" />
          <div className="viewfinder-corner viewfinder-corner-tr" />
          <div className="viewfinder-corner viewfinder-corner-bl" />
          <div className="viewfinder-corner viewfinder-corner-br" />
        </div>

        {/* Technique Badge */}
        <div className="absolute top-3 right-3 bg-[#0a0a0a]/80 border border-[#00ff00] px-3 py-1">
          <span className="text-[#00ff00] text-xs tracking-wider">
            {repairTechnique}
          </span>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-[#00ff00]" />
          <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-[#00ff00]" />
          <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-[#00ff00]" />
          <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-[#00ff00]" />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-[3px] bg-gradient-to-r from-[#00ff00] to-[#00ffff]" />
          <span className="text-[#B0B0B0]">STITCH PATH</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#00ff00] animate-pulse" />
          <span className="text-[#B0B0B0]">SNAKE HEAD</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#00ff00] bg-[#0a0a0a]" />
          <span className="text-[#B0B0B0]">NODE</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-[#333]">
        <div className="text-[#124191] text-xs mb-2 tracking-wider">REPAIR INSTRUCTIONS:</div>
        <ol className="text-[#B0B0B0] text-xs space-y-1 list-decimal list-inside">
          <li>Thread needle with matching color thread</li>
          <li>Start at the marked &quot;S&quot; point</li>
          <li>Follow the glowing snake path precisely</li>
          <li>Use consistent tension throughout</li>
          <li>Secure thread at the snake head endpoint</li>
        </ol>
      </div>
    </div>
  );
}

