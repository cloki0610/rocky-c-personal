import DiamondPips from "@/app/games/components/DiamondPips";
import ProgressBar from "@/app/games/components/ProgressBar";
import type { Fighter, FighterStatusProps } from "../../interfaces/DrDualTypes";
import { FIGHTER_NAMES, MAX_HP, ROUNDS_TO_WIN } from "../../utils/constants";

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
        <DiamondPips
          label={`${name}: ${f.roundsWon} of ${ROUNDS_TO_WIN} rounds won`}
          total={ROUNDS_TO_WIN}
          filled={f.roundsWon}
          pipClassName="w-2.5 h-2.5 ring-1 ring-amber-400/70"
          filledClassName="bg-amber-400"
          emptyClassName="bg-transparent"
        />
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
      <ProgressBar
        value={f.hp}
        max={MAX_HP}
        height={16}
        color={isPlayer ? "bg-sky-500" : "bg-rose-500"}
        label={`${name} health`}
      >
        {Math.ceil(f.hp)} / {MAX_HP}
      </ProgressBar>
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
