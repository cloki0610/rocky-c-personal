"use client";

import { useCallback, useEffect, useRef } from "react";
import type { KeyState, UseHeldKeysResult } from "../interfaces/GamesTypes";
import { normalizeKey } from "../utils/keyboard";

/**
 * Tracks which of `trackedKeys` are held while `enabled`, in a ref so key
 * presses never trigger a re-render. Losing window focus releases every key.
 */
export default function useHeldKeys(
  trackedKeys: readonly string[],
  enabled = true,
): UseHeldKeysResult {
  const keys = useRef<KeyState>({});

  const resetKeys = useCallback(() => {
    keys.current = {};
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const set = (pressed: boolean) => (e: KeyboardEvent) => {
      const k = normalizeKey(e);
      if (!trackedKeys.includes(k)) return;
      e.preventDefault();
      keys.current[k] = pressed;
    };
    const down = set(true);
    const up = set(false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", resetKeys);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", resetKeys);
    };
  }, [trackedKeys, enabled, resetKeys]);

  return { keys, resetKeys };
}
