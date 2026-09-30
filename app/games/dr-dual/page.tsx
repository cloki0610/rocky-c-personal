"use client";

import DualArena from "./components/arena/DualArena";
import AbilityBar from "./components/hud/AbilityBar";
import DualHeader from "./components/hud/DualHeader";
import FighterStatus from "./components/hud/FighterStatus";
import DifficultySelect from "./components/setup/DifficultySelect";
import useDrDual from "./hooks/useDrDual";

export default function DrDual() {
  const {
    screen,
    world,
    record,
    boardRef,
    scale,
    aim,
    marker,
    startMatch,
    backToMenu,
    castFromButton,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onContextMenu,
  } = useDrDual();

  if (screen === "select" || !world) {
    return <DifficultySelect record={record} onStart={startMatch} />;
  }

  return (
    <div className="w-full max-w-4xl">
      <p className="sr-only" aria-live="polite">
        {world.announcement}
      </p>
      <DualHeader world={world} backToMenu={backToMenu} />
      <FighterStatus world={world} />
      <DualArena
        world={world}
        boardRef={boardRef}
        scale={scale}
        aim={aim}
        marker={marker}
        record={record}
        startMatch={startMatch}
        backToMenu={backToMenu}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onContextMenu={onContextMenu}
      />
      <AbilityBar
        fighter={world.fighters.player}
        canCast={world.phase === "fighting"}
        castFromButton={castFromButton}
      />
    </div>
  );
}
