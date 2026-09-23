"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  Side,
  UseSteppingStoneResult,
} from "../interfaces/SteppingStoneTypes";
import { HEAL_TOAST_MS } from "../utils/constants";
import {
  acknowledgeFall as acknowledgeFallAction,
  acknowledgeHeal,
  chooseStone,
  initWorld,
  landJump,
} from "../utils/game";
import { normalizeKey, sideForKey } from "../utils/keyboard";

export default function useSteppingStone(): UseSteppingStoneResult {
  const [world, setWorld] = useState(initWorld);
  const [best, setBest] = useState(0);

  useEffect(() => {
    if (world.phase === "gameover") setBest((b) => Math.max(b, world.furthest));
  }, [world.phase, world.furthest]);

  /* the checkpoint toast is transient; clear it once it has had time to show */
  useEffect(() => {
    if (!world.justHealed) return;
    const timer = setTimeout(
      () => setWorld((w) => acknowledgeHeal(w)),
      HEAL_TOAST_MS,
    );
    return () => clearTimeout(timer);
  }, [world.justHealed]);

  const choose = useCallback((side: Side) => {
    setWorld((w) => chooseStone(w, side));
  }, []);

  const land = useCallback(() => {
    setWorld((w) => landJump(w));
  }, []);

  const acknowledgeFall = useCallback(() => {
    setWorld((w) => acknowledgeFallAction(w));
  }, []);

  const restart = useCallback(() => setWorld(initWorld()), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const side = sideForKey(normalizeKey(event));
      if (!side) return;
      event.preventDefault();
      choose(side);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose]);

  return { world, best, choose, land, acknowledgeFall, restart };
}
