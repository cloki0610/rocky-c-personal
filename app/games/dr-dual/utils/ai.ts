import type {
  AiBrain,
  AiProfile,
  FighterId,
  Vec,
  World,
} from "../interfaces/DrDualTypes";
import {
  ATTACK_RANGE,
  BURN,
  CLEAVER,
  FIGHTER_R,
  MAX_HP,
  TRAUMA,
} from "./constants";
import { castAbility, commandAttack, commandMove } from "./game";
import {
  abilityReady,
  clampToArena,
  dist,
  normalize,
  opponentOf,
} from "./helpers";

const DODGE_LOOKAHEAD = 320;
const DODGE_STEP = 90;
const DODGE_HOLD = 0.35;

export const createBrain = (): AiBrain => ({ thinkIn: 0.4, dodgeFor: 0 });

/* returns a sidestep point if an enemy cleaver is on course to hit */
const dodgePoint = (w: World, id: FighterId): Vec | null => {
  const me = w.fighters[id];
  for (const c of w.cleavers) {
    if (c.owner === id) continue;
    const rx = me.pos.x - c.pos.x;
    const ry = me.pos.y - c.pos.y;
    const along = rx * c.dir.x + ry * c.dir.y;
    const across = rx * c.dir.y - ry * c.dir.x;
    if (along <= 0 || along > DODGE_LOOKAHEAD) continue;
    if (Math.abs(across) > FIGHTER_R + CLEAVER.radius + 8) continue;
    const side = across >= 0 ? 1 : -1;
    for (const s of [side, -side]) {
      const p = {
        x: me.pos.x - c.dir.y * s * DODGE_STEP,
        y: me.pos.y + c.dir.x * s * DODGE_STEP,
      };
      if (dist(clampToArena(p), p) < 1) return p;
    }
  }
  return null;
};

/* the CPU issues the same commands a player would, at its reaction interval */
export const aiStep = (
  w: World,
  id: FighterId,
  brain: AiBrain,
  profile: AiProfile,
  dt: number,
  rng: () => number = Math.random,
) => {
  if (w.phase !== "fighting") return;
  brain.thinkIn -= dt;
  brain.dodgeFor -= dt;
  if (brain.thinkIn > 0) return;
  brain.thinkIn = profile.reaction * (0.75 + rng() * 0.5);

  const me = w.fighters[id];
  const foe = w.fighters[opponentOf(id)];
  const d = dist(me.pos, foe.pos);
  const myFrac = me.hp / MAX_HP;
  const foeFrac = foe.hp / MAX_HP;

  if (profile.dodge > 0 && rng() < profile.dodge) {
    const p = dodgePoint(w, id);
    if (p) {
      commandMove(w, id, p);
      brain.dodgeFor = DODGE_HOLD;
      return;
    }
  }
  if (brain.dodgeFor > 0) return;

  if (myFrac < profile.healAt && abilityReady(me, "r"))
    castAbility(w, id, "r", foe.pos);

  if (
    abilityReady(me, "q") &&
    d < CLEAVER.range * 0.9 &&
    me.hp > CLEAVER.cost + 60
  ) {
    const lead = (d / CLEAVER.speed) * profile.lead;
    const tx = foe.pos.x + foe.vel.x * lead;
    const ty = foe.pos.y + foe.vel.y * lead;
    const angle =
      Math.atan2(ty - me.pos.y, tx - me.pos.x) +
      (rng() * 2 - 1) * profile.aimError;
    castAbility(w, id, "q", {
      x: me.pos.x + Math.cos(angle) * 100,
      y: me.pos.y + Math.sin(angle) * 100,
    });
  }

  const inBurnRange = d < BURN.radius + FIGHTER_R + 40;
  if (!me.burning && inBurnRange && myFrac > 0.3 && abilityReady(me, "w"))
    castAbility(w, id, "w", foe.pos);
  else if (
    me.burning &&
    (d > BURN.radius + 160 || myFrac < 0.2) &&
    abilityReady(me, "w")
  )
    castAbility(w, id, "w", foe.pos);

  /* fight back when caught in melee range rather than kiting into a wall */
  const pressing =
    myFrac > 0.45 ||
    myFrac >= foeFrac - 0.1 ||
    me.healTime > 0 ||
    d <= ATTACK_RANGE;
  if (pressing) {
    if (
      d < ATTACK_RANGE + 80 &&
      me.hp > TRAUMA.cost + 30 &&
      abilityReady(me, "e")
    )
      castAbility(w, id, "e", foe.pos);
    commandAttack(w, id);
    return;
  }

  /* losing: back off and strafe while cooldowns come back */
  const away = normalize({ x: me.pos.x - foe.pos.x, y: me.pos.y - foe.pos.y });
  const strafe = rng() < 0.5 ? 1 : -1;
  commandMove(w, id, {
    x: me.pos.x + away.x * 140 - away.y * strafe * 100,
    y: me.pos.y + away.y * 140 + away.x * strafe * 100,
  });
};
