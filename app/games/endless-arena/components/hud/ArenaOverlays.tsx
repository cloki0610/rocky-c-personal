import GameOverDialog from "@/app/games/components/GameOverDialog";
import OverlayBanner from "@/app/games/components/OverlayBanner";
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
        <OverlayBanner>
          <p className="text-2xl sm:text-4xl font-black tracking-[0.3em] text-amber-300 drop-shadow-lg">
            STAGE CLEAR
          </p>
          <p className="mt-2 text-sm font-mono text-slate-300 animate-pulse">
            STAGE {w.stage + 1} INCOMING
            {isBossStage(w.stage + 1) && (
              <span className="text-orange-400"> · BOSS</span>
            )}
          </p>
        </OverlayBanner>
      )}

      {w.phase === "lost" && (
        <GameOverDialog
          title="DEFEATED"
          message={`Your ${cls.name} fell on stage ${w.stage}.`}
          highlight={w.stage >= best ? "NEW BEST" : `BEST — STAGE ${best}`}
          primaryAction={{
            label: `RETRY AS ${cls.name.toUpperCase()}`,
            onClick: () => startGame(cls.id),
            className: cls.btn,
          }}
          secondaryAction={{ label: "CHANGE FIGHTER", onClick: changeFighter }}
        />
      )}
    </>
  );
}
