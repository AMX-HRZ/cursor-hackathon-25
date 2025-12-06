"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * SnakeOverlay - Isolated SVG drawing logic for repair stitch visualization
 *
 * This component handles ONLY the visual representation of the snake stitch pattern.
 * Features CSS keyframe animation using stroke-dasharray for "drawing" effect.
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
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(animated);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  // Generate smooth bezier curve path
  const path = useMemo(() => {
    if (coordinates.length < 2) return "";

    let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;

    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];

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

        pathD += ` Q ${midX + perpX} ${midY + perpY} ${curr.x} ${curr.y}`;
      } else {
        pathD += ` L ${curr.x} ${curr.y}`;
      }
    }

    return pathD;
  }, [coordinates]);

  // Calculate path length for stroke-dasharray animation
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [path]);

  // Handle animation completion
  useEffect(() => {
    if (!animated) {
      setAnimationComplete(true);
      return;
    }

    setIsAnimating(true);
    setAnimationComplete(false);

    // Animation duration matches the CSS animation
    const animationDuration = 2000; // 2 seconds
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setIsAnimating(false);
    }, animationDuration);

    return () => clearTimeout(timer);
  }, [animated, coordinates]);

  // Generate stitch marks
  const stitchMarks = useMemo(() => {
    const marks: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      mx: number;
      my: number;
    }> = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      const curr = coordinates[i];
      const next = coordinates[i + 1];

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
  }, [coordinates]);

  const glowConfig = GLOW_CONFIGS[glowIntensity];

  if (coordinates.length < 2) return null;

  // Unique ID for this instance to avoid CSS conflicts
  const instanceId = useMemo(
    () => `snake-${Math.random().toString(36).substr(2, 9)}`,
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
        {/* Glow filter */}
        <filter
          id={`${instanceId}-glow`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation={glowConfig.blur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Animated dash pattern */}
        <linearGradient
          id={`${instanceId}-gradient`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="50%" stopColor="#00ffff" stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Background glow layer - only show when animation complete */}
      {animationComplete && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 4}
          opacity={glowConfig.opacity}
          filter={`url(#${instanceId}-glow)`}
        />
      )}

      {/* Main stitch path with snake drawing animation */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={`url(#${instanceId}-gradient)`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={
          isAnimating && pathLength > 0
            ? {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                animation: `${instanceId}-draw 2s ease-out forwards`,
              }
            : {}
        }
      />

      {/* Center highlight */}
      <path
        d={path}
        fill="none"
        stroke="#ffffff"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={animationComplete ? 0.4 : 0}
        className="transition-opacity duration-500"
      />

      {/* Stitch marks - fade in after animation */}
      {stitchMarks.map((mark, index) => (
        <g
          key={`stitch-${index}`}
          opacity={animationComplete ? 1 : 0}
          className="transition-opacity duration-300"
          style={{ transitionDelay: `${index * 50}ms` }}
        >
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
      <g
        opacity={animationComplete ? 1 : 0.5}
        className="transition-opacity duration-300"
      >
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

      {/* End marker (snake head) - pulses when complete */}
      {coordinates.length > 1 && (
        <g
          className={animationComplete ? "animate-pulse" : ""}
          opacity={animationComplete ? 1 : 0}
          style={{ transition: "opacity 0.5s ease-out" }}
        >
          <circle
            cx={coordinates[coordinates.length - 1].x}
            cy={coordinates[coordinates.length - 1].y}
            r={12}
            fill={color}
            filter={`url(#${instanceId}-glow)`}
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
      {isAnimating && (
        <text
          x={width / 2}
          y={height - 30}
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontFamily="monospace"
          className="animate-pulse"
        >
          GENERATING REPAIR PATH...
        </text>
      )}

      {/* CSS Keyframes for stroke-dashoffset animation */}
      <style>
        {`
          @keyframes ${instanceId}-draw {
            0% {
              stroke-dashoffset: ${pathLength};
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
    </svg>
  );
}
