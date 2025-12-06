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
// COMPACT OPTION CARD COMPONENT - Y2K Style
// ============================================
interface OptionCardProps {
  option: RepairOption;
  isSelected: boolean;
  onClick: () => void;
}

function OptionCard({ option, isSelected, onClick }: OptionCardProps) {
  const difficultyColor = {
    LOW: "#39ff14",
    MED: "#ffaa00",
    HIGH: "#ff0055",
  }[option.difficulty];

  const typeIcon = {
    basic: "▣",
    trend: "✿",
    cyber: "◈",
  }[option.type];

  const typeColor = {
    basic: "#00e5ff",
    trend: "#ff00aa",
    cyber: "#9d00ff",
  }[option.type];

  return (
    <button
      onClick={onClick}
      className="min-w-[180px] p-4 text-left transition-all duration-200 shrink-0 nokia-border"
      style={{
        background: isSelected 
          ? `linear-gradient(135deg, ${typeColor}20 0%, rgba(0, 20, 40, 0.9) 100%)`
          : 'rgba(0, 20, 40, 0.9)',
        borderColor: isSelected ? typeColor : 'rgba(0, 229, 255, 0.2)',
        boxShadow: isSelected 
          ? `0 0 30px ${typeColor}40, inset 0 0 20px ${typeColor}10`
          : '0 0 10px rgba(0, 229, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-2xl ${isSelected ? "animate-pulse" : ""}`}
          style={{ 
            color: isSelected ? typeColor : "#666",
            filter: isSelected ? `drop-shadow(0 0 10px ${typeColor})` : 'none'
          }}
        >
          {typeIcon}
        </span>
        <span
          className="text-[9px] px-2 py-0.5 tracking-wider"
          style={{ 
            color: difficultyColor, 
            border: `1px solid ${difficultyColor}`,
            boxShadow: `0 0 5px ${difficultyColor}40`
          }}
        >
          {option.difficulty}
        </span>
      </div>

      {/* Name */}
      <div
        className="text-xs tracking-wider mb-2"
        style={{ 
          fontFamily: "var(--font-pixel)",
          color: isSelected ? typeColor : "#c0c0c0",
          textShadow: isSelected ? `0 0 10px ${typeColor}80` : 'none'
        }}
      >
        {option.name}
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 text-[10px] mt-3">
        <span style={{ color: '#ff0055' }}>-${option.cost}</span>
        <span className="text-[#333]">→</span>
        <span style={{ color: '#39ff14', textShadow: '0 0 5px rgba(57, 255, 20, 0.5)' }}>
          +${option.value_increase}
        </span>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div 
          className="mt-3 text-center text-[9px] tracking-[0.2em] animate-pulse"
          style={{ color: typeColor }}
        >
          ▶ SELECTED ◀
        </div>
      )}
    </button>
  );
}

// ============================================
// REPAIR VIEW WITH DYNAMIC OVERLAY - Y2K Style
// ============================================
interface RepairViewProps {
  imageSrc: string;
  selectedOption: RepairOption;
  overlayKey: number;
}

