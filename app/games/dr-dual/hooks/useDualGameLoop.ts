"use client";

import { useEffect, useState } from "react";
import type { UseDualGameLoopOptions } from "../interfaces/DrDualTypes";
import { aiStep, createBrain } from "../utils/ai";
import { AI_PROFILES } from "../utils/constants";
import { step } from "../utils/simulation";

/* longest simulated frame, so a tab switch does not teleport fighters */
const MAX_FRAME_SECONDS = 0.05;

/**
 * Drives the simulation with requestAnimationFrame while `active`: runs the
 * CPU brain, steps the world, reports the match result once, and re-renders
 * every frame. A new `runId` restarts the loop with a fresh CPU brain.
 */
export default function useDualGameLoop({
  world,
  active,
  runId,
  onMatchOver,
}: UseDualGameLoopOptions): void {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!active || !world.current) return;
    const brain = createBrain();
    let raf: number;
    let last = performance.now();

    const frame = (now: number) => {
      const w = world.current;
      if (!w) return;
      const dt = Math.min(MAX_FRAME_SECONDS, (now - last) / 1000);
      last = now;
      aiStep(w, "cpu", brain, AI_PROFILES[w.difficulty], dt);
      step(w, dt);
      if (w.phase === "matchOver" && !w.recorded) {
        w.recorded = true;
        onMatchOver(w.matchWinner);
      }
      setTick((t) => t + 1);
      /* keep running until the last damage numbers fade out */
      const done = w.phase === "matchOver" && w.floaters.length === 0;
      if (!done) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [world, active, runId, onMatchOver]);
}
