import type { SSHeaderProps } from "../../interfaces/SteppingStoneTypes";
import SSHearts from "./SSHearts";

export default function SSHeader({ world, best }: SSHeaderProps) {
  const bestScore = Math.max(best, world.furthest);
  return (
    <div className="mb-4 flex w-full max-w-md lg:max-w-5xl items-end justify-between">
      <div>
        <h1 className="text-xl font-black tracking-wide text-sky-100 sm:text-2xl">
          STEPPING STONE
        </h1>
        <p className="font-mono text-xs text-sky-300/70">
          Crossed {world.stonesCrossed} · Best {bestScore}
        </p>
      </div>
      <SSHearts health={world.health} />
    </div>
  );
}
