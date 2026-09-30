import type { DualArenaProps } from "../../interfaces/DrDualTypes";
import { ARENA_H, ARENA_W, FIGHTER_R } from "../../utils/constants";
import { dist } from "../../utils/helpers";
import DualOverlays from "../hud/DualOverlays";
import AimGuide from "./AimGuide";
import CleaverSprite from "./CleaverSprite";
import Floaters from "./Floaters";
import DoctorFighter from "./DoctorFighter";

export default function DualArena({
  world: w,
  boardRef,
  scale,
  aim,
  marker,
  record,
  startMatch,
  backToMenu,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onContextMenu,
}: DualArenaProps) {
  const { player, cpu } = w.fighters;
  const overFoe = dist(aim, cpu.pos) <= FIGHTER_R + 14;
  const fighting = w.phase === "fighting";

  return (
    <div
      ref={boardRef}
      aria-label="Arena. Click the ground to move, click the CPU to attack. Q, W, E and R use abilities toward the cursor."
      className={`relative w-full rounded-xl overflow-hidden ring-2 ring-lime-900/70 bg-slate-900 shadow-2xl touch-none ${
        fighting ? (overFoe ? "cursor-pointer" : "cursor-crosshair") : ""
      }`}
      style={{ height: ARENA_H * scale }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={onContextMenu}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: ARENA_W,
          height: ARENA_H,
          transform: `scale(${scale})`,
        }}
      >
        {/* Zaun floor: grid, centre ring, and chemtech glow at the walls */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(30,41,59,0) 55%, rgba(101,163,13,.18) 100%), linear-gradient(to right, rgba(148,163,184,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,.07) 1px, transparent 1px)",
            backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          }}
        />
        <div
          className="absolute rounded-full border-2 border-dashed border-slate-700/60"
          style={{
            left: ARENA_W / 2 - 90,
            top: ARENA_H / 2 - 90,
            width: 180,
            height: 180,
          }}
        />
        <div
          className="absolute top-0 bottom-0 border-l border-slate-700/40"
          style={{ left: ARENA_W / 2 }}
        />

        <AimGuide fighter={player} aim={aim} marker={marker} time={w.time} />
        <DoctorFighter fighter={cpu} />
        <DoctorFighter fighter={player} />
        {w.cleavers.map((c) => (
          <CleaverSprite key={c.id} cleaver={c} time={w.time} />
        ))}
        <Floaters floaters={w.floaters} />
      </div>

      <DualOverlays
        world={w}
        record={record}
        startMatch={startMatch}
        backToMenu={backToMenu}
      />
    </div>
  );
}
