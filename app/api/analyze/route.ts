import { NextRequest, NextResponse } from "next/server";

// Fabric types and their characteristics
const fabricTypes = [
  "DENIM",
  "COTTON",
  "WOOL",
  "SILK",
  "POLYESTER",
  "LINEN",
  "LEATHER",
];

const damageTypes = [
  "TEAR",
  "HOLE",
  "WORN AREA",
  "FRAYING",
  "STAIN",
  "RIP",
  "MOTH DAMAGE",
];

const repairTypes = [
  "SNAKE STITCH",
  "RUNNING STITCH",
  "BLANKET STITCH",
  "INVISIBLE MEND",
  "PATCH REPAIR",
  "DARNING",
];

const difficulties = ["EASY", "MEDIUM", "HARD", "EXPERT"];

// Generate a snake-like path of coordinates for the repair
function generateSnakePath(
  centerX: number,
  centerY: number,
  segments: number = 12
): Array<{ x: number; y: number }> {
  const coordinates: Array<{ x: number; y: number }> = [];
  const amplitude = 30 + Math.random() * 20;
  const wavelength = 40 + Math.random() * 20;

  // Random starting angle for variety
  const startAngle = Math.random() * Math.PI * 2;

  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    const angle = startAngle + progress * Math.PI;

    // Create a snake-like wavy path
    const waveOffset = Math.sin(i * 0.8) * amplitude;
    const x = centerX + Math.cos(angle) * (50 + progress * 80) + waveOffset * 0.5;
    const y = centerY + Math.sin(angle) * (30 + progress * 60) + waveOffset;

    coordinates.push({
      x: Math.round(x),
      y: Math.round(y),
    });
  }

  return coordinates;
}

export async function POST(request: NextRequest) {
  try {
    // Simulate processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Parse the request body
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Send the image to OpenAI Vision API
    // 2. Get fabric analysis and damage detection
    // 3. Calculate optimal repair path
    //
    // Example OpenAI integration (uncomment when ready):
    // import OpenAI from 'openai';
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4-vision-preview",
    //   messages: [
    //     {
    //       role: "user",
    //       content: [
    //         { type: "text", text: "Analyze this fabric image. Identify the fabric type, any damage, and suggest a repair method." },
    //         { type: "image_url", image_url: { url: image } }
    //       ]
    //     }
    //   ],
    //   max_tokens: 500,
    // });

    // Mock analysis result
    const fabricIndex = Math.floor(Math.random() * fabricTypes.length);
    const damageIndex = Math.floor(Math.random() * damageTypes.length);
    const repairIndex = Math.floor(Math.random() * repairTypes.length);
    const difficultyIndex = Math.floor(Math.random() * difficulties.length);

    // Generate snake stitch coordinates
    // Center of the image (assuming 640x480)
    const centerX = 320 + (Math.random() - 0.5) * 100;
    const centerY = 240 + (Math.random() - 0.5) * 100;
    const segments = 10 + Math.floor(Math.random() * 8);

    const coordinates = generateSnakePath(centerX, centerY, segments);

    // Calculate snake score based on repair complexity
    const snakeScore = Math.floor(
      100 + 
      (segments * 10) + 
      (difficultyIndex * 50) + 
      Math.random() * 100
    );

    const result = {
      fabric: fabricTypes[fabricIndex],
      damageType: damageTypes[damageIndex],
      coordinates,
      repairType: repairTypes[repairIndex],
      difficulty: difficulties[difficultyIndex],
      snakeScore: Math.min(snakeScore, 999), // Cap at 999
      timestamp: new Date().toISOString(),
      analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "OPERATIONAL",
    service: "MEND-AR Analysis API",
    version: "3.31.0",
    timestamp: new Date().toISOString(),
  });
}

