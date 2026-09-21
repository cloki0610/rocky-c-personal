import type { TimedWorldProps } from "../../interfaces/EndlessArenaTypes";
import Bar from "./Bar";
import { scaleFor } from "../../utils/game";

export default function ArenaHud({ world: w, now }: TimedWorldProps) {
  const p = w.player;
  const cls = p.cls;
  const rangedMode = p.ranged.mode;
  const stunReady = now - p.rangedLast >= p.ranged.cd;
  const buff = Math.round((scaleFor(w.stage).hp - 1) * 100);
  return (
    <>
      {/* HUD — unscaled so it stays legible on small screens */}
      {w.boss && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[70%] max-w-md">
          <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-widest text-orange-300 mb-1">
            <span>BOSS</span>
            <span>
              {Math.ceil(w.boss.hp)} / {w.boss.maxHp}
            </span>
          </div>
          <Bar
            hp={w.boss.hp}
            maxHp={w.boss.maxHp}
            color="bg-gradient-to-r from-orange-600 to-red-500"
            height={14}
          />
        </div>
      )}

      {buff > 0 && !w.boss && (
        <div className="absolute top-3 right-3 text-[10px] font-mono text-red-400/80 bg-black/40 px-2 py-1 rounded">
          ENEMY +{buff}% HP
        </div>
      )}

      <div className="absolute bottom-3 left-3 w-40 sm:w-56">
        <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-widest mb-1">
          <span className={cls.text}>{cls.name.toUpperCase()}</span>
          <span className="text-slate-300">
            {Math.ceil(p.hp)} / {p.maxHp}
          </span>
        </div>
        <Bar
          hp={p.hp}
          maxHp={p.maxHp}
          color={
            p.hp / p.maxHp > 0.35
              ? cls.bar
              : "bg-gradient-to-r from-red-600 to-orange-500"
          }
        />
        {rangedMode === "stun" && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest text-slate-500">
              S
            </span>
            <div className="flex-1 h-1 bg-black/60 rounded-full overflow-hidden">
              <div
                className={
                  stunReady ? "h-full bg-amber-300" : "h-full bg-amber-700"
                }
                style={{
                  width: `${Math.min(100, ((now - p.rangedLast) / p.ranged.cd) * 100)}%`,
                }}
              />
            </div>
            <span
              className={`text-[9px] font-mono ${stunReady ? "text-amber-300" : "text-slate-600"}`}
            >
              {stunReady ? "READY" : "…"}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
