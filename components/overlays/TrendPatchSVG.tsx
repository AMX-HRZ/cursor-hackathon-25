"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * TrendPatchSVG - Pixel-art flower/Sashiko pattern
 *
 * Visual style: Trendy geometric pattern inspired by Sashiko
 * Color: Magenta/Pink (#ff00ff) with cyan accents
 */

interface Coordinate {
  x: number;
  y: number;
}

interface TrendPatchSVGProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export default function TrendPatchSVG({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
}: TrendPatchSVGProps) {
  const [visiblePatterns, setVisiblePatterns] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  const primaryColor = "#ff00ff"; // Magenta
  const accentColor = "#00ffff"; // Cyan
  const pixelSize = 6;

  // Calculate center and bounds from coordinates
  const bounds = useMemo(() => {
    if (coordinates.length === 0) {
      return { centerX: width / 2, centerY: height / 2, spread: 80 };
    }

    const xs = coordinates.map((c) => c.x);
    const ys = coordinates.map((c) => c.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      spread: Math.max(maxX - minX, maxY - minY, 80),
    };
  }, [coordinates, width, height]);

  // Generate Sashiko-style flower pattern
  const flowerPattern = useMemo(() => {
    const { centerX, centerY } = bounds;
    const patterns: Array<{
      type: "petal" | "center" | "dot";
      x: number;
      y: number;
      rotation?: number;
    }> = [];

    // Center pixel
    patterns.push({ type: "center", x: centerX, y: centerY });

    // 8 petals around center
    const petalDistance = 20;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      patterns.push({
        type: "petal",
        x: centerX + Math.cos(angle) * petalDistance,
        y: centerY + Math.sin(angle) * petalDistance,
        rotation: (i * 360) / 8,
      });
    }

    // Outer dots
    const dotDistance = 35;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8 + Math.PI / 8;
      patterns.push({
        type: "dot",
        x: centerX + Math.cos(angle) * dotDistance,
        y: centerY + Math.sin(angle) * dotDistance,
      });
    }

    return patterns;
  }, [bounds]);

  // Generate connecting stitch lines (Sashiko style)
  const stitchLines = useMemo(() => {
    const { centerX, centerY } = bounds;
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    // Cross pattern
    const crossSize = 50;
    lines.push(
      {
        x1: centerX - crossSize,
        y1: centerY,
        x2: centerX + crossSize,
        y2: centerY,
      },
      {
        x1: centerX,
        y1: centerY - crossSize,
        x2: centerX,
        y2: centerY + crossSize,
      }
    );

    // Diagonal cross
    const diagSize = 35;
    lines.push(
      {
        x1: centerX - diagSize,
        y1: centerY - diagSize,
        x2: centerX + diagSize,
        y2: centerY + diagSize,
      },
      {
        x1: centerX + diagSize,
        y1: centerY - diagSize,
        x2: centerX - diagSize,
        y2: centerY + diagSize,
      }
    );

    return lines;
  }, [bounds]);

  // Animation effect
  useEffect(() => {
    if (!animated) {
      setVisiblePatterns(flowerPattern.length);
      setAnimationComplete(true);
      return;
    }

    setVisiblePatterns(0);
    setAnimationComplete(false);

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setVisiblePatterns(current);

      if (current >= flowerPattern.length) {
        clearInterval(interval);
        setAnimationComplete(true);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [animated, flowerPattern.length]);

  const instanceId = useMemo(
    () => `trend-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter
          id={`${instanceId}-glow`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient
          id={`${instanceId}-gradient`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>
      </defs>

      {/* Stitch lines (Sashiko style) - dashed */}
      {animationComplete &&
        stitchLines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={primaryColor}
            strokeWidth={2}
            strokeDasharray="6 4"
            opacity={0.6}
            className="transition-opacity duration-300"
          />
        ))}

      {/* Flower pattern - pixel art style */}
      {flowerPattern.slice(0, visiblePatterns).map((pattern, index) => {
        if (pattern.type === "center") {
          // Center - larger pixel cluster
          return (
            <g key={`pattern-${index}`} filter={`url(#${instanceId}-glow)`}>
              <rect
                x={pattern.x - pixelSize}
                y={pattern.y - pixelSize}
                width={pixelSize * 2}
                height={pixelSize * 2}
                fill={accentColor}
              />
              {/* Inner detail */}
              <rect
                x={pattern.x - pixelSize / 2}
                y={pattern.y - pixelSize / 2}
                width={pixelSize}
                height={pixelSize}
                fill={primaryColor}
              />
            </g>
          );
        }

        if (pattern.type === "petal") {
          // Petal - diamond shape made of pixels
          return (
            <g
              key={`pattern-${index}`}
              transform={`rotate(${pattern.rotation || 0} ${pattern.x} ${
                pattern.y
              })`}
            >
              {/* Diamond petal */}
              <rect
                x={pattern.x - pixelSize / 2}
                y={pattern.y - pixelSize * 1.5}
                width={pixelSize}
                height={pixelSize}
                fill={primaryColor}
              />
              <rect
                x={pattern.x - pixelSize}
                y={pattern.y - pixelSize / 2}
                width={pixelSize}
                height={pixelSize}
                fill={primaryColor}
              />
              <rect
                x={pattern.x}
                y={pattern.y - pixelSize / 2}
                width={pixelSize}
                height={pixelSize}
                fill={primaryColor}
              />
              <rect
                x={pattern.x - pixelSize / 2}
                y={pattern.y + pixelSize / 2}
                width={pixelSize}
                height={pixelSize}
                fill={primaryColor}
              />
            </g>
          );
        }

        // Dot - small accent pixel
        return (
          <rect
            key={`pattern-${index}`}
            x={pattern.x - pixelSize / 2}
            y={pattern.y - pixelSize / 2}
            width={pixelSize}
            height={pixelSize}
            fill={accentColor}
            opacity={0.8}
          />
        );
      })}

      {/* Outer border ring */}
      {animationComplete && (
        <circle
          cx={bounds.centerX}
          cy={bounds.centerY}
          r={55}
          fill="none"
          stroke={`url(#${instanceId}-gradient)`}
          strokeWidth={2}
          strokeDasharray="4 6"
          opacity={0.5}
          className="animate-pulse"
        />
      )}

      {/* Label */}
      {animationComplete && (
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={primaryColor}
          fontSize="10"
          fontFamily="monospace"
          opacity={0.6}
        >
          SASHIKO FLOWER
        </text>
      )}
    </svg>
  );
}
