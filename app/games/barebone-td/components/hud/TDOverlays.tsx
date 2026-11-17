import GameOverDialog from "@/app/games/components/GameOverDialog";
import type { TDOverlaysProps } from "../../interfaces/BareboneTDTypes";

export default function TDOverlays({
  world: w,
  best,
  restart,
}: TDOverlaysProps) {
  if (w.phase !== "gameover") return null;
  return (
    <GameOverDialog
      title="BASE OVERRUN"
      message={`Your defenses fell on wave ${w.wave}.`}
      highlight={w.wave >= best ? "NEW BEST" : `BEST — WAVE ${best}`}
      primaryAction={{ label: "RESTART", onClick: restart }}
    />
  );
}
