import type {
  AbilityBarProps,
  AbilityKey,
  Fighter,
} from "../../interfaces/DrDualTypes";
import {
  ABILITIES,
  ABILITY_COOLDOWNS,
  BURN,
  CLEAVER,
} from "../../utils/constants";
import { abilityReady, sadismHeal, traumaBonus } from "../../utils/helpers";

/* live numbers so the low-health scaling of E and R is visible */
const detail = (f: Fighter, key: AbilityKey) => {
  if (key === "q") return `−${CLEAVER.cost} HP`;
  if (key === "w") return f.burning ? `ON · −${BURN.drain}/s` : "OFF";
  if (key === "e")
    return f.empowered > 0
      ? `ARMED +${traumaBonus(f.hp)}`
      : `+${traumaBonus(f.hp)} dmg`;
  return `+${sadismHeal(f.hp)} HP`;
};

export default function AbilityBar({
  fighter: f,
  canCast,
  castFromButton,
}: AbilityBarProps) {
  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {ABILITIES.map(({ key, name }) => {
        const cd = f.cooldowns[key];
        const ready = abilityReady(f, key);
        const active =
          (key === "w" && f.burning) ||
          (key === "e" && f.empowered > 0) ||
          (key === "r" && f.healTime > 0);
        const state =
          cd > 0 ? `${cd.toFixed(1)}s` : ready ? detail(f, key) : "LOW HP";
        return (
          <button
            key={key}
            type="button"
            disabled={!canCast || !ready}
            aria-pressed={key === "w" ? f.burning : undefined}
            aria-label={`${key.toUpperCase()}: ${name}, ${state}`}
            onClick={() => castFromButton(key)}
            className={`relative overflow-hidden rounded-lg px-2 py-2 text-left ring-1 transition active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 ${
              active
                ? "bg-lime-900/50 ring-lime-400"
                : "bg-slate-800/80 ring-slate-700 hover:enabled:bg-slate-700"
            }`}
          >
            {cd > 0 && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-black/55"
                style={{ height: `${(cd / ABILITY_COOLDOWNS[key]) * 100}%` }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <kbd className="text-lg sm:text-xl font-black font-mono text-lime-300">
                {key.toUpperCase()}
              </kbd>
              <span className="hidden sm:inline truncate text-xs font-bold text-slate-200">
                {name}
              </span>
            </span>
            <span
              className={`relative block text-[10px] sm:text-xs font-mono truncate ${
                cd > 0 || !ready ? "text-slate-500" : "text-slate-300"
              }`}
            >
              {state}
            </span>
          </button>
        );
      })}
    </div>
  );
}
