"use client";

import type { SSStoneProps } from "../../interfaces/SteppingStoneTypes";

const SLAB =
  "relative flex h-14 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-2 font-bold sm:h-16 sm:w-28 lg:h-20 lg:w-36";
const STONE_COLORS =
  "border-stone-500/60 bg-gradient-to-b from-stone-400 to-stone-600 text-stone-900";

export default function SSStone({
  side,
  stoneNumber,
  kind,
  checkpoint,
  broken,
  disabled,
  onChoose,
}: SSStoneProps) {
  if (kind !== "active") {
    const onCheckpoint = kind === "platform" && checkpoint;
    return (
      <div
        aria-hidden="true"
        className={`${SLAB} ${
          onCheckpoint
            ? "border-emerald-400/60 bg-gradient-to-b from-emerald-500 to-emerald-700 text-emerald-950"
            : STONE_COLORS
        }`}
      >
        <span className="text-[10px] sm:text-xs lg:text-sm">
          {onCheckpoint ? "Checkpoint" : `Stone ${stoneNumber}`}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onChoose(side)}
      disabled={disabled}
      aria-label={`Jump to the ${side} stone for stone ${stoneNumber}`}
      className={`${SLAB} transition-colors
        ${
          broken
            ? "border-red-500/70 bg-red-950/40 text-red-300"
            : `${STONE_COLORS} hover:from-stone-300 hover:to-stone-500`
        }
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300
      `}
    >
      <span className="absolute inset-x-0 top-1 text-[9px] uppercase tracking-widest text-stone-800/70 sm:text-[10px]">
        {side}
      </span>
      <span className="mt-2 text-[10px] sm:text-xs lg:text-sm">
        {broken ? "Crumbling…" : `Stone ${stoneNumber}`}
      </span>
    </button>
  );
}
