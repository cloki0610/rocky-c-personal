"use client";

import { useCallback, useState } from "react";
import useKeyDown from "@/app/games/hooks/useKeyDown";
import type {
  ClassId,
  UseCharacterSelectControlsResult,
} from "../interfaces/EndlessArenaTypes";
import { CLASS_LIST } from "../utils/constants";

/**
 * Fighter selection input: ← → cycle through the classes and Enter or Space
 * starts a run with the highlighted one.
 */
export default function useCharacterSelectControls(
  onStart: (clsId: ClassId) => void,
): UseCharacterSelectControlsResult {
  const [index, setIndex] = useState(0);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setIndex(
          (i) =>
            (e.key === "ArrowLeft" ? i + CLASS_LIST.length - 1 : i + 1) %
            CLASS_LIST.length,
        );
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onStart(CLASS_LIST[index].id);
      }
    },
    [index, onStart],
  );
  useKeyDown(onKeyDown);

  return { index, select: setIndex };
}
