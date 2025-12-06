"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Analysis data structure from AI
export interface AnalysisData {
  fabric: string;
  damageType: string;
  repairTechnique: string;
  marketValueOriginal: number;
  marketValueRepaired: number;
  // Computed fields
  valueIncrease: number;
  valueIncreasePercent: number;
  // Repair visualization data
  coordinates: Array<{ x: number; y: number }>;
  snakeScore: number;
  difficulty: string;
  timestamp: string;
  analysisId: string;
}

interface RepairContextType {
  // State
  capturedImage: string | null;
  analysisData: AnalysisData | null;
  isAnalyzing: boolean;
  error: string | null;
  
  // Actions
  setCapturedImage: (image: string | null) => void;
  setAnalysisData: (data: AnalysisData | null) => void;
  startAnalysis: (image: string) => Promise<AnalysisData>;
  clearSession: () => void;
}

const RepairContext = createContext<RepairContextType | undefined>(undefined);

export function RepairProvider({ children }: { children: ReactNode }) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (image: string): Promise<AnalysisData> => {
    setIsAnalyzing(true);
    setError(null);
    setCapturedImage(image);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data: AnalysisData = await response.json();
      
      // Compute derived values
      data.valueIncrease = data.marketValueRepaired - data.marketValueOriginal;
      data.valueIncreasePercent = data.marketValueOriginal > 0 
        ? Math.round((data.valueIncrease / data.marketValueOriginal) * 100)
        : 0;

      setAnalysisData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    setCapturedImage(null);
    setAnalysisData(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return (
    <RepairContext.Provider
      value={{
        capturedImage,
        analysisData,
        isAnalyzing,
        error,
        setCapturedImage,
        setAnalysisData,
        startAnalysis,
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

