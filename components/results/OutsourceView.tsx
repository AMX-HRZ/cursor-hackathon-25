"use client";

import { RepairOption } from "@/app/api/analyze/route";
import { Button } from "@/components/ui/button";
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
      className="fixed inset-0 z-50 flex flex-col dot-grid-bg"
      style={{ background: "rgba(242, 243, 245, 0.98)" }}
    >
      {/* Header */}
      <div
        className="bg-white border-b-2 sticky top-0 z-10"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-sm font-bold tracking-wider font-mono-tech hover:bg-gray-100"
              style={{ color: "#124191" }}
            >
              ◀ BACK
            </Button>
            <h1
              className="text-lg font-bold tracking-wider font-pixel"
              style={{ color: "#124191" }}
            >
              OUTSOURCE REPAIR
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
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
                <div className="tech-card p-12 text-center">
                  {/* Radar Animation */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <div
                      className="absolute inset-0 border-2 rounded-full"
                      style={{ borderColor: "rgba(22, 101, 52, 0.3)" }}
                    />
                    <div
                      className="absolute inset-4 border-2 rounded-full"
                      style={{ borderColor: "rgba(22, 101, 52, 0.4)" }}
                    />
                    <div
                      className="absolute inset-8 border-2 rounded-full"
                      style={{ borderColor: "rgba(22, 101, 52, 0.5)" }}
                    />
                    <div
                      className="absolute inset-0 border-t-2 rounded-full animate-spin"
                      style={{
                        borderColor: "#166534",
                        animationDuration: "2s",
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-3 h-3 rounded-full animate-pulse-tech"
                        style={{ background: "#166534" }}
                      />
                    </div>
                  </div>

                  <div
                    className="text-lg font-bold tracking-widest font-pixel mb-2"
                    style={{ color: "#166534" }}
                  >
                    TRIANGULATING POSITION{locationDots}
                  </div>
                  <div
                    className="text-sm font-mono-tech"
                    style={{ color: "#6B7280" }}
                  >
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
                className="space-y-6"
              >
                {/* Nokia GPS Map */}
                <div className="tech-card">
                  <div
                    className="tech-card-header"
                    style={{ background: "#124191" }}
                  >
                    /// NOKIA_GPS_LOCAL_VENDORS
                  </div>
                  <div className="tech-card-body p-4">
                    {/* Retro Wireframe Map */}
                    <div
                      className="relative aspect-video lcd-display overflow-hidden"
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, rgba(18, 65, 145, 0.2) 1px, transparent 1px),
                          linear-gradient(rgba(18, 65, 145, 0.2) 1px, transparent 1px)
                        `,
                        backgroundSize: "20px 20px",
                      }}
                    >
                      {/* Roads - Horizontal */}
                      <div
                        className="absolute top-1/4 left-0 right-0 h-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />
                      <div
                        className="absolute top-1/2 left-0 right-0 h-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />
                      <div
                        className="absolute top-3/4 left-0 right-0 h-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />

                      {/* Roads - Vertical */}
                      <div
                        className="absolute left-1/4 top-0 bottom-0 w-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />
                      <div
                        className="absolute left-1/2 top-0 bottom-0 w-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />
                      <div
                        className="absolute left-3/4 top-0 bottom-0 w-[2px]"
                        style={{ background: "rgba(22, 101, 52, 0.6)" }}
                      />

                      {/* User Location - Center */}
                      <div
                        className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ left: "50%", top: "50%" }}
                      >
                        <div
                          className="w-full h-full border-2 rotate-45 animate-pulse-tech"
                          style={{ borderColor: "#124191" }}
                        />
                        <div
                          className="absolute inset-1 rotate-45"
                          style={{ background: "#124191" }}
                        />
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
                            className={`w-full h-full rounded-sm ${
                              selectedVendor === vendor.id
                                ? "bg-[#FF5500] shadow-lg"
                                : "bg-[#DC2626]"
                            }`}
                            style={{
                              clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                            }}
                          />
                          {selectedVendor === vendor.id && (
                            <div
                              className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-mono-tech px-1 rounded-sm"
                              style={{
                                background: "#FFFFFF",
                                color: "#FF5500",
                                border: "1px solid #FF5500",
                              }}
                            >
                              {vendor.name.split(" ")[0]}
                            </div>
                          )}
                        </button>
                      ))}

                      {/* Compass */}
                      <div
                        className="absolute top-2 right-2 text-xs font-mono-tech"
                        style={{ color: "#166534" }}
                      >
                        <div className="text-center">N</div>
                        <div className="flex">
                          <span>W</span>
                          <span className="mx-1">+</span>
                          <span>E</span>
                        </div>
                        <div className="text-center">S</div>
                      </div>

                      {/* Scale */}
                      <div
                        className="absolute bottom-2 left-2 text-[8px] font-mono-tech"
                        style={{ color: "#6B7280" }}
                      >
                        <div className="flex items-center gap-1">
                          <div
                            className="w-8 h-px"
                            style={{ background: "#6B7280" }}
                          />
                          <span>1km</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-6 mt-3 text-[10px] font-mono-tech">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 border rotate-45"
                          style={{ borderColor: "#124191" }}
                        />
                        <span style={{ color: "#6B7280" }}>YOU</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 bg-[#DC2626]"
                          style={{
                            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                          }}
                        />
                        <span style={{ color: "#6B7280" }}>VENDOR</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor List */}
                <div className="tech-card">
                  <div
                    className="tech-card-header"
                    style={{ background: "#124191" }}
                  >
                    /// NEARBY_REPAIR_VENDORS
                  </div>
                  <div className="tech-card-body p-5">
                    <div className="space-y-3">
                      {vendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          onClick={() => setSelectedVendor(vendor.id)}
                          className={`w-full p-4 text-left transition-all rounded-sm ${
                            selectedVendor === vendor.id
                              ? "bg-[#EEF2FF] border-2"
                              : "bg-[#F9FAFB] border-2"
                          }`}
                          style={{
                            borderColor:
                              selectedVendor === vendor.id
                                ? "#124191"
                                : "#E5E7EB",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div
                                className={`text-sm font-bold font-pixel ${
                                  selectedVendor === vendor.id
                                    ? "text-[#124191]"
                                    : "text-[#1A1A1A]"
                                }`}
                              >
                                {vendor.name}
                              </div>
                              <div
                                className="text-xs font-mono-tech mt-1"
                                style={{ color: "#6B7280" }}
                              >
                                📍 {vendor.distance}
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className="text-[10px] font-mono-tech"
                                style={{ color: "#6B7280" }}
                              >
                                QUOTE
                              </div>
                              <div
                                className="text-lg font-bold font-pixel"
                                style={{ color: "#FF5500" }}
                              >
                                ${vendor.quote}
                              </div>
                            </div>
                          </div>
                          {selectedVendor === vendor.id && (
                            <div
                              className="mt-3 pt-3 border-t text-[10px] font-mono-tech"
                              style={{
                                borderColor: "#E5E7EB",
                                color: "#6B7280",
                              }}
                            >
                              EST. TURNAROUND: 2-3 DAYS • RATING: ★★★★☆
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Repair Summary */}
                <div className="tech-card">
                  <div
                    className="tech-card-header"
                    style={{ background: "#166534" }}
                  >
                    /// REPAIR_BLUEPRINT
                  </div>
                  <div className="tech-card-body p-5">
                    <div className="flex gap-4">
                      <div className="lcd-display p-1 w-20 h-20 shrink-0">
                        <img
                          src={imageSrc}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <div
                          className="font-bold font-pixel mb-1"
                          style={{ color: "#166534" }}
                        >
                          {selectedOption.name}
                        </div>
                        <div
                          className="text-xs font-mono-tech"
                          style={{ color: "#6B7280" }}
                        >
                          Type: {selectedOption.type.toUpperCase()}
                        </div>
                        <div
                          className="text-xs font-mono-tech"
                          style={{ color: "#6B7280" }}
                        >
                          Difficulty: {selectedOption.difficulty}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transmit Button */}
                <Button
                  onClick={handleTransmit}
                  disabled={selectedVendor === null}
                  className="nokia-btn nokia-btn-success w-full py-6 text-lg tracking-widest font-pixel disabled:opacity-50 disabled:cursor-not-allowed"
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
                <div className="tech-card p-8 w-full max-w-md">
                  {/* File Transfer Dialog */}
                  <div
                    className="lcd-display p-4 mb-4"
                    style={{ background: "#F9FAFB" }}
                  >
                    <div
                      className="text-xs font-bold font-mono-tech mb-4 flex items-center gap-2"
                      style={{ color: "#124191" }}
                    >
                      <span className="animate-pulse-tech">📡</span>
                      INFRARED DATA TRANSFER
                    </div>

                    {/* Transfer Animation */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center">
                        <div
                          className="w-12 h-12 border-2 flex items-center justify-center text-2xl rounded-sm"
                          style={{ borderColor: "#166534" }}
                        >
                          📱
                        </div>
                        <div
                          className="text-[8px] font-mono-tech mt-1"
                          style={{ color: "#6B7280" }}
                        >
                          YOUR DEVICE
                        </div>
                      </div>

                      {/* Data Stream */}
                      <div className="flex-1 mx-4 h-2 relative overflow-hidden rounded-sm">
                        <div
                          className="absolute inset-0"
                          style={{ background: "#E5E7EB" }}
                        />
                        <div
                          className="absolute left-0 top-0 bottom-0 transition-all duration-300"
                          style={{
                            width: `${transmitProgress}%`,
                            background:
                              "linear-gradient(90deg, #166534 0%, #22C55E 100%)",
                          }}
                        />
                      </div>

                      <div className="text-center">
                        <div
                          className="w-12 h-12 border-2 flex items-center justify-center text-2xl rounded-sm"
                          style={{ borderColor: "#FF5500" }}
                        >
                          🏪
                        </div>
                        <div
                          className="text-[8px] font-mono-tech mt-1"
                          style={{ color: "#6B7280" }}
                        >
                          VENDOR
                        </div>
                      </div>
                    </div>

                    {/* File Info */}
                    <div
                      className="p-2 text-[10px] font-mono-tech rounded-sm"
                      style={{
                        background: "#F3F4F6",
                        border: "1px solid #E5E7EB",
                      }}
                    >
                      <div style={{ color: "#6B7280" }}>
                        FILE: repair_blueprint.mrp
                      </div>
                      <div style={{ color: "#6B7280" }}>SIZE: 2.4KB</div>
                      <div style={{ color: "#166534" }}>
                        SENT:{" "}
                        {Math.round((transmitProgress / 100) * 2.4 * 10) / 10}KB
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-2 font-mono-tech">
                      <span style={{ color: "#FF5500" }}>
                        SENDING DATA VIA INFRARED...
                      </span>
                      <span style={{ color: "#166534" }}>
                        {transmitProgress}%
                      </span>
                    </div>
                    <div
                      className="h-3 rounded-sm overflow-hidden"
                      style={{
                        background: "#E5E7EB",
                        border: "2px solid #1A1A1A",
                      }}
                    >
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${transmitProgress}%`,
                          background:
                            "linear-gradient(90deg, #166534 0%, #22C55E 100%)",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="text-center text-xs font-mono-tech"
                    style={{ color: "#6B7280" }}
                  >
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
                <div className="tech-card p-8 text-center">
                  <div className="text-6xl mb-4">✓</div>
                  <div
                    className="text-2xl font-bold tracking-widest font-pixel mb-2"
                    style={{ color: "#166534" }}
                  >
                    TRANSMISSION COMPLETE
                  </div>
                  <div
                    className="text-sm font-mono-tech mb-6"
                    style={{ color: "#6B7280" }}
                  >
                    DROP-OFF WINDOW OPEN
                  </div>

                  <div
                    className="p-4 mb-6 text-left rounded-sm"
                    style={{
                      background: "#F9FAFB",
                      border: "2px solid #E5E7EB",
                    }}
                  >
                    <div
                      className="text-xs font-bold font-mono-tech mb-2"
                      style={{ color: "#124191" }}
                    >
                      CONFIRMATION
                    </div>
                    <div className="text-xs space-y-1 font-mono-tech">
                      <div style={{ color: "#1A1A1A" }}>
                        Vendor:{" "}
                        <span style={{ color: "#166534" }}>
                          {vendors.find((v) => v.id === selectedVendor)?.name}
                        </span>
                      </div>
                      <div style={{ color: "#1A1A1A" }}>
                        Quote:{" "}
                        <span style={{ color: "#FF5500" }}>
                          ${vendors.find((v) => v.id === selectedVendor)?.quote}
                        </span>
                      </div>
                      <div style={{ color: "#1A1A1A" }}>
                        Ref:{" "}
                        <span style={{ color: "#6B7280" }}>
                          RTH-{Date.now().toString(36).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={onClose}
                    className="nokia-btn nokia-btn-primary w-full py-4 font-pixel"
                  >
                    DONE
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
