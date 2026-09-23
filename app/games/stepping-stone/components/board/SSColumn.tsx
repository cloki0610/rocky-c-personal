"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  SSColumnProps,
  Side,
  StoneKind,
} from "../../interfaces/SteppingStoneTypes";
import { PAN_DURATION_S, ROW_Y, columnX } from "../../utils/constants";
import { STONES_PER_CHECKPOINT } from "../../utils/game";
import SSStone from "./SSStone";

const SIDES: Side[] = ["top", "bottom"];

/* one stone position on the bridge; columns are keyed by stone number, so
   they slide left together as the player advances */
export default function SSColumn({
  world,
  stoneNumber,
  index,
  columns,
  slideIn,
  choose,
}: SSColumnProps) {
  const reduceMotion = useReducedMotion();
  const seconds = (s: number) => (reduceMotion ? 0.01 : s);
  const kind: StoneKind =
    index === 0 ? "platform" : index === 1 ? "active" : "preview";
  const checkpoint =
    stoneNumber > 0 && stoneNumber % STONES_PER_CHECKPOINT === 0;
  const left = (i: number) => `${columnX(i, columns)}%`;
  const sides =
    kind === "platform" ? (world.standingOn ? [world.standingOn] : []) : SIDES;

  return (
    <motion.div
      initial={{ left: left(slideIn ? index + 1 : index), opacity: 0 }}
      animate={{ left: left(index), opacity: 1 }}
      exit={{ left: left(index - 1), opacity: 0 }}
      transition={{ duration: seconds(PAN_DURATION_S), ease: "easeInOut" }}
      className="absolute inset-y-0"
    >
      {checkpoint && kind !== "platform" && (
        <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-widest text-emerald-300 sm:text-[10px]">
          CHECKPOINT
        </span>
      )}

      {kind === "platform" && stoneNumber === 0 && (
        <div
          aria-hidden="true"
          className="absolute flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-end justify-center rounded-2xl border-2 border-emerald-700/60 bg-gradient-to-b from-emerald-700 to-emerald-900 pb-1.5 font-mono text-[10px] tracking-widest text-emerald-200/80 sm:h-16 sm:w-28 sm:text-xs lg:h-20 lg:w-36"
          style={{ top: `${ROW_Y.start}%` }}
        >
          START
        </div>
      )}

      <AnimatePresence>
        {sides.map((side) => {
          const broken =
            kind === "active" &&
            world.phase === "falling" &&
            world.fallSide === side;
          return (
            <motion.div
              /* retries gives a fresh stone after a fall; the landed stone
                 keeps its key as it turns from the jump target into the platform */
              key={`${side}-${world.retries}`}
              initial={{ opacity: 0 }}
              animate={
                broken
                  ? {
                      opacity: 0.35,
                      y: 36,
                      rotate: side === "top" ? -8 : 8,
                    }
                  : { opacity: kind === "preview" ? 0.5 : 1, y: 0, rotate: 0 }
              }
              exit={{ opacity: 0 }}
              transition={{
                duration: seconds(broken ? 0.5 : 0.3),
                ease: broken ? "easeIn" : "easeOut",
              }}
              className="absolute"
              style={{ top: `${ROW_Y[side]}%` }}
            >
              <SSStone
                side={side}
                stoneNumber={stoneNumber}
                kind={kind}
                checkpoint={checkpoint}
                broken={broken}
                disabled={world.phase !== "playing"}
                onChoose={choose}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
