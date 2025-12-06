"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * CyberWeaveSVG - Glowing green snake pattern (Nokia Cyber-Weave)
 *
 * Visual style: High-tech digital stitch with matrix green glow
 * Color: Matrix green (#00ff00) with cyan highlights
 *
 * Refactored from SnakeOverlay.tsx
 */

interface Coordinate {
  x: number;
  y: number;
}

interface CyberWeaveSVGProps {
  coordinates: Coordinate[];
  width?: number;
  height?: number;
  animated?: boolean;
}

const GLOW_CONFIG = { blur: 6, opacity: 0.7 };

export default function CyberWeaveSVG({
  coordinates,
  width = 640,
  height = 480,
  animated = true,
}: CyberWeaveSVGProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [isAnimating, setIsAnimating] = useState(animated);
  const [animationComplete, setAnimationComplete] = useState(!animated);

  const color = "#00ff00"; // Matrix green
  const strokeWidth = 3;

  // Generate smooth bezier curve path with snake-like waviness
  const path = useMemo(() => {
    if (coordinates.length < 2) return "";

    let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;

    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];

      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;

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

  // Calculate path length
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, [path]);

  // Animation handling
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
    }, 2000);

    return () => clearTimeout(timer);
  }, [animated, coordinates]);

  // Generate stitch marks
  const stitchMarks = useMemo(() => {
    const marks: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
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
        });
      }
    }

    return marks;
  }, [coordinates]);

  const instanceId = useMemo(
    () => `cyber-${Math.random().toString(36).substr(2, 9)}`,
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
        {/* Glow filter */}
        <filter
          id={`${instanceId}-glow`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation={GLOW_CONFIG.blur} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient */}
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

      {/* Background glow layer */}
      {animationComplete && (
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 4}
          opacity={GLOW_CONFIG.opacity}
          filter={`url(#${instanceId}-glow)`}
        />
      )}

      {/* Main stitch path */}
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

      {/* Stitch marks */}
      {animationComplete &&
        stitchMarks.map((mark, index) => (
          <g
            key={`stitch-${index}`}
            className="transition-opacity duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
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
          </g>
        ))}

      {/* Start marker */}
      <g opacity={animationComplete ? 1 : 0.5}>
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

      {/* End marker - Snake head */}
      {coordinates.length > 1 && animationComplete && (
        <g className="animate-pulse">
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

      {/* Progress indicator */}
      {isAnimating && (
        <text
          x={width / 2}
          y={height - 20}
          textAnchor="middle"
          fill={color}
          fontSize="10"
          fontFamily="monospace"
          className="animate-pulse"
        >
          GENERATING CYBER-WEAVE...
        </text>
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
          NOKIA CYBER-WEAVE
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
