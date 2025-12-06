import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ============================================
// DEMO MODE FLAG - Set to false for production
// ============================================
const DEMO_MODE = true;

// ============================================
// TYPE DEFINITIONS
// ============================================
export interface RepairOption {
  id: number;
  name: string;
  description: string;
  type: "basic" | "trend" | "cyber";
  cost: number;
  value_increase: number;
  time: number;
  difficulty: "LOW" | "MED" | "HIGH";
  coordinates: Array<{ x: number; y: number }>;
}

export interface AnalysisResponse {
  fabric: string;
  damageType: string;
  options: RepairOption[];
  timestamp: string;
  analysisId: string;
}

// ============================================
// DEMO DATA - Hardcoded response for demos
// ============================================
const DEMO_RESPONSE: AnalysisResponse = {
  fabric: "Vintage Denim",
  damageType: "TEAR",
  options: [
    {
      id: 1,
      name: "INVISIBLE MEND",
      description: "Standard darning. Minimal visual impact.",
      type: "basic",
      cost: 5,
      value_increase: 15,
      time: 10,
      difficulty: "LOW",
      coordinates: generateSnakePath(320, 240, 8),
    },
    {
      id: 2,
      name: "SASHIKO FLOWER",
      description: "Trending geometric floral pattern.",
      type: "trend",
      cost: 12,
      value_increase: 45,
      time: 25,
      difficulty: "MED",
      coordinates: generateSnakePath(320, 240, 12),
    },
    {
      id: 3,
      name: "NOKIA CYBER-WEAVE",
      description: "Signature reinforced digital stitch.",
      type: "cyber",
      cost: 20,
      value_increase: 85,
      time: 5,
      difficulty: "HIGH",
      coordinates: generateSnakePath(320, 240, 16),
    },
  ],
  timestamp: new Date().toISOString(),
  analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
};

// ============================================
// PRICING ALGORITHM
// ============================================
const PRICING_CONFIG = {
  fabricBaseValues: {
    DENIM: 45,
    COTTON: 25,
    WOOL: 80,
    SILK: 120,
    POLYESTER: 15,
    LINEN: 55,
    LEATHER: 150,
    CASHMERE: 200,
    VINTAGE: 95,
    "VINTAGE DENIM": 65,
  } as Record<string, number>,

  damageDepreciation: {
    TEAR: 0.3,
    HOLE: 0.25,
    "WORN AREA": 0.5,
    FRAYING: 0.6,
    STAIN: 0.4,
    RIP: 0.2,
    "MOTH DAMAGE": 0.35,
  } as Record<string, number>,
};

// ============================================
// SNAKE PATH GENERATION
// ============================================
function generateSnakePath(
  centerX: number = 320,
  centerY: number = 240,
  segments: number = 12
): Array<{ x: number; y: number }> {
  const coordinates: Array<{ x: number; y: number }> = [];
  const amplitude = 25 + Math.random() * 15;
  const pathLength = 150 + Math.random() * 100;

  const angle = Math.random() * Math.PI * 2;
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);

  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    const distance = progress * pathLength - pathLength / 2;
    const wave = Math.sin(progress * Math.PI * 2.5) * amplitude;

    const x = centerX + dirX * distance - dirY * wave;
    const y = centerY + dirY * distance + dirX * wave;

    coordinates.push({
      x: Math.round(Math.max(50, Math.min(590, x))),
      y: Math.round(Math.max(50, Math.min(430, y))),
    });
  }

  return coordinates;
}

