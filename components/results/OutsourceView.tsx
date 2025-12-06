"use client";

import { Button } from "@/components/ui/button";
import { RepairOption } from "@/context/RepairContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * OutsourceView - Nokia GPS style vendor finder
 *
 * Phases:
 * 1. Geolocation - "TRIANGULATING POSITION..."
 * 2. Map - Retro wireframe with user and vendor nodes
 * 3. Vendor List - 3 nearby tailors with quotes
 * 4. Transmit - IR data transfer animation
 */

interface OutsourceViewProps {
  imageSrc: string;
  selectedOption: RepairOption;
  onClose: () => void;
}

type Phase = "locating" | "map" | "transmitting" | "complete";

interface Vendor {
  id: number;
  name: string;
  distance: string;
  quote: number;
  x: number;
  y: number;
}

export default function OutsourceView({
  imageSrc,
  selectedOption,
  onClose,
}: OutsourceViewProps) {
  const [phase, setPhase] = useState<Phase>("locating");
  const [selectedVendor, setSelectedVendor] = useState<number | null>(null);
  const [transmitProgress, setTransmitProgress] = useState(0);
  const [locationDots, setLocationDots] = useState("");

  // Generate vendors with quotes based on repair cost
  const vendors: Vendor[] = [
    {
      id: 1,
      name: "Local Seamstress Unit 4",
      distance: "0.4km",
      quote: selectedOption.cost + 10,
      x: 35,
      y: 25,
    },
    {
      id: 2,
      name: "Cyber-Tailor Hub",
      distance: "1.2km",
      quote: selectedOption.cost + 17,
      x: 70,
      y: 40,
    },
    {
      id: 3,
      name: "Nokia Authorized Refit",
      distance: "3.5km",
      quote: selectedOption.cost + 20,
      x: 20,
      y: 70,
    },
  ];

  // Phase 1: Geolocation simulation
  useEffect(() => {
    if (phase !== "locating") return;

    const dotInterval = setInterval(() => {
      setLocationDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);

    const timeout = setTimeout(() => {
      setPhase("map");
    }, 2500);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(timeout);
    };
  }, [phase]);

  // Phase 3: Transmit animation
  useEffect(() => {
    if (phase !== "transmitting") return;

    const interval = setInterval(() => {
      setTransmitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("complete"), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [phase]);

  const handleTransmit = () => {
    if (selectedVendor === null) return;
    setPhase("transmitting");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col"
    >
      {/* Header */}
      <header className="nokia-border bg-[#0a0a0a] p-4 m-4 mb-0">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-[#B0B0B0] hover:text-[#00ff00] hover:bg-transparent p-0"
          >
            ◀ BACK
          </Button>
          <h1
            className="text-lg text-[#00ffff] tracking-widest"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            OUTSOURCE REPAIR
          </h1>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
        <AnimatePresence mode="wait">
          {/* Phase 1: Locating */}
          {phase === "locating" && (
            <motion.div
              key="locating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="nokia-border bg-[#0a0a0a] p-8 text-center">
                {/* Radar Animation */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 border-2 border-[#00ff00]/30 rounded-full" />
                  <div className="absolute inset-4 border-2 border-[#00ff00]/40 rounded-full" />
                  <div className="absolute inset-8 border-2 border-[#00ff00]/50 rounded-full" />
                  <div
                    className="absolute inset-0 border-t-2 border-[#00ff00] rounded-full"
                    style={{ animation: "spin 2s linear infinite" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#00ff00] rounded-full animate-pulse" />
                  </div>
                </div>

                <div
                  className="text-[#00ff00] text-lg tracking-widest"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  TRIANGULATING POSITION{locationDots}
                </div>
                <div className="text-[#666] text-xs mt-2">
                  ACCESSING GPS SATELLITES
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 2: Map + Vendor List */}
          {phase === "map" && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Nokia GPS Map */}
              <div className="nokia-border bg-[#0a0a0a] p-4">
                <div className="text-[#00ffff] text-xs tracking-widest mb-3">
                  ▣ NOKIA GPS - LOCAL VENDORS
                </div>

                {/* Retro Wireframe Map */}
                <div
                  className="relative aspect-video bg-[#0a0a0a] border border-[#333] overflow-hidden"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, #00ff00 1px, transparent 1px),
                      linear-gradient(#00ff00 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Map Grid Overlay */}
                  <div className="absolute inset-0 bg-[#0a0a0a]/80" />

                  {/* Roads - Horizontal */}
                  <div className="absolute top-1/4 left-0 right-0 h-[2px] bg-[#00ff00]/60" />
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#00ff00]/60" />
                  <div className="absolute top-3/4 left-0 right-0 h-[2px] bg-[#00ff00]/60" />

                  {/* Roads - Vertical */}
                  <div className="absolute left-1/4 top-0 bottom-0 w-[2px] bg-[#00ff00]/60" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-[#00ff00]/60" />
                  <div className="absolute left-3/4 top-0 bottom-0 w-[2px] bg-[#00ff00]/60" />

                  {/* User Location - Center */}
                  <div
                    className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: "50%", top: "50%" }}
                  >
                    <div className="w-full h-full border-2 border-[#00ffff] rotate-45 animate-pulse" />
                    <div className="absolute inset-1 bg-[#00ffff] rotate-45" />
                  </div>

                  {/* Vendor Nodes */}
                  {vendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => setSelectedVendor(vendor.id)}
                      className={`absolute w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                        selectedVendor === vendor.id
                          ? "scale-125"
                          : "hover:scale-110"
                      }`}
                      style={{ left: `${vendor.x}%`, top: `${vendor.y}%` }}
                    >
                      <div
                        className={`w-full h-full ${
                          selectedVendor === vendor.id
                            ? "bg-[#ffaa00] shadow-[0_0_10px_#ffaa00]"
                            : "bg-[#ff0040]"
                        }`}
                        style={{
                          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                        }}
                      />
                      {selectedVendor === vendor.id && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-[#ffaa00] bg-[#0a0a0a] px-1">
                          {vendor.name.split(" ")[0]}
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Compass */}
                  <div className="absolute top-2 right-2 text-[#00ff00] text-xs">
                    <div className="text-center">N</div>
                    <div className="flex">
                      <span>W</span>
                      <span className="mx-1">+</span>
                      <span>E</span>
                    </div>
                    <div className="text-center">S</div>
                  </div>

                  {/* Scale */}
                  <div className="absolute bottom-2 left-2 text-[#666] text-[8px]">
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-[1px] bg-[#666]" />
                      <span>1km</span>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 mt-3 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-[#00ffff] rotate-45" />
                    <span className="text-[#666]">YOU</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 bg-[#ff0040]"
                      style={{
                        clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                      }}
                    />
                    <span className="text-[#666]">VENDOR</span>
                  </div>
                </div>
              </div>

              {/* Vendor List */}
              <div className="nokia-border bg-[#0a0a0a] p-4">
                <div className="text-[#00ffff] text-xs tracking-widest mb-3">
                  ▣ NEARBY REPAIR VENDORS
                </div>

                <div className="space-y-2">
                  {vendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => setSelectedVendor(vendor.id)}
                      className={`w-full p-3 border text-left transition-all ${
                        selectedVendor === vendor.id
                          ? "bg-[#124191] border-[#00ff00]"
                          : "bg-[#1a1a1a] border-[#333] hover:border-[#666]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className={`text-sm ${
                              selectedVendor === vendor.id
                                ? "text-[#00ff00]"
                                : "text-[#B0B0B0]"
                            }`}
                          >
                            {vendor.name}
                          </div>
                          <div className="text-[#666] text-xs mt-1">
                            📍 {vendor.distance}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#666] text-[10px]">QUOTE</div>
                          <div className="text-[#ffaa00] text-lg">
                            ${vendor.quote}
                          </div>
                        </div>
                      </div>
                      {selectedVendor === vendor.id && (
                        <div className="mt-2 pt-2 border-t border-[#333] text-[10px] text-[#666]">
                          EST. TURNAROUND: 2-3 DAYS • RATING: ★★★★☆
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repair Summary */}
              <div className="nokia-border bg-[#0a0a0a] p-4">
                <div className="text-[#00ffff] text-xs tracking-widest mb-2">
                  ▣ REPAIR BLUEPRINT
                </div>
                <div className="flex gap-3">
                  <div className="w-16 h-16 border border-[#333] overflow-hidden">
                    <img
                      src={imageSrc}
                      alt="Garment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="text-[#00ff00]">{selectedOption.name}</div>
                    <div className="text-[#666] mt-1">
                      Type: {selectedOption.type.toUpperCase()}
                    </div>
                    <div className="text-[#666]">
                      Difficulty: {selectedOption.difficulty}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transmit Button */}
              <Button
                onClick={handleTransmit}
                disabled={selectedVendor === null}
                className="w-full nokia-button bg-[#00ff00] hover:bg-[#00ffff] text-[#0a0a0a] py-6 text-lg tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📡 TRANSMIT BLUEPRINT
              </Button>
            </motion.div>
          )}

          {/* Phase 3: Transmitting */}
          {phase === "transmitting" && (
            <motion.div
              key="transmitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="nokia-border bg-[#0a0a0a] p-8 w-full max-w-md">
                {/* File Transfer Dialog */}
                <div className="border border-[#333] bg-[#1a1a1a] p-4 mb-4">
                  <div className="text-[#00ffff] text-xs mb-4 flex items-center gap-2">
                    <span className="animate-pulse">📡</span>
                    INFRARED DATA TRANSFER
                  </div>

                  {/* Transfer Animation */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center">
                      <div className="w-12 h-12 border border-[#00ff00] flex items-center justify-center text-2xl">
                        📱
                      </div>
                      <div className="text-[8px] text-[#666] mt-1">
                        YOUR DEVICE
                      </div>
                    </div>

                    {/* Data Stream */}
                    <div className="flex-1 mx-4 h-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#333]" />
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#00ff00] to-[#00ffff]"
                        style={{
                          width: `${transmitProgress}%`,
                          boxShadow: "0 0 10px #00ff00",
                        }}
                      />
                      {/* Moving packets */}
                      <div
                        className="absolute top-0 bottom-0 w-4 bg-[#00ff00]/50"
                        style={{
                          left: `${(transmitProgress % 20) * 5}%`,
                          animation: "none",
                        }}
                      />
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 border border-[#ffaa00] flex items-center justify-center text-2xl">
                        🏪
                      </div>
                      <div className="text-[8px] text-[#666] mt-1">VENDOR</div>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="bg-[#0a0a0a] border border-[#333] p-2 text-[10px] font-mono">
                    <div className="text-[#666]">
                      FILE: repair_blueprint.mrp
                    </div>
                    <div className="text-[#666]">SIZE: 2.4KB</div>
                    <div className="text-[#00ff00]">
                      SENT:{" "}
                      {Math.round((transmitProgress / 100) * 2.4 * 10) / 10}KB
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#ffaa00]">
                      SENDING DATA VIA INFRARED...
                    </span>
                    <span className="text-[#00ff00]">{transmitProgress}%</span>
                  </div>
                  <div className="nokia-progress">
                    <div
                      className="nokia-progress-fill h-full transition-all"
                      style={{ width: `${transmitProgress}%` }}
                    />
                  </div>
                </div>

                <div className="text-center text-[#666] text-xs">
                  DO NOT INTERRUPT TRANSMISSION
                </div>
              </div>
            </motion.div>
          )}

          {/* Phase 4: Complete */}
          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="nokia-border bg-[#0a0a0a] p-8 text-center">
                <div className="text-6xl mb-4">✓</div>
                <div
                  className="text-[#00ff00] text-2xl tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  TRANSMISSION COMPLETE
                </div>
                <div className="text-[#666] text-sm mb-6">
                  DROP-OFF WINDOW OPEN
                </div>

                <div className="bg-[#1a1a1a] border border-[#333] p-4 mb-6 text-left">
                  <div className="text-[#00ffff] text-xs mb-2">
                    CONFIRMATION
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="text-[#B0B0B0]">
                      Vendor:{" "}
                      <span className="text-[#00ff00]">
                        {vendors.find((v) => v.id === selectedVendor)?.name}
                      </span>
                    </div>
                    <div className="text-[#B0B0B0]">
                      Quote:{" "}
                      <span className="text-[#ffaa00]">
                        ${vendors.find((v) => v.id === selectedVendor)?.quote}
                      </span>
                    </div>
                    <div className="text-[#B0B0B0]">
                      Ref:{" "}
                      <span className="text-[#666]">
                        MND-{Date.now().toString(36).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={onClose}
                  className="w-full nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white py-4"
                >
                  DONE
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
}
