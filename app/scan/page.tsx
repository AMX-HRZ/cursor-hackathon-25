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

      {/* Header - Y2K Style */}
      <header className="nokia-border bg-[rgba(0,20,40,0.9)] p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-[#c0c0c0] hover:text-[#00e5ff] hover:bg-transparent p-0"
            >
              ◀ BACK
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-2 animate-pulse"
              style={{
                backgroundColor: '#ff00aa',
                boxShadow: '0 0 10px #ff00aa'
              }}
            />
            <h1
              className="text-xl tracking-widest"
              style={{ 
                fontFamily: "var(--font-pixel)",
                color: '#00e5ff',
                textShadow: '0 0 20px rgba(0, 229, 255, 0.5), -1px 0 #ff00aa, 1px 0 #39ff14'
              }}
            >
              SCAN MODE
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span 
              className={`w-3 h-3 ${isAnalyzing ? "" : "animate-pulse"}`}
              style={{
                backgroundColor: isAnalyzing ? '#ffaa00' : '#39ff14',
                boxShadow: `0 0 10px ${isAnalyzing ? '#ffaa00' : '#39ff14'}`
              }}
            />
            <span className="text-[#666] text-xs tracking-wider">
              {isAnalyzing ? "PROCESSING" : "LIVE"}
            </span>
          </div>
        </div>
      </header>

      {/* Error Display - Y2K Alert Style */}
      {scanError && (
        <div 
          className="nokia-border p-4 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(122, 0, 32, 0.3) 0%, rgba(51, 0, 16, 0.8) 100%)',
            borderColor: '#ff0055',
            boxShadow: '0 0 30px rgba(255, 0, 85, 0.2)'
          }}
        >
          <div className="flex items-center gap-4">
            <span 
              className="text-3xl"
              style={{ filter: 'drop-shadow(0 0 10px #ff0055)' }}
            >
              ⚠
            </span>
            <div>
              <div 
                className="text-sm tracking-widest mb-1"
                style={{ 
                  color: '#ff0055',
                  textShadow: '0 0 10px rgba(255, 0, 85, 0.5)'
                }}
              >
                ANALYSIS ERROR
              </div>
              <div className="text-[#c0c0c0] text-xs">{scanError}</div>
            </div>
          </div>
          <Button
            onClick={() => setScanError(null)}
            className="mt-4"
            variant="destructive"
            size="sm"
          >
            TRY AGAIN
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Scanner Frame - Y2K Style */}
          <div 
            className="relative p-1"
            style={{
              background: 'linear-gradient(135deg, #00e5ff 0%, #ff00aa 50%, #9d00ff 100%)',
              boxShadow: '0 0 30px rgba(0, 229, 255, 0.3), 0 0 60px rgba(255, 0, 170, 0.2)'
            }}
          >
            <div className="bg-[#040810]">
              <CameraView 
                onCapture={handleCapture} 
                isCapturing={showScanner || isAnalyzing} 
              />
            </div>
          </div>

          {/* Status Bar */}
          <div 
            className="mt-4 nokia-border bg-[rgba(0,20,40,0.9)] p-3"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-1 h-4"
                      style={{
                        backgroundColor: i < 3 ? '#00e5ff' : '#333',
                        boxShadow: i < 3 ? '0 0 5px #00e5ff' : 'none'
                      }}
                    />
                  ))}
                </div>
                <span className="text-[#666] tracking-wider">CAM.ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span style={{ color: '#9d00ff' }}>AI:</span>
                <span style={{ color: '#39ff14' }}>READY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Y2K Style */}
      <footer className="mt-6 nokia-border bg-[rgba(0,20,40,0.9)] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span style={{ color: '#ff00aa' }}>◆</span>
            <span className="ml-2">CENTER THE DAMAGED AREA FOR OPTIMAL SCAN</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#c0c0c0] tracking-wider">MODE: FABRIC SCAN</span>
            <div className="flex gap-1">
              <div className="w-2 h-2" style={{ backgroundColor: '#39ff14', boxShadow: '0 0 5px #39ff14' }} />
              <div className="w-2 h-2" style={{ backgroundColor: '#00e5ff', boxShadow: '0 0 5px #00e5ff' }} />
              <div className="w-2 h-2" style={{ backgroundColor: '#ff00aa', boxShadow: '0 0 5px #ff00aa' }} />
            </div>
          </div>
        </div>
      </footer>

      {/* Decorative Corner Elements */}
      <div className="fixed top-1/4 left-4 hidden lg:block">
        <div className="w-[1px] h-20 bg-gradient-to-b from-[#00e5ff] to-transparent" />
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#ff00aa] to-transparent mt-4" />
      </div>
      <div className="fixed top-1/3 right-4 hidden lg:block">
        <div className="w-[1px] h-16 bg-gradient-to-b from-[#9d00ff] to-transparent" />
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#39ff14] to-transparent mt-4" />
      </div>
    </main>
  );
}
