"use client";

import TDBoard from "./components/board/TDBoard";
import TDHeader from "./components/hud/TDHeader";
import TDToolbar from "./components/hud/TDToolbar";
import TDTowerPanel from "./components/hud/TDTowerPanel";
import useBareboneTD from "./hooks/useBareboneTD";

export default function BareboneTD() {
  const {
    world,
    boardRef,
    scale,
    now,
    selectedTower,
    selectedTowerId,
    best,
    speed,
    selectTower,
    placeCell,
    cycleSpeed,
    upgradeSelectedTower,
    sellSelectedTower,
    deselectTower,
    startWave,
    restart,
  } = useBareboneTD();

  const selectedTowerObj =
    world.towers.find((t) => t.id === selectedTowerId) ?? null;

  return (
    <div className="w-full max-w-4xl">
      <TDHeader
        world={world}
        speed={speed}
        startWave={startWave}
        cycleSpeed={cycleSpeed}
      />
      <TDBoard
        world={world}
        boardRef={boardRef}
        scale={scale}
        now={now}
        selectedTower={selectedTower}
        selectedTowerId={selectedTowerId}
        best={best}
        placeCell={placeCell}
        restart={restart}
      />
      <TDTowerPanel
        tower={selectedTowerObj}
        gold={world.gold}
        waveActive={world.waveActive}
        upgradeTower={upgradeSelectedTower}
        sellTower={sellSelectedTower}
        close={deselectTower}
      />
      <TDToolbar
        gold={world.gold}
        selectedTower={selectedTower}
        waveActive={world.waveActive}
        selectTower={selectTower}
      />
    </div>
  );
}
