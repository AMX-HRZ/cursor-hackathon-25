/**
 * imageCompositor - Utility to composite captured image with SVG overlay
 *
 * Used when saving repairs to include the repair visualization in the saved image
 */

interface Coordinate {
  x: number;
  y: number;
}

type OverlayType = "basic" | "trend" | "cyber";

/**
 * Generate SVG path string from coordinates
 */
function generatePathFromCoordinates(
  coordinates: Coordinate[],
  type: OverlayType
): string {
  if (coordinates.length < 2) return "";

  let pathD = `M ${coordinates[0].x} ${coordinates[0].y}`;

  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];

    if (type === "cyber") {
      // Wavy path for cyber
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
    } else {
      pathD += ` L ${curr.x} ${curr.y}`;
    }
  }

  return pathD;
}

/**
 * Get color configuration for overlay type
 */
function getOverlayColors(type: OverlayType): {
  primary: string;
  secondary: string;
} {
  switch (type) {
    case "basic":
      return { primary: "#ffaa00", secondary: "#ffcc00" };
    case "trend":
      return { primary: "#ff00ff", secondary: "#00ffff" };
    case "cyber":
      return { primary: "#00ff00", secondary: "#00ffff" };
    default:
      return { primary: "#00ff00", secondary: "#00ffff" };
  }
}

/**
 * Composites an image with the repair overlay and returns a data URL
 */
export async function compositeImageWithOverlay(
  imageSrc: string,
  coordinates: Coordinate[],
  type: OverlayType,
  width: number = 640,
  height: number = 480
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Failed to get canvas context"));
      return;
    }

    // Load the base image
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Draw the base image
      ctx.drawImage(img, 0, 0, width, height);

      // Get colors for the overlay type
      const colors = getOverlayColors(type);

      // Draw the overlay path
      if (coordinates.length >= 2) {
        const path = generatePathFromCoordinates(coordinates, type);

        // Create path from string
        const path2D = new Path2D(path);

        // Draw glow effect
        ctx.save();
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 15;
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke(path2D);
        ctx.restore();

        // Draw main path
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke(path2D);

        // Draw highlight
        ctx.strokeStyle = colors.secondary;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.stroke(path2D);
        ctx.globalAlpha = 1;

        // Draw stitch marks
        for (let i = 0; i < coordinates.length - 1; i++) {
          const curr = coordinates[i];
          const next = coordinates[i + 1];

          const dx = next.x - curr.x;
          const dy = next.y - curr.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          if (len > 0) {
            const perpX = -dy / len;
            const perpY = dx / len;
            const stitchLen = 12;

            const midX = (curr.x + next.x) / 2;
            const midY = (curr.y + next.y) / 2;

            ctx.beginPath();
            ctx.moveTo(midX - perpX * stitchLen, midY - perpY * stitchLen);
            ctx.lineTo(midX + perpX * stitchLen, midY + perpY * stitchLen);
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw node circles
            ctx.beginPath();
            ctx.arc(
              midX - perpX * stitchLen,
              midY - perpY * stitchLen,
              3,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = "#0a0a0a";
            ctx.fill();
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(
              midX + perpX * stitchLen,
              midY + perpY * stitchLen,
              3,
              0,
              Math.PI * 2
            );
            ctx.fill();
            ctx.stroke();
          }
        }

        // Draw start marker
        ctx.beginPath();
        ctx.arc(coordinates[0].x, coordinates[0].y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#0a0a0a";
        ctx.fill();
        ctx.strokeStyle = colors.primary;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw "S" text
        ctx.fillStyle = colors.primary;
        ctx.font = "bold 10px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("S", coordinates[0].x, coordinates[0].y);

        // Draw end marker (snake head for cyber)
        const lastCoord = coordinates[coordinates.length - 1];
        ctx.beginPath();
        ctx.arc(lastCoord.x, lastCoord.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = colors.primary;
        ctx.shadowColor = colors.primary;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes for cyber type
        if (type === "cyber") {
          ctx.beginPath();
          ctx.arc(lastCoord.x - 4, lastCoord.y - 3, 2, 0, Math.PI * 2);
          ctx.fillStyle = "#0a0a0a";
          ctx.fill();
          ctx.beginPath();
          ctx.arc(lastCoord.x + 4, lastCoord.y - 3, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Add watermark
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
      ctx.font = "10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("RETHREAD", 10, height - 10);

      // Return the composite image
      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageSrc;
  });
}

export default compositeImageWithOverlay;
