import assert from "node:assert/strict";
import test from "node:test";
import {
  ATTACK_COOLDOWN,
  ATTACK_DAMAGE,
  BURN,
  CLEAVER,
  COUNTDOWN_TIME,
  FIGHTER_R,
  MAX_HP,
  ROUNDS_TO_WIN,
  SADISM,
  TRAUMA,
} from "./constants.ts";
import { castAbility, commandAttack, commandMove, initWorld } from "./game.ts";
import { step } from "./simulation.ts";
import { cleaverDamage, sadismHeal, traumaBonus } from "./helpers.ts";

/* a world already in the fighting phase with fighters at chosen spots */
function fighting({
  player = { x: 200, y: 270 },
  cpu = { x: 700, y: 270 },
} = {}) {
  const w = initWorld("normal");
  w.phase = "fighting";
  w.timer = 0;
  w.fighters.player.pos = { ...player };
  w.fighters.cpu.pos = { ...cpu };
  return w;
}

const run = (w, seconds, dt = 1 / 60) => {
  for (let t = 0; t < seconds; t += dt) step(w, dt);
};

test("a match starts with a countdown that blocks commands", () => {
  const w = initWorld("hard");
  assert.equal(w.phase, "countdown");
  assert.equal(w.difficulty, "hard");
  assert.equal(commandMove(w, "player", { x: 10, y: 10 }), false);
  assert.equal(castAbility(w, "player", "q", { x: 700, y: 270 }), false);
  run(w, COUNTDOWN_TIME + 0.05);
  assert.equal(w.phase, "fighting");
  assert.equal(commandMove(w, "player", { x: 10, y: 10 }), true);
});

test("move orders are clamped to the arena and reached", () => {
  const w = fighting();
  commandMove(w, "player", { x: -500, y: 270 });
  run(w, 2);
  assert.equal(w.fighters.player.pos.x, FIGHTER_R);
  assert.equal(w.fighters.player.moveTarget, null);
});

test("an attack order chases into range and swings on cooldown", () => {
  const w = fighting({ player: { x: 400, y: 270 }, cpu: { x: 520, y: 270 } });
  commandAttack(w, "player");
  run(w, 0.6);
  const hp = w.fighters.cpu.hp;
  assert.ok(hp < MAX_HP, "first swing landed");
  assert.ok(MAX_HP - hp >= ATTACK_DAMAGE - 1);
  run(w, ATTACK_COOLDOWN * 0.5);
  assert.ok(Math.abs(w.fighters.cpu.hp - hp) < 2, "no swing during cooldown");
});

test("the cleaver costs health, hits the opponent, and slows", () => {
  const w = fighting({ player: { x: 200, y: 270 }, cpu: { x: 500, y: 270 } });
  assert.equal(castAbility(w, "player", "q", { x: 900, y: 270 }), true);
  assert.equal(w.fighters.player.hp, MAX_HP - CLEAVER.cost);
  assert.equal(castAbility(w, "player", "q", { x: 900, y: 270 }), false);
  run(w, 0.6);
  assert.equal(w.cleavers.length, 0);
  assert.ok(w.fighters.cpu.hp <= MAX_HP - cleaverDamage(MAX_HP) + 1);
  assert.ok(w.fighters.cpu.slow > 0);
});

test("a missed cleaver disappears at max range", () => {
  const w = fighting();
  castAbility(w, "player", "q", { x: 200, y: 0 });
  run(w, 1.5);
  assert.equal(w.cleavers.length, 0);
  assert.equal(w.fighters.cpu.hp, MAX_HP);
});

test("cleaver damage scales with the target's current health", () => {
  assert.ok(cleaverDamage(MAX_HP) > cleaverDamage(100));
});

test("burning drains the caster and damages a nearby opponent only", () => {
  const w = fighting({
    player: { x: 400, y: 270 },
    cpu: { x: 400 + BURN.radius, y: 270 },
  });
  assert.equal(castAbility(w, "player", "w", { x: 0, y: 0 }), true);
  assert.equal(w.fighters.player.burning, true);
  run(w, 1);
  assert.ok(w.fighters.player.hp < MAX_HP, "caster loses health");
  assert.ok(w.fighters.cpu.hp < MAX_HP - BURN.dps * 0.8, "neighbour burns");

  const far = fighting();
  castAbility(far, "player", "w", { x: 0, y: 0 });
  run(far, 1);
  assert.ok(far.fighters.cpu.hp >= MAX_HP - 0.001, "distant opponent unharmed");
});

