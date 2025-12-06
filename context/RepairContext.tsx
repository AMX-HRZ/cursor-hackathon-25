"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface AnalysisData {
  fabric: string;
  damageType: string;
  timestamp: string;
  analysisId: string;
}

export interface TechPackData {
  image: string;
  description?: string;
  isLoading: boolean;
  error?: string;
}

interface RepairContextType {
  capturedImage: string | null;
  analysisData: AnalysisData | null;
  techPack: TechPackData | null;
  isAnalyzing: boolean;
  error: string | null;

  setCapturedImage: (image: string | null) => void;
  setAnalysisData: (data: AnalysisData | null) => void;
  startAnalysis: (image: string) => Promise<AnalysisData>;
  generateTechPack: () => Promise<string | null>;
  clearSession: () => void;
}

// ============================================
// CONTEXT
// ============================================

const RepairContext = createContext<RepairContextType | undefined>(undefined);

export function RepairProvider({ children }: { children: ReactNode }) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [techPack, setTechPack] = useState<TechPackData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(
    async (image: string): Promise<AnalysisData> => {
      setIsAnalyzing(true);
      setError(null);
      setCapturedImage(image);
      setTechPack(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image }),
        });

        if (!response.ok) {
          throw new Error(`Analysis failed: ${response.statusText}`);
        }

        const data = await response.json();

        // Simplified analysis data
        const analysisResult: AnalysisData = {
          fabric: data.fabric,
          damageType: data.damageType,
          timestamp: data.timestamp,
          analysisId: data.analysisId,
        };

        setAnalysisData(analysisResult);
        return analysisResult;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        throw err;
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const generateTechPack = useCallback(async (): Promise<string | null> => {
    if (!capturedImage || !analysisData) {
      return null;
    }

    if (techPack?.image && !techPack.error) {
      return techPack.image;
    }

    if (techPack?.isLoading) {
      return null;
    }

    setTechPack({ image: "", isLoading: true });

    try {
      const response = await fetch("/api/generate-repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: capturedImage,
          fabric: analysisData.fabric,
          damageType: analysisData.damageType,
        }),
      });

      const result = await response.json();

      if (result.success && result.techPackImage) {
        setTechPack({
          image: result.techPackImage,
          description: result.description,
          isLoading: false,
        });
        return result.techPackImage;
      } else {
        setTechPack({
          image: "",
          error: result.error || "Generation failed",
          isLoading: false,
        });
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setTechPack({
        image: "",
        error: errorMessage,
        isLoading: false,
      });
      return null;
    }
  }, [capturedImage, analysisData, techPack]);

  const clearSession = useCallback(() => {
    setCapturedImage(null);
    setAnalysisData(null);
    setTechPack(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <RepairContext.Provider
      value={{
        capturedImage,
        analysisData,
        techPack,
        isAnalyzing,
        error,
        setCapturedImage,
        setAnalysisData,
        startAnalysis,
        generateTechPack,
        clearSession,
      }}
    >
      {children}
    </RepairContext.Provider>
  );
}

export function useRepair() {
  const context = useContext(RepairContext);
  if (context === undefined) {
    throw new Error("useRepair must be used within a RepairProvider");
  }
  return context;
}

export default RepairContext;
