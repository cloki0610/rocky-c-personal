import type {
  Fighter,
  FighterStatusProps,
  HealthBarProps,
} from "../../interfaces/DrDualTypes";
import { FIGHTER_NAMES, MAX_HP, ROUNDS_TO_WIN } from "../../utils/constants";

const HealthBar = ({ hp, color, label }: HealthBarProps) => (
  <div
    role="meter"
    aria-label={label}
    aria-valuemin={0}
    aria-valuemax={MAX_HP}
    aria-valuenow={Math.round(hp)}
    className="relative w-full h-4 bg-black/60 rounded-full overflow-hidden ring-1 ring-white/15"
  >
    <div
      className={`h-full ${color} transition-[width] duration-150 ease-out`}
      style={{ width: `${Math.max(0, (hp / MAX_HP) * 100)}%` }}
    />
    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white [text-shadow:0_1px_2px_#000]">
      {Math.ceil(hp)} / {MAX_HP}
    </span>
  </div>
);

const statuses = (f: Fighter) =>
  [
    f.burning && { label: "BURNING", cls: "text-orange-300 bg-orange-500/15" },
    f.empowered > 0 && {
      label: "EMPOWERED",
      cls: "text-red-300 bg-red-500/15",
    },
    f.healTime > 0 && {
      label: "SADISM",
      cls: "text-green-300 bg-green-500/15",
    },
    f.slow > 0 && { label: "SLOWED", cls: "text-sky-300 bg-sky-500/15" },
  ].filter((s): s is { label: string; cls: string } => Boolean(s));

function Side({ f, align }: { f: Fighter; align: "left" | "right" }) {
  const isPlayer = f.id === "player";
  const name = FIGHTER_NAMES[f.id];
  return (
    <div className={`flex-1 min-w-0 ${align === "right" ? "text-right" : ""}`}>
      <div
        className={`flex items-center gap-2 mb-1 ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        <span
          className={`text-xs font-black tracking-wider ${isPlayer ? "text-sky-300" : "text-rose-300"}`}
        >
          {name.toUpperCase()}
        </span>
        <span
          className="flex gap-1"
          aria-label={`${name}: ${f.roundsWon} of ${ROUNDS_TO_WIN} rounds won`}
        >
          {Array.from({ length: ROUNDS_TO_WIN }, (_, i) => (
            <span
              key={i}
              aria-hidden
              className={`w-2.5 h-2.5 rotate-45 ring-1 ring-amber-400/70 ${
                i < f.roundsWon ? "bg-amber-400" : "bg-transparent"
              }`}
            />
          ))}
        </span>
        <span
          className={`flex gap-1 overflow-hidden ${align === "right" ? "flex-row-reverse mr-auto" : "ml-auto"}`}
        >
          {statuses(f).map((s) => (
            <span
              key={s.label}
              className={`px-1 rounded text-[9px] sm:text-[10px] font-bold font-mono ${s.cls}`}
            >
              {s.label}
            </span>
          ))}
        </span>
      </div>
      <HealthBar
        hp={f.hp}
        color={isPlayer ? "bg-sky-500" : "bg-rose-500"}
        label={`${name} health`}
      />
    </div>
  );
}

export default function FighterStatus({ world: w }: FighterStatusProps) {
  return (
    <div className="mt-2 mb-3 flex items-end gap-4 sm:gap-8">
      <Side f={w.fighters.player} align="left" />
      <span className="pb-0.5 text-xs font-black text-slate-600">VS</span>
      <Side f={w.fighters.cpu} align="right" />
    </div>
  );
}
