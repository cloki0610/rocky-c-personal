"use client";

import { useEffect, useRef, useState } from "react";
import type { UseBoardScaleResult } from "../interfaces/GamesTypes";

/**
 * Scales a fixed-width board to fit its container: attach `boardRef` to the
 * container and multiply world pixels by `scale`. Re-measures on resize and
 * whenever `enabled` turns on (for boards that mount after a menu screen).
 */
export default function useBoardScale(
  width: number,
  enabled = true,
): UseBoardScaleResult {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!enabled) return;
    const el = boardRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, enabled]);

  return { boardRef, scale };
}
