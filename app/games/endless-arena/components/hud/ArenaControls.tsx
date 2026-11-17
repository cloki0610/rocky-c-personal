import ControlHints from "@/app/games/components/ControlHints";
import type { ArenaControlsProps } from "../../interfaces/EndlessArenaTypes";
import { rangedDesc } from "../../utils/game";

export default function ArenaControls({
  player: p,
  changeFighter,
}: ArenaControlsProps) {
  return (
    <ControlHints
      hints={[
        { keys: "↑ ↓ ← →", label: "move + aim" },
        {
          keys: "A",
          keyClassName: "text-amber-300",
          label: `melee · ${p.melee.dmg} dmg`,
        },
        {
          keys: "S",
          keyClassName: "text-cyan-300",
          label: (
            <>
              {p.ranged.label} · {rangedDesc(p.ranged)}
              {p.ranged.mode === "stun" && (
                <span className="text-slate-600"> · all minions</span>
              )}
            </>
          ),
        },
      ]}
    >
      <button
        onClick={changeFighter}
        className="ml-auto text-slate-500 hover:text-slate-300 underline"
      >
        change fighter
      </button>
    </ControlHints>
  );
}
