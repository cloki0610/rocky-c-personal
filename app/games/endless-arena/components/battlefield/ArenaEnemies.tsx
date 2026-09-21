import type { TimedWorldProps } from "../../interfaces/EndlessArenaTypes";
import { TYPES } from "../../utils/constants";

export default function ArenaEnemies({ world: w, now }: TimedWorldProps) {
  return (
    <>
      {/* enemies */}
      {(w.boss ? [...w.enemies, w.boss] : w.enemies).map((e) => {
        const stunned = e.stunUntil > now;
        return (
          <div
            key={e.id}
            className="absolute"
            style={{ left: e.x, top: e.y, width: e.size, height: e.size }}
          >
            <div className="absolute -top-2 left-0 w-full h-1 bg-black/60 rounded">
              <div
                className="h-full bg-emerald-400 rounded"
                style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
              />
            </div>

            {stunned && (
              <div
                className="absolute left-1/2 -translate-x-1/2 animate-spin"
                style={{
                  top: -18,
                  width: 26,
                  height: 10,
                  animationDuration: "0.7s",
                }}
              >
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300 rounded-full" />
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-300 rounded-full" />
              </div>
            )}

            <div
              className="w-full h-full rounded-md"
              style={{
                background: TYPES[e.type].color,
                boxShadow:
                  e.flash > now
                    ? "0 0 0 3px #fff"
                    : stunned
                      ? "0 0 0 3px #fbbf24"
                      : "0 3px 8px rgba(0,0,0,.45)",
                filter:
                  e.flash > now
                    ? "brightness(1.8)"
                    : stunned
                      ? "saturate(.45) brightness(.75)"
                      : "none",
              }}
            />
          </div>
        );
      })}
    </>
  );
}