test("burning toggles off with a short lockout and stops at low health", () => {
  const w = fighting();
  castAbility(w, "player", "w", { x: 0, y: 0 });
  assert.equal(castAbility(w, "player", "w", { x: 0, y: 0 }), false);
  run(w, BURN.toggleCooldown + 0.05);
  assert.equal(castAbility(w, "player", "w", { x: 0, y: 0 }), true);
  assert.equal(w.fighters.player.burning, false);

  const low = fighting();
  low.fighters.player.hp = BURN.minHp + 2;
  castAbility(low, "player", "w", { x: 0, y: 0 });
  run(low, 1);
  assert.equal(low.fighters.player.burning, false);
  assert.ok(low.fighters.player.hp > 0);
});

test("blunt force trauma empowers only the next melee hit", () => {
  const w = fighting({ player: { x: 400, y: 270 }, cpu: { x: 460, y: 270 } });
  w.fighters.player.hp = 300;
  assert.equal(castAbility(w, "player", "e", { x: 0, y: 0 }), true);
  const bonus = traumaBonus(300 - TRAUMA.cost);
  commandAttack(w, "player");
  step(w, 1 / 60);
  assert.equal(w.fighters.player.empowered, 0);
  assert.equal(w.fighters.player.swingEmpowered, true, "swing shows empowered");
  assert.ok(w.fighters.cpu.meleeHit > 0, "target shows the impact");
  assert.ok(Math.abs(MAX_HP - w.fighters.cpu.hp - (ATTACK_DAMAGE + bonus)) < 1);
});

test("blunt force trauma does not shorten the fixed melee cooldown", () => {
  const w = fighting({ player: { x: 400, y: 270 }, cpu: { x: 460, y: 270 } });
  commandAttack(w, "player");
  step(w, 1 / 60);
  const afterFirst = w.fighters.cpu.hp;
  assert.ok(afterFirst < MAX_HP, "first swing landed");

  assert.equal(castAbility(w, "player", "e", { x: 0, y: 0 }), true);
  run(w, ATTACK_COOLDOWN - 0.05);
  assert.ok(afterFirst - w.fighters.cpu.hp < 5, "no swing before the cooldown");
  run(w, 0.1);
  assert.ok(afterFirst - w.fighters.cpu.hp >= ATTACK_DAMAGE, "empowered swing");
});

test("lower health means a bigger trauma bonus and a bigger heal", () => {
  assert.ok(traumaBonus(100) > traumaBonus(500));
  assert.equal(traumaBonus(MAX_HP), TRAUMA.base);
  assert.ok(sadismHeal(100) > sadismHeal(500));
  assert.equal(sadismHeal(MAX_HP), SADISM.base);
});

test("sadism heals its full amount over its duration", () => {
  const w = fighting();
  w.fighters.player.hp = 200;
  const expected = sadismHeal(200);
  castAbility(w, "player", "r", { x: 0, y: 0 });
  run(w, SADISM.duration + 0.2);
  const regen = 2 * (SADISM.duration + 0.2);
  assert.ok(Math.abs(w.fighters.player.hp - (200 + expected + regen)) < 2);
  assert.equal(w.fighters.player.healTime, 0);
});

test("health costs can never kill the caster", () => {
  const w = fighting();
  w.fighters.player.hp = CLEAVER.cost;
  assert.equal(castAbility(w, "player", "q", { x: 900, y: 270 }), false);
  w.fighters.player.hp = TRAUMA.cost;
  assert.equal(castAbility(w, "player", "e", { x: 900, y: 270 }), false);
});

test("a knockout wins the round and the match ends at the target", () => {
  const w = fighting();
  w.fighters.cpu.hp = 0.5;
  w.fighters.player.burning = true;
  w.fighters.cpu.pos = { x: 250, y: 270 };
  step(w, 0.1);
  assert.equal(w.phase, "roundOver");
  assert.equal(w.roundWinner, "player");
  assert.equal(w.fighters.player.roundsWon, 1);
  assert.equal(w.fighters.player.burning, false);

  run(w, 3);
  assert.equal(w.phase, "countdown");
  assert.equal(w.round, 2);
  assert.equal(w.fighters.cpu.hp, MAX_HP);
  assert.equal(w.fighters.player.roundsWon, 1);

  run(w, COUNTDOWN_TIME + 0.05);
  w.fighters.player.hp = 0;
  step(w, 1 / 60);
  assert.equal(w.fighters.cpu.roundsWon, 1);

  run(w, 3 + COUNTDOWN_TIME);
  w.fighters.cpu.hp = 0;
  step(w, 1 / 60);
  assert.equal(w.fighters.player.roundsWon, ROUNDS_TO_WIN);
  assert.equal(w.phase, "matchOver");
  assert.equal(w.matchWinner, "player");
});

test("a double knockout is a draw that awards no round", () => {
  const w = fighting();
  w.fighters.player.hp = 0;
  w.fighters.cpu.hp = 0;
  step(w, 1 / 60);
  assert.equal(w.phase, "roundOver");
  assert.equal(w.roundWinner, null);
  assert.equal(w.fighters.player.roundsWon + w.fighters.cpu.roundsWon, 0);
});
