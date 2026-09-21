import assert from "node:assert/strict";
import test from "node:test";
import {
  createGame,
  clickSquare,
  canMove,
  hasLegalMove,
  seniorCount,
} from "./game.ts";

const boss = { type: "boss", player: "A", age: 0 };
const manager = { type: "manager", player: "B", age: 0 };
const staff = (age) => ({ type: "staff", player: "C", age });
function fixture() {
  const game = createGame(5, 10);
  game.board = Array.from({ length: 5 }, () => Array(5).fill(null));
  game.board[0][0] = { ...boss };
  game.board[4][4] = { ...manager };
  return game;
}
function move(game, r, c, toR, toC) {
  return clickSquare(clickSquare(game, r, c), toR, toC);
}

test("every supported size starts with distinct leaders and independent rows", () => {
  for (let size = 5; size <= 10; size++) {
    const game = createGame(size, 3);
    assert.equal(game.board.length, size);
    assert.equal(game.board.flat().filter(Boolean).length, 2);
    assert.notEqual(game.board[0], game.board[1]);
    assert.equal(game.currentPlayer, "A");
  }
});

test("moves are orthogonal, bounded, and captures obey senior thresholds", () => {
  const { board } = fixture();
  assert.equal(canMove(board, 0, 0, -1, 0), false);
  assert.equal(canMove(board, 0, 0, 1, 1), false);
  assert.equal(canMove(board, 0, 0, 0, 0), false);
  assert.equal(canMove(board, 0, 0, 0, 1), true);
  board[0][1] = staff(2);
  assert.equal(canMove(board, 0, 0, 0, 1), true);
  board[2][2] = staff(2);
  board[2][3] = staff(3);
  assert.equal(canMove(board, 0, 0, 0, 1), false);
  board[4][3] = staff(2);
  assert.equal(canMove(board, 4, 4, 4, 3), false);
  board[4][3] = staff(1);
  assert.equal(canMove(board, 4, 4, 4, 3), true);
  board[4][3] = boss;
  assert.equal(canMove(board, 4, 4, 4, 3), true);
  board[2][2] = null;
  assert.equal(canMove(board, 4, 4, 4, 3), false);
});

test("turn cycle and promotions use immutable snapshots", () => {
  const original = fixture();
  const snapshot = structuredClone(original);
  let game = move(original, 0, 0, 0, 1);
  assert.equal(game.currentPlayer, "B");
  assert.deepEqual(original, snapshot);
  game = move(game, 4, 4, 4, 3);
  assert.equal(game.currentPlayer, "B");
  assert.equal(game.managerMovesRemaining, 1);
  assert.match(game.gameStatus, /1 move remaining/);
  game = move(game, 4, 3, 3, 3);
  assert.equal(game.currentPlayer, "C");
  game = clickSquare(game, 2, 2);
  assert.equal(game.currentPlayer, "A");
  assert.equal(game.roundCount, 2);
  assert.equal(game.board[2][2].age, 0);
  const previous = game;
  game = clickSquare({ ...game, currentPlayer: "C" }, 2, 3);
  assert.equal(game.board[2][2].age, 1);
  assert.equal(previous.board[2][2].age, 0);
  game = clickSquare({ ...game, currentPlayer: "C" }, 3, 2);
  assert.equal(game.board[2][2].age, 2);
  assert.equal(game.board[3][2].age, 0);
  assert.equal(seniorCount(game.board), 1);
});

test("captures finish immediately, clear selection, and prevent further input", () => {
  const game = fixture();
  game.board[4][4] = null;
  game.board[0][1] = manager;
  const won = move(game, 0, 0, 0, 1);
  assert.equal(won.gameOver, true);
  assert.match(won.gameStatus, /Boss wins/);
  assert.equal(won.selectedPiece, null);
  assert.equal(clickSquare(won, 3, 3), won);
});

test("Manager can win with three seniors when target is higher", () => {
  const game = fixture();
  game.currentPlayer = "B";
  game.board[0][0] = null;
  game.board[4][3] = boss;
  for (let c = 0; c < 3; c++) game.board[2][c] = staff(2);
  assert.match(move(game, 4, 4, 4, 3).gameStatus, /Manager wins/);
});

test("promotion target is checked on the new board", () => {
  const game = fixture();
  game.staffCountTarget = 3;
  game.currentPlayer = "C";
  for (let c = 0; c < 3; c++) game.board[2][c] = staff(1);
  const won = clickSquare(game, 3, 0);
  assert.equal(won.gameOver, true);
  assert.match(won.gameStatus, /target/);
});

test("a blocked Manager skips to Staff and both blocked leaders give Staff the win", () => {
  const game = fixture();
  game.board[4][3] = staff(2);
  game.board[3][4] = staff(2);
  assert.equal(hasLegalMove(game.board, "B"), false);
  const skipped = move(game, 0, 0, 0, 1);
  assert.equal(skipped.currentPlayer, "C");
  assert.equal(skipped.gameOver, false);
  const blocked = fixture();
  blocked.currentPlayer = "C";
  blocked.board[0][1] = staff(1);
  blocked.board[1][0] = staff(1);
  blocked.board[4][3] = staff(1);
  blocked.board[3][4] = staff(1);
  const draw = clickSquare(blocked, 2, 2);
  assert.equal(draw.gameOver, true);
  assert.match(draw.gameStatus, /neither leader/);
});

