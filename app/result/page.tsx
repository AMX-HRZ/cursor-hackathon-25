"use client";

import DynamicOverlay from "@/components/overlays/DynamicOverlay";
import BusinessCard from "@/components/results/BusinessCard";
import DigitalPassport from "@/components/results/DigitalPassport";
import OutsourceView from "@/components/results/OutsourceView";
import RepairGuide from "@/components/results/RepairGuide";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RepairOption, useRepair } from "@/context/RepairContext";
import { useRepairHistory } from "@/hooks/useRepairHistory";
import { compositeImageWithOverlay } from "@/lib/imageCompositor";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================
// COMPACT OPTION CARD COMPONENT
// ============================================
interface OptionCardProps {
  option: RepairOption;
  isSelected: boolean;
  onClick: () => void;
}

function OptionCard({ option, isSelected, onClick }: OptionCardProps) {
  const difficultyColor = {
    LOW: "#00ff00",
    MED: "#ffaa00",
    HIGH: "#ff0040",
  }[option.difficulty];

  const typeIcon = {
    basic: "▣",
    trend: "✿",
    cyber: "◈",
  }[option.type];

  return (
    <button
      onClick={onClick}
      className={`
        nokia-border min-w-[160px] p-3 text-left transition-all duration-150 shrink-0
        ${
          isSelected
            ? "bg-[#124191] border-[#00ff00] shadow-[0_0_15px_rgba(0,255,0,0.3)]"
            : "bg-[#0a0a0a] hover:bg-[#1a1a1a]"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-xl ${isSelected ? "animate-pulse" : ""}`}
          style={{ color: isSelected ? "#00ff00" : "#666" }}
        >
          {typeIcon}
        </span>
        <span
          className="text-[9px] px-1.5 py-0.5 border"
          style={{ color: difficultyColor, borderColor: difficultyColor }}
        >
          {option.difficulty}
        </span>
      </div>

      {/* Name */}
      <div
        className={`text-xs tracking-wider mb-1 ${
          isSelected ? "text-[#00ff00]" : "text-[#B0B0B0]"
        }`}
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        {option.name}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-2 text-[10px] mt-2">
        <span className="text-[#ff0040]">-${option.cost}</span>
        <span className="text-[#333]">→</span>
        <span className="text-[#00ff00]">+${option.value_increase}</span>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="mt-2 text-center text-[#00ff00] text-[9px] tracking-widest animate-pulse">
          ▶ SELECTED ◀
        </div>
      )}
    </button>
  );
}

// ============================================
// REPAIR VIEW WITH DYNAMIC OVERLAY
// ============================================
interface RepairViewProps {
  imageSrc: string;
  selectedOption: RepairOption;
  overlayKey: number;
}

