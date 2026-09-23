import assert from "node:assert/strict";
import test from "node:test";
import {
  initWorld,
  chooseStone,
  acknowledgeFall,
  acknowledgeHeal,
  landJump,
  MAX_HEALTH,
  STONES_PER_CHECKPOINT,
} from "./game.ts";

function fixture(overrides = {}) {
  return {
    phase: "playing",
    health: MAX_HEALTH,
    stonesCrossed: 0,
    furthest: 0,
    sinceCheckpoint: 0,
    stableSide: "top",
    standingOn: null,
    checkpointSide: null,
    jumpSide: null,
    fallSide: null,
    justHealed: false,
    retries: 0,
    ...overrides,
  };
}

test("initWorld starts at full health with a random stable side", () => {
  const w = initWorld();
  assert.equal(w.phase, "playing");
  assert.equal(w.health, MAX_HEALTH);
  assert.equal(w.stonesCrossed, 0);
  assert.equal(w.sinceCheckpoint, 0);
  assert.equal(w.standingOn, null);
  assert.ok(w.stableSide === "top" || w.stableSide === "bottom");
});

/* choose a stone and resolve the landing, as the jump animation does */
const jumpTo = (w, side) => landJump(chooseStone(w, side));

test("choosing a stone starts a jump without resolving it", () => {
  const next = chooseStone(fixture(), "bottom");
  assert.equal(next.phase, "jumping");
  assert.equal(next.jumpSide, "bottom");
  assert.equal(next.health, MAX_HEALTH);
  assert.equal(next.stonesCrossed, 0);
  assert.deepEqual(chooseStone(next, "top"), next);
});

test("landing on the stable side advances progress without cost", () => {
  const next = jumpTo(fixture(), "top");
  assert.equal(next.phase, "playing");
  assert.equal(next.stonesCrossed, 1);
  assert.equal(next.sinceCheckpoint, 1);
  assert.equal(next.health, MAX_HEALTH);
  assert.equal(next.justHealed, false);
  assert.equal(next.standingOn, "top");
  assert.equal(next.jumpSide, null);
});

test("landing on the wrong side starts a fall and costs one health", () => {
  const next = jumpTo(fixture({ standingOn: "top" }), "bottom");
  assert.equal(next.phase, "falling");
  assert.equal(next.standingOn, "top");
  assert.equal(next.fallSide, "bottom");
  assert.equal(next.health, MAX_HEALTH - 1);
  assert.equal(next.stonesCrossed, 0);
});

test("acknowledging a survivable fall resumes play with a fresh stable side", () => {
  const fallen = jumpTo(fixture(), "bottom");
  const resumed = acknowledgeFall(fallen);
  assert.equal(resumed.phase, "playing");
  assert.equal(resumed.fallSide, null);
  assert.equal(resumed.health, MAX_HEALTH - 1);
  assert.equal(resumed.retries, 1);
});

test("a survivable fall returns the player to the starting bank", () => {
  const w = fixture({
    stonesCrossed: 4,
    furthest: 4,
    sinceCheckpoint: 4,
    standingOn: "top",
  });
  const resumed = acknowledgeFall(jumpTo(w, "bottom"));
  assert.equal(resumed.standingOn, null);
  assert.equal(resumed.stonesCrossed, 0);
  assert.equal(resumed.sinceCheckpoint, 0);
  assert.equal(resumed.furthest, 4);
});

test("a survivable fall returns the player to the last checkpoint", () => {
  const w = fixture({
    stonesCrossed: 13,
    furthest: 13,
    sinceCheckpoint: 3,
    standingOn: "top",
    checkpointSide: "bottom",
  });
  const resumed = acknowledgeFall(jumpTo(w, "bottom"));
  assert.equal(resumed.standingOn, "bottom");
  assert.equal(resumed.stonesCrossed, STONES_PER_CHECKPOINT);
  assert.equal(resumed.sinceCheckpoint, 0);
  assert.equal(resumed.furthest, 13);
});

test("landing records the furthest stone and the checkpoint stone", () => {
  const w = jumpTo(
    fixture({
      stonesCrossed: 9,
      furthest: 12,
      sinceCheckpoint: STONES_PER_CHECKPOINT - 1,
    }),
    "top",
  );
  assert.equal(w.furthest, 12);
  assert.equal(w.checkpointSide, "top");
  assert.equal(jumpTo({ ...w, stableSide: "top" }, "top").furthest, 12);
  const ahead = jumpTo(fixture({ stonesCrossed: 12, furthest: 12 }), "top");
  assert.equal(ahead.furthest, 13);
});

test("running out of health ends the game after the fall animation", () => {
  const fallen = jumpTo(fixture({ health: 1 }), "bottom");
  assert.equal(fallen.phase, "falling");
  assert.equal(fallen.health, 0);
  const resumed = acknowledgeFall(fallen);
  assert.equal(resumed.phase, "gameover");
});

test("crossing a full group reaches a checkpoint and restores health", () => {
  const w = jumpTo(
    fixture({ health: 2, sinceCheckpoint: STONES_PER_CHECKPOINT - 1 }),
    "top",
  );
  assert.equal(w.sinceCheckpoint, 0);
  assert.equal(w.health, MAX_HEALTH);
  assert.equal(w.justHealed, true);
  assert.equal(w.stonesCrossed, 1);
});

test("acknowledgeHeal clears the transient checkpoint flag only", () => {
  assert.equal(
    acknowledgeHeal(fixture({ justHealed: true })).justHealed,
    false,
  );
  assert.equal(acknowledgeHeal(fixture()).justHealed, false);
});

test("actions outside their expected phase are no-ops", () => {
  const gameOver = fixture({ phase: "gameover" });
  assert.deepEqual(chooseStone(gameOver, "top"), gameOver);
  assert.deepEqual(acknowledgeFall(fixture()), fixture());
  assert.deepEqual(landJump(fixture()), fixture());
});
