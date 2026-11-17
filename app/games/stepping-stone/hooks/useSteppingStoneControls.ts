"use client";

import { useCallback } from "react";
import useKeyDown from "@/app/games/hooks/useKeyDown";
import { normalizeKey } from "@/app/games/utils/keyboard";
import type { Side } from "../interfaces/SteppingStoneTypes";
import { sideForKey } from "../utils/keyboard";

/* ArrowUp/W jumps to the top stone and ArrowDown/S to the bottom one */
export default function useSteppingStoneControls(
  choose: (side: Side) => void,
): void {
  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const side = sideForKey(normalizeKey(event));
      if (!side) return;
      event.preventDefault();
      choose(side);
    },
    [choose],
  );
  useKeyDown(onKeyDown);
}