function RepairView({ imageSrc, selectedOption, overlayKey }: RepairViewProps) {
  return (
    <div className="nokia-border bg-[#0a0a0a] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-[#00ffff] tracking-widest">
          ▣ AR REPAIR PREVIEW
        </span>
        <span className="text-[#666]">{selectedOption.difficulty}</span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-black overflow-hidden">
        {/* Captured Image */}
        <img
          src={imageSrc}
          alt="Captured fabric for repair"
          className="w-full h-full object-cover"
        />

        {/* Dynamic Overlay - Changes based on selection */}
        <DynamicOverlay
          key={overlayKey}
          type={selectedOption.type}
          coordinates={selectedOption.coordinates}
          width={640}
          height={480}
          animated={true}
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
            {selectedOption.name}
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
          <span className="text-[#B0B0B0]">ENDPOINT</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN RESULT PAGE
// ============================================
export default function ResultPage() {
  const router = useRouter();
  const { capturedImage, analysisData, clearSession } = useRepair();
  const { saveRepair } = useRepairHistory();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showOutsource, setShowOutsource] = useState(false);
  const [overlayKey, setOverlayKey] = useState(0);

  // Redirect if no data
  useEffect(() => {
    if (!capturedImage || !analysisData) {
      router.push("/scan");
    }
  }, [capturedImage, analysisData, router]);

  // Reset overlay animation when option changes
  const handleOptionSelect = (index: number) => {
    setSelectedOptionIndex(index);
    setOverlayKey((prev) => prev + 1);
  };

  const handleSaveToWardrobe = async () => {
    if (!analysisData || !capturedImage) return;

    setIsSaving(true);

    try {
      // Save to localStorage via hook
      const selectedOption = analysisData.options[selectedOptionIndex];
      const profit = selectedOption.value_increase - selectedOption.cost;
      const snakePoints = Math.round(selectedOption.value_increase * 1.5);

      // Composite image with overlay
      const compositeImage = await compositeImageWithOverlay(
        capturedImage,
        selectedOption.coordinates,
        selectedOption.type,
        640,
        480
      );

      saveRepair({
        img: compositeImage, // Save composite image with overlay
        profit: profit,
        optionName: selectedOption.name,
        snakePoints: snakePoints,
        fabric: analysisData.fabric,
        technique: selectedOption.type,
      });

      setIsSaving(false);
      setSaved(true);
      setShowDialog(true);
    } catch (error) {
      console.error("Failed to save repair:", error);
      setIsSaving(false);
      // Fallback: save without overlay
      const selectedOption = analysisData.options[selectedOptionIndex];
      const profit = selectedOption.value_increase - selectedOption.cost;
      const snakePoints = Math.round(selectedOption.value_increase * 1.5);

      saveRepair({
        img: capturedImage,
        profit: profit,
        optionName: selectedOption.name,
        snakePoints: snakePoints,
        fabric: analysisData.fabric,
        technique: selectedOption.type,
      });

      setSaved(true);
      setShowDialog(true);
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    // Redirect to profile after dialog closes
    router.push("/profile");
  };

  const handleExportToMarket = () => {
    setShowPassport(true);
  };

  const handleOutsource = () => {
    setShowOutsource(true);
  };

  const handleNewScan = () => {
    clearSession();
    router.push("/scan");
  };

  // Loading state
  if (!capturedImage || !analysisData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#00ff00] text-xl animate-pulse mb-4">
            LOADING...
          </div>
          <div className="text-[#666] text-sm">Retrieving analysis data</div>
        </div>
      </main>
    );
  }

  const selectedOption = analysisData.options[selectedOptionIndex];
  const profit = selectedOption.value_increase - selectedOption.cost;
  const snakeScore = Math.round(selectedOption.value_increase * 1.5);

  return (
    <>
      <main className="min-h-screen flex flex-col p-4">
        {/* Header */}
        <header className="nokia-border bg-[#0a0a0a] p-4 mb-6 shrink-0">
          <div className="flex items-center justify-between">
            <Link href="/scan">
              <Button
                variant="ghost"
                className="text-[#B0B0B0] hover:text-[#00ff00] hover:bg-transparent p-0"
              >
                ◀ RESCAN
              </Button>
            </Link>
            <h1
              className="text-xl text-[#00ff00] tracking-widest"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              ANALYSIS COMPLETE
            </h1>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="text-[#00ffff] hover:text-[#00ff00] hover:bg-transparent p-0 text-xs"
              >
                PROFILE ▶
              </Button>
            </Link>
          </div>
        </header>

        {/* Strategy Selector - Horizontal Scroll */}
        <div className="nokia-border bg-[#0a0a0a] p-4 mb-6 shrink-0">
          <div className="text-[#00ffff] text-sm mb-3 tracking-widest">
            ▣ SELECT REPAIR STRATEGY
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {analysisData.options.map((option, index) => (
              <OptionCard
                key={option.id}
                option={option}
                isSelected={selectedOptionIndex === index}
                onClick={() => handleOptionSelect(index)}
              />
            ))}
          </div>
        </div>

        {/* Repair Guide - Execution Protocol */}
        <div className="mb-6">
          <motion.div
            key={selectedOptionIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RepairGuide selectedOption={selectedOption} />
          </motion.div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Repair Visualization */}
          <RepairView
            imageSrc={capturedImage}
            selectedOption={selectedOption}
            overlayKey={overlayKey}
          />

          {/* Right Column - Business Data & Actions */}
          <div className="space-y-6">
            {/* Business Card - Value Analysis (Updates with selection) */}
            <motion.div
              key={selectedOptionIndex}
              initial={{ opacity: 0.5, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <BusinessCard
                scrapValue={selectedOption.cost}
                upcycledValue={selectedOption.value_increase}
                fabric={analysisData.fabric}
                damageType={analysisData.damageType}
              />
            </motion.div>

            {/* Repair Details */}
            <div className="nokia-border bg-[#0a0a0a] p-4">
              <div className="text-[#00ffff] text-sm mb-3 tracking-widest">
                ▣ REPAIR DETAILS
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">TECHNIQUE</span>
                  <span className="text-[#00ff00]">{selectedOption.name}</span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">EST. TIME</span>
                  <span className="text-[#00ff00]">
                    {selectedOption.time} MIN
                  </span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">DIFFICULTY</span>
                  <span
                    style={{
                      color:
                        selectedOption.difficulty === "LOW"
                          ? "#00ff00"
                          : selectedOption.difficulty === "MED"
                          ? "#ffaa00"
                          : "#ff0040",
                    }}
                  >
                    {selectedOption.difficulty}
                  </span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">SNAKE SCORE</span>
                  <span className="text-[#00ffff]">{snakeScore} ★</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <Button
                  onClick={handleSaveToWardrobe}
                  disabled={isSaving || saved}
                  className="w-full nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white py-6 text-lg tracking-widest"
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◐</span> SAVING...
                    </span>
                  ) : saved ? (
                    <span className="flex items-center gap-2">
                      ✓ SAVED TO WARDROBE
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      💾 SAVE TO WARDROBE
                    </span>
                  )}
                </Button>

                <DialogContent className="nokia-border bg-[#0a0a0a] border-[#333]">
                  <DialogHeader>
                    <DialogTitle className="text-[#00ff00] text-center text-2xl">
                      ✓ REPAIR SAVED
                    </DialogTitle>
                    <DialogDescription className="text-[#B0B0B0] text-center">
                      Your repair has been archived. Snake grows +1!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">🐍</div>
                    <div className="text-[#00ffff] text-xl mb-2">
                      +{snakeScore} XP EARNED
                    </div>
                    <div className="text-[#00ff00] text-lg mb-2">
                      PROFIT: +${profit}
                    </div>
                    <div className="text-[#666] text-xs">
                      VIEW YOUR STATS ON THE PROFILE PAGE
                    </div>
                  </div>
                  <Button
                    onClick={handleDialogClose}
                    className="w-full nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a]"
                  >
                    VIEW PROFILE
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Export to Market */}
              <Button
                onClick={handleExportToMarket}
                className="w-full nokia-button bg-[#00ff00] hover:bg-[#00ffff] text-[#0a0a0a] py-6 text-lg tracking-widest"
              >
                <span className="flex items-center gap-2">
                  📋 EXPORT TO RESALE MARKET
                </span>
              </Button>

              {/* Outsource to Vendor */}
              <Button
                onClick={handleOutsource}
                variant="outline"
                className="w-full nokia-button bg-[#1a1a1a] border-[#ffaa00] text-[#ffaa00] hover:bg-[#ffaa00] hover:text-[#0a0a0a] py-6 text-lg tracking-widest"
              >
                <span className="flex items-center gap-2">
                  🏪 OUTSOURCE TO VENDOR
                </span>
              </Button>

              <Button
                onClick={handleNewScan}
                variant="outline"
                className="w-full nokia-button bg-transparent border-[#333] text-[#B0B0B0] hover:bg-[#1a1a1a] hover:text-[#00ff00] py-6 text-lg tracking-widest"
              >
                📷 NEW SCAN
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-6 nokia-border bg-[#0a0a0a] p-4 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="text-[#666]">
              <span className="text-[#124191]">ID:</span>{" "}
              {analysisData.analysisId}
            </div>
            <Link href="/" className="text-[#00ffff] hover:text-[#00ff00]">
              ◀ MAIN MENU
            </Link>
          </div>
        </footer>
      </main>

      {/* Digital Passport Overlay */}
      <AnimatePresence>
        {showPassport && (
          <DigitalPassport
            analysisData={{
              fabric: analysisData.fabric,
              damageType: analysisData.damageType,
              repairTechnique: selectedOption.name,
              snakeScore: snakeScore,
              marketValueRepaired: selectedOption.value_increase,
              difficulty: selectedOption.difficulty,
              timestamp: analysisData.timestamp,
              analysisId: analysisData.analysisId,
            }}
            imageSrc={capturedImage}
            onClose={() => setShowPassport(false)}
          />
        )}
      </AnimatePresence>

      {/* Outsource View Overlay */}
      <AnimatePresence>
        {showOutsource && (
          <OutsourceView
            imageSrc={capturedImage}
            selectedOption={selectedOption}
            onClose={() => setShowOutsource(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
