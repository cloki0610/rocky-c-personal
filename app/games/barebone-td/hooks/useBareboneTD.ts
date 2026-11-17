"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useBoardScale from "@/app/games/hooks/useBoardScale";
import type { UseBareboneTDResult, World } from "../interfaces/BareboneTDTypes";
import { GRID_W } from "../utils/constants";
import { initWorld, step } from "../utils/game";
import useTDControls from "./useTDControls";

/**
 * Owns the world and the simulation loop; composes the board scaling and the
 * player's controls around one shared world ref.
 */
export default function useBareboneTD(): UseBareboneTDResult {
  const [initialWorld] = useState(initWorld);
  const world = useRef<World>(initialWorld);
  const simNow = useRef(0);
  const [, setTick] = useState(0);
  const [best, setBest] = useState(0);
  const { boardRef, scale } = useBoardScale(GRID_W);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const { resetControls, ...controls } = useTDControls({ world, refresh });
  const speedRef = useRef(controls.speed);

  useEffect(() => {
    speedRef.current = controls.speed;
  }, [controls.speed]);

  /* main loop, driven by a simulated clock so speed-up affects everything uniformly */
  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const frame = (real: number) => {
      const w = world.current;
      const realDt = Math.min(0.05, (real - last) / 1000);
      last = real;
      const dt = realDt * speedRef.current;
      simNow.current += dt * 1000;
      step(w, dt, simNow.current);
      if (w.phase === "gameover" && !w.recorded) {
        w.recorded = true;
        setBest((b) => Math.max(b, w.wave));
      }
      setTick((t) => t + 1);
      const done =
        w.phase === "gameover" &&
        w.impacts.length === 0 &&
        w.projectiles.length === 0;
      if (!done) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const restart = useCallback(() => {
    world.current = initWorld();
    simNow.current = 0;
    resetControls();
    refresh();
  }, [resetControls, refresh]);

  return {
    world: world.current,
    boardRef,
    scale,
    best,
    now: simNow.current,
    restart,
    ...controls,
  };
}
