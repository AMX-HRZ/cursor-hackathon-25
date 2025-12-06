"use client";

import { RepairOption } from "@/app/api/analyze/route";
import OutsourceView from "@/components/results/OutsourceView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRepair } from "@/context/RepairContext";
import { useRepairHistory } from "@/hooks/useRepairHistory";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const router = useRouter();
  const {
    capturedImage,
    analysisData,
    techPack,
    generateTechPack,
    clearSession,
  } = useRepair();
  const { saveRepair } = useRepairHistory();

  const [showTechPack, setShowTechPack] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showOutsource, setShowOutsource] = useState(false);
  const [repairOptions, setRepairOptions] = useState<RepairOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<RepairOption | null>(
    null
  );

  // Redirect if no data
  useEffect(() => {
    if (!capturedImage || !analysisData) {
      router.push("/scan");
    }
  }, [capturedImage, analysisData, router]);

  // Fetch repair options when analysis data is available
  useEffect(() => {
    if (!capturedImage || !analysisData) return;

    const fetchOptions = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: capturedImage }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.options && Array.isArray(data.options)) {
            setRepairOptions(data.options);
            // Default to first option (usually the premium one)
            if (data.options.length > 0) {
              setSelectedOption(data.options[0]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch repair options:", error);
        // Use default option if fetch fails
        const defaultOption: RepairOption = {
          id: 1,
          name: "PREMIUM EMBROIDERY",
          description: "Premium decorative embroidery",
          type: "trend",
          cost: 20,
          value_increase: 85,
          time: 5,
          difficulty: "MED",
          coordinates: [],
          steps: [],
        };
        setRepairOptions([defaultOption]);
        setSelectedOption(defaultOption);
      }
    };

    fetchOptions();
  }, [capturedImage, analysisData]);

  const handleGenerateTechPack = async () => {
    await generateTechPack();
  };

  const handleSaveToWardrobe = async () => {
    if (!analysisData || !capturedImage) return;

    setIsSaving(true);

    try {
      const imageToSave = techPack?.image || capturedImage;

      saveRepair({
        img: imageToSave,
        profit: 45,
        optionName: "PREMIUM EMBROIDERY",
        snakePoints: 75,
        fabric: analysisData.fabric,
        technique: "trend",
      });

      setIsSaving(false);
      setSaved(true);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to save:", error);
      setIsSaving(false);
    }
  };

  const handleNewScan = () => {
    clearSession();
    router.push("/scan");
  };

  // Loading state
  if (!capturedImage || !analysisData) {
    return (
      <main className="min-h-screen flex items-center justify-center dot-grid-bg">
        <div className="text-center">
          <div
            className="w-12 h-12 mx-auto mb-4 rounded-full animate-spin"
            style={{ border: "3px solid #E5E7EB", borderTopColor: "#124191" }}
          />
          <p className="font-mono-tech" style={{ color: "#6B7280" }}>
            Loading analysis...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col dot-grid-bg">
      {/* ============================================ */}
      {/* NAV BAR */}
      {/* ============================================ */}
      <nav
        className="bg-white border-b-2 sticky top-0 z-50"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-lg font-bold">R</span>
              </div>
              <div className="flex flex-col">
                <span
                  className="text-lg font-bold tracking-wider leading-none font-pixel"
                  style={{ color: "#1A1A1A" }}
                >
                  RETHREAD
                </span>
                <span
                  className="text-[10px] tracking-widest"
                  style={{ color: "#A1A1C2" }}
                >
                  × NOKIA INNOVATION
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{ background: "#DCFCE7", border: "2px solid #166534" }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse-tech"
                  style={{ background: "#22C55E" }}
                />
                <span
                  className="text-xs font-bold tracking-wider font-mono-tech"
                  style={{ color: "#166534" }}
                >
                  ANALYSIS COMPLETE
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="tech-badge tech-badge-green mb-3">
              <span className="mr-2">✓</span>
              GARMENT ANALYZED
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Repair Plan Ready
            </h1>
            <p className="text-sm font-mono-tech" style={{ color: "#6B7280" }}>
              Your garment has been analyzed. Generate a tech pack or save to
              your wardrobe.
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Original Image & Analysis */}
            <div className="space-y-6">
              {/* Captured Image Card */}
              <div className="tech-card">
                <div className="tech-card-header flex items-center justify-between">
                  <span>/// CAPTURED_IMAGE</span>
                  <span className="text-[10px]">
                    {new Date(analysisData.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="lcd-display m-4">
                  <img
                    src={capturedImage}
                    alt="Captured garment"
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div
                  className="p-4 border-t-2 flex items-center justify-between"
                  style={{ borderColor: "#1A1A1A", background: "#F9FAFB" }}
                >
                  <span
                    className="text-xs font-mono-tech"
                    style={{ color: "#6B7280" }}
                  >
                    ID: {analysisData.analysisId}
                  </span>
                  <span
                    className="text-xs font-mono-tech font-bold"
                    style={{ color: "#166534" }}
                  >
                    ✓ REPAIRABLE
                  </span>
                </div>
              </div>

              {/* Analysis Results */}
              <div className="tech-card">
                <div
                  className="tech-card-header"
                  style={{ background: "#7C3AED" }}
                >
                  /// ANALYSIS_RESULTS
                </div>
                <div className="tech-card-body p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4 rounded-sm"
                      style={{
                        background: "#F9FAFB",
                        border: "2px solid #E5E7EB",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono-tech tracking-wider block mb-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        FABRIC TYPE
                      </span>
                      <span
                        className="font-bold font-pixel"
                        style={{ color: "#1A1A1A" }}
                      >
                        {analysisData.fabric}
                      </span>
                    </div>
                    <div
                      className="p-4 rounded-sm"
                      style={{
                        background: "#F9FAFB",
                        border: "2px solid #E5E7EB",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono-tech tracking-wider block mb-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        DAMAGE TYPE
                      </span>
                      <span
                        className="font-bold font-pixel"
                        style={{ color: "#DC2626" }}
                      >
                        {analysisData.damageType}
                      </span>
                    </div>
                    <div
                      className="p-4 rounded-sm"
                      style={{
                        background: "#F9FAFB",
                        border: "2px solid #E5E7EB",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono-tech tracking-wider block mb-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        REPAIR METHOD
                      </span>
                      <span
                        className="font-bold font-pixel"
                        style={{ color: "#7C3AED" }}
                      >
                        EMBROIDERY
                      </span>
                    </div>
                    <div
                      className="p-4 rounded-sm"
                      style={{
                        background: "#F9FAFB",
                        border: "2px solid #E5E7EB",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono-tech tracking-wider block mb-1"
                        style={{ color: "#9CA3AF" }}
                      >
                        DIFFICULTY
                      </span>
                      <span
                        className="font-bold font-pixel"
                        style={{ color: "#FF5500" }}
                      >
                        MEDIUM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Tech Pack Generator */}
            <div className="space-y-6">
              {/* Tech Pack Card */}
              <div className="tech-card">
                <div
                  className="tech-card-header flex items-center justify-between"
                  style={{ background: "#166534" }}
                >
                  <span>/// TECH_PACK_GENERATOR</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]">GEMINI AI</span>
                    <span>✨</span>
                  </div>
                </div>

                <div className="tech-card-body p-5">
                  {/* Not generated yet */}
                  {!techPack?.image &&
                    !techPack?.isLoading &&
                    !techPack?.error && (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">✨</div>
                        <h3
                          className="font-bold font-pixel mb-2 text-lg"
                          style={{ color: "#1A1A1A" }}
                        >
                          Premium Embroidery Design
                        </h3>
                        <p
                          className="text-sm font-mono-tech mb-6 max-w-sm mx-auto leading-relaxed"
                          style={{ color: "#6B7280" }}
                        >
                          Generate a tech pack with premium decorative
                          embroidery that transforms the defect into a
                          limited-edition design.
                        </p>
                        <Button
                          onClick={handleGenerateTechPack}
                          className="nokia-btn nokia-btn-success px-8 py-4 text-sm font-pixel"
                        >
                          ✨ GENERATE DESIGN
                        </Button>
                      </div>
                    )}

                  {/* Loading */}
                  {techPack?.isLoading && (
                    <div className="text-center py-12">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <div
                          className="absolute inset-0 rounded-full animate-spin"
                          style={{
                            border: "3px solid #E5E7EB",
                            borderTopColor: "#7C3AED",
                          }}
                        />
                        <div className="absolute inset-2 flex items-center justify-center">
                          <span className="text-3xl animate-pulse">✨</span>
                        </div>
                      </div>
                      <p
                        className="font-pixel text-sm animate-pulse"
                        style={{ color: "#7C3AED" }}
                      >
                        DESIGNING...
                      </p>
                      <p
                        className="text-xs font-mono-tech mt-2"
                        style={{ color: "#6B7280" }}
                      >
                        Creating premium embroidery design
                      </p>
                    </div>
                  )}

                  {/* Error */}
                  {techPack?.error && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">⚠️</div>
                      <h3
                        className="font-bold font-pixel mb-2"
                        style={{ color: "#DC2626" }}
                      >
                        Generation Failed
                      </h3>
                      <p
                        className="text-sm font-mono-tech mb-4"
                        style={{ color: "#6B7280" }}
                      >
                        {techPack.error}
                      </p>
                      <Button
                        onClick={handleGenerateTechPack}
                        className="nokia-btn nokia-btn-alert px-6 py-3 text-sm font-pixel"
                      >
                        TRY AGAIN
                      </Button>
                    </div>
                  )}

                  {/* Generated Tech Pack */}
                  {techPack?.image && !techPack.isLoading && (
                    <div>
                      {/* Toggle View */}
                      <div className="flex justify-center gap-2 mb-4">
                        <button
                          onClick={() => setShowTechPack(true)}
                          className="px-4 py-2 text-xs font-mono-tech tracking-wider rounded-sm transition-all"
                          style={{
                            background: showTechPack ? "#166534" : "#F3F4F6",
                            color: showTechPack ? "#FFFFFF" : "#4B5563",
                            border: `2px solid ${
                              showTechPack ? "#166534" : "#E5E7EB"
                            }`,
                          }}
                        >
                          TECH PACK
                        </button>
                        <button
                          onClick={() => setShowTechPack(false)}
                          className="px-4 py-2 text-xs font-mono-tech tracking-wider rounded-sm transition-all"
                          style={{
                            background: !showTechPack ? "#124191" : "#F3F4F6",
                            color: !showTechPack ? "#FFFFFF" : "#4B5563",
                            border: `2px solid ${
                              !showTechPack ? "#124191" : "#E5E7EB"
                            }`,
                          }}
                        >
                          ORIGINAL
                        </button>
                      </div>

                      {/* Image Display */}
                      <div className="lcd-display relative overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={showTechPack ? "techpack" : "original"}
                            src={showTechPack ? techPack.image : capturedImage}
                            alt={showTechPack ? "Tech pack" : "Original"}
                            className="w-full h-auto object-contain"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        </AnimatePresence>
                        <div
                          className="absolute top-3 left-3 px-3 py-1 rounded-sm text-xs font-mono-tech"
                          style={{
                            background: showTechPack ? "#166534" : "#124191",
                            color: "#FFFFFF",
                          }}
                        >
                          {showTechPack ? "TECH PACK" : "ORIGINAL"}
                        </div>
                      </div>

                      {/* Regenerate */}
                      <div className="mt-4 text-center">
                        <Button
                          onClick={handleGenerateTechPack}
                          variant="outline"
                          className="text-xs font-mono-tech"
                          style={{ borderColor: "#166534", color: "#166534" }}
                        >
                          🔄 REGENERATE
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Premium Embroidery Info Card */}
              <div className="tech-card" style={{ borderColor: "#7C3AED" }}>
                <div
                  className="tech-card-header"
                  style={{ background: "#7C3AED" }}
                >
                  /// DESIGN_APPROACH
                </div>
                <div className="tech-card-body p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 flex items-center justify-center rounded-sm shrink-0 text-2xl"
                      style={{
                        background: "#F3E8FF",
                        border: "2px solid #7C3AED",
                      }}
                    >
                      👑
                    </div>
                    <div>
                      <h3
                        className="font-bold font-pixel mb-1"
                        style={{ color: "#7C3AED" }}
                      >
                        Premium Embroidery
                      </h3>
                      <p
                        className="text-sm font-mono-tech leading-relaxed"
                        style={{ color: "#4B5563" }}
                      >
                        Folk art & ceremonial motifs transform defects into
                        intentional, limited-edition designs. High-fashion meets
                        heritage craftsmanship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="tech-card">
            <div className="tech-card-header">/// ACTIONS</div>
            <div className="tech-card-body p-5">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Dialog
                  open={showSuccessDialog}
                  onOpenChange={setShowSuccessDialog}
                >
                  <Button
                    onClick={handleSaveToWardrobe}
                    disabled={isSaving || saved}
                    className="nokia-btn nokia-btn-primary w-full py-5 text-sm font-pixel"
                  >
                    {isSaving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">◐</span> SAVING...
                      </span>
                    ) : saved ? (
                      <span>✓ SAVED</span>
                    ) : (
                      <span>SAVE</span>
                    )}
                  </Button>

                  <DialogContent className="tech-card border-0">
                    <DialogHeader>
                      <DialogTitle
                        className="text-center text-2xl font-pixel"
                        style={{ color: "#166534" }}
                      >
                        ✓ Saved Successfully!
                      </DialogTitle>
                      <DialogDescription className="text-center font-mono-tech">
                        Your repair has been added to your wardrobe.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="text-center py-6">
                      <div className="text-6xl mb-4">🐍</div>
                      <div
                        className="text-xl mb-2 font-pixel"
                        style={{ color: "#124191" }}
                      >
                        +75 XP EARNED
                      </div>
                      <div
                        className="text-lg font-pixel"
                        style={{ color: "#166534" }}
                      >
                        +$45 VALUE ADDED
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push("/profile")}
                      className="nokia-btn nokia-btn-success w-full"
                    >
                      VIEW PROFILE
                    </Button>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleNewScan}
                  className="nokia-btn w-full py-5 text-sm font-pixel"
                  style={{
                    background:
                      "linear-gradient(180deg, #F9FAFB 0%, #E5E7EB 100%)",
                    borderColor: "#1A1A1A",
                    color: "#1A1A1A",
                  }}
                >
                  NEW SCAN
                </Button>

                <Button
                  onClick={() => setShowOutsource(true)}
                  className="nokia-btn nokia-btn-primary w-full py-5 text-sm font-pixel"
                  disabled={!selectedOption}
                >
                  OUTSOURCE
                </Button>

                <Link href="/" className="block">
                  <Button
                    variant="outline"
                    className="w-full py-5 text-sm font-pixel"
                    style={{ borderColor: "#9CA3AF", color: "#6B7280" }}
                  >
                    ← BACK TO HOME
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="mt-6 text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm"
              style={{ background: "#DCFCE7", border: "2px solid #166534" }}
            >
              <span>🌍</span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#166534" }}
              >
                By repairing this item, you&apos;re saving approximately{" "}
                <strong>20kg CO₂</strong> and <strong>2,700L of water</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer
        className="bg-white border-t-2 py-4 px-6"
        style={{ borderColor: "#1A1A1A" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center rounded-sm"
                style={{ background: "#124191" }}
              >
                <span className="text-white text-sm font-bold">R</span>
              </div>
              <span
                className="font-bold tracking-wider font-pixel"
                style={{ color: "#1A1A1A" }}
              >
                RETHREAD
              </span>
              <span style={{ color: "#D1D5DB" }}>×</span>
              <span
                className="text-sm font-mono-tech"
                style={{ color: "#6B7280" }}
              >
                Nokia Innovation
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm font-mono-tech">
              <Link
                href="/scan"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#124191" }}
              >
                Scanner
              </Link>
              <Link
                href="/profile"
                className="font-bold tracking-wider hover:opacity-70 transition-opacity"
                style={{ color: "#7C3AED" }}
              >
                Profile
              </Link>
              <span style={{ color: "#D1D5DB" }}>|</span>
              <span className="font-bold" style={{ color: "#166534" }}>
                🌍 For the Planet
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Outsource View Modal */}
      {showOutsource && selectedOption && capturedImage && (
        <OutsourceView
          imageSrc={capturedImage}
          selectedOption={selectedOption}
          onClose={() => setShowOutsource(false)}
        />
      )}
    </main>
  );
}
