"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

interface CameraViewProps {
  onCapture: (imageSrc: string) => void;
  isCapturing?: boolean;
}

export default function CameraView({
  onCapture,
  isCapturing = false,
}: CameraViewProps) {
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

  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: facingMode,
  };

  // Mirror only for front-facing camera
  const shouldMirror = facingMode === "user";

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
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
      {/* Nokia Style Camera Frame */}
      <div className="tech-card">
        {/* Top Status Bar */}
        <div
          className="flex justify-between items-center px-4 py-2 border-b-2"
          style={{ background: "#F3F4F6", borderColor: "#1A1A1A" }}
        >
          <span
            className="text-sm font-bold tracking-wider font-mono-tech"
            style={{ color: "#166534" }}
          >
            RETHREAD CAM v1.0
          </span>
          <div className="flex gap-2 items-center">
            <span
              className={`w-2 h-2 rounded-full ${
                isCameraReady ? "animate-pulse-tech" : ""
              }`}
              style={{ background: isCameraReady ? "#22C55E" : "#9CA3AF" }}
            />
            <span
              className="text-xs font-mono-tech font-bold"
              style={{ color: isCameraReady ? "#166534" : "#6B7280" }}
            >
              {isCameraReady ? "REC" : "---"}
            </span>
          </div>
        </div>

        {/* Camera Container with Viewfinder */}
        <div className="lcd-display m-3">
          <div className="relative aspect-[4/3] overflow-hidden">
            {error ? (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ background: "#FEE2E2" }}
              >
                <div
                  className="text-2xl font-bold font-pixel mb-4"
                  style={{ color: "#DC2626" }}
                >
                  ⚠ ERROR
                </div>
                <div
                  className="text-sm font-mono-tech text-center px-4"
                  style={{ color: "#1A1A1A" }}
                >
                  {error}
                </div>
                <div
                  className="text-xs font-mono-tech mt-4"
                  style={{ color: "#6B7280" }}
                >
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
                  mirrored={shouldMirror}
                  className="w-full h-full object-cover"
                />

                {/* Viewfinder Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Corner brackets - Nokia Blue */}
                  <div
                    className="absolute top-3 left-3 w-8 h-8 border-l-3 border-t-3"
                    style={{ borderColor: "#124191", borderWidth: "3px" }}
                  />
                  <div
                    className="absolute top-3 right-3 w-8 h-8 border-r-3 border-t-3"
                    style={{ borderColor: "#124191", borderWidth: "3px" }}
                  />
                  <div
                    className="absolute bottom-3 left-3 w-8 h-8 border-l-3 border-b-3"
                    style={{ borderColor: "#124191", borderWidth: "3px" }}
                  />
                  <div
                    className="absolute bottom-3 right-3 w-8 h-8 border-r-3 border-b-3"
                    style={{ borderColor: "#124191", borderWidth: "3px" }}
                  />

                  {/* Center crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 relative">
                      <div
                        className="absolute top-1/2 left-0 w-full h-[2px]"
                        style={{ background: "#166534", opacity: 0.6 }}
                      />
                      <div
                        className="absolute top-0 left-1/2 w-[2px] h-full"
                        style={{ background: "#166534", opacity: 0.6 }}
                      />
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2"
                        style={{ borderColor: "#166534" }}
                      />
                    </div>
                  </div>

                  {/* Target Area Label */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-12 text-xs tracking-widest font-mono-tech px-2 py-1 rounded-sm"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#166534",
                      border: "1px solid #166534",
                    }}
                  >
                    TARGET DAMAGE AREA
                  </div>

                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute top-1/3 left-0 right-0 h-[1px]"
                      style={{ background: "#124191" }}
                    />
                    <div
                      className="absolute top-2/3 left-0 right-0 h-[1px]"
                      style={{ background: "#124191" }}
                    />
                    <div
                      className="absolute left-1/3 top-0 bottom-0 w-[1px]"
                      style={{ background: "#124191" }}
                    />
                    <div
                      className="absolute left-2/3 top-0 bottom-0 w-[1px]"
                      style={{ background: "#124191" }}
                    />
                  </div>

                  {/* Scanning effect when capturing */}
                  {isCapturing && (
                    <div
                      className="absolute inset-0 animate-pulse"
                      style={{ background: "rgba(22, 101, 52, 0.1)" }}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom Info Bar */}
        <div
          className="flex justify-between items-center px-4 py-2 border-t-2"
          style={{ background: "#F3F4F6", borderColor: "#1A1A1A" }}
        >
          <span
            className="text-xs font-mono-tech"
            style={{ color: "#6B7280" }}
          >
            640x480
          </span>
          <button
            onClick={toggleCamera}
            className="text-xs font-bold tracking-wider font-mono-tech hover:opacity-70 transition-opacity"
            style={{ color: "#124191" }}
          >
            🔄 {facingMode === "user" ? "FRONT" : "BACK"} CAM
          </button>
          <span
            className="text-xs font-mono-tech"
            style={{ color: "#6B7280" }}
          >
            JPEG
          </span>
        </div>
      </div>

      {/* Capture Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={capture}
          disabled={!isCameraReady || isCapturing}
          className="nokia-btn nokia-btn-primary px-8 py-4 text-lg tracking-widest font-pixel disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-sm font-mono-tech" style={{ color: "#6B7280" }}>
          POSITION DAMAGED AREA IN CENTER
        </p>
        <p
          className="text-xs font-mono-tech mt-1 animate-pulse-tech"
          style={{ color: "#166534" }}
        >
          ● PRESS CAPTURE TO ANALYZE
        </p>
      </div>
    </div>
  );
}
