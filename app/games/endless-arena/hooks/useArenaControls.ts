"use client";

import useHeldKeys from "@/app/games/hooks/useHeldKeys";
import type { UseHeldKeysResult } from "@/app/games/interfaces/GamesTypes";
import { TRACKED_KEYS } from "../utils/constants";

/**
 * Player input during a run: arrow keys move and aim, A/S attack. The held
 * keys live in a ref that the simulation step reads every frame.
 */
export default function useArenaControls(active: boolean): UseHeldKeysResult {
  return useHeldKeys(TRACKED_KEYS, active);
}
