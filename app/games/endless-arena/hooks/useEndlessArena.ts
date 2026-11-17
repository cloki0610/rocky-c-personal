"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useBoardScale from "@/app/games/hooks/useBoardScale";
import type {
  ArenaScreen,
  ClassId,
  World,
  UseEndlessArenaResult,
} from "../interfaces/EndlessArenaTypes";
import { VIEW_W } from "../utils/constants";
import { initWorld, step } from "../utils/game";
import useArenaControls from "./useArenaControls";

export default function useEndlessArena(): UseEndlessArenaResult {
  const [screen, setScreen] = useState<ArenaScreen>("select");
  const world = useRef<World | null>(null);
  const [, setTick] = useState(0);
  const [runId, setRunId] = useState(0);
  const [best, setBest] = useState(0);
  const active = screen === "game";
  const { keys, resetKeys } = useArenaControls(active);
  const { boardRef, scale } = useBoardScale(VIEW_W, active);

  const startGame = useCallback(
    (clsId: ClassId) => {
      world.current = initWorld(clsId);
      resetKeys();
      setScreen("game");
      setRunId((r) => r + 1);
    },
    [resetKeys],
  );

  /* main loop */
  useEffect(() => {
    if (!active || !world.current) return;
    let raf: number;
    let last = performance.now();

    const frame = (now: number) => {
      const w = world.current;
      if (!w) return;
      const dt = Math.min(0.05, (now - last) / 1000); // clamp after tab-switch
      last = now;
      step(w, keys.current, dt, now);
      if (w.phase === "lost" && !w.recorded) {
        w.recorded = true;
        setBest((b) => Math.max(b, w.stage));
      }
      setTick((t) => t + 1);
      const done = w.phase === "lost" && w.corpses.length === 0;
      if (!done) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [runId, active, keys]);

  const changeFighter = useCallback(() => setScreen("select"), []);

  return {
    screen,
    world: world.current,
    boardRef,
    scale,
    best,
    startGame,
    changeFighter,
  };
}
