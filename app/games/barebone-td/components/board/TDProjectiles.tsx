import type { TDProjectilesProps } from "../../interfaces/BareboneTDTypes";
import { TOWER_DEFS } from "../../utils/constants";

const IMPACT_LIFE = 0.4;

export default function TDProjectiles({
  projectiles,
  impacts,
  now,
}: TDProjectilesProps) {
  return (
    <>
      {projectiles.map((proj) => {
        const pTime = Math.min(1, (now - proj.startedAt) / proj.travelTime);
        const x = proj.fromX + (proj.toX - proj.fromX) * pTime;
        const y = proj.fromY + (proj.toY - proj.fromY) * pTime;
        const def = TOWER_DEFS[proj.type];
        return (
          <div
            key={proj.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: x - 4,
              top: y - 4,
              width: 8,
              height: 8,
              backgroundColor: def.color,
            }}
          />
        );
      })}
      {impacts.map((impact) => {
        const grow = impact.t / IMPACT_LIFE;
        const r = impact.radius * grow;
        return (
          <div
            key={impact.key}
            className="absolute rounded-full border-2 pointer-events-none"
            style={{
              left: impact.x - r,
              top: impact.y - r,
              width: r * 2,
              height: r * 2,
              borderColor: impact.color,
              opacity: 1 - grow,
            }}
          />
        );
      })}
    </>
  );
}
