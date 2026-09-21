import type { TDTowerPanelProps } from "../../interfaces/BareboneTDTypes";
import {
  MAX_TOWER_LEVEL,
  SELL_REFUND_RATE,
  TOWER_DEFS,
  UPGRADE_DAMAGE_MULT,
  UPGRADE_DURATION_MS,
} from "../../utils/constants";
import { getUpgradeCost } from "../../utils/game";

export default function TDTowerPanel({
  tower,
  gold,
  waveActive,
  upgradeTower,
  sellTower,
  close,
}: TDTowerPanelProps) {
  if (!tower) return null;
  const def = TOWER_DEFS[tower.type];
  const maxed = tower.level >= MAX_TOWER_LEVEL;
  const upgradeCost = getUpgradeCost(tower);
  const canUpgrade = !maxed && !waveActive && gold >= upgradeCost;
  const refund = Math.round(tower.totalCost * SELL_REFUND_RATE);
  const levelBonus = tower.level - 1;
  const isDurationTower = def.slowDuration != null;
  const stat = isDurationTower
    ? `${((def.slowDuration! + UPGRADE_DURATION_MS * levelBonus) / 1000).toFixed(2)}s slow`
    : `${Math.round(def.damage * (1 + UPGRADE_DAMAGE_MULT * levelBonus))} dmg`;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-800 ring-2 px-4 py-3">
      <div>
        <div className="flex items-center gap-2 text-sm font-bold">
          <span
            className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black text-slate-950"
            style={{ backgroundColor: def.color }}
          >
            {def.label}
          </span>
          {def.name} · Lv {tower.level}
        </div>
        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
          {stat}
          {!maxed && (
            <span className="text-slate-500">
              {" "}
              → next:{" "}
              {isDurationTower
                ? `${((def.slowDuration! + UPGRADE_DURATION_MS * tower.level) / 1000).toFixed(2)}s`
                : `${Math.round(def.damage * (1 + UPGRADE_DAMAGE_MULT * tower.level))} dmg`}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={upgradeTower}
          disabled={!canUpgrade}
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 active:scale-95 transition"
        >
          {maxed ? "MAX LEVEL" : `UPGRADE ${upgradeCost}g`}
        </button>
        <button
          type="button"
          onClick={sellTower}
          disabled={waveActive}
          className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide bg-red-700 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-400 active:scale-95 transition"
        >
          SELL +{refund}g
        </button>
        <button
          type="button"
          onClick={close}
          aria-label="Close tower panel"
          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-700 hover:bg-slate-600 active:scale-95 transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
