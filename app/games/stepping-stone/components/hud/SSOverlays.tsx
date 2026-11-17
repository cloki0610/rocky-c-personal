import GameOverDialog from "@/app/games/components/GameOverDialog";
import type { SSOverlaysProps } from "../../interfaces/SteppingStoneTypes";

export default function SSOverlays({ world, best, restart }: SSOverlaysProps) {
  if (world.phase !== "gameover") return null;
  const bestScore = Math.max(best, world.furthest);
  const newBest = world.furthest > 0 && world.furthest >= bestScore;

  return (
    <GameOverDialog
      className="rounded-3xl"
      title="YOU FELL"
      message={`You reached stone ${world.furthest}.`}
      highlight={newBest ? "NEW BEST" : `BEST — ${bestScore} STONES`}
      primaryAction={{ label: "RESTART", onClick: restart }}
    />
  );
}
