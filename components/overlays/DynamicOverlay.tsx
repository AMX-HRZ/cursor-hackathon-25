"use client";

import BasicStitchSVG from "./BasicStitchSVG";
import CyberWeaveSVG from "./CyberWeaveSVG";
import TrendPatchSVG from "./TrendPatchSVG";

/**
 * DynamicOverlay - Wrapper component that renders the correct overlay
 * based on the selected repair type.
 *
 * Types:
 * - "basic" -> BasicStitchSVG (yellow zig-zag)
 * - "trend" -> TrendPatchSVG (pixel flower/Sashiko)
 * - "cyber" -> CyberWeaveSVG (green snake pattern)
 */

export type OverlayType = "basic" | "trend" | "cyber";

interface Coordinate {
  x: number;
  y: number;
}

interface DynamicOverlayProps {
  type: OverlayType;
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export default function DynamicOverlay({
  type,
  coordinates,
  width = 640,
  height = 480,
  animated = true,
}: DynamicOverlayProps) {
  // Render the appropriate overlay based on type
  switch (type) {
    case "basic":
      return (
        <BasicStitchSVG
          coordinates={coordinates}
          width={width}
          height={height}
          animated={animated}
        />
      );

    case "trend":
      return (
        <TrendPatchSVG
          coordinates={coordinates}
          width={width}
          height={height}
          animated={animated}
        />
      );

    case "cyber":
      return (
        <CyberWeaveSVG
          coordinates={coordinates}
          width={width}
          height={height}
          animated={animated}
        />
      );

    default:
      // Fallback to cyber (the original snake)
      return (
        <CyberWeaveSVG
          coordinates={coordinates}
          width={width}
          height={height}
          animated={animated}
        />
      );
  }
}
