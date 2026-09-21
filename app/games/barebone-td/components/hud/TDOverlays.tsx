import type { TDOverlaysProps } from "../../interfaces/BareboneTDTypes";

export default function TDOverlays({
  world: w,
  best,
  restart,
}: TDOverlaysProps) {
  if (w.phase !== "gameover") return null;
  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 ring-1 ring-slate-700 rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-black mb-1 text-red-500">
          BASE OVERRUN
        </h2>
        <p className="text-slate-400 mb-1 text-sm">
          Your defenses fell on wave {w.wave}.
        </p>
        <p className="text-amber-400 font-mono text-xs mb-6">
          {w.wave >= best ? "NEW BEST" : `BEST — WAVE ${best}`}
        </p>
        <button
          onClick={restart}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition px-6 py-3 rounded-lg font-bold tracking-wide"
        >
          RESTART
        </button>
      </div>
    </div>
  );
}
