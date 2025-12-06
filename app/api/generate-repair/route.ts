import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface GenerateTechPackRequest {
  image: string;
  fabric: string;
  damageType: string;
}

interface GenerateTechPackResponse {
  success: boolean;
  techPackImage?: string;
  description?: string;
  error?: string;
}

// ============================================
// TECH PACK PROMPT - Premium Embroidery Design
// ============================================

const TECH_PACK_PROMPT = `Create a TECH PACK for this garment showing premium decorative embroidery placement.

CRITICAL RULES:
1. KEEP THE EXACT COLORS of the original garment - if shirt is brown, tech pack shows brown
2. MINIMAL information - only what's essential
3. The embroidery must look INTENTIONAL and PREMIUM, NOT like a repair

DESIGN LANGUAGE:
• Ornamental embroidery inspired by folk art, ceremonial motifs, symbolic iconography
• Balanced symmetry or centered placement
• Rich thread textures, visible stitching depth, hand-crafted feel

MOTIF OPTIONS (choose one that fits):
• Floral elements
• Symbolic emblems
• Skull / mask iconography
• Heritage patterns
• Decorative accents radiating from center

COLOR PALETTE:
• Contrasting but HARMONIOUS embroidery colors
• Vibrant highlights against the garment's base color

PLACEMENT:
• Position embroidery exactly over the defect area
• Make it the visual FOCAL POINT
• Align with garment structure (chest center, upper torso, sleeve, seam line)

FINISH STYLE:
• High-fashion sportswear / lifestyle crossover
• Looks like LIMITED-EDITION design, not a correction
• Clean edges, precise stitching, production-ready

OUTPUT FORMAT:
- Technical flat drawing of the garment (front view)
- Same garment color as the original photo
- Show embroidery design placement with detail callout
- Clean, minimal, professional tech pack style
`;

// ============================================
// GEMINI API CONFIGURATION
// ============================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ============================================
// TECH PACK GENERATION
// ============================================

async function generateTechPack(
  imageBase64: string,
  fabric: string,
  damageType: string
): Promise<{ image: string; description: string } | null> {
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    let mimeType = "image/jpeg";
    if (imageBase64.startsWith("data:image/png")) {
      mimeType = "image/png";
    } else if (imageBase64.startsWith("data:image/webp")) {
      mimeType = "image/webp";
    }

    const contextPrompt = `
${TECH_PACK_PROMPT}

GARMENT INFO:
- Fabric: ${fabric}
- Defect: ${damageType}

Generate the tech pack now. Remember: SAME COLORS as original, premium embroidery design, minimal info.
`;

    const prompt = [
      { text: contextPrompt },
      {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      },
    ];

    console.log("[RETHREAD] Generating premium embroidery tech pack...");

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    let generatedImage: string | null = null;
    let description = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          description = part.text;
        } else if (part.inlineData) {
          generatedImage = part.inlineData.data || null;
        }
      }
    }

    if (generatedImage) {
      return {
        image: `data:image/png;base64,${generatedImage}`,
        description: description || "Premium embroidery tech pack generated",
      };
    }

    return null;
  } catch (error) {
    console.error("[RETHREAD] Gemini error:", error);
    return null;
  }
}

// ============================================
// API HANDLER
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTechPackRequest = await request.json();
    const { image, fabric, damageType } = body;

    if (!image) {
      return NextResponse.json<GenerateTechPackResponse>(
        { success: false, error: "No image provided" },
        { status: 400 }
      );
    }

    const result = await generateTechPack(
      image,
      fabric || "COTTON",
      damageType || "TEAR"
    );

    if (result) {
      return NextResponse.json<GenerateTechPackResponse>({
        success: true,
        techPackImage: result.image,
        description: result.description,
      });
    }

    return NextResponse.json<GenerateTechPackResponse>({
      success: false,
      error: "Tech pack generation failed. Please try again.",
    });
  } catch (error) {
    console.error("[RETHREAD] Error:", error);
    return NextResponse.json<GenerateTechPackResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "OPERATIONAL",
    service: "RETHREAD Premium Embroidery Tech Pack Generator",
    version: "2.1.0",
    timestamp: new Date().toISOString(),
  });
}
