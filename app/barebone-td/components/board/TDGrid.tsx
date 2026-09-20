import type { TDGridProps } from "../../interfaces/BareboneTDTypes";
import { COLS, ROWS, TILE, TOWER_DEFS } from "../../utils/constants";
import { isPathCell } from "../../utils/game";

export default function TDGrid({
  selectedTower,
  towers,
  placeCell,
}: TDGridProps) {
  const occupied = new Set(towers.map((t) => `${t.row},${t.col}`));
  const def = selectedTower ? TOWER_DEFS[selectedTower] : null;

  return (
    <div className="absolute top-0 left-0">
      {Array.from({ length: ROWS }, (_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: COLS }, (_, c) => {
            if (isPathCell(r, c)) {
              return (
                <div
                  key={c}
                  aria-hidden
                  className="shrink-0 bg-amber-900/40 border border-amber-950/40"
                  style={{ width: TILE, height: TILE }}
                />
              );
            }
            const taken = occupied.has(`${r},${c}`);
            return (
              <button
                key={c}
                type="button"
                onClick={() => placeCell(r, c)}
                aria-label={`Row ${r + 1}, column ${c + 1}${
                  taken
                    ? ", tower placed, select tower"
                    : def
                      ? `, place ${def.name}`
                      : ", buildable"
                }`}
                className={`shrink-0 border border-slate-800/60 transition focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 ${
                  taken
                    ? "bg-slate-800/70 hover:bg-slate-800/90 cursor-pointer"
                    : "bg-slate-800/40 hover:bg-slate-700/70 cursor-pointer"
                }`}
                style={{ width: TILE, height: TILE }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
