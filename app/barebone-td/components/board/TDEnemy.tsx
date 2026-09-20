import type { TDEnemyProps } from "../../interfaces/BareboneTDTypes";

export default function TDEnemy({ enemy: e, now }: TDEnemyProps) {
  const hit = now < e.hitFlash;
  const slowed = now < e.slowUntil;
  const color = e.kind === "brute" ? "#a855f7" : "#ef4444";
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: e.x - e.size / 2,
        top: e.y - e.size / 2,
        width: e.size,
        height: e.size,
      }}
    >
      <div className="absolute -top-2 left-0 right-0 h-1 bg-black/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${Math.max(0, (e.hp / e.maxHp) * 100)}%` }}
        />
      </div>
      <div
        className="w-full h-full rounded-full border-2"
        style={{
          backgroundColor: hit ? "#ffffff" : color,
          borderColor: slowed ? "#38bdf8" : "transparent",
        }}
      />
    </div>
  );
}