test("invalid placement and clicks do not advance turns or age staff", () => {
  const game = fixture();
  assert.equal(clickSquare(game, -1, 0), game);
  const selected = clickSquare(game, 0, 0);
  const invalid = clickSquare(selected, 2, 2);
  assert.equal(invalid.board, game.board);
  assert.deepEqual(invalid.selectedPiece, [0, 0]);
  assert.equal(clickSquare(selected, 0, 0).selectedPiece, null);
  const placement = clickSquare({ ...game, currentPlayer: "C" }, 0, 0);
  assert.equal(placement.currentPlayer, "C");
  assert.equal(placement.roundCount, 1);
});

test("a blocked Boss skips to the Manager after placement", () => {
  const game = fixture();
  game.currentPlayer = "C";
  game.board[0][1] = staff(1);
  game.board[1][0] = staff(1);
  game.board[2][2] = staff(1);
  const next = clickSquare(game, 3, 0);
  assert.equal(next.gameOver, false);
  assert.equal(next.currentPlayer, "B");
  assert.match(next.gameStatus, /Boss has no legal move/);
});

test("captured staff disappear from subsequent promotion counts", () => {
  const game = fixture();
  game.board[0][1] = staff(2);
  const captured = move(game, 0, 0, 0, 1);
  assert.equal(seniorCount(captured.board), 0);
  const placed = clickSquare({ ...captured, currentPlayer: "C" }, 2, 2);
  assert.equal(seniorCount(placed.board), 0);
  assert.equal(
    placed.board.flat().filter((piece) => piece?.type === "staff").length,
    1,
  );
});

test("leaders farther than ten moves apart do not trigger a false draw", () => {
  const game = createGame(10, 10);
  game.board = Array.from({ length: 10 }, () => Array(10).fill(null));
  game.board[0][0] = boss;
  game.board[9][9] = manager;
  game.currentPlayer = "C";
  assert.equal(clickSquare(game, 4, 4).gameOver, false);
});

test("invalid Manager input preserves both moves and the next round restores them", () => {
  let game = move(fixture(), 0, 0, 0, 1);
  assert.equal(game.managerMovesRemaining, 2);
  const invalid = move(game, 4, 4, 2, 2);
  assert.equal(invalid.managerMovesRemaining, 2);
  assert.equal(invalid.board, game.board);
  game = clickSquare(invalid, 4, 3);
  assert.equal(game.managerMovesRemaining, 1);
  game = move(game, 4, 3, 4, 4);
  assert.equal(game.currentPlayer, "C");
  game = clickSquare(game, 2, 2);
  game = move(game, 0, 1, 0, 0);
  assert.equal(game.managerMovesRemaining, 2);
});

test("Manager captures end the game on either move", () => {
  for (const remaining of [1, 2]) {
    const game = fixture();
    game.currentPlayer = "B";
    game.managerMovesRemaining = remaining;
    game.board[0][0] = null;
    game.board[4][3] = boss;
    for (let c = 0; c < 3; c++) game.board[2][c] = staff(2);
    const won = move(game, 4, 4, 4, 3);
    assert.equal(won.gameOver, true);
    assert.match(won.gameStatus, /Manager wins/);
    assert.equal(won.selectedPiece, null);
  }
});

test("Boss survival counts complete rounds and freezes finished games", () => {
  let game = fixture();
  game.bossRoundTarget = 1;
  game = move(game, 0, 0, 0, 1);
  assert.equal(game.gameOver, false);
  game = move(game, 4, 4, 4, 3);
  assert.equal(game.gameOver, false);
  game = move(game, 4, 3, 4, 4);
  assert.equal(game.gameOver, false);
  const invalid = clickSquare(game, 0, 1);
  assert.equal(invalid.roundCount, 1);
  assert.equal(invalid.gameOver, false);
  const won = clickSquare(invalid, 2, 2);
  assert.equal(won.roundCount, 2);
  assert.match(won.gameStatus, /Boss wins by surviving 1 rounds/);
  assert.equal(won.gameOver, true);
  assert.equal(won.selectedPiece, null);
  assert.equal(clickSquare(won, 2, 3), won);
});

test("Staff target and blocked leaders take priority over survival on the final placement", () => {
  for (const blocked of [false, true]) {
    const game = fixture();
    game.bossRoundTarget = 1;
    game.currentPlayer = "C";
    if (blocked) {
      for (const [r, c] of [
        [0, 1],
        [1, 0],
        [4, 3],
        [3, 4],
      ])
        game.board[r][c] = staff(1);
    } else {
      game.staffCountTarget = 3;
      for (let c = 0; c < 3; c++) game.board[2][c] = staff(1);
    }
    assert.match(clickSquare(game, 3, 0).gameStatus, /Staff wins/);
  }
});

test("survival target validates boundaries and new games reset progress", () => {
  for (const target of [0, 101, 1.5, NaN])
    assert.throws(() => createGame(5, 3, target), RangeError);
  for (const target of [1, 10, 100]) {
    const game = createGame(5, 3, target);
    assert.equal(game.bossRoundTarget, target);
    assert.equal(game.roundCount, 1);
    assert.equal(game.managerMovesRemaining, 0);
    assert.equal(game.gameOver, false);
  }
});
