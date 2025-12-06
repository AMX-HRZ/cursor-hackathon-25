"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraView from "@/components/CameraView";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ScanPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");

  const analysisSteps = [
    "INITIALIZING SCANNER...",
    "DETECTING FABRIC TYPE...",
    "ANALYZING DAMAGE PATTERN...",
    "CALCULATING REPAIR PATH...",
    "GENERATING SNAKE STITCH...",
    "ANALYSIS COMPLETE!",
  ];

  const handleCapture = async (imageSrc: string) => {
    setIsAnalyzing(true);
    setProgress(0);

    // Store image in sessionStorage for result page
    sessionStorage.setItem("capturedImage", imageSrc);

    // Simulate analysis progress
    for (let i = 0; i < analysisSteps.length; i++) {
      setStatusMessage(analysisSteps[i]);
      setProgress(((i + 1) / analysisSteps.length) * 100);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    // Call the analysis API
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      });

      const data = await response.json();
      sessionStorage.setItem("analysisResult", JSON.stringify(data));

      // Navigate to result page
      router.push("/result");
    } catch (error) {
      console.error("Analysis failed:", error);
      setIsAnalyzing(false);
      setStatusMessage("ERROR: ANALYSIS FAILED");
    }
  };

  return (
    <main className="min-h-screen flex flex-col p-4">
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
            <span className="w-2 h-2 bg-[#00ff00] animate-pulse" />
            <span className="text-[#666] text-xs">LIVE</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isAnalyzing ? (
          /* Analysis Progress Screen */
          <div className="nokia-border bg-[#0a0a0a] p-8 max-w-lg w-full">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4 animate-pulse">🔍</div>
              <h2 className="text-2xl text-[#00ffff] text-glow-cyan tracking-widest mb-2">
                ANALYZING
              </h2>
              <p className="text-[#B0B0B0] text-sm">
                PLEASE WAIT...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="nokia-progress mb-2">
                <div
                  className="nokia-progress-fill h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666]">0%</span>
                <span className="text-[#00ff00]">{Math.round(progress)}%</span>
                <span className="text-[#666]">100%</span>
              </div>
            </div>

            {/* Status Message */}
            <div className="bg-[#1a1a1a] border border-[#333] p-4">
              <div className="flex items-center gap-2">
                <span className="text-[#124191]">&gt;</span>
                <span className="text-[#ffaa00]">{statusMessage}</span>
                <span className="blink">_</span>
              </div>
            </div>

            {/* ASCII Snake Animation */}
            <div className="mt-8 text-center text-[#00ff00] text-xs font-mono opacity-50">
              <pre className="inline-block animate-pulse">
{`    ____
   /    \\
  | MEND |
   \\____/
     ||
  ~~~||~~~
     \\/`}
              </pre>
            </div>
          </div>
        ) : (
          /* Camera View */
          <div className="w-full max-w-2xl">
            <CameraView onCapture={handleCapture} isCapturing={isAnalyzing} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-6 nokia-border bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span className="text-[#124191]">TIP:</span> HOLD STEADY FOR BEST RESULTS
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#B0B0B0]">MODE: AUTO</span>
            <span className="text-[#00ff00]">●</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

