"use client";

import { useCallback } from "react";

/**
 * useNokiaSound - Sound effects hook for Nokia-themed interactions
 *
 * Provides audio feedback for key UI interactions.
 * Sound files should be placed in /public/sounds/
 *
 * Expected files:
 * - /public/sounds/click.mp3
 * - /public/sounds/scan-success.mp3
 * - /public/sounds/startup.mp3
 *
 * TODO: Replace console.log with actual useSound calls when MP3 files are added
 */

// Sound file paths (for future implementation)
const SOUND_PATHS = {
  click: "/sounds/click.mp3",
  scanSuccess: "/sounds/scan-success.mp3",
  startup: "/sounds/startup.mp3",
} as const;

type SoundType = keyof typeof SOUND_PATHS;

interface UseNokiaSoundReturn {
  playClick: () => void;
  playScanSuccess: () => void;
  playStartup: () => void;
  playSound: (type: SoundType) => void;
}

export function useNokiaSound(): UseNokiaSoundReturn {
  // Placeholder implementation - logs to console
  // When MP3 files are added, uncomment useSound implementation below

  /*
  // Future implementation with use-sound:
  import useSound from 'use-sound';
  
  const [playClickSound] = useSound(SOUND_PATHS.click, { volume: 0.5 });
  const [playScanSuccessSound] = useSound(SOUND_PATHS.scanSuccess, { volume: 0.7 });
  const [playStartupSound] = useSound(SOUND_PATHS.startup, { volume: 0.6 });
  */

  const playClick = useCallback(() => {
    console.log("[SFX] Playing Sound: click");
    // playClickSound();
  }, []);

  const playScanSuccess = useCallback(() => {
    console.log("[SFX] Playing Sound: scan-success");
    // playScanSuccessSound();
  }, []);

  const playStartup = useCallback(() => {
    console.log("[SFX] Playing Sound: startup");
    // playStartupSound();
  }, []);

  const playSound = useCallback((type: SoundType) => {
    console.log(`[SFX] Playing Sound: ${type}`);
    // Switch to appropriate sound
  }, []);

  return {
    playClick,
    playScanSuccess,
    playStartup,
    playSound,
  };
}

export default useNokiaSound;
