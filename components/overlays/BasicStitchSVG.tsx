"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * BasicStitchSVG - Simple yellow zig-zag stitch pattern
 *
 * Visual style: Minimal, functional repair aesthetic
 * Color: Yellow (#ffaa00) - Nokia amber
 */

interface Coordinate {
  x: number;
  y: number;
}

interface BasicStitchSVGProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
}

export default function BasicStitchSVG({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
}: BasicStitchSVGProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(animated);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  const color = "#ffaa00"; // Nokia amber
  const strokeWidth = 3;

  // Generate zig-zag path
  const path = useMemo(() => {
    if (coordinates.length < 2) return "";

    let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;

    for (let i = 1; i < coordinates.length; i++) {
      const curr = coordinates[i];
      // Simple straight lines for basic zig-zag
      pathD += ` L ${curr.x} ${curr.y}`;
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

  // Handle animation
  useEffect(() => {
    if (!animated) {
      setAnimationComplete(true);
      return;
    }

    setIsAnimating(true);
    setAnimationComplete(false);

    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setIsAnimating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [animated, coordinates]);

  // Generate stitch marks perpendicular to path
  const stitchMarks = useMemo(() => {
    const marks: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

    for (let i = 0; i < coordinates.length - 1; i++) {
      const curr = coordinates[i];
      const next = coordinates[i + 1];

      const dx = next.x - curr.x;
      const dy = next.y - curr.y;
      const len = Math.sqrt(dx * dx + dy * dy);

      if (len > 0) {
        const perpX = -dy / len;
        const perpY = dx / len;
        const stitchLen = 10;

        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y) / 2;

        marks.push({
          x1: midX - perpX * stitchLen,
          y1: midY - perpY * stitchLen,
          x2: midX + perpX * stitchLen,
          y2: midY + perpY * stitchLen,
        });
      }
    }

    return marks;
  }, [coordinates]);

  const instanceId = useMemo(
    () => `basic-${Math.random().toString(36).substr(2, 9)}`,
    []
  );

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
        <filter
          id={`${instanceId}-glow`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main zig-zag path */}
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 4"
        style={
          isAnimating && pathLength > 0
            ? {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
                animation: `${instanceId}-draw 1.5s ease-out forwards`,
              }
            : { strokeDasharray: "8 4" }
        }
      />

      {/* Stitch marks */}
      {animationComplete &&
        stitchMarks.map((mark, index) => (
          <line
            key={`stitch-${index}`}
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.7}
            className="transition-opacity duration-200"
            style={{ animationDelay: `${index * 30}ms` }}
          />
        ))}

      {/* Start/End markers */}
      {animationComplete && (
        <>
          <circle
            cx={coordinates[0].x}
            cy={coordinates[0].y}
            r={6}
            fill="#0a0a0a"
            stroke={color}
            strokeWidth={2}
          />
          <circle
            cx={coordinates[coordinates.length - 1].x}
            cy={coordinates[coordinates.length - 1].y}
            r={6}
            fill={color}
            opacity={0.8}
          />
        </>
      )}

      {/* Label */}
      {animationComplete && (
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontFamily="monospace"
          opacity={0.6}
        >
          BASIC STITCH
        </text>
      )}

      <style>
        {`
          @keyframes ${instanceId}-draw {
            0% { stroke-dashoffset: ${pathLength}; }
            100% { stroke-dashoffset: 0; }
          }
        `}
      </style>
    </svg>
  );
}
