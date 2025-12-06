"use client";

import React, { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  isCapturing?: boolean;
}

export default function CameraView({ onCapture, isCapturing = false }: CameraViewProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "environment", // Use back camera on mobile
  };

  const handleUserMedia = () => {
    setIsCameraReady(true);
    setError(null);
  };

  const handleUserMediaError = () => {
    setError("CAMERA ACCESS DENIED");
    setIsCameraReady(false);
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      {/* Nokia 7650 Style Camera Frame */}
      <div className="nokia-border bg-[#1a1a1a] p-2">
        {/* Top Status Bar */}
        <div className="flex justify-between items-center mb-2 px-2 py-1 bg-[#0a0a0a] border border-[#333]">
          <span className="text-[#00ff00] text-sm tracking-wider">MEND-AR CAM v1.0</span>
          <div className="flex gap-2">
            <span className="text-[#ffaa00] text-sm">●</span>
            <span className="text-[#00ff00] text-sm">{isCameraReady ? "REC" : "---"}</span>
          </div>
        </div>

        {/* Camera Container with Viewfinder */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]">
              <div className="text-[#ff0040] text-xl mb-4 text-glow">⚠ ERROR</div>
              <div className="text-[#B0B0B0] text-center px-4">{error}</div>
              <div className="text-[#666] text-sm mt-4">
                ENABLE CAMERA IN BROWSER SETTINGS
              </div>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                className="w-full h-full object-cover pixelated"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="viewfinder-corner viewfinder-corner-tl" />
                <div className="viewfinder-corner viewfinder-corner-tr" />
                <div className="viewfinder-corner viewfinder-corner-bl" />
                <div className="viewfinder-corner viewfinder-corner-br" />

                {/* Center crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[#00ff00] opacity-60" />
                    <div className="absolute top-0 left-1/2 w-[2px] h-full bg-[#00ff00] opacity-60" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#00ff00]" />
                  </div>
                </div>

                {/* Target Area Label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 text-[#00ff00] text-xs tracking-widest">
                  TARGET DAMAGE AREA
                </div>

                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-[#00ff00]" />
                  <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-[#00ff00]" />
                  <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-[#00ff00]" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-[#00ff00]" />
                </div>

                {/* Scanning effect when capturing */}
                {isCapturing && (
                  <div className="absolute inset-0 bg-[#00ff00] opacity-10 animate-pulse" />
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Info Bar */}
        <div className="flex justify-between items-center mt-2 px-2 py-1 bg-[#0a0a0a] border border-[#333]">
          <span className="text-[#B0B0B0] text-xs">640x480</span>
          <span className="text-[#00ffff] text-xs tracking-wider">FABRIC SCAN MODE</span>
          <span className="text-[#B0B0B0] text-xs">JPEG</span>
        </div>
      </div>

      {/* Capture Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={capture}
          disabled={!isCameraReady || isCapturing}
          className="nokia-button bg-[#124191] hover:bg-[#00ffff] hover:text-[#0a0a0a] text-white px-8 py-4 text-xl tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCapturing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">◐</span> SCANNING...
            </span>
          ) : (
            <>▣ CAPTURE</>
          )}
        </Button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center">
        <p className="text-[#666] text-sm">
          POSITION DAMAGED AREA IN CENTER
        </p>
        <p className="text-[#00ff00] text-xs mt-1 blink">
          ● PRESS CAPTURE TO ANALYZE
        </p>
      </div>
    </div>
  );
}

