import type {
  Fighter,
  FighterId,
  FloaterKind,
  Vec,
  World,
} from "../interfaces/DrDualTypes";
import {
  ARENA_H,
  ARENA_W,
  ATTACK_COOLDOWN,
  ATTACK_DAMAGE,
  ATTACK_RANGE,
  BURN,
  CLEAVER,
  FIGHTER_R,
  FLOATER_LIFE,
  HIT_FLASH_TIME,
  HP_REGEN,
  MAX_HP,
  MELEE_HIT_TIME,
  ROUNDS_TO_WIN,
  ROUND_OVER_TIME,
  SWING_TIME,
} from "./constants.ts";
import { startNextRound } from "./game.ts";
import {
  addFloater,
  clampToArena,
  cleaverDamage,
  dist,
  distToSegment,
  moveSpeed,
  normalize,
  opponentOf,
  traumaBonus,
} from "./helpers.ts";

/* ---------------- simulation ---------------- */
const damage = (
  w: World,
  target: Fighter,
  amount: number,
  kind: FloaterKind | null,
) => {
  target.hp = Math.max(0, target.hp - amount);
  target.hitFlash = HIT_FLASH_TIME;
  if (kind) addFloater(w, target.pos, `${Math.round(amount)}`, kind);
};

const tickTimers = (f: Fighter, dt: number) => {
  f.attackCd = Math.max(0, f.attackCd - dt);
  f.empowered = Math.max(0, f.empowered - dt);
  f.slow = Math.max(0, f.slow - dt);
  f.swing = Math.max(0, f.swing - dt);
  f.meleeHit = Math.max(0, f.meleeHit - dt);
  f.hitFlash = Math.max(0, f.hitFlash - dt);
  for (const key of ["q", "w", "e", "r"] as const)
    f.cooldowns[key] = Math.max(0, f.cooldowns[key] - dt);
};

const sustain = (f: Fighter, dt: number) => {
  if (f.hp <= 0) return; // a downed fighter is resolved, never revived
  let gain = HP_REGEN * dt;
  if (f.healTime > 0) {
    gain += f.healRate * Math.min(dt, f.healTime);
    f.healTime = Math.max(0, f.healTime - dt);
  }
  f.hp = Math.min(MAX_HP, f.hp + gain);
};

const burn = (w: World, f: Fighter, foe: Fighter, dt: number) => {
  if (!f.burning) return;
  f.hp -= BURN.drain * dt;
  if (f.hp < BURN.minHp) f.burning = false;
  if (dist(f.pos, foe.pos) > BURN.radius + FIGHTER_R) return;
  const amount = BURN.dps * dt;
  damage(w, foe, amount, null);
  f.burnShown += amount;
  if (f.burnShown >= BURN.shownEvery) {
    addFloater(w, foe.pos, `${Math.round(f.burnShown)}`, "damage");
    f.burnShown = 0;
  }
};

const move = (f: Fighter, foe: Fighter, dt: number) => {
  let target: Vec | null = null;
  if (f.attacking) {
    if (dist(f.pos, foe.pos) > ATTACK_RANGE - 4) target = foe.pos;
  } else if (f.moveTarget) {
    target = f.moveTarget;
  }

  const before = { ...f.pos };
  if (target) {
    const d = dist(f.pos, target);
    const stepLen = Math.min(d, moveSpeed(f) * dt);
    if (d > 0) {
      f.pos = clampToArena({
        x: f.pos.x + ((target.x - f.pos.x) / d) * stepLen,
        y: f.pos.y + ((target.y - f.pos.y) / d) * stepLen,
      });
    }
    if (!f.attacking && stepLen >= d) f.moveTarget = null;
  }
  f.vel =
    dt > 0
      ? { x: (f.pos.x - before.x) / dt, y: (f.pos.y - before.y) / dt }
      : { x: 0, y: 0 };

  if (f.attacking)
    f.facing = Math.atan2(foe.pos.y - f.pos.y, foe.pos.x - f.pos.x);
  else if (f.vel.x !== 0 || f.vel.y !== 0)
    f.facing = Math.atan2(f.vel.y, f.vel.x);
};

