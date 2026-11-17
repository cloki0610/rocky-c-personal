"use client";

import { useEffect } from "react";

/**
 * Calls `onKeyDown` for every window keydown while `enabled`. Pass a stable
 * (memoized) handler so the listener is not re-attached on every render.
 */
export default function useKeyDown(
  onKeyDown: (event: KeyboardEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown, enabled]);
}
