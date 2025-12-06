"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * SatinStitchSVG - Embroidery-style satin stitch overlay
 *
 * Visual style: Thick textured thread like real embroidery
 * Replaces the glowing "cyber" look with organic, handcrafted feel
 */

interface Coordinate {
  x: number;
  y: number;
}

interface SatinStitchSVGProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
  color?: "red" | "blue" | "green" | "pink";
}

const colorMap = {
  red: { primary: "#D9381E", secondary: "#B91C1C", highlight: "#EF4444" },
  blue: { primary: "#1E40AF", secondary: "#1E3A8A", highlight: "#3B82F6" },
  green: { primary: "#15803D", secondary: "#166534", highlight: "#22C55E" },
  pink: { primary: "#F472B6", secondary: "#EC4899", highlight: "#F9A8D4" },
};

export default function SatinStitchSVG({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
  color = "red",
}: SatinStitchSVGProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  const colors = colorMap[color];
  const strokeWidth = 10; // Thick like satin stitch

  // Generate smooth path (less wavy, more organic)
  const path = useMemo(() => {
    if (coordinates.length < 2) return "";

    let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;

    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];

      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

      // Slight organic curve
      const dx = curr.x - prev.x;
      const dy = curr.y - prev.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > 0) {
        const curve = (i % 2 === 0 ? 1 : -1) * 5; // Subtle curve
        const perpX = (-dy / len) * curve;
        const perpY = (dx / len) * curve;

        pathD += ` Q ${midX + perpX} ${midY + perpY} ${curr.x} ${curr.y}`;
      } else {
        pathD += ` L ${curr.x} ${curr.y}`;
      }
    }

    return pathD;
  }, [coordinates]);

  // Calculate path length
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [path]);

  // Animation timing
  useEffect(() => {
    if (!animated) {
      setAnimationComplete(true);
      return;
    }

    setAnimationComplete(false);
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [animated, coordinates]);

  // Generate cross-stitch marks along the path
  const crossStitches = useMemo(() => {
    const stitches: Array<{
      x: number;
      y: number;
      angle: number;
    }> = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      const curr = coordinates[i];
      const next = coordinates[i + 1];
      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Add stitch at midpoint
      stitches.push({
        x: (curr.x + next.x) / 2,
        y: (curr.y + next.y) / 2,
        angle,
      });
    }

    return stitches;
  }, [coordinates]);

  // Generate thread texture pattern
  const textureId = `thread-texture-${color}`;

  if (coordinates.length < 2) return null;

  const firstCoord = coordinates[0];
  const lastCoord = coordinates[coordinates.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 pointer-events-none"
      style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }}
    >
      <defs>
        {/* Thread texture pattern */}
        <pattern
          id={textureId}
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="4"
            stroke={colors.secondary}
            strokeWidth="2"
          />
        </pattern>

        {/* Gradient for depth */}
        <linearGradient
          id={`stitch-gradient-${color}`}
          x1="0%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={colors.highlight} />
          <stop offset="50%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
      </defs>

      {/* Shadow layer */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={strokeWidth + 4}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2, 2)"
      />

      {/* Main stitch - base layer */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={colors.secondary}
        strokeWidth={strokeWidth + 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: animated ? pathLength : "none",
          strokeDashoffset: animated && !animationComplete ? pathLength : 0,
          transition: animated
            ? "stroke-dashoffset 2s ease-out"
            : "none",
        }}
      />

      {/* Main stitch - highlight layer */}
      <path
        d={path}
        fill="none"
        stroke={`url(#stitch-gradient-${color})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: animated ? pathLength : "none",
          strokeDashoffset: animated && !animationComplete ? pathLength : 0,
          transition: animated
            ? "stroke-dashoffset 2s ease-out"
            : "none",
        }}
      />

      {/* Thread texture overlay */}
      <path
        d={path}
        fill="none"
        stroke={`url(#${textureId})`}
        strokeWidth={strokeWidth - 2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.3}
        style={{
          strokeDasharray: animated ? pathLength : "none",
          strokeDashoffset: animated && !animationComplete ? pathLength : 0,
          transition: animated
            ? "stroke-dashoffset 2s ease-out"
            : "none",
        }}
      />

      {/* Center shine */}
      <path
        d={path}
        fill="none"
        stroke={colors.highlight}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
        style={{
          strokeDasharray: animated ? pathLength : "none",
          strokeDashoffset: animated && !animationComplete ? pathLength : 0,
          transition: animated
            ? "stroke-dashoffset 2s ease-out 0.1s"
            : "none",
        }}
      />

      {/* Cross stitch marks */}
      {animationComplete &&
        crossStitches.map((stitch, i) => (
          <g
            key={i}
            transform={`translate(${stitch.x}, ${stitch.y}) rotate(${stitch.angle})`}
            style={{
              opacity: animationComplete ? 1 : 0,
              transition: `opacity 0.3s ease ${i * 50}ms`,
            }}
          >
            {/* Perpendicular stitch mark */}
            <line
              x1="-12"
              y1="0"
              x2="12"
              y2="0"
              stroke={colors.primary}
              strokeWidth="3"
              strokeLinecap="round"
              transform="rotate(90)"
            />
            {/* Small knot */}
            <circle
              cx="0"
              cy="0"
              r="2"
              fill={colors.secondary}
            />
          </g>
        ))}

      {/* Start marker - Needle hole */}
      <g
        style={{
          opacity: animationComplete ? 1 : 0,
          transform: animationComplete ? "scale(1)" : "scale(0)",
          transformOrigin: `${firstCoord.x}px ${firstCoord.y}px`,
          transition: "all 0.4s ease 2s",
        }}
      >
        <circle
          cx={firstCoord.x}
          cy={firstCoord.y}
          r="8"
          fill="#F9F7F1"
          stroke={colors.primary}
          strokeWidth="3"
        />
        <circle
          cx={firstCoord.x}
          cy={firstCoord.y}
          r="3"
          fill={colors.secondary}
        />
        <text
          x={firstCoord.x}
          y={firstCoord.y - 16}
          textAnchor="middle"
          fill={colors.primary}
          fontSize="10"
          fontWeight="bold"
          fontFamily="var(--font-body)"
        >
          START
        </text>
      </g>

      {/* End marker - Decorative knot */}
      <g
        style={{
          opacity: animationComplete ? 1 : 0,
          transform: animationComplete ? "scale(1)" : "scale(0)",
          transformOrigin: `${lastCoord.x}px ${lastCoord.y}px`,
          transition: "all 0.4s ease 2.2s",
        }}
      >
        {/* French knot style end */}
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r="10"
          fill={colors.primary}
          stroke={colors.secondary}
          strokeWidth="2"
        />
        <circle
          cx={lastCoord.x}
          cy={lastCoord.y}
          r="6"
          fill={colors.highlight}
          opacity={0.5}
        />
        <circle
          cx={lastCoord.x - 2}
          cy={lastCoord.y - 2}
          r="2"
          fill="#FFFFFF"
          opacity={0.6}
        />
      </g>
    </svg>
  );
}

