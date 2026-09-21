import type { ArenaBoardProps } from "../../interfaces/EndlessArenaTypes";
import { VIEW_H, VIEW_W, WORLD_H, WORLD_W } from "../../utils/constants";
import ArenaCombat from "./ArenaCombat";
import ArenaEnemies from "./ArenaEnemies";
import ArenaParticles from "./ArenaParticles";
import ArenaHud from "../hud/ArenaHud";
import ArenaOverlays from "../hud/ArenaOverlays";

export default function ArenaBoard({
  world: w,
  boardRef,
  scale,
  best,
  startGame,
  changeFighter,
}: ArenaBoardProps) {
  const now = performance.now();
  return (
    <div
      ref={boardRef}
      className="relative w-full rounded-xl overflow-hidden ring-2 ring-slate-700 bg-slate-800 shadow-2xl"
      style={{ height: VIEW_H * scale }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: VIEW_W, height: VIEW_H, transform: `scale(${scale})` }}
      >
        <div
          className="absolute top-0 left-0"
          style={{
            width: WORLD_W,
            height: WORLD_H,
            transform: `translateX(${-w.camera}px)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.10) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div
            className="absolute bottom-0 left-0 h-16 bg-slate-900/60"
            style={{ width: WORLD_W }}
          />

          <ArenaCombat world={w} now={now} />
          <ArenaEnemies world={w} now={now} />
          <ArenaParticles particles={w.corpses} />
        </div>
      </div>

      <ArenaHud world={w} now={now} />
      <ArenaOverlays
        world={w}
        best={best}
        startGame={startGame}
        changeFighter={changeFighter}
      />
    </div>
  );
}
