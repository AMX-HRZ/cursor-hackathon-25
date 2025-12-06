"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

/**
 * DigitalPassport - Nokia-style certificate for repaired garments
 *
 * Displays:
 * - QR code containing analysis data
 * - Snake score with XP
 * - Repair certification details
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
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: "rgba(242, 243, 245, 0.95)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        className="w-full max-w-md mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nokia Clean Room Badge Card */}
        <div className="tech-card overflow-hidden">
          {/* Badge Header - Nokia Blue */}
          <div
            className="tech-card-header py-4"
            style={{ background: "#124191" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-[10px] tracking-widest mb-1"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  RETHREAD CERTIFIED
                </div>
                <div className="text-lg tracking-wider">DIGITAL PASSPORT</div>
              </div>
              <div className="text-3xl">🐍</div>
            </div>
          </div>

          {/* Badge Body */}
          <div className="tech-card-body p-5">
            {/* Photo + QR Section */}
            <div className="flex gap-4 mb-5">
              {/* Garment Thumbnail */}
              <div className="lcd-display p-1 w-24 h-24 shrink-0">
                <img
                  src={imageSrc}
                  alt="Repaired garment"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* QR Code */}
              <div
                className="p-2 rounded-sm flex items-center justify-center"
                style={{ background: "#FFFFFF", border: "2px solid #1A1A1A" }}
              >
                <QRCodeSVG
                  value={qrData}
                  size={80}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1A1A1A"
                />
              </div>

              {/* Snake Score */}
              <div className="flex-1 flex flex-col justify-center items-center">
                <div
                  className="text-xs font-mono-tech tracking-wider mb-1"
                  style={{ color: "#124191" }}
                >
                  SNAKE SCORE
                </div>
                <div
                  className="text-3xl font-bold font-pixel"
                  style={{ color: "#166534" }}
                >
                  +{analysisData.snakeScore}
                </div>
                <div
                  className="text-sm font-mono-tech tracking-widest"
                  style={{ color: "#FF5500" }}
                >
                  XP
                </div>
              </div>
            </div>

            {/* Divider */}
            <div
              className="border-t-2 border-dashed relative my-4"
              style={{ borderColor: "#E5E7EB" }}
            >
              <div
                className="absolute -left-5 -top-2 w-4 h-4 rounded-full"
                style={{ background: "#F2F3F5" }}
              />
              <div
                className="absolute -right-5 -top-2 w-4 h-4 rounded-full"
                style={{ background: "#F2F3F5" }}
              />
            </div>

            {/* Repair Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div
                className="p-3 rounded-sm"
                style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
              >
                <span
                  className="text-[10px] font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  FABRIC
                </span>
                <span
                  className="text-sm font-bold font-pixel uppercase"
                  style={{ color: "#166534" }}
                >
                  {analysisData.fabric}
                </span>
              </div>
              <div
                className="p-3 rounded-sm"
                style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
              >
                <span
                  className="text-[10px] font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  TECHNIQUE
                </span>
                <span
                  className="text-sm font-bold font-pixel"
                  style={{ color: "#124191" }}
                >
                  {analysisData.repairTechnique}
                </span>
              </div>
              <div
                className="p-3 rounded-sm"
                style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
              >
                <span
                  className="text-[10px] font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  DIFFICULTY
                </span>
                <span
                  className="text-sm font-bold font-pixel uppercase"
                  style={{ color: "#FF5500" }}
                >
                  {analysisData.difficulty}
                </span>
              </div>
              <div
                className="p-3 rounded-sm"
                style={{ background: "#F3F4F6", border: "2px solid #E5E7EB" }}
              >
                <span
                  className="text-[10px] font-mono-tech block mb-1"
                  style={{ color: "#6B7280" }}
                >
                  VALUE
                </span>
                <span
                  className="text-sm font-bold font-pixel"
                  style={{ color: "#166534" }}
                >
                  +${analysisData.marketValueRepaired}
                </span>
              </div>
            </div>

            {/* Certificate Footer */}
            <div
              className="p-4 rounded-sm text-center"
              style={{ background: "#F9FAFB", border: "2px solid #E5E7EB" }}
            >
              <div
                className="text-[10px] font-mono-tech tracking-widest mb-1"
                style={{ color: "#6B7280" }}
              >
                VERIFICATION ID
              </div>
              <div
                className="text-xs font-mono-tech tracking-wider"
                style={{ color: "#124191" }}
              >
                {analysisData.analysisId}
              </div>
              <div
                className="text-[10px] font-mono-tech mt-2"
                style={{ color: "#9CA3AF" }}
              >
                {new Date(analysisData.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={onClose}
                className="flex-1 nokia-btn py-3 text-sm font-pixel tracking-widest"
              >
                ◀ BACK
              </button>
              <button
                onClick={() => {
                  // Future: Share functionality
                  console.log("[Passport] Share clicked");
                }}
                className="flex-1 nokia-btn nokia-btn-primary py-3 text-sm font-pixel tracking-widest"
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
