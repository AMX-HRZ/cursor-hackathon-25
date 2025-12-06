"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * useRepairHistory - localStorage persistence for repair history
 *
 * Manages:
 * - Saved repairs array
 * - Total profit tracking
 * - Snake length (gamification)
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SavedRepair {
  id: string;
  date: string;
  img: string;
  profit: number;
  optionName: string;
  snakePoints: number;
  fabric?: string;
  technique?: string;
}

export interface ProfileStats {
  totalProfit: number;
  totalSaves: number;
  snakeLength: number;
  carbonOffset: number;
}

const STORAGE_KEY = "mend_ar_history";
const INITIAL_SNAKE_LENGTH = 3;

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useRepairHistory() {
  const [history, setHistory] = useState<SavedRepair[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("[RepairHistory] Failed to load:", error);
      setHistory([]);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("[RepairHistory] Failed to save:", error);
    }
  }, [history, isLoaded]);

  /**
   * Save a new repair to history
   */
  const saveRepair = useCallback(
    (repairData: Omit<SavedRepair, "id" | "date">) => {
      const newRepair: SavedRepair = {
        ...repairData,
        id: `repair-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
      };

      setHistory((prev) => [newRepair, ...prev]);

      return newRepair;
    },
    []
  );

  /**
   * Get aggregated profile stats
   */
  const getProfileStats = useCallback((): ProfileStats => {
    const totalProfit = history.reduce((sum, repair) => sum + repair.profit, 0);
    const totalSaves = history.length;
    const snakeLength = INITIAL_SNAKE_LENGTH + totalSaves;
    // Carbon offset: ~0.5kg CO2 saved per garment repair (vs buying new)
    const carbonOffset = Math.round(totalSaves * 0.5 * 10) / 10;

    return {
      totalProfit,
      totalSaves,
      snakeLength,
      carbonOffset,
    };
  }, [history]);

  /**
   * Get repair history (newest first)
   */
  const getHistory = useCallback((): SavedRepair[] => {
    return [...history];
  }, [history]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  /**
   * Delete a specific repair
   */
  const deleteRepair = useCallback((id: string) => {
    setHistory((prev) => prev.filter((repair) => repair.id !== id));
  }, []);

  return {
    history,
    isLoaded,
    saveRepair,
    getProfileStats,
    getHistory,
    clearHistory,
    deleteRepair,
  };
}

export default useRepairHistory;
