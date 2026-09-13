"use client";

import ArenaBoard from "./components/battlefield/ArenaBoard";
import ArenaControls from "./components/hud/ArenaControls";
import ArenaHeader from "./components/hud/ArenaHeader";
import CharacterSelect from "./components/character-select/CharacterSelect";
import useEndlessArena from "./hooks/useEndlessArena";

export default function FighterArena() {
  const { screen, world, boardRef, scale, best, startGame, changeFighter } =
    useEndlessArena();

  if (screen === "select" || !world) {
    return <CharacterSelect onStart={startGame} best={best} />;
  }

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-4xl">
        <ArenaHeader player={world.player} stage={world.stage} best={best} />
        <ArenaBoard
          world={world}
          boardRef={boardRef}
          scale={scale}
          best={best}
          startGame={startGame}
          changeFighter={changeFighter}
        />
        <ArenaControls player={world.player} changeFighter={changeFighter} />
      </div>
    </div>
  );
}
