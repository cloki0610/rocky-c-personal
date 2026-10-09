import assert from "node:assert/strict";
import test from "node:test";
import { createGame, canMove, canPlace } from "./game.ts";
import { chooseAiAction, takeAiTurn } from "./ai.ts";

const boss = { type: "boss", player: "A", age: 0 };
const manager = { type: "manager", player: "B", age: 0 };
const staff = (age) => ({ type: "staff", player: "C", age });
const noRandom = () => 0;
// A hand-built 5x5 position keeps rule tests small; it is not a playable size.
function fixture() {
  const game = { ...createGame(7, 10), boardSize: 5 };
  game.board = Array.from({ length: 5 }, () => Array(5).fill(null));
  game.board[0][0] = { ...boss };
  game.board[4][4] = { ...manager };
  return game;
}

test("the Boss captures an adjacent Manager to win", () => {
  const game = fixture();
  game.board[4][4] = null;
  game.board[0][1] = { ...manager };
  const next = takeAiTurn(game, noRandom);
  assert.equal(next.gameOver, true);
  assert.match(next.gameStatus, /Boss wins/);
});

test("the Manager captures the Boss once three Seniors exist", () => {
  const game = fixture();
  game.board[4][4] = null;
  game.board[1][0] = { ...manager };
  game.board[4][2] = staff(2);
  game.board[4][3] = staff(2);
  game.board[4][4] = staff(2);
  game.currentPlayer = "B";
  game.managerMovesRemaining = 2;
  const next = takeAiTurn(game, noRandom);
  assert.equal(next.gameOver, true);
  assert.match(next.gameStatus, /Manager wins/);
});

test("the Manager does not end its turn next to the Boss", () => {
  const game = fixture();
  game.board[4][4] = null;
  game.board[0][2] = { ...manager };
  game.currentPlayer = "B";
  game.managerMovesRemaining = 1;
  const action = chooseAiAction(game, noRandom);
  assert.equal(action.kind, "move");
  assert.notDeepEqual(action.to, [0, 1]);
});

test("Staff opens next to the Manager, away from the Boss", () => {
  const game = createGame(7, 10);
  game.currentPlayer = "C";
  const action = chooseAiAction(game, noRandom);
  assert.equal(action.kind, "place");
  assert.ok(canPlace(game.board, ...action.at));
  // createGame puts the Boss at [3, 1] and the Manager at [3, 5] on 7x7;
  // [3, 4] is the only square next to the Manager on the Boss's side.
  assert.notDeepEqual(action.at, [3, 4]);
});

test("the Boss captures a Junior about to be promoted", () => {
  const game = fixture();
  game.board[0][1] = staff(0);
  game.board[1][0] = staff(1);
  const action = chooseAiAction(game, noRandom);
  assert.deepEqual(action, { kind: "move", from: [0, 0], to: [1, 0] });
});

test("the Boss heads toward Staff it can still capture", () => {
  const game = fixture();
  game.board[4][0] = staff(0);
  const before = 4;
  const action = chooseAiAction(game, noRandom);
  const [r, c] = action.to;
  assert.ok(Math.abs(r - 4) + Math.abs(c - 0) < before);
});

test("the Manager spares Staff unless they are about to win", () => {
  const game = fixture();
  game.currentPlayer = "B";
  game.managerMovesRemaining = 2;
  game.board[4][3] = staff(1);
  const spare = chooseAiAction(game, noRandom);
  assert.notDeepEqual(spare.to, [4, 3]);
  game.staffCountTarget = 3;
  game.board[2][0] = staff(2);
  game.board[2][1] = staff(2);
  const deny = chooseAiAction(game, noRandom);
  assert.deepEqual(deny.to, [4, 3]);
});

test("the Manager steps in to guard Staff the Boss is about to capture", () => {
  const game = fixture();
  game.currentPlayer = "B";
  game.managerMovesRemaining = 1;
  game.board[0][0] = null;
  game.board[2][0] = { ...boss };
  game.board[2][1] = staff(1);
  game.board[4][4] = null;
  game.board[3][2] = { ...manager };
  const action = chooseAiAction(game, noRandom);
  assert.deepEqual(action, { kind: "move", from: [3, 2], to: [2, 2] });
});

test("computer actions are always legal and full games finish", () => {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let size = 7; size <= 10; size++) {
    let game = createGame(size, 5, 10);
    for (let turn = 0; turn < 200 && !game.gameOver; turn++) {
      const action = chooseAiAction(game, random);
      assert.ok(action, "a playable seat always has an action");
      if (action.kind === "move")
        assert.ok(canMove(game.board, ...action.from, ...action.to));
      else assert.ok(canPlace(game.board, ...action.at));
      const next = takeAiTurn(game, random);
      assert.notEqual(next, game);
      game = next;
    }
    assert.equal(game.gameOver, true);
    assert.equal(chooseAiAction(game, random), null);
  }
});

test("computer turns do not mutate the previous game", () => {
  const game = fixture();
  const snapshot = structuredClone(game);
  takeAiTurn(game, noRandom);
  assert.deepEqual(game, snapshot);
});
