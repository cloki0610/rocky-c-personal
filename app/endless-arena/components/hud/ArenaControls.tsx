import type { ArenaControlsProps } from "../../interfaces/EndlessArenaTypes";
import { rangedDesc } from "../../utils/game";

export default function ArenaControls({
  player: p,
  changeFighter,
}: ArenaControlsProps) {
  const rangedMode = p.ranged.mode;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 font-mono">
      <span>
        <span className="text-slate-200">↑ ↓ ← →</span> move + aim
      </span>
      <span>
        <span className="text-amber-300">A</span> melee · {p.melee.dmg} dmg
      </span>
      <span>
        <span className="text-cyan-300">S</span> {p.ranged.label} ·{" "}
        {rangedDesc(p.ranged)}
        {rangedMode === "stun" && (
          <span className="text-slate-600"> · all minions</span>
        )}
      </span>
      <button
        onClick={changeFighter}
        className="ml-auto text-slate-500 hover:text-slate-300 underline"
      >
        change fighter
      </button>
    </div>
  );
}