/* fighters are solid: push overlapping bodies apart equally */
const separate = (a: Fighter, b: Fighter) => {
  const d = dist(a.pos, b.pos);
  const overlap = FIGHTER_R * 2 - d;
  if (overlap <= 0) return;
  const n =
    d === 0
      ? { x: 1, y: 0 }
      : normalize({ x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y });
  a.pos = clampToArena({
    x: a.pos.x - (n.x * overlap) / 2,
    y: a.pos.y - (n.y * overlap) / 2,
  });
  b.pos = clampToArena({
    x: b.pos.x + (n.x * overlap) / 2,
    y: b.pos.y + (n.y * overlap) / 2,
  });
};

const melee = (w: World, f: Fighter, foe: Fighter) => {
  if (!f.attacking || f.attackCd > 0) return;
  if (dist(f.pos, foe.pos) > ATTACK_RANGE) return;
  const empowered = f.empowered > 0;
  const amount = ATTACK_DAMAGE + (empowered ? traumaBonus(f.hp) : 0);
  f.empowered = 0;
  f.attackCd = ATTACK_COOLDOWN;
  f.swing = SWING_TIME;
  f.swingEmpowered = empowered;
  foe.meleeHit = MELEE_HIT_TIME;
  damage(w, foe, amount, empowered ? "empowered" : "damage");
};

const moveCleavers = (w: World, dt: number) => {
  w.cleavers = w.cleavers.filter((c) => {
    const target = w.fighters[opponentOf(c.owner)];
    const stepLen = Math.min(CLEAVER.speed * dt, CLEAVER.range - c.traveled);
    const next = {
      x: c.pos.x + c.dir.x * stepLen,
      y: c.pos.y + c.dir.y * stepLen,
    };
    /* swept test so a fast cleaver cannot skip past a fighter between frames */
    if (distToSegment(target.pos, c.pos, next) <= FIGHTER_R + CLEAVER.radius) {
      damage(w, target, cleaverDamage(target.hp), "damage");
      target.slow = CLEAVER.slowTime;
      return false;
    }
    c.pos = next;
    c.traveled += stepLen;
    const outside =
      c.pos.x < 0 || c.pos.x > ARENA_W || c.pos.y < 0 || c.pos.y > ARENA_H;
    return c.traveled < CLEAVER.range && !outside;
  });
};

const resolveRound = (w: World) => {
  const { player, cpu } = w.fighters;
  if (player.hp > 0 && cpu.hp > 0) return;

  const winner: FighterId | null =
    player.hp > 0 ? "player" : cpu.hp > 0 ? "cpu" : null;
  for (const f of [player, cpu]) {
    f.burning = false;
    f.attacking = false;
    f.moveTarget = null;
  }
  w.cleavers = [];
  w.roundWinner = winner;
  if (winner) w.fighters[winner].roundsWon += 1;

  if (winner && w.fighters[winner].roundsWon >= ROUNDS_TO_WIN) {
    w.matchWinner = winner;
    w.phase = "matchOver";
    w.announcement =
      winner === "player"
        ? "Victory! You won the match."
        : "Defeat. The CPU won the match.";
    return;
  }
  w.phase = "roundOver";
  w.timer = ROUND_OVER_TIME;
  w.announcement =
    winner === null
      ? `Round ${w.round} is a draw.`
      : winner === "player"
        ? `You win round ${w.round}.`
        : `The CPU wins round ${w.round}.`;
};

/* advances the world by dt seconds; mutates w in place */
export const step = (w: World, dt: number) => {
  w.time += dt;
  w.floaters = w.floaters
    .map((fl) => ({ ...fl, age: fl.age + dt }))
    .filter((fl) => fl.age < FLOATER_LIFE);

  if (w.phase === "countdown") {
    w.timer -= dt;
    if (w.timer <= 0) {
      w.phase = "fighting";
      w.timer = 0;
      w.announcement = `Round ${w.round}. Fight!`;
    }
    return;
  }
  if (w.phase === "roundOver") {
    w.timer -= dt;
    if (w.timer <= 0) startNextRound(w);
    return;
  }
  if (w.phase !== "fighting") return;

  const { player, cpu } = w.fighters;
  const pairs: [Fighter, Fighter][] = [
    [player, cpu],
    [cpu, player],
  ];
  for (const [f] of pairs) {
    tickTimers(f, dt);
    sustain(f, dt);
  }
  for (const [f, foe] of pairs) burn(w, f, foe, dt);
  for (const [f, foe] of pairs) move(f, foe, dt);
  separate(player, cpu);
  for (const [f, foe] of pairs) melee(w, f, foe);
  moveCleavers(w, dt);
  resolveRound(w);
};
