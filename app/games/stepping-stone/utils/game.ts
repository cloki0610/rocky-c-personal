import type { Side, World } from "../interfaces/SteppingStoneTypes";

export const MAX_HEALTH = 5;
export const STONES_PER_CHECKPOINT = 10;

export const randomSide = (): Side => (Math.random() < 0.5 ? "top" : "bottom");

export const initWorld = (): World => ({
  phase: "playing",
  health: MAX_HEALTH,
  stonesCrossed: 0,
  furthest: 0,
  sinceCheckpoint: 0,
  stableSide: randomSide(),
  standingOn: null,
  checkpointSide: null,
  jumpSide: null,
  fallSide: null,
  justHealed: false,
  retries: 0,
});

/* starts the jump; the outcome is resolved by landJump once the player lands */
export const chooseStone = (w: World, side: Side): World => {
  if (w.phase !== "playing") return w;
  return { ...w, phase: "jumping", jumpSide: side, justHealed: false };
};

export const landJump = (w: World): World => {
  if (w.phase !== "jumping" || !w.jumpSide) return w;
  const side = w.jumpSide;

  if (side === w.stableSide) {
    const sinceCheckpoint = w.sinceCheckpoint + 1;
    const reachedCheckpoint = sinceCheckpoint >= STONES_PER_CHECKPOINT;
    const stonesCrossed = w.stonesCrossed + 1;
    return {
      ...w,
      phase: "playing",
      stonesCrossed,
      furthest: Math.max(w.furthest, stonesCrossed),
      sinceCheckpoint: reachedCheckpoint ? 0 : sinceCheckpoint,
      health: reachedCheckpoint ? MAX_HEALTH : w.health,
      justHealed: reachedCheckpoint,
      stableSide: randomSide(),
      standingOn: side,
      checkpointSide: reachedCheckpoint ? side : w.checkpointSide,
      jumpSide: null,
      fallSide: null,
    };
  }

  return {
    ...w,
    health: Math.max(0, w.health - 1),
    phase: "falling",
    jumpSide: null,
    fallSide: side,
  };
};

export const acknowledgeFall = (w: World): World => {
  if (w.phase !== "falling") return w;
  if (w.health <= 0) return { ...w, phase: "gameover", fallSide: null };
  /* a survivable fall sends the player back to the last checkpoint, or the
     starting bank, and the stones crossed since then must be crossed again */
  return {
    ...w,
    phase: "playing",
    stonesCrossed: w.stonesCrossed - w.sinceCheckpoint,
    sinceCheckpoint: 0,
    standingOn: w.checkpointSide,
    fallSide: null,
    retries: w.retries + 1,
    stableSide: randomSide(),
  };
};

export const acknowledgeHeal = (w: World): World =>
  w.justHealed ? { ...w, justHealed: false } : w;
