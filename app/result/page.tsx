"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SnakeOverlay from "@/components/SnakeOverlay";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AnalysisResult {
  fabric: string;
  damageType: string;
  coordinates: Array<{ x: number; y: number }>;
  repairType: string;
  difficulty: string;
  snakeScore: number;
}

export default function ResultPage() {
  const router = useRouter();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Load data from sessionStorage
    const image = sessionStorage.getItem("capturedImage");
    const result = sessionStorage.getItem("analysisResult");

    if (!image || !result) {
      router.push("/scan");
      return;
    }

    setCapturedImage(image);
    setAnalysisResult(JSON.parse(result));
  }, [router]);

  const handleSaveToWardrobe = async () => {
    if (!analysisResult) return;

    setIsSaving(true);

    // Simulate saving to database
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, you'd save to the database here
    // await fetch('/api/repairs', { method: 'POST', body: JSON.stringify({...}) })

    setIsSaving(false);
    setSaved(true);
    setShowDialog(true);
  };

  const handleNewScan = () => {
    sessionStorage.removeItem("capturedImage");
    sessionStorage.removeItem("analysisResult");
    router.push("/scan");
  };

  if (!capturedImage || !analysisResult) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-[#00ff00] text-xl animate-pulse">LOADING...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="nokia-border bg-[#0a0a0a] p-4 mb-6">
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

      {/* Main Content */}
      <div className="flex-1 grid lg:grid-cols-2 gap-6">
        {/* Image with Snake Overlay */}
        <div className="nokia-border bg-[#0a0a0a] p-4">
          <div className="text-[#00ffff] text-sm mb-3 tracking-widest">
            ▣ REPAIR PREVIEW
          </div>
          <div className="relative aspect-[4/3] bg-black overflow-hidden">
            <Image
              src={capturedImage}
              alt="Captured fabric"
              fill
              className="object-cover pixelated"
            />
            <SnakeOverlay
              coordinates={analysisResult.coordinates}
              animated={true}
            />

            {/* Viewfinder corners */}
            <div className="viewfinder-corner viewfinder-corner-tl" />
            <div className="viewfinder-corner viewfinder-corner-tr" />
            <div className="viewfinder-corner viewfinder-corner-bl" />
            <div className="viewfinder-corner viewfinder-corner-br" />
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-[#00ff00]" />
              <span className="text-[#B0B0B0]">STITCH PATH</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#00ff00]" />
              <span className="text-[#B0B0B0]">SNAKE HEAD</span>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="space-y-4">
          {/* Fabric Info Card */}
          <Card className="nokia-border bg-[#0a0a0a] border-none">
            <CardHeader className="border-b border-[#333] pb-3">
              <CardTitle className="text-[#00ffff] text-sm tracking-widest">
                ▣ FABRIC ANALYSIS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[#666]">MATERIAL:</span>
                <span className="text-[#00ff00]">{analysisResult.fabric}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">DAMAGE:</span>
                <span className="text-[#ffaa00]">{analysisResult.damageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">DIFFICULTY:</span>
                <span className="text-[#00ffff]">{analysisResult.difficulty}</span>
              </div>
            </CardContent>
          </Card>

          {/* Repair Info Card */}
          <Card className="nokia-border bg-[#0a0a0a] border-none">
            <CardHeader className="border-b border-[#333] pb-3">
              <CardTitle className="text-[#00ffff] text-sm tracking-widest">
                ▣ REPAIR PLAN
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-[#666]">METHOD:</span>
                <span className="text-[#00ff00]">{analysisResult.repairType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">STITCHES:</span>
                <span className="text-[#00ff00]">{analysisResult.coordinates.length - 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#666]">SNAKE SCORE:</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#00ff00] text-xl">{analysisResult.snakeScore}</span>
                  <span className="text-[#ffaa00]">★</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions Card */}
          <Card className="nokia-border bg-[#1a1a1a] border-none">
            <CardContent className="pt-4">
              <div className="text-[#124191] text-xs mb-2">REPAIR INSTRUCTIONS:</div>
              <ol className="text-[#B0B0B0] text-xs space-y-1 list-decimal list-inside">
                <li>Thread needle with matching color</li>
                <li>Start at marked &quot;S&quot; point</li>
                <li>Follow the snake path shown</li>
                <li>Use running stitch technique</li>
                <li>Secure end at snake head</li>
              </ol>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
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
              </DialogTrigger>
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
                    SNAKE SCORE: {analysisResult.snakeScore}
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
      <footer className="mt-6 nokia-border bg-[#0a0a0a] p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-[#666]">
            <span className="text-[#124191]">MEND-AR</span> v3.31.0
          </div>
          <Link href="/" className="text-[#00ffff] hover:text-[#00ff00]">
            ◀ MAIN MENU
          </Link>
        </div>
      </footer>
    </main>
  );
}

