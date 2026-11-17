import GameOverDialog from "@/app/games/components/GameOverDialog";
import OverlayBanner from "@/app/games/components/OverlayBanner";
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
        <OverlayBanner>
          <p className="text-sm sm:text-lg font-mono tracking-[0.4em] text-slate-300">
            ROUND {w.round}
          </p>
          <p className="text-6xl sm:text-8xl font-black text-lime-300 drop-shadow-lg">
            {Math.max(1, Math.ceil(w.timer))}
          </p>
        </OverlayBanner>
      )}

      {w.phase === "roundOver" && (
        <OverlayBanner className="bg-black/30">
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
        </OverlayBanner>
      )}

      {w.phase === "matchOver" && (
        <GameOverDialog
          title={won ? "VICTORY" : "DEFEAT"}
          titleClassName={won ? "text-lime-300" : "text-red-500"}
          message={
            won
              ? "Doctor goes where he pleases."
              : "The other Doctor went where he pleased."
          }
          detail={`${player.roundsWon} – ${cpu.roundsWon} vs ${AI_PROFILES[w.difficulty].label} CPU`}
          highlight={`SESSION ${record.wins}W · ${record.losses}L`}
          primaryAction={{
            label: "REMATCH",
            onClick: () => startMatch(w.difficulty),
            className: "bg-lime-500 hover:bg-lime-400 text-slate-950",
          }}
          secondaryAction={{ label: "CHANGE DIFFICULTY", onClick: backToMenu }}
        />
      )}
    </>
  );
}
