import type {
  AbilityKey,
  Fighter,
  FighterId,
  FloaterKind,
  Vec,
  World,
} from "../interfaces/DrDualTypes";
import {
  ARENA_H,
  ARENA_W,
  BURN,
  CLEAVER,
  FIGHTER_R,
  MAX_HP,
  MOVE_SPEED,
  SADISM,
  TRAUMA,
} from "./constants.ts";

/* ---------------- vector helpers ---------------- */
export const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

export const normalize = (v: Vec): Vec => {
  const l = Math.hypot(v.x, v.y);
  return l === 0 ? { x: 0, y: 0 } : { x: v.x / l, y: v.y / l };
};

export const clampToArena = (p: Vec): Vec => ({
  x: Math.min(ARENA_W - FIGHTER_R, Math.max(FIGHTER_R, p.x)),
  y: Math.min(ARENA_H - FIGHTER_R, Math.max(FIGHTER_R, p.y)),
});

/* shortest distance from p to the segment a-b */
export const distToSegment = (p: Vec, a: Vec, b: Vec) => {
  const abx = b.x - a.x;
  const aby = b.y - a.y;
  const len2 = abx * abx + aby * aby;
  const t =
    len2 === 0
      ? 0
      : Math.max(
          0,
          Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / len2),
        );
  return Math.hypot(p.x - (a.x + abx * t), p.y - (a.y + aby * t));
};

export const opponentOf = (id: FighterId): FighterId =>
  id === "player" ? "cpu" : "player";

/* ---------------- ability formulas ---------------- */
const missingFraction = (hp: number) =>
  Math.min(1, Math.max(0, (MAX_HP - hp) / MAX_HP));

export const cleaverDamage = (targetHp: number) =>
  Math.round(CLEAVER.base + CLEAVER.currentHpRatio * targetHp);

export const traumaBonus = (hp: number) =>
  Math.round(TRAUMA.base + TRAUMA.missingBonus * missingFraction(hp));

export const sadismHeal = (hp: number) =>
  Math.round(SADISM.base + SADISM.missingRatio * (MAX_HP - hp));

export const moveSpeed = (f: Fighter) =>
  MOVE_SPEED *
  (f.slow > 0 ? 1 - CLEAVER.slow : 1) *
  (f.healTime > 0 ? 1 + SADISM.speedBonus : 1);

/* whether an ability can be used right now, ignoring the match phase */
export const abilityReady = (f: Fighter, key: AbilityKey) => {
  if (f.cooldowns[key] > 0) return false;
  if (key === "q") return f.hp > CLEAVER.cost;
  if (key === "w") return f.burning || f.hp > BURN.minHp;
  if (key === "e") return f.hp > TRAUMA.cost;
  return true;
};

/* ---------------- world helpers ---------------- */
export const addFloater = (
  w: World,
  pos: Vec,
  text: string,
  kind: FloaterKind,
) => {
  w.floaters.push({
    id: w.nextId++,
    pos: { x: pos.x, y: pos.y - FIGHTER_R - 8 },
    text,
    kind,
    age: 0,
  });
};
