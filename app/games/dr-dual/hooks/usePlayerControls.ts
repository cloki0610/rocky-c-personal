"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import type {
  AbilityKey,
  ClickMarker,
  UsePlayerControlsOptions,
  UsePlayerControlsResult,
  Vec,
} from "../interfaces/DrDualTypes";
import { ARENA_W, FIGHTER_R, SPAWNS } from "../utils/constants";
import { castAbility, commandAttack, commandMove } from "../utils/game";
import { dist } from "../utils/helpers";
import { abilityKeyFor } from "../utils/keyboard";

/* clicks this close to the opponent's centre become attack orders */
const ATTACK_CLICK_SLACK = 14;

/**
 * Player input: maps the pointer onto the scaled arena for move/attack
 * orders and aiming, and casts Q/W/E/R from the keyboard or ability buttons.
 */
export default function usePlayerControls({
  world,
  active,
}: UsePlayerControlsOptions): UsePlayerControlsResult {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const aim = useRef<Vec>({ ...SPAWNS.cpu });
  const marker = useRef<ClickMarker | null>(null);
  const holdingMove = useRef(false);
  const [scale, setScale] = useState(1);

  const resetControls = useCallback(() => {
    aim.current = { ...SPAWNS.cpu };
    marker.current = null;
    holdingMove.current = false;
  }, []);

  const cast = useCallback(
    (key: AbilityKey) => {
      const w = world.current;
      if (w) castAbility(w, "player", key, aim.current);
    },
    [world],
  );

  /* abilities: Q W E R, aimed at the last cursor position on the arena */
  useEffect(() => {
    if (!active) return;
    const down = (e: KeyboardEvent) => {
      const key = abilityKeyFor(e);
      if (!key || !world.current) return;
      e.preventDefault();
      cast(key);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [active, world, cast]);

  /* responsive: scale the fixed-size arena to fit its container */
  useEffect(() => {
    if (!active) return;
    const el = boardRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / ARENA_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const toWorld = useCallback(
    (clientX: number, clientY: number): Vec | null => {
      const el = boardRef.current;
      if (!el || scale === 0) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [scale],
  );

  /* left or right click: on the opponent attacks, anywhere else moves */
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const w = world.current;
      if (!w || (e.button !== 0 && e.button !== 2)) return;
      const p = toWorld(e.clientX, e.clientY);
      if (!p) return;
      e.preventDefault();
      aim.current = p;
      const onFoe =
        dist(p, w.fighters.cpu.pos) <= FIGHTER_R + ATTACK_CLICK_SLACK;
      const ordered = onFoe
        ? commandAttack(w, "player")
        : commandMove(w, "player", p);
      holdingMove.current = ordered && !onFoe;
      if (ordered) {
        e.currentTarget.setPointerCapture(e.pointerId);
        marker.current = {
          pos: onFoe ? { ...w.fighters.cpu.pos } : p,
          kind: onFoe ? "attack" : "move",
          at: w.time,
        };
      }
    },
    [world, toWorld],
  );

  /* track the cursor for aiming; holding the button keeps steering */
  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const p = toWorld(e.clientX, e.clientY);
      if (!p) return;
      aim.current = p;
      const w = world.current;
      if (w && holdingMove.current) commandMove(w, "player", p);
    },
    [world, toWorld],
  );

  const onPointerUp = useCallback(() => {
    holdingMove.current = false;
  }, []);

  const onContextMenu = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => e.preventDefault(),
    [],
  );

  return {
    boardRef,
    scale,
    aim: aim.current,
    marker: marker.current,
    resetControls,
    castFromButton: cast,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onContextMenu,
  };
}
