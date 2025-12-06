"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

/**
 * DigitalPassport - Nokia-style employee badge for repaired garments
 *
 * Displays:
 * - QR code containing analysis data
 * - Snake score with XP
 * - Repair certification details
 *
 * Animates: Slides up from bottom when displayed
 */

/** Passport-specific data structure */
interface PassportData {
  fabric: string;
  damageType: string;
  repairTechnique: string;
  snakeScore: number;
  marketValueRepaired: number;
  difficulty: string;
  timestamp: string;
  analysisId: string;
}

interface DigitalPassportProps {
  analysisData: PassportData;
  imageSrc: string;
  onClose: () => void;
}

export default function DigitalPassport({
  analysisData,
  imageSrc,
  onClose,
}: DigitalPassportProps) {
  // Generate QR code data - compact JSON with key repair info
  const qrData = JSON.stringify({
    id: analysisData.analysisId,
    fabric: analysisData.fabric,
    repair: analysisData.repairTechnique,
    score: analysisData.snakeScore,
    value: analysisData.marketValueRepaired,
    ts: analysisData.timestamp,
  });

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 200,
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="w-full max-w-md mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nokia Employee Badge Style Card */}
        <div className="nokia-border bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] overflow-hidden">
          {/* Badge Header - Nokia Blue */}
          <div className="bg-[#124191] p-4 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(255,255,255,0.1) 10px,
                  rgba(255,255,255,0.1) 20px
                )`,
              }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <div
                  className="text-xs text-white/70 tracking-widest"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  MEND-AR CERTIFIED
                </div>
                <div
                  className="text-lg text-white tracking-wider mt-1"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  DIGITAL PASSPORT
                </div>
              </div>
              <div className="text-3xl">🐍</div>
            </div>
          </div>

          {/* Badge Body */}
          <div className="p-4 space-y-4">
            {/* Photo + QR Section */}
            <div className="flex gap-4">
              {/* Garment Thumbnail */}
              <div className="nokia-border bg-[#0a0a0a] p-1 w-24 h-24 shrink-0">
                <img
                  src={imageSrc}
                  alt="Repaired garment"
                  className="w-full h-full object-cover pixelated"
                />
              </div>

              {/* QR Code */}
              <div className="nokia-border bg-white p-2 flex items-center justify-center">
                <QRCodeSVG
                  value={qrData}
                  size={80}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#0a0a0a"
                />
              </div>

              {/* Snake Score */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div className="text-[#00ffff] text-xs tracking-widest mb-1">
                  SNAKE SCORE
                </div>
                <div
                  className="text-[#00ff00] text-3xl font-bold"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  +{analysisData.snakeScore}
                </div>
                <div className="text-[#ffaa00] text-sm tracking-widest">XP</div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-[#333] relative">
              <div className="absolute -left-4 -top-2 w-4 h-4 bg-[#0a0a0a] rounded-full" />
              <div className="absolute -right-4 -top-2 w-4 h-4 bg-[#0a0a0a] rounded-full" />
            </div>

            {/* Repair Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#1a1a1a] border border-[#333] p-2">
                <span className="text-[#666] block">FABRIC</span>
                <span className="text-[#00ff00] uppercase">
                  {analysisData.fabric}
                </span>
              </div>
              <div className="bg-[#1a1a1a] border border-[#333] p-2">
                <span className="text-[#666] block">TECHNIQUE</span>
                <span className="text-[#00ff00]">
                  {analysisData.repairTechnique}
                </span>
              </div>
              <div className="bg-[#1a1a1a] border border-[#333] p-2">
                <span className="text-[#666] block">DIFFICULTY</span>
                <span className="text-[#ffaa00] uppercase">
                  {analysisData.difficulty}
                </span>
              </div>
              <div className="bg-[#1a1a1a] border border-[#333] p-2">
                <span className="text-[#666] block">VALUE</span>
                <span className="text-[#00ffff]">
                  +${analysisData.marketValueRepaired}
                </span>
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="bg-[#0f0f0f] border border-[#222] p-3 text-center">
              <div className="text-[#666] text-[10px] tracking-widest mb-1">
                VERIFICATION ID
              </div>
              <div
                className="text-[#124191] text-xs tracking-wider"
                style={{ fontFamily: "monospace" }}
              >
                {analysisData.analysisId}
              </div>
              <div className="text-[#444] text-[10px] mt-2">
                {new Date(analysisData.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 nokia-button bg-[#1a1a1a] text-[#B0B0B0] hover:text-[#00ff00] py-3 text-sm tracking-widest transition-colors"
              >
                ◀ BACK
              </button>
              <button
                onClick={() => {
                  // Future: Share functionality
                  console.log("[Passport] Share clicked");
                }}
                className="flex-1 nokia-button bg-[#124191] text-white hover:bg-[#00ffff] hover:text-[#0a0a0a] py-3 text-sm tracking-widest transition-colors"
              >
                SHARE 📤
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
