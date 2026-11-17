import ScaledStage from "@/app/games/components/ScaledStage";
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
    <ScaledStage
      boardRef={boardRef}
      scale={scale}
      width={GRID_W}
      height={GRID_H}
      className="ring-slate-700 bg-slate-900"
      overlay={<TDOverlays world={world} best={best} restart={restart} />}
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
    </ScaledStage>
  );
}