function RepairView({ imageSrc, selectedOption, overlayKey }: RepairViewProps) {
  const typeColor = {
    basic: "#00e5ff",
    trend: "#ff00aa",
    cyber: "#9d00ff",
  }[selectedOption.type];

  return (
    <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2"
            style={{
              backgroundColor: typeColor,
              boxShadow: `0 0 10px ${typeColor}`
            }}
          />
          <span 
            className="tracking-[0.2em]"
            style={{ color: typeColor }}
          >
            AR REPAIR PREVIEW
          </span>
        </div>
        <span className="text-[#666] tracking-wider">{selectedOption.difficulty}</span>
      </div>

      {/* Image Container with Y2K Frame */}
      <div 
        className="relative aspect-[4/3] overflow-hidden"
        style={{
          border: `2px solid ${typeColor}`,
          boxShadow: `0 0 20px ${typeColor}30, inset 0 0 30px rgba(0, 0, 0, 0.5)`
        }}
      >
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

        {/* Viewfinder Corners - Y2K Colors */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute top-4 left-4 w-10 h-10"
            style={{
              borderTop: `3px solid ${typeColor}`,
              borderLeft: `3px solid ${typeColor}`,
              filter: `drop-shadow(0 0 5px ${typeColor})`
            }}
          />
          <div 
            className="absolute top-4 right-4 w-10 h-10"
            style={{
              borderTop: `3px solid #ff00aa`,
              borderRight: `3px solid #ff00aa`,
              filter: 'drop-shadow(0 0 5px #ff00aa)'
            }}
          />
          <div 
            className="absolute bottom-4 left-4 w-10 h-10"
            style={{
              borderBottom: `3px solid #9d00ff`,
              borderLeft: `3px solid #9d00ff`,
              filter: 'drop-shadow(0 0 5px #9d00ff)'
            }}
          />
          <div 
            className="absolute bottom-4 right-4 w-10 h-10"
            style={{
              borderBottom: `3px solid #39ff14`,
              borderRight: `3px solid #39ff14`,
              filter: 'drop-shadow(0 0 5px #39ff14)'
            }}
          />
        </div>

        {/* Technique Badge */}
        <div 
          className="absolute top-4 right-16 px-3 py-1"
          style={{
            backgroundColor: 'rgba(4, 8, 16, 0.9)',
            border: `1px solid ${typeColor}`,
            boxShadow: `0 0 15px ${typeColor}30`
          }}
        >
          <span 
            className="text-xs tracking-wider"
            style={{ color: typeColor }}
          >
            {selectedOption.name}
          </span>
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="absolute top-1/3 left-0 right-0 h-[1px]"
            style={{ backgroundColor: typeColor }}
          />
          <div 
            className="absolute top-2/3 left-0 right-0 h-[1px]"
            style={{ backgroundColor: typeColor }}
          />
          <div 
            className="absolute left-1/3 top-0 bottom-0 w-[1px]"
            style={{ backgroundColor: typeColor }}
          />
          <div 
            className="absolute left-2/3 top-0 bottom-0 w-[1px]"
            style={{ backgroundColor: typeColor }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-8 text-xs">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-[3px]"
            style={{
              background: `linear-gradient(90deg, ${typeColor} 0%, #39ff14 100%)`,
              boxShadow: `0 0 10px ${typeColor}`
            }}
          />
          <span className="text-[#c0c0c0] tracking-wider">STITCH PATH</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full animate-pulse"
            style={{
              backgroundColor: '#39ff14',
              boxShadow: '0 0 10px #39ff14'
            }}
          />
          <span className="text-[#c0c0c0] tracking-wider">ENDPOINT</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN RESULT PAGE - Y2K Style
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
      const selectedOption = analysisData.options[selectedOptionIndex];
      const profit = selectedOption.value_increase - selectedOption.cost;
      const snakePoints = Math.round(selectedOption.value_increase * 1.5);

      const compositeImage = await compositeImageWithOverlay(
        capturedImage,
        selectedOption.coordinates,
        selectedOption.type,
        640,
        480
      );

      saveRepair({
        img: compositeImage,
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

  // Loading state - Y2K Style
  if (!capturedImage || !analysisData) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div 
            className="text-xl animate-pulse mb-4 tracking-widest"
            style={{
              color: '#00e5ff',
              textShadow: '0 0 20px rgba(0, 229, 255, 0.5)'
            }}
          >
            LOADING...
          </div>
          <div className="text-[#666] text-sm tracking-wider">Retrieving analysis data</div>
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
        {/* Header - Y2K Style */}
        <header className="nokia-border bg-[rgba(0,20,40,0.9)] p-4 mb-6 shrink-0">
          <div className="flex items-center justify-between">
            <Link href="/scan">
              <Button
                variant="ghost"
                className="text-[#c0c0c0] hover:text-[#00e5ff] hover:bg-transparent p-0"
              >
                ◀ RESCAN
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div 
                className="w-2 h-2 animate-pulse"
                style={{
                  backgroundColor: '#39ff14',
                  boxShadow: '0 0 10px #39ff14'
                }}
              />
              <h1
                className="text-xl tracking-widest"
                style={{ 
                  fontFamily: "var(--font-pixel)",
                  color: '#39ff14',
                  textShadow: '0 0 20px rgba(57, 255, 20, 0.5), -1px 0 #00e5ff, 1px 0 #ff00aa'
                }}
              >
                ANALYSIS COMPLETE
              </h1>
            </div>
            <Link href="/profile">
              <Button
                variant="ghost"
                className="text-[#00e5ff] hover:text-[#39ff14] hover:bg-transparent p-0 text-xs tracking-widest"
              >
                PROFILE ▶
              </Button>
            </Link>
          </div>
        </header>

        {/* Strategy Selector - Horizontal Scroll with Y2K Style */}
        <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4 mb-6 shrink-0">
          <div className="flex items-center gap-2 mb-4">
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
              SELECT REPAIR STRATEGY
            </span>
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
            {/* Business Card */}
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

            {/* Repair Details - Y2K Grid */}
            <div className="nokia-border bg-[rgba(0,20,40,0.9)] p-4">
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-2 h-2"
                  style={{
                    backgroundColor: '#9d00ff',
                    boxShadow: '0 0 5px #9d00ff'
                  }}
                />
                <span 
                  className="text-sm tracking-[0.2em]"
                  style={{ color: '#9d00ff' }}
                >
                  REPAIR DETAILS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div 
                  className="p-3"
                  style={{
                    background: 'rgba(0, 30, 60, 0.6)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                >
                  <span className="text-[#666] block mb-1 tracking-wider">TECHNIQUE</span>
                  <span style={{ color: '#00e5ff' }}>{selectedOption.name}</span>
                </div>
                <div 
                  className="p-3"
                  style={{
                    background: 'rgba(0, 30, 60, 0.6)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                >
                  <span className="text-[#666] block mb-1 tracking-wider">EST. TIME</span>
                  <span style={{ color: '#ffaa00' }}>
                    {selectedOption.time} MIN
                  </span>
                </div>
                <div 
                  className="p-3"
                  style={{
                    background: 'rgba(0, 30, 60, 0.6)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                >
                  <span className="text-[#666] block mb-1 tracking-wider">DIFFICULTY</span>
                  <span
                    style={{
                      color: selectedOption.difficulty === "LOW"
                        ? "#39ff14"
                        : selectedOption.difficulty === "MED"
                        ? "#ffaa00"
                        : "#ff0055",
                      textShadow: `0 0 5px ${
                        selectedOption.difficulty === "LOW"
                          ? "#39ff14"
                          : selectedOption.difficulty === "MED"
                          ? "#ffaa00"
                          : "#ff0055"
                      }50`
                    }}
                  >
                    {selectedOption.difficulty}
                  </span>
                </div>
                <div 
                  className="p-3"
                  style={{
                    background: 'rgba(0, 30, 60, 0.6)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}
                >
                  <span className="text-[#666] block mb-1 tracking-wider">SNAKE SCORE</span>
                  <span 
                    style={{ 
                      color: '#ff00aa',
                      textShadow: '0 0 5px rgba(255, 0, 170, 0.5)'
                    }}
                  >
                    {snakeScore} ★
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Y2K Style */}
            <div className="space-y-3">
              <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <Button
                  onClick={handleSaveToWardrobe}
                  disabled={isSaving || saved}
                  className="w-full py-6 text-lg tracking-widest"
                  style={{
                    background: saved 
                      ? 'linear-gradient(180deg, rgba(57, 255, 20, 0.2) 0%, rgba(0, 30, 60, 0.9) 100%)'
                      : 'linear-gradient(180deg, #003b7a 0%, #001a33 50%, #003b7a 100%)',
                    borderColor: saved ? '#39ff14' : '#00e5ff',
                    color: saved ? '#39ff14' : '#00e5ff'
                  }}
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

                <DialogContent 
                  className="nokia-border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.95) 0%, rgba(0, 20, 40, 0.98) 100%)',
                    borderColor: 'rgba(57, 255, 20, 0.5)',
                    boxShadow: '0 0 60px rgba(57, 255, 20, 0.2)'
                  }}
                >
                  <DialogHeader>
                    <DialogTitle 
                      className="text-center text-2xl tracking-widest"
                      style={{ 
                        color: '#39ff14',
                        textShadow: '0 0 20px rgba(57, 255, 20, 0.8)'
                      }}
                    >
                      ✓ REPAIR SAVED
                    </DialogTitle>
                    <DialogDescription className="text-[#c0c0c0] text-center tracking-wider">
                      Your repair has been archived. Snake grows +1!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-center py-6">
                    <div 
                      className="text-7xl mb-4"
                      style={{ filter: 'drop-shadow(0 0 20px #39ff14)' }}
                    >
                      🐍
                    </div>
                    <div 
                      className="text-2xl mb-3 tracking-widest"
                      style={{ 
                        color: '#00e5ff',
                        textShadow: '0 0 15px rgba(0, 229, 255, 0.5)'
                      }}
                    >
                      +{snakeScore} XP EARNED
                    </div>
                    <div 
                      className="text-xl mb-3 tracking-widest"
                      style={{ 
                        color: '#39ff14',
                        textShadow: '0 0 15px rgba(57, 255, 20, 0.5)'
                      }}
                    >
                      PROFIT: +${profit}
                    </div>
                    <div className="text-[#666] text-xs tracking-wider">
                      VIEW YOUR STATS ON THE PROFILE PAGE
                    </div>
                  </div>
                  <Button
                    onClick={handleDialogClose}
                    className="w-full"
                  >
                    VIEW PROFILE
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Export to Market */}
              <Button
                onClick={handleExportToMarket}
                className="w-full py-6 text-lg tracking-widest"
                style={{
                  background: 'linear-gradient(180deg, rgba(57, 255, 20, 0.2) 0%, rgba(0, 30, 60, 0.9) 100%)',
                  borderColor: '#39ff14',
                  color: '#39ff14'
                }}
              >
                <span className="flex items-center gap-2">
                  📋 EXPORT TO RESALE MARKET
                </span>
              </Button>

              {/* Outsource to Vendor */}
              <Button
                onClick={handleOutsource}
                variant="outline"
                className="w-full py-6 text-lg tracking-widest"
                style={{
                  background: 'transparent',
                  borderColor: '#ffaa00',
                  color: '#ffaa00'
                }}
              >
                <span className="flex items-center gap-2">
                  🏪 OUTSOURCE TO VENDOR
                </span>
              </Button>

              <Button
                onClick={handleNewScan}
                variant="ghost"
                className="w-full py-6 text-lg tracking-widest text-[#666] hover:text-[#00e5ff]"
              >
                📷 NEW SCAN
              </Button>
            </div>
          </div>
        </div>

        {/* Footer - Y2K Style */}
        <footer className="mt-6 nokia-border bg-[rgba(0,20,40,0.9)] p-4 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="text-[#666]">
              <span style={{ color: '#9d00ff' }}>ID:</span>{" "}
              <span className="tracking-wider">{analysisData.analysisId}</span>
            </div>
            <Link 
              href="/" 
              className="tracking-widest hover:text-[#39ff14] transition-colors"
              style={{ color: '#00e5ff' }}
            >
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
