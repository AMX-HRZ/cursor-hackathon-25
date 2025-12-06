"use client";

import CameraView from "@/components/CameraView";
import ScanningOverlay from "@/components/scanner/ScanningOverlay";
import { Button } from "@/components/ui/button";
import { useRepair } from "@/context/RepairContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function ScanPage() {
  const router = useRouter();
  const { startAnalysis, isAnalyzing } = useRepair();
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleCapture = useCallback(
    async (imageSrc: string) => {
      setShowScanner(true);
      setScanError(null);

      try {
        // Start analysis in the background
        await startAnalysis(imageSrc);
      } catch (error) {
        console.error("Analysis failed:", error);
        setScanError(
          error instanceof Error ? error.message : "Analysis failed"
        );
      }
    },
    [startAnalysis]
  );

  const handleScanComplete = useCallback(() => {
    if (!scanError) {
      router.push("/result");
    } else {
      setShowScanner(false);
    }
  }, [router, scanError]);

  return (
    <main className="min-h-screen flex flex-col dot-grid-bg">
      {/* Scanning Overlay */}
      <ScanningOverlay isActive={showScanner} onComplete={handleScanComplete} />

      {/* ============================================ */}
      {/* NAV BAR - Same as main page */}
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
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                HOME
              </Link>
              <Link
                href="/profile"
                className="text-sm font-bold tracking-wider px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors hidden sm:block"
                style={{ color: "#124191" }}
              >
                PROFILE
              </Link>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{ background: "#DCFCE7", border: "2px solid #166534" }}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAnalyzing ? "" : "animate-pulse-tech"
                  }`}
                  style={{ background: isAnalyzing ? "#FF5500" : "#22C55E" }}
                />
                <span
                  className="text-xs font-bold tracking-wider font-mono-tech"
                  style={{ color: "#166534" }}
                >
                  {isAnalyzing ? "PROCESSING" : "READY"}
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
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-6">
            <div className="tech-badge tech-badge-blue mb-3">
              <span className="mr-2">📱</span>
              GARMENT SCANNER
            </div>
            <h1
              className="text-2xl md:text-3xl font-bold font-pixel mb-2"
              style={{ color: "#1A1A1A" }}
            >
              Scan Your Garment
            </h1>
            <p className="text-sm font-mono-tech" style={{ color: "#6B7280" }}>
              Point your camera at the damaged area for AI analysis
            </p>
          </div>

          {/* Error Display */}
          {scanError && (
            <div className="tech-card mb-6" style={{ borderColor: "#DC2626" }}>
              <div
                className="tech-card-header flex items-center gap-2"
                style={{ background: "#DC2626" }}
              >
                <span className="animate-pulse">⚠</span>
                /// ANALYSIS_ERROR
              </div>
              <div className="tech-card-body p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-sm shrink-0"
                    style={{
                      background: "#FEE2E2",
                      border: "2px solid #DC2626",
                    }}
                  >
                    <span className="text-2xl">❌</span>
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-bold text-sm font-mono-tech mb-1"
                      style={{ color: "#DC2626" }}
                    >
                      Analysis Failed
                    </p>
                    <p
                      className="text-sm font-mono-tech"
                      style={{ color: "#4B5563" }}
                    >
                      {scanError}
                    </p>
                  </div>
                  <Button
                    onClick={() => setScanError(null)}
                    className="nokia-btn nokia-btn-alert px-4 py-2 text-xs font-pixel"
                  >
                    RETRY
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Scanner Card */}
          <div className="tech-card">
            <div className="tech-card-header flex items-center justify-between">
              <span>/// CAMERA_FEED</span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAnalyzing ? "animate-pulse" : "animate-pulse-tech"
                  }`}
                  style={{ background: isAnalyzing ? "#FF5500" : "#22C55E" }}
                />
                <span className="text-[10px]">
                  {isAnalyzing ? "ANALYZING" : "LIVE"}
                </span>
              </div>
            </div>

            {/* Camera Display */}
            <div className="lcd-display m-4">
              <div className="relative">
                <CameraView
                  onCapture={handleCapture}
                  isCapturing={showScanner || isAnalyzing}
                />

                {/* Corner Markers */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2"
                  style={{ borderColor: "#124191" }}
                />
                <div
                  className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2"
                  style={{ borderColor: "#124191" }}
                />
                <div
                  className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2"
                  style={{ borderColor: "#124191" }}
                />
                <div
                  className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2"
                  style={{ borderColor: "#124191" }}
                />
              </div>
            </div>

            {/* Status Footer */}
            <div
              className="p-4 flex items-center justify-between border-t-2"
              style={{ borderColor: "#1A1A1A", background: "#F9FAFB" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-4 rounded-sm"
                      style={{
                        background: i < 3 ? "#124191" : "#E5E7EB",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="text-xs font-mono-tech tracking-wider"
                  style={{ color: "#6B7280" }}
                >
                  CAMERA ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono-tech">
                <span style={{ color: "#124191" }}>AI: READY</span>
                <span style={{ color: "#A1A1C2" }}>|</span>
                <span style={{ color: "#166534" }}>MODE: FABRIC</span>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="tech-card mt-6">
            <div className="tech-card-header" style={{ background: "#166534" }}>
              /// SCAN_INSTRUCTIONS
            </div>
            <div className="tech-card-body p-5">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    step: "01",
                    icon: "📍",
                    title: "Position",
                    desc: "Center the damaged area in the camera frame",
                  },
                  {
                    step: "02",
                    icon: "💡",
                    title: "Lighting",
                    desc: "Ensure good lighting for accurate detection",
                  },
                  {
                    step: "03",
                    icon: "📸",
                    title: "Capture",
                    desc: "Press the capture button when ready",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-sm shrink-0 text-xl"
                      style={{
                        background: "#DCFCE7",
                        border: "2px solid #166534",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-pixel"
                          style={{ color: "#A1A1C2" }}
                        >
                          STEP_{item.step}
                        </span>
                      </div>
                      <p
                        className="font-bold text-sm font-mono-tech mb-0.5"
                        style={{ color: "#1A1A1A" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-xs font-mono-tech"
                        style={{ color: "#6B7280" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: "👕", text: "Works on all fabrics" },
              { icon: "🔍", text: "Detects multiple damage types" },
              { icon: "⚡", text: "Results in seconds" },
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 rounded-sm"
                style={{
                  background: "#F3F4F6",
                  border: "2px solid #E5E7EB",
                }}
              >
                <span>{tip.icon}</span>
                <span
                  className="text-xs font-mono-tech"
                  style={{ color: "#4B5563" }}
                >
                  {tip.text}
                </span>
              </div>
            ))}
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
            <div className="flex items-center gap-2 text-xs font-mono-tech">
              <span style={{ color: "#DC2626" }}>◆</span>
              <span style={{ color: "#6B7280" }}>
                CENTER THE DAMAGED AREA FOR OPTIMAL SCAN
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono-tech">
              <span style={{ color: "#A1A1C2" }}>RETHREAD × NOKIA</span>
              <span className="font-bold" style={{ color: "#166534" }}>
                🌍 For the Planet
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
