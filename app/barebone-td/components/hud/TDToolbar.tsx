import type { TDToolbarProps } from "../../interfaces/BareboneTDTypes";
import { TOWER_LIST } from "../../utils/constants";

export default function TDToolbar({
  gold,
  selectedTower,
  waveActive,
  selectTower,
}: TDToolbarProps) {
  return (
    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
      {TOWER_LIST.map((def) => {
        const affordable = gold >= def.cost && !waveActive;
        const active = selectedTower === def.type;
        return (
          <button
            key={def.type}
            type="button"
            onClick={() => selectTower(def.type)}
            disabled={!affordable}
            aria-pressed={active}
            aria-label={`${def.name}, cost ${def.cost} gold${active ? ", selected" : ""}`}
            className={`flex flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition ring-2 ${
              active ? def.ring : "ring-transparent"
            } ${
              affordable
                ? "bg-slate-800 hover:bg-slate-700"
                : "bg-slate-800/40 text-slate-500 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-2 text-sm font-bold">
              <span
                className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black text-slate-950"
                style={{ backgroundColor: def.color }}
              >
                {def.label}
              </span>
              {def.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {def.description}
            </span>
            <span className="text-xs font-mono text-amber-300">
              {def.cost}g
            </span>
          </button>
        );
      })}
    </div>
  );
}
