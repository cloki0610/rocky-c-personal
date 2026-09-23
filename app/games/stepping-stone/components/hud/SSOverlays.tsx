import type { SSOverlaysProps } from "../../interfaces/SteppingStoneTypes";

export default function SSOverlays({ world, best, restart }: SSOverlaysProps) {
  if (world.phase !== "gameover") return null;
  const bestScore = Math.max(best, world.furthest);
  const newBest = world.furthest > 0 && world.furthest >= bestScore;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 text-center shadow-2xl ring-1 ring-slate-700 sm:p-8">
        <h2 className="mb-1 text-3xl font-black text-red-500 sm:text-4xl">
          YOU FELL
        </h2>
        <p className="mb-1 text-sm text-slate-400">
          You reached stone {world.furthest}.
        </p>
        <p className="mb-6 font-mono text-xs text-amber-400">
          {newBest ? "NEW BEST" : `BEST — ${bestScore} STONES`}
        </p>
        <button
          onClick={restart}
          className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-bold tracking-wide transition hover:bg-emerald-500 active:scale-95"
        >
          RESTART
        </button>
      </div>
    </div>
  );
}
