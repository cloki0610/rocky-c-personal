"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  ArenaScreen,
  ClassId,
  KeyState,
  World,
  UseEndlessArenaResult,
} from "../interfaces/EndlessArenaTypes";
import { TRACKED_KEYS, VIEW_W } from "../utils/constants";
import { initWorld, step } from "../utils/game";
import { normalizeKey } from "../utils/keyboard";

export default function useEndlessArena(): UseEndlessArenaResult {
  const [screen, setScreen] = useState<ArenaScreen>("select");
  const world = useRef<World | null>(null);
  const keys = useRef<KeyState>({});
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [, setTick] = useState(0);
  const [runId, setRunId] = useState(0);
  const [scale, setScale] = useState(1);
  const [best, setBest] = useState(0);

  const startGame = useCallback((clsId: ClassId) => {
    world.current = initWorld(clsId);
    keys.current = {};
    setScreen("game");
    setRunId((r) => r + 1);
  }, []);

  /* keyboard — refs only, so no re-render per keypress */
  useEffect(() => {
    if (screen !== "game") return;
    const down = (e: KeyboardEvent) => {
      const k = normalizeKey(e);
      if (!TRACKED_KEYS.includes(k)) return;
      e.preventDefault();
      keys.current[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = normalizeKey(e);
      if (!TRACKED_KEYS.includes(k)) return;
      e.preventDefault();
      keys.current[k] = false;
    };
    const blur = () => (keys.current = {});
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [screen]);

  /* responsive: scale the 800x600 stage to fit its container */
  useEffect(() => {
    if (screen !== "game") return;
    const el = boardRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / VIEW_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [screen]);

  /* main loop */
  useEffect(() => {
    if (screen !== "game" || !world.current) return;
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
  }, [runId, screen]);

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
