import type { TDHeaderProps } from "../../interfaces/BareboneTDTypes";

export default function TDHeader({
  world,
  speed,
  startWave,
  cycleSpeed,
}: TDHeaderProps) {
  const prepSeconds = Math.max(0, Math.ceil(world.prepTimer / 1000));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
      <div className="flex items-center gap-4 text-sm font-mono">
        <span className="text-amber-300">GOLD {world.gold}</span>
        <span className={world.lives <= 5 ? "text-red-400" : "text-emerald-300"}>
          LIVES {world.lives}
        </span>
        <span className="text-slate-300">WAVE {world.wave}</span>
        {!world.waveActive && world.phase !== "gameover" && (
          <span className="text-sky-300">PREP {prepSeconds}s</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={cycleSpeed}
          disabled={world.phase === "gameover"}
          aria-label={`Game speed, currently ${speed}x, click to change`}
          className="px-3 py-1.5 rounded-lg text-sm font-bold tracking-wide bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 active:scale-95 transition font-mono"
        >
          {speed}x
        </button>
        <button
          type="button"
          onClick={startWave}
          disabled={world.waveActive || world.phase === "gameover"}
          className="px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 active:scale-95 transition"
        >
          {world.waveActive
            ? "WAVE IN PROGRESS"
            : `START WAVE ${world.wave + 1} (${prepSeconds}s)`}
        </button>
      </div>
    </div>
  );
}
