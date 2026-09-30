import type { DifficultySelectProps } from "../../interfaces/DrDualTypes";
import { ABILITIES, AI_PROFILES, DIFFICULTIES } from "../../utils/constants";
import { ROUNDS_TO_WIN } from "../../utils/constants";

export default function DifficultySelect({
  record,
  onStart,
}: DifficultySelectProps) {
  const played = record.wins + record.losses;
  return (
    <div className="w-full max-w-3xl">
      <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-center">
        DR.<span className="text-lime-400"> DUAL</span>
      </h1>
      <p className="mt-2 text-center text-sm text-slate-400">
        Doctor versus Doctor in a closed Zaun arena. First to {ROUNDS_TO_WIN}{" "}
        rounds wins.
      </p>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {ABILITIES.map((a) => (
          <li
            key={a.key}
            className="flex gap-3 rounded-lg bg-slate-800/60 ring-1 ring-slate-700 p-3"
          >
            <kbd className="shrink-0 w-9 h-9 grid place-items-center rounded-md bg-slate-950 ring-1 ring-lime-700 text-lg font-black font-mono text-lime-300">
              {a.key.toUpperCase()}
            </kbd>
            <span>
              <span className="block text-sm font-bold">{a.name}</span>
              <span className="block text-xs text-slate-400">{a.summary}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-xs font-mono text-slate-400">
        <span className="text-slate-200">Click</span> the ground to move ·{" "}
        <span className="text-slate-200">click</span> the enemy to attack ·{" "}
        <span className="text-lime-300">Q W E R</span> cast toward the cursor
      </p>

      <h2 className="mt-6 mb-2 text-center text-xs font-bold tracking-[0.3em] text-slate-500">
        CHOOSE YOUR OPPONENT
      </h2>
      <div className="grid gap-2 sm:grid-cols-3">
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => onStart(d)}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 ring-1 ring-slate-600 hover:ring-lime-400 active:scale-95 transition p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300"
          >
            <span className="block font-black tracking-wide">
              {AI_PROFILES[d].label.toUpperCase()} CPU
            </span>
            <span className="block text-xs text-slate-400">
              {AI_PROFILES[d].blurb}
            </span>
          </button>
        ))}
      </div>

      {played > 0 && (
        <p className="mt-4 text-center text-xs font-mono text-amber-400">
          SESSION {record.wins}W · {record.losses}L
        </p>
      )}
    </div>
  );
}
