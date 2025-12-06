"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * SnakeOverlay - Isolated SVG drawing logic for repair stitch visualization
 *
 * Y2K Laboratory Schematic Style:
 * - Dark green or black lines (ink on paper / plotter drawing)
 * - High contrast against light backgrounds
 * - Technical, precise appearance
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
  /** 
   * Color theme:
   * - "ink" = Dark green (#006400)
   * - "black" = Tech black (#1A1A1A)
   * - "nokia" = Nokia blue (#124191)
   * - custom hex color
   */
  color?: "ink" | "black" | "nokia" | string;
  showNodes?: boolean;
  strokeWidth?: number;
}

const COLOR_MAP: Record<string, string> = {
  ink: "#006400",
  black: "#1A1A1A",
  nokia: "#124191",
};

export default function SnakeOverlay({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
  color = "ink",
  showNodes = true,
  strokeWidth = 3,
}: SnakeOverlayProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(animated);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  // Resolve color from presets or use custom
  const resolvedColor = COLOR_MAP[color] || color;

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
        {/* Ink shadow filter for plotter effect */}
        <filter
          id={`${instanceId}-shadow`}
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          <feDropShadow dx="1" dy="1" stdDeviation="0.5" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main stitch path with snake drawing animation */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={resolvedColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${instanceId}-shadow)`}
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
            stroke={resolvedColor}
            strokeWidth={2}
            strokeLinecap="round"
            filter={`url(#${instanceId}-shadow)`}
          />
          {/* Node points */}
          {showNodes && (
            <>
              <circle
                cx={mark.x1}
                cy={mark.y1}
                r={3}
                fill="#FFFFFF"
                stroke={resolvedColor}
                strokeWidth={1.5}
              />
              <circle
                cx={mark.x2}
                cy={mark.y2}
                r={3}
                fill="#FFFFFF"
                stroke={resolvedColor}
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
          fill="#FFFFFF"
          stroke={resolvedColor}
          strokeWidth={2}
        />
        <text
          x={coordinates[0].x}
          y={coordinates[0].y + 4}
          textAnchor="middle"
          fill={resolvedColor}
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
        >
          S
        </text>
      </g>

      {/* End marker (snake head) */}
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
            fill={resolvedColor}
          />
          {/* Eyes */}
          <circle
            cx={coordinates[coordinates.length - 1].x - 4}
            cy={coordinates[coordinates.length - 1].y - 3}
            r={2}
            fill="#FFFFFF"
          />
          <circle
            cx={coordinates[coordinates.length - 1].x + 4}
            cy={coordinates[coordinates.length - 1].y - 3}
            r={2}
            fill="#FFFFFF"
          />
        </g>
      )}

      {/* Progress indicator during animation */}
      {isAnimating && (
        <text
          x={width / 2}
          y={height - 30}
          textAnchor="middle"
          fill={resolvedColor}
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          className="animate-pulse"
        >
          /// GENERATING REPAIR PATH...
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
