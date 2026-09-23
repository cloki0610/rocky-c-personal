"use client";

import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import type { SSPlayerProps } from "../../interfaces/SteppingStoneTypes";
import {
  FALL_DEPTH,
  FALL_DURATION_S,
  JUMP_DURATION_S,
  JUMP_PEAK,
  PAN_DURATION_S,
  ROW_Y,
  columnX,
} from "../../utils/constants";

const pct = (n: number) => `${n}%`;

export default function SSPlayer({
  world,
  columns,
  onLand,
  onFallComplete,
}: SSPlayerProps) {
  const reduceMotion = useReducedMotion();
  const seconds = (s: number) => (reduceMotion ? 0.01 : s);
  const fromY = ROW_Y[world.standingOn ?? "start"];
  const hereX = columnX(0, columns);
  const nextX = columnX(1, columns);

  let animate: TargetAndTransition;
  let transition: Transition;

  if (world.phase === "jumping" && world.jumpSide) {
    const toY = ROW_Y[world.jumpSide];
    /* null starts from the current position, so a jump mid-pan stays smooth */
    animate = {
      left: [null, pct((hereX + nextX) / 2), pct(nextX)],
      top: [null, pct(Math.min(fromY, toY) - JUMP_PEAK), pct(toY)],
      rotate: [0, -10, 0],
      opacity: 1,
      scale: 1,
    };
    transition = {
      duration: seconds(JUMP_DURATION_S),
      times: [0, 0.5, 1],
      left: { duration: seconds(JUMP_DURATION_S), ease: "linear" },
      top: {
        duration: seconds(JUMP_DURATION_S),
        times: [0, 0.5, 1],
        ease: ["easeOut", "easeIn"],
      },
    };
  } else if (world.phase === "falling" && world.fallSide) {
    animate = {
      left: pct(nextX),
      top: pct(ROW_Y[world.fallSide] + FALL_DEPTH),
      rotate: world.fallSide === "bottom" ? 200 : -200,
      opacity: 0,
      scale: 0.7,
    };
    transition = {
      duration: seconds(FALL_DURATION_S),
      delay: seconds(0.12),
      ease: "easeIn",
    };
  } else if (world.phase === "gameover") {
    animate = { opacity: 0 };
    transition = { duration: seconds(0.2) };
  } else {
    /* after a safe landing this pans back with the platform; after a fall
       the player is invisible while moving and fades in once in place */
    animate = {
      left: pct(hereX),
      top: pct(fromY),
      rotate: 0,
      opacity: 1,
      scale: 1,
    };
    transition = {
      duration: seconds(PAN_DURATION_S),
      ease: "easeInOut",
      opacity: {
        duration: seconds(0.2),
        delay: seconds(PAN_DURATION_S),
      },
    };
  }

  const handleComplete = () => {
    if (world.phase === "jumping") onLand();
    else if (world.phase === "falling") onFallComplete();
  };

  return (
    <motion.div
      initial={{ left: pct(hereX), top: pct(fromY), opacity: 1 }}
      animate={animate}
      transition={transition}
      onAnimationComplete={handleComplete}
      className="pointer-events-none absolute z-20"
      aria-hidden="true"
    >
      <div className="-mt-6 flex h-9 w-9 -translate-x-1/2 -translate-y-full flex-col items-center sm:-mt-7 lg:-mt-9">
        <span className="h-4 w-4 rounded-full bg-amber-300 ring-2 ring-amber-100" />
        <span className="mt-0.5 h-4 w-3 rounded-b-full rounded-t-sm bg-amber-400" />
      </div>
    </motion.div>
  );
}
