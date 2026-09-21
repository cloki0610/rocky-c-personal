import type { ArenaOverlaysProps } from "../../interfaces/EndlessArenaTypes";
import { isBossStage } from "../../utils/game";

export default function ArenaOverlays({
  world: w,
  best,
  startGame,
  changeFighter,
}: ArenaOverlaysProps) {
  const cls = w.player.cls;
  return (
    <>
      {w.phase === "clearing" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl sm:text-4xl font-black tracking-[0.3em] text-amber-300 drop-shadow-lg">
            STAGE CLEAR
          </p>
          <p className="mt-2 text-sm font-mono text-slate-300 animate-pulse">
            STAGE {w.stage + 1} INCOMING
            {isBossStage(w.stage + 1) && (
              <span className="text-orange-400"> · BOSS</span>
            )}
          </p>
        </div>
      )}

      {w.phase === "lost" && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 ring-1 ring-slate-700 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-1 text-red-500">
              DEFEATED
            </h2>
            <p className="text-slate-400 mb-1 text-sm">
              Your {cls.name} fell on stage {w.stage}.
            </p>
            <p className="text-amber-400 font-mono text-xs mb-6">
              {w.stage >= best ? "NEW BEST" : `BEST — STAGE ${best}`}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => startGame(cls.id)}
                className={`w-full ${cls.btn} active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide`}
              >
                RETRY AS {cls.name.toUpperCase()}
              </button>
              <button
                onClick={changeFighter}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide text-slate-300"
              >
                CHANGE FIGHTER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