// ============================================
// OPTION GENERATORS
// ============================================
function generateRepairOptions(
  fabric: string,
  damageType: string
): RepairOption[] {
  const baseValue = PRICING_CONFIG.fabricBaseValues[fabric.toUpperCase()] || 40;
  const depreciation =
    PRICING_CONFIG.damageDepreciation[damageType.toUpperCase()] || 0.4;
  const scrapValue = Math.round(baseValue * depreciation);

  return [
    {
      id: 1,
      name: "INVISIBLE MEND",
      description: "Standard darning. Minimal visual impact.",
      type: "basic",
      cost: Math.round(scrapValue * 0.15),
      value_increase: Math.round(baseValue * 0.35),
      time: 10,
      difficulty: "LOW",
      coordinates: generateSnakePath(320, 240, 8),
    },
    {
      id: 2,
      name: "SASHIKO FLOWER",
      description: "Trending geometric floral pattern.",
      type: "trend",
      cost: Math.round(scrapValue * 0.35),
      value_increase: Math.round(baseValue * 0.75),
      time: 25,
      difficulty: "MED",
      coordinates: generateSnakePath(320, 240, 12),
    },
    {
      id: 3,
      name: "NOKIA CYBER-WEAVE",
      description: "Signature reinforced digital stitch.",
      type: "cyber",
      cost: Math.round(scrapValue * 0.6),
      value_increase: Math.round(baseValue * 1.2),
      time: 5,
      difficulty: "HIGH",
      coordinates: generateSnakePath(320, 240, 16),
    },
  ];
}

// ============================================
// OPENAI INTEGRATION
// ============================================
async function analyzeWithOpenAI(
  imageBase64: string
): Promise<{ fabric: string; damageType: string } | null> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "your-api-key-here") {
    console.log("[MEND-AR] No OpenAI key found, using mock data");
    return null;
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a textile analysis AI for the MEND-AR clothing repair system. 
Analyze fabric images and return JSON with fabric identification.
Always respond with valid JSON only, no markdown or explanation.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this fabric image and return a JSON object with these exact fields:
{
  "fabric": "string - type of fabric (DENIM, COTTON, WOOL, SILK, LINEN, LEATHER, CASHMERE, POLYESTER, or VINTAGE DENIM)",
  "damageType": "string - type of damage (TEAR, HOLE, WORN AREA, FRAYING, STAIN, RIP, or MOTH DAMAGE)"
}
Return ONLY the JSON object, no other text.`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith("data:")
                  ? imageBase64
                  : `data:image/jpeg;base64,${imageBase64}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const aiData = JSON.parse(jsonMatch[0]);
    return {
      fabric: aiData.fabric?.toUpperCase() || "DENIM",
      damageType: aiData.damageType?.toUpperCase() || "TEAR",
    };
  } catch (error) {
    console.error("[MEND-AR] OpenAI error:", error);
    return null;
  }
}

// ============================================
// API ROUTE HANDLER
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // DEMO MODE: Return hardcoded data immediately
    if (DEMO_MODE) {
      console.log("[MEND-AR] DEMO_MODE enabled, returning hardcoded response");
      // Regenerate coordinates for fresh paths each time
      const demoData: AnalysisResponse = {
        ...DEMO_RESPONSE,
        options: DEMO_RESPONSE.options.map((opt) => ({
          ...opt,
          coordinates: generateSnakePath(
            320,
            240,
            opt.type === "basic" ? 8 : opt.type === "trend" ? 12 : 16
          ),
        })),
        timestamp: new Date().toISOString(),
        analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
      };
      return NextResponse.json(demoData);
    }

    // PRODUCTION MODE: Use OpenAI
    const aiAnalysis = await analyzeWithOpenAI(image);

    let analysisData: AnalysisResponse;

    if (aiAnalysis) {
      analysisData = {
        fabric: aiAnalysis.fabric,
        damageType: aiAnalysis.damageType,
        options: generateRepairOptions(
          aiAnalysis.fabric,
          aiAnalysis.damageType
        ),
        timestamp: new Date().toISOString(),
        analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
      };
    } else {
      // Fallback to demo data if AI fails
      analysisData = {
        ...DEMO_RESPONSE,
        options: DEMO_RESPONSE.options.map((opt) => ({
          ...opt,
          coordinates: generateSnakePath(
            320,
            240,
            opt.type === "basic" ? 8 : opt.type === "trend" ? 12 : 16
          ),
        })),
        timestamp: new Date().toISOString(),
        analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
      };
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("[MEND-AR] Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

// Health check
export async function GET() {
  const hasOpenAI =
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY !== "your-api-key-here";

  return NextResponse.json({
    status: "OPERATIONAL",
    service: "MEND-AR Analysis API",
    version: "4.0.0",
    mode: DEMO_MODE ? "DEMO_MODE" : hasOpenAI ? "AI_ENABLED" : "MOCK_MODE",
    timestamp: new Date().toISOString(),
  });
}
