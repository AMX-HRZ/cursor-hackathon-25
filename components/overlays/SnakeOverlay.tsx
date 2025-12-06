"use client";

import React, { useEffect, useState } from "react";

/**
 * SnakeOverlay - Isolated SVG drawing logic for repair stitch visualization
 * 
 * This component handles ONLY the visual representation of the snake stitch pattern.
 * Keep business logic separate for easy pattern modifications.
 */

interface Coordinate {
  x: number;
  y: number;
}

interface SnakeOverlayProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
  color?: string;
  glowIntensity?: "low" | "medium" | "high";
  showNodes?: boolean;
  strokeWidth?: number;
}

// Glow filter intensities
const GLOW_CONFIGS = {
  low: { blur: 2, opacity: 0.3 },
  medium: { blur: 4, opacity: 0.5 },
  high: { blur: 6, opacity: 0.7 },
};

export default function SnakeOverlay({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
  color = "#00ff00",
  glowIntensity = "medium",
  showNodes = true,
  strokeWidth = 3,
}: SnakeOverlayProps) {
  const [visibleSegments, setVisibleSegments] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Animation effect
  useEffect(() => {
    if (!animated) {
      setVisibleSegments(coordinates.length);
      setIsComplete(true);
      return;
    }

    setVisibleSegments(0);
    setIsComplete(false);

    let currentSegment = 0;
    const interval = setInterval(() => {
      currentSegment++;
      setVisibleSegments(currentSegment);

      if (currentSegment >= coordinates.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [coordinates.length, animated]);

  // Generate smooth bezier curve path
  const generatePath = (coords: Coordinate[], segments: number): string => {
    if (coords.length < 2 || segments < 2) return "";

    const visibleCoords = coords.slice(0, segments);
    let path = `M ${visibleCoords[0].x} ${visibleCoords[0].y}`;

    for (let i = 1; i < visibleCoords.length; i++) {
      const prev = visibleCoords[i - 1];
      const curr = visibleCoords[i];

      // Calculate control points for smooth curve
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

      // Add perpendicular offset for snake-like waviness
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > 0) {
        const waveOffset = (i % 2 === 0 ? 1 : -1) * 10;
        const perpX = (-dy / len) * waveOffset;
        const perpY = (dx / len) * waveOffset;

        path += ` Q ${midX + perpX} ${midY + perpY} ${curr.x} ${curr.y}`;
      } else {
        path += ` L ${curr.x} ${curr.y}`;
      }
    }

    return path;
  };

  // Generate stitch marks
  const generateStitchMarks = (coords: Coordinate[], segments: number) => {
    const marks: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      mx: number;
      my: number;
    }> = [];

    const visibleCoords = coords.slice(0, segments);

    for (let i = 0; i < visibleCoords.length - 1; i++) {
      const curr = visibleCoords[i];
      const next = visibleCoords[i + 1];

      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > 0) {
        const perpX = -dy / len;
        const perpY = dx / len;
        const stitchLen = 14;

        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;

        marks.push({
          x1: midX - perpX * stitchLen,
          y1: midY - perpY * stitchLen,
          x2: midX + perpX * stitchLen,
          y2: midY + perpY * stitchLen,
          mx: midX,
          my: midY,
        });
      }
    }

    return marks;
  };

  const path = generatePath(coordinates, visibleSegments);
  const stitchMarks = generateStitchMarks(coordinates, visibleSegments);
  const glowConfig = GLOW_CONFIGS[glowIntensity];

  if (coordinates.length < 2) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="snakeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={glowConfig.blur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated dash pattern */}
        <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00ffff" stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Background glow layer */}
      {isComplete && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 4}
          opacity={glowConfig.opacity}
          filter="url(#snakeGlow)"
        />
      )}

      {/* Main stitch path */}
      <path
        d={path}
        fill="none"
        stroke="url(#snakeGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-100"
      />

      {/* Center highlight */}
      <path
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* Stitch marks */}
      {stitchMarks.map((mark, index) => (
        <g key={`stitch-${index}`}>
          {/* Stitch line */}
          <line
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.8}
          />
          {/* Node points */}
          {showNodes && (
            <>
              <circle
                cx={mark.x1}
                cy={mark.y1}
                r={3}
                fill="#0a0a0a"
                stroke={color}
                strokeWidth={1.5}
              />
              <circle
                cx={mark.x2}
                cy={mark.y2}
                r={3}
                fill="#0a0a0a"
                stroke={color}
                strokeWidth={1.5}
              />
            </>
          )}
        </g>
      ))}

      {/* Start marker */}
      {visibleSegments > 0 && (
        <g>
          <circle
            cx={coordinates[0].x}
            cy={coordinates[0].y}
            r={10}
            fill="#0a0a0a"
            stroke={color}
            strokeWidth={2}
          />
          <text
            x={coordinates[0].x}
            y={coordinates[0].y + 4}
            textAnchor="middle"
            fill={color}
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            S
          </text>
        </g>
      )}

      {/* End marker (snake head) */}
      {isComplete && coordinates.length > 1 && (
        <g className="animate-pulse">
          <circle
            cx={coordinates[coordinates.length - 1].x}
            cy={coordinates[coordinates.length - 1].y}
            r={12}
            fill={color}
            filter="url(#snakeGlow)"
          />
          {/* Eyes */}
          <circle
            cx={coordinates[coordinates.length - 1].x - 4}
            cy={coordinates[coordinates.length - 1].y - 3}
            r={2}
            fill="#0a0a0a"
          />
          <circle
            cx={coordinates[coordinates.length - 1].x + 4}
            cy={coordinates[coordinates.length - 1].y - 3}
            r={2}
            fill="#0a0a0a"
          />
        </g>
      )}

      {/* Progress indicator during animation */}
      {animated && !isComplete && (
        <text
          x={width / 2}
          y={height - 30}
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontFamily="monospace"
          className="animate-pulse"
        >
          GENERATING REPAIR PATH... {Math.round((visibleSegments / coordinates.length) * 100)}%
        </text>
      )}
    </svg>
  );
}

