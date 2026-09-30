import type { DualOverlaysProps } from "../../interfaces/DrDualTypes";
import { AI_PROFILES } from "../../utils/constants";

export default function DualOverlays({
  world: w,
  record,
  startMatch,
  backToMenu,
}: DualOverlaysProps) {
  const { player, cpu } = w.fighters;
  const won = w.matchWinner === "player";

  return (
    <>
      {w.phase === "countdown" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm sm:text-lg font-mono tracking-[0.4em] text-slate-300">
            ROUND {w.round}
          </p>
          <p className="text-6xl sm:text-8xl font-black text-lime-300 drop-shadow-lg">
            {Math.max(1, Math.ceil(w.timer))}
          </p>
        </div>
      )}

      {w.phase === "roundOver" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/30">
          <p
            className={`text-3xl sm:text-5xl font-black tracking-widest drop-shadow-lg ${
              w.roundWinner === "player"
                ? "text-sky-300"
                : w.roundWinner === "cpu"
                  ? "text-rose-400"
                  : "text-slate-200"
            }`}
          >
            {w.roundWinner === "player"
              ? "ROUND WON"
              : w.roundWinner === "cpu"
                ? "ROUND LOST"
                : "DOUBLE KO"}
          </p>
          <p className="mt-2 text-sm font-mono text-slate-300">
            YOU {player.roundsWon} – {cpu.roundsWon} CPU
          </p>
        </div>
      )}

      {w.phase === "matchOver" && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 ring-1 ring-slate-700 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full shadow-2xl">
            <h2
              className={`text-3xl sm:text-4xl font-black mb-1 ${
                won ? "text-lime-300" : "text-red-500"
              }`}
            >
              {won ? "VICTORY" : "DEFEAT"}
            </h2>
            <p className="text-slate-400 mb-1 text-sm">
              {won
                ? "Doctor goes where he pleases."
                : "The other Doctor went where he pleased."}
            </p>
            <p className="text-slate-300 font-mono text-xs mb-1">
              {player.roundsWon} – {cpu.roundsWon} vs{" "}
              {AI_PROFILES[w.difficulty].label} CPU
            </p>
            <p className="text-amber-400 font-mono text-xs mb-6">
              SESSION {record.wins}W · {record.losses}L
            </p>
            <div className="space-y-2">
              <button
                onClick={() => startMatch(w.difficulty)}
                className="w-full bg-lime-500 hover:bg-lime-400 text-slate-950 active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide"
              >
                REMATCH
              </button>
              <button
                onClick={backToMenu}
                className="w-full bg-slate-800 hover:bg-slate-700 active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide text-slate-300"
              >
                CHANGE DIFFICULTY
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
