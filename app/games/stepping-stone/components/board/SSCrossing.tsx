"use client";

import { AnimatePresence } from "framer-motion";
import useSceneColumns from "../../hooks/useSceneColumns";
import type { SSCrossingProps } from "../../interfaces/SteppingStoneTypes";
import { STONES_PER_CHECKPOINT } from "../../utils/game";
import SSColumn from "./SSColumn";
import SSPlayer from "./SSPlayer";

export default function SSCrossing({
  world,
  choose,
  land,
  acknowledgeFall,
}: SSCrossingProps) {
  const columns = useSceneColumns();
  const stoneNumber = world.stonesCrossed + 1;
  const toCheckpoint = STONES_PER_CHECKPOINT - world.sinceCheckpoint;
  /* after a safe landing the bridge slides left and a new column enters from
     the right; after a fall the player is sent back to the checkpoint or
     start, and the rewound bridge fades in instead */
  const arrivedByLanding =
    world.stonesCrossed > 0 && (world.sinceCheckpoint > 0 || world.justHealed);
  const returnPoint = world.checkpointSide
    ? "the last checkpoint"
    : "the start";

  const statusText =
    world.phase === "jumping"
      ? `Jumping to the ${world.jumpSide} stone.`
      : world.phase === "falling"
        ? world.health > 0
          ? `The ${world.fallSide} stone gave way. ${world.health} health remaining. Returning to ${returnPoint}.`
          : `The ${world.fallSide} stone gave way.`
        : world.phase === "gameover"
          ? `Game over. You reached stone ${world.furthest}.`
          : world.justHealed
            ? "Checkpoint reached. Health fully restored."
            : `Choose the top or bottom stone for stone ${stoneNumber}.`;

  return (
    <div className="relative w-full max-w-md lg:max-w-5xl rounded-3xl bg-sky-950/60 ring-1 ring-sky-400/20 p-6 sm:p-8">
      <p role="status" aria-live="polite" className="sr-only">
        {statusText}
      </p>

      <div className="mb-2 flex items-center justify-between text-xs sm:text-sm font-mono text-sky-200/80">
        <span>STONE {stoneNumber}</span>
        <span>{toCheckpoint} to checkpoint</span>
      </div>

      {world.justHealed && (
        <div className="absolute top-2 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-mono tracking-wide text-emerald-300 ring-1 ring-emerald-400/40">
          SAFE GROUND — HEALTH RESTORED
        </div>
      )}

      <div className="relative h-64 w-full overflow-x-clip lg:h-72">
        <AnimatePresence>
          {Array.from({ length: columns }, (_, index) => {
            const n = world.stonesCrossed + index;
            return (
              <SSColumn
                key={n}
                world={world}
                stoneNumber={n}
                index={index}
                columns={columns}
                slideIn={arrivedByLanding}
                choose={choose}
              />
            );
          })}
        </AnimatePresence>
        <SSPlayer
          world={world}
          columns={columns}
          onLand={land}
          onFallComplete={acknowledgeFall}
        />
      </div>
    </div>
  );
}
