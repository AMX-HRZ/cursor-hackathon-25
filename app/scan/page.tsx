"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraView from "@/components/CameraView";
import ScanningOverlay from "@/components/scanner/ScanningOverlay";
import { Button } from "@/components/ui/button";
import { useRepair } from "@/context/RepairContext";

export default function ScanPage() {
  const router = useRouter();
  const { startAnalysis, isAnalyzing } = useRepair();
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleCapture = useCallback(async (imageSrc: string) => {
    setShowScanner(true);
    setScanError(null);

    try {
      // Start analysis in the background
      await startAnalysis(imageSrc);
    } catch (error) {
      console.error("Analysis failed:", error);
      setScanError(error instanceof Error ? error.message : "Analysis failed");
    }
  }, [startAnalysis]);

  const handleScanComplete = useCallback(() => {
    if (!scanError) {
      router.push("/result");
    } else {
      setShowScanner(false);
    }
  }, [router, scanError]);

  return (
    <main className="min-h-screen flex flex-col p-4">
      {/* Scanning Overlay */}
      <ScanningOverlay 
        isActive={showScanner} 
        onComplete={handleScanComplete}
      />

      {/* Header */}
      <header className="nokia-border bg-[#0a0a0a] p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#B0B0B0] hover:text-[#00ff00] hover:bg-transparent p-0"
            >
              ◀ BACK
            </Button>
          </Link>
          <h1
            className="text-xl text-[#00ff00] tracking-widest"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            SCAN MODE
          </h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${isAnalyzing ? "bg-[#ffaa00]" : "bg-[#00ff00]"} animate-pulse`} />
            <span className="text-[#666] text-xs">{isAnalyzing ? "BUSY" : "LIVE"}</span>
          </div>
        </div>
      </header>

      {/* Error Display */}
      {scanError && (
        <div className="nokia-border bg-[#1a1a1a] border-[#ff0040] p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-[#ff0040] text-xl">⚠</span>
            <div>
              <div className="text-[#ff0040] text-sm">ANALYSIS ERROR</div>
              <div className="text-[#B0B0B0] text-xs">{scanError}</div>
            </div>
          </div>
          <Button
            onClick={() => setScanError(null)}
            className="mt-3 nokia-button bg-[#333] hover:bg-[#444] text-[#B0B0B0] text-xs"
          >
            TRY AGAIN
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          <CameraView 
            onCapture={handleCapture} 
            isCapturing={showScanner || isAnalyzing} 
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-6 nokia-border bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span className="text-[#124191]">TIP:</span> CENTER THE DAMAGED AREA FOR BEST RESULTS
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#B0B0B0]">MODE: FABRIC SCAN</span>
            <span className="text-[#00ff00]">●</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
