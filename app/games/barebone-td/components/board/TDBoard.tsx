import type { TDBoardProps } from "../../interfaces/BareboneTDTypes";
import { GRID_H, GRID_W } from "../../utils/constants";
import TDEnemy from "./TDEnemy";
import TDGrid from "./TDGrid";
import TDProjectiles from "./TDProjectiles";
import TDTower from "./TDTower";
import TDOverlays from "../hud/TDOverlays";

export default function TDBoard({
  world,
  boardRef,
  scale,
  now,
  selectedTower,
  selectedTowerId,
  best,
  placeCell,
  restart,
}: TDBoardProps) {
  return (
    <div
      ref={boardRef}
      className="relative w-full rounded-xl overflow-hidden ring-2 ring-slate-700 bg-slate-900 shadow-2xl"
      style={{ height: GRID_H * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: GRID_W, height: GRID_H, transform: `scale(${scale})` }}
      >
        <TDGrid
          selectedTower={selectedTower}
          towers={world.towers}
          placeCell={placeCell}
        />
        {world.towers.map((t) => (
          <TDTower key={t.id} tower={t} selected={t.id === selectedTowerId} />
        ))}
        {world.enemies.map((e) => (
          <TDEnemy key={e.id} enemy={e} now={now} />
        ))}
        <TDProjectiles
          projectiles={world.projectiles}
          impacts={world.impacts}
          now={now}
        />
      </div>
      <TDOverlays world={world} best={best} restart={restart} />
    </div>
  );
}
