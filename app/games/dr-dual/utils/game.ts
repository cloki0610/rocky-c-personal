import type {
  AbilityKey,
  Difficulty,
  Fighter,
  FighterId,
  Vec,
  World,
} from "../interfaces/DrDualTypes";
import {
  BURN,
  CLEAVER,
  COUNTDOWN_TIME,
  MAX_HP,
  SADISM,
  SPAWNS,
  TRAUMA,
} from "./constants.ts";
import {
  abilityReady,
  addFloater,
  clampToArena,
  normalize,
  sadismHeal,
} from "./helpers.ts";

/* ---------------- setup ---------------- */
export const createFighter = (id: FighterId, roundsWon = 0): Fighter => ({
  id,
  pos: { ...SPAWNS[id] },
  vel: { x: 0, y: 0 },
  facing: id === "player" ? 0 : Math.PI,
  hp: MAX_HP,
  moveTarget: null,
  attacking: false,
  attackCd: 0,
  cooldowns: { q: 0, w: 0, e: 0, r: 0 },
  burning: false,
  burnShown: 0,
  empowered: 0,
  healRate: 0,
  healTime: 0,
  slow: 0,
  swing: 0,
  swingEmpowered: false,
  meleeHit: 0,
  hitFlash: 0,
  roundsWon,
});

export const initWorld = (difficulty: Difficulty = "normal"): World => ({
  phase: "countdown",
  difficulty,
  round: 1,
  timer: COUNTDOWN_TIME,
  fighters: { player: createFighter("player"), cpu: createFighter("cpu") },
  cleavers: [],
  floaters: [],
  roundWinner: null,
  matchWinner: null,
  announcement: "Round 1. Get ready.",
  time: 0,
  nextId: 1,
  recorded: false,
});

/* the next round keeps the score and resets everything else */
export const startNextRound = (w: World) => {
  w.round += 1;
  w.fighters = {
    player: createFighter("player", w.fighters.player.roundsWon),
    cpu: createFighter("cpu", w.fighters.cpu.roundsWon),
  };
  w.cleavers = [];
  w.roundWinner = null;
  w.phase = "countdown";
  w.timer = COUNTDOWN_TIME;
  w.announcement = `Round ${w.round}. Get ready.`;
};

/* ---------------- commands (shared by the mouse and the CPU) ---------------- */
export const commandMove = (w: World, id: FighterId, point: Vec) => {
  if (w.phase !== "fighting") return false;
  const f = w.fighters[id];
  f.moveTarget = clampToArena(point);
  f.attacking = false;
  return true;
};

export const commandAttack = (w: World, id: FighterId) => {
  if (w.phase !== "fighting") return false;
  const f = w.fighters[id];
  f.attacking = true;
  f.moveTarget = null;
  return true;
};

export const castAbility = (
  w: World,
  id: FighterId,
  key: AbilityKey,
  aim: Vec,
) => {
  if (w.phase !== "fighting") return false;
  const f = w.fighters[id];
  if (!abilityReady(f, key)) return false;

  if (key === "q") {
    let dir = normalize({ x: aim.x - f.pos.x, y: aim.y - f.pos.y });
    if (dir.x === 0 && dir.y === 0)
      dir = { x: Math.cos(f.facing), y: Math.sin(f.facing) };
    f.hp -= CLEAVER.cost;
    f.facing = Math.atan2(dir.y, dir.x);
    f.cooldowns.q = CLEAVER.cooldown;
    w.cleavers.push({
      id: w.nextId++,
      owner: id,
      pos: { ...f.pos },
      dir,
      traveled: 0,
    });
  } else if (key === "w") {
    f.burning = !f.burning;
    f.burnShown = 0;
    f.cooldowns.w = BURN.toggleCooldown;
  } else if (key === "e") {
    f.hp -= TRAUMA.cost;
    f.empowered = TRAUMA.window;
    f.cooldowns.e = TRAUMA.cooldown;
  } else {
    const total = sadismHeal(f.hp);
    f.healRate = total / SADISM.duration;
    f.healTime = SADISM.duration;
    f.cooldowns.r = SADISM.cooldown;
    addFloater(w, f.pos, `+${total}`, "heal");
  }
  return true;
};
