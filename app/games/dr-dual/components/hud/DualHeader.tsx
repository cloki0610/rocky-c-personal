import type { DualHeaderProps } from "../../interfaces/DrDualTypes";
import { AI_PROFILES } from "../../utils/constants";

export default function DualHeader({ world: w, backToMenu }: DualHeaderProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h1 className="text-xl sm:text-3xl font-black tracking-tight">
        DR.<span className="text-lime-400"> DUAL</span>
      </h1>
      <div className="flex items-baseline gap-3 text-xs sm:text-sm font-mono">
        <span className="text-slate-300">ROUND {w.round}</span>
        <span className="text-slate-500">
          {AI_PROFILES[w.difficulty].label.toUpperCase()} CPU
        </span>
        <button
          onClick={backToMenu}
          className="text-slate-500 hover:text-slate-300 underline"
        >
          menu
        </button>
      </div>
    </div>
  );
}
