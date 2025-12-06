import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// ============================================
// PRICING ALGORITHM - Easy to tweak later
// ============================================
const PRICING_CONFIG = {
  // Base values by fabric type (in dollars)
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
  } as Record<string, number>,
  
  // Damage depreciation multipliers
  damageDepreciation: {
    TEAR: 0.3,      // 70% value loss
    HOLE: 0.25,     // 75% value loss
    "WORN AREA": 0.5,
    FRAYING: 0.6,
    STAIN: 0.4,
    RIP: 0.2,
    "MOTH DAMAGE": 0.35,
  } as Record<string, number>,
  
  // Repair value recovery multipliers
  repairRecovery: {
    "SNAKE STITCH": 0.85,     // Recovers 85% of original value
    "RUNNING STITCH": 0.75,
    "BLANKET STITCH": 0.80,
    "INVISIBLE MEND": 0.95,   // Best recovery
    "PATCH REPAIR": 0.70,
    "DARNING": 0.78,
    "SASHIKO": 0.90,          // Adds artistic value
  } as Record<string, number>,
  
  // Vintage/upcycle bonus multiplier
  upcycleBonus: 1.15,  // 15% bonus for visible mending trend
};

function calculateMarketValues(
  fabric: string,
  damageType: string,
  repairTechnique: string
): { original: number; repaired: number } {
  const baseValue = PRICING_CONFIG.fabricBaseValues[fabric.toUpperCase()] || 40;
  const depreciation = PRICING_CONFIG.damageDepreciation[damageType.toUpperCase()] || 0.4;
  const recovery = PRICING_CONFIG.repairRecovery[repairTechnique.toUpperCase()] || 0.75;
  
  // Damaged item value (scrap value)
  const originalValue = Math.round(baseValue * depreciation);
  
  // Repaired item value with upcycle bonus
  const repairedValue = Math.round(baseValue * recovery * PRICING_CONFIG.upcycleBonus);
  
  return {
    original: originalValue,
    repaired: repairedValue,
  };
}

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
  const wavelength = 35 + Math.random() * 15;
  const pathLength = 150 + Math.random() * 100;
  
  // Random direction
  const angle = Math.random() * Math.PI * 2;
  const dirX = Math.cos(angle);
  const dirY = Math.sin(angle);
  
  for (let i = 0; i < segments; i++) {
    const progress = i / (segments - 1);
    const distance = progress * pathLength - pathLength / 2;
    
    // Wave offset perpendicular to main direction
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
// MOCK DATA GENERATOR
// ============================================
const FABRIC_TYPES = ["DENIM", "COTTON", "WOOL", "SILK", "LINEN", "LEATHER", "CASHMERE"];
const DAMAGE_TYPES = ["TEAR", "HOLE", "WORN AREA", "FRAYING", "STAIN", "RIP"];
const REPAIR_TECHNIQUES = ["SNAKE STITCH", "SASHIKO", "INVISIBLE MEND", "DARNING", "BLANKET STITCH"];
const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

function generateMockAnalysis() {
  const fabric = FABRIC_TYPES[Math.floor(Math.random() * FABRIC_TYPES.length)];
  const damageType = DAMAGE_TYPES[Math.floor(Math.random() * DAMAGE_TYPES.length)];
  const repairTechnique = REPAIR_TECHNIQUES[Math.floor(Math.random() * REPAIR_TECHNIQUES.length)];
  const difficulty = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)];
  
  const { original, repaired } = calculateMarketValues(fabric, damageType, repairTechnique);
  const segments = 10 + Math.floor(Math.random() * 8);
  
  return {
    fabric,
    damageType,
    repairTechnique,
    marketValueOriginal: original,
    marketValueRepaired: repaired,
    coordinates: generateSnakePath(320, 240, segments),
    snakeScore: Math.floor(100 + segments * 15 + Math.random() * 200),
    difficulty,
    timestamp: new Date().toISOString(),
    analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
  };
}

// ============================================
// OPENAI INTEGRATION
// ============================================
async function analyzeWithOpenAI(imageBase64: string) {
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
Analyze fabric images and return JSON with repair recommendations.
Always respond with valid JSON only, no markdown or explanation.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this fabric image and return a JSON object with these exact fields:
{
  "fabric": "string - type of fabric (DENIM, COTTON, WOOL, SILK, LINEN, LEATHER, CASHMERE, or POLYESTER)",
  "damageType": "string - type of damage (TEAR, HOLE, WORN AREA, FRAYING, STAIN, RIP, or MOTH DAMAGE)",
  "repairTechnique": "string - recommended repair (SNAKE STITCH, SASHIKO, INVISIBLE MEND, DARNING, BLANKET STITCH, RUNNING STITCH, or PATCH REPAIR)",
  "difficulty": "string - skill level needed (BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT)"
}
Return ONLY the JSON object, no other text.`
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64.startsWith("data:") 
                  ? imageBase64 
                  : `data:image/jpeg;base64,${imageBase64}`,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });
    
    const content = response.choices[0]?.message?.content;
    if (!content) return null;
    
    // Parse AI response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    const aiData = JSON.parse(jsonMatch[0]);
    return {
      fabric: aiData.fabric?.toUpperCase() || "COTTON",
      damageType: aiData.damageType?.toUpperCase() || "TEAR",
      repairTechnique: aiData.repairTechnique?.toUpperCase() || "SNAKE STITCH",
      difficulty: aiData.difficulty?.toUpperCase() || "INTERMEDIATE",
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
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Try OpenAI first, fall back to mock
    const aiAnalysis = await analyzeWithOpenAI(image);
    
    let analysisData;
    
    if (aiAnalysis) {
      // Use AI analysis with calculated market values
      const { original, repaired } = calculateMarketValues(
        aiAnalysis.fabric,
        aiAnalysis.damageType,
        aiAnalysis.repairTechnique
      );
      
      const segments = 10 + Math.floor(Math.random() * 8);
      
      analysisData = {
        ...aiAnalysis,
        marketValueOriginal: original,
        marketValueRepaired: repaired,
        coordinates: generateSnakePath(320, 240, segments),
        snakeScore: Math.floor(100 + segments * 15 + Math.random() * 200),
        timestamp: new Date().toISOString(),
        analysisId: `MEND-${Date.now().toString(36).toUpperCase()}`,
      };
    } else {
      // Use mock data
      analysisData = generateMockAnalysis();
    }

    return NextResponse.json(analysisData);
  } catch (error) {
    console.error("[MEND-AR] Analysis error:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your-api-key-here";
  
  return NextResponse.json({
    status: "OPERATIONAL",
    service: "MEND-AR Analysis API",
    version: "3.31.0",
    mode: hasOpenAI ? "AI_ENABLED" : "MOCK_MODE",
    timestamp: new Date().toISOString(),
  });
}
