"use client";

import BusinessCard from "@/components/results/BusinessCard";
import DigitalPassport from "@/components/results/DigitalPassport";
import RepairView from "@/components/results/RepairView";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRepair } from "@/context/RepairContext";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const router = useRouter();
  const { capturedImage, analysisData, clearSession } = useRepair();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showPassport, setShowPassport] = useState(false);

  // Redirect if no data
  useEffect(() => {
    if (!capturedImage || !analysisData) {
      router.push("/scan");
    }
  }, [capturedImage, analysisData, router]);

  const handleSaveToWardrobe = async () => {
    if (!analysisData) return;

    setIsSaving(true);

    // Simulate saving to database
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In production, save to Prisma here
    // await fetch('/api/repairs', { method: 'POST', body: JSON.stringify({...}) })

    setIsSaving(false);
    setSaved(true);
    setShowDialog(true);
  };

  const handleExportToMarket = () => {
    setShowPassport(true);
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
            <div className="flex items-center gap-2">
              <span className="text-[#00ff00]">✓</span>
              <span className="text-[#666] text-xs">DONE</span>
            </div>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Repair Visualization */}
          <RepairView
            imageSrc={capturedImage}
            coordinates={analysisData.coordinates}
            repairTechnique={analysisData.repairTechnique}
            difficulty={analysisData.difficulty}
          />

          {/* Right Column - Business Data & Actions */}
          <div className="space-y-6">
            {/* Business Card - Value Analysis */}
            <BusinessCard
              scrapValue={analysisData.marketValueOriginal}
              upcycledValue={analysisData.marketValueRepaired}
              fabric={analysisData.fabric}
              damageType={analysisData.damageType}
            />

            {/* Analysis Details */}
            <div className="nokia-border bg-[#0a0a0a] p-4">
              <div className="text-[#00ffff] text-sm mb-3 tracking-widest">
                ▣ REPAIR DETAILS
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">TECHNIQUE</span>
                  <span className="text-[#00ff00]">
                    {analysisData.repairTechnique}
                  </span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">STITCHES</span>
                  <span className="text-[#00ff00]">
                    {analysisData.coordinates.length - 1}
                  </span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">DIFFICULTY</span>
                  <span className="text-[#ffaa00]">
                    {analysisData.difficulty}
                  </span>
                </div>
                <div className="bg-[#1a1a1a] border border-[#333] p-3">
                  <span className="text-[#666] block mb-1">SNAKE SCORE</span>
                  <span className="text-[#00ffff]">
                    {analysisData.snakeScore} ★
                  </span>
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
                      Your repair plan has been saved to your digital wardrobe.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-center py-4">
                    <div className="text-6xl mb-4">🐍</div>
                    <div className="text-[#00ffff] text-xl mb-2">
                      SNAKE SCORE: {analysisData.snakeScore}
                    </div>
                    <div className="text-[#00ff00] text-lg mb-2">
                      VALUE INCREASE: +$
                      {analysisData.marketValueRepaired -
                        analysisData.marketValueOriginal}
                    </div>
                    <div className="text-[#666] text-xs">
                      KEEP REPAIRING TO INCREASE YOUR SCORE!
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowDialog(false)}
                    className="w-full nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a]"
                  >
                    CONTINUE
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Export to Resale Market - Shows Digital Passport */}
              <Button
                onClick={handleExportToMarket}
                className="w-full nokia-button bg-[#00ff00] hover:bg-[#00ffff] text-[#0a0a0a] py-6 text-lg tracking-widest"
              >
                <span className="flex items-center gap-2">
                  📋 EXPORT TO RESALE MARKET
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
            analysisData={analysisData}
            imageSrc={capturedImage}
            onClose={() => setShowPassport(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
