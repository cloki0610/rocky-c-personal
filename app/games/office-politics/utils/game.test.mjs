import assert from "node:assert/strict";
import test from "node:test";
import {
  createGame,
  clickSquare,
  canMove,
  BOARD_PRESETS,
  canPlace,
  hasLegalMove,
  performance,
  seniorCount,
} from "./game.ts";

const boss = { type: "boss", player: "A", age: 0 };
const manager = { type: "manager", player: "B", age: 0 };
const staff = (age) => ({ type: "staff", player: "C", age });
// A hand-built 5x5 position keeps rule tests small; it is not a playable size.
function fixture() {
  const game = { ...createGame(7, 10), boardSize: 5 };
  game.board = Array.from({ length: 5 }, () => Array(5).fill(null));
  game.board[0][0] = { ...boss };
  game.board[4][4] = { ...manager };
  return game;
}
function move(game, r, c, toR, toC) {
  return clickSquare(clickSquare(game, r, c), toR, toC);
}

test("every supported size starts with distinct leaders and independent rows", () => {
  for (const size of [5, 6, 11])
    assert.throws(() => createGame(size, 3), RangeError);
  for (let size = 7; size <= 10; size++) {
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
  game = clickSquare(game, 3, 2);
  assert.equal(game.currentPlayer, "A");
  assert.equal(game.roundCount, 2);
  assert.equal(game.board[3][2].age, 0);
  const previous = game;
  game = clickSquare({ ...game, currentPlayer: "C" }, 2, 2);
  assert.equal(game.board[3][2].age, 1);
  assert.equal(previous.board[3][2].age, 0);
  game = clickSquare({ ...game, currentPlayer: "C" }, 2, 1);
  assert.equal(game.board[3][2].age, 2);
  assert.equal(game.board[2][1].age, 0);
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
  const draw = clickSquare(blocked, 1, 1);
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
  const next = clickSquare(game, 2, 0);
  assert.equal(next.gameOver, false);
  assert.equal(next.currentPlayer, "B");
  assert.match(next.gameStatus, /Boss has no legal move/);
});

test("captured staff disappear from subsequent promotion counts", () => {
  const game = fixture();
  game.board[0][1] = staff(2);
  const captured = move(game, 0, 0, 0, 1);
  assert.equal(seniorCount(captured.board), 0);
  const placed = clickSquare({ ...captured, currentPlayer: "C" }, 3, 4);
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
  assert.equal(clickSquare(game, 8, 9).gameOver, false);
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
  game = clickSquare(game, 3, 4);
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
  const won = clickSquare(invalid, 3, 4);
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
    assert.match(clickSquare(game, 1, 1).gameStatus, /Staff wins/);
  }
});

test("survival target validates boundaries and new games reset progress", () => {
  for (const target of [0, 101, 1.5, NaN])
    assert.throws(() => createGame(7, 3, target), RangeError);
  for (const target of [1, 10, 100]) {
    const game = createGame(7, 3, target);
    assert.equal(game.bossRoundTarget, target);
    assert.equal(game.roundCount, 1);
    assert.equal(game.managerMovesRemaining, 0);
    assert.equal(game.gameOver, false);
  }
});

test("the first Junior goes next to the Manager and later ones join the team", () => {
  const game = fixture();
  game.currentPlayer = "C";
  assert.equal(canPlace(game.board, 2, 2), false);
  assert.equal(canPlace(game.board, 3, 3), false, "diagonal does not count");
  assert.equal(canPlace(game.board, 0, 1), false, "next to the Boss");
  assert.equal(canPlace(game.board, 4, 4), false, "occupied");
  const rejected = clickSquare(game, 2, 2);
  assert.equal(rejected.board, game.board);
  assert.equal(rejected.roundCount, 1);
  assert.match(rejected.gameStatus, /next to the Manager/);
  const placed = clickSquare(game, 3, 4);
  assert.equal(placed.board[3][4].age, 0);
  assert.equal(canPlace(placed.board, 2, 4), true);
  assert.equal(
    canPlace(placed.board, 4, 3),
    false,
    "Manager no longer anchors",
  );
  const later = clickSquare({ ...placed, currentPlayer: "C" }, 4, 3);
  assert.equal(later.board, placed.board);
  assert.match(later.gameStatus, /next to existing Staff/);
});

test("a boxed-in team ends the round without placing or aging", () => {
  const game = fixture();
  game.board = Array.from({ length: 5 }, () => Array(5).fill(null));
  game.board[0][0] = staff(1);
  game.board[1][0] = { ...boss };
  game.board[0][2] = { ...manager };
  game.currentPlayer = "B";
  game.managerMovesRemaining = 1;
  // The Manager fills the team's last open neighbour.
  const next = move(game, 0, 2, 0, 1);
  assert.equal(next.gameOver, false);
  assert.equal(next.currentPlayer, "A");
  assert.equal(next.roundCount, 2);
  assert.match(next.gameStatus, /Staff has no legal placement; round ends/);
  assert.equal(next.board[0][0].age, 1, "no aging without a placement");
});

test("the Manager protects orthogonally adjacent Staff from the Boss", () => {
  const { board } = fixture();
  board[0][1] = staff(0);
  board[1][0] = staff(1);
  assert.equal(canMove(board, 0, 0, 0, 1), true);
  board[0][2] = { ...manager };
  board[4][4] = null;
  assert.equal(canMove(board, 0, 0, 0, 1), false, "guarded Junior");
  assert.equal(canMove(board, 0, 0, 1, 0), true, "diagonal is not guarded");
  board[1][1] = { ...manager };
  board[0][2] = null;
  assert.equal(canMove(board, 0, 0, 0, 1), false);
  assert.equal(canMove(board, 0, 0, 1, 0), false);
  assert.equal(hasLegalMove(board, "A"), false, "guarded Staff can block");
});

test("performance counts direct reports within two steps of the Manager", () => {
  const { board } = fixture();
  assert.equal(performance(board), 0);
  board[4][3] = staff(0);
  board[2][4] = staff(2);
  board[3][3] = staff(1);
  board[1][4] = staff(2);
  // 1 (adjacent Junior) + 3 (Senior two steps away) + 1 (diagonal Junior);
  // the Senior three steps away does not count.
  assert.equal(performance(board), 5);
  board[4][4] = null;
  assert.equal(performance(board), 0, "no Manager, no performance");
});

test("the Manager wins on reaching the performance target", () => {
  const game = fixture();
  game.performanceTarget = 4;
  game.currentPlayer = "C";
  game.board[3][4] = staff(1);
  const won = clickSquare(game, 2, 4);
  assert.equal(won.gameOver, true);
  assert.match(
    won.gameStatus,
    /Manager wins by reaching the performance target/,
  );
  const short = clickSquare({ ...game, performanceTarget: 5 }, 2, 4);
  assert.equal(short.gameOver, false);
});

test("Staff wins ties with the performance target", () => {
  const game = fixture();
  game.staffCountTarget = 3;
  game.performanceTarget = 3;
  game.currentPlayer = "C";
  game.board[3][4] = staff(1);
  game.board[4][3] = staff(1);
  game.board[4][2] = staff(1);
  const won = clickSquare(game, 2, 4);
  assert.match(won.gameStatus, /Staff wins/);
});

test("performance target validates boundaries and defaults to 11", () => {
  assert.equal(createGame(9, 5).performanceTarget, 11);
  assert.equal(createGame(9, 5, 10, 8).performanceTarget, 8);
  for (const target of [2, 41, 1.5, NaN])
    assert.throws(() => createGame(9, 5, 10, target), RangeError);
});

test("each board size starts with its recommended targets", () => {
  for (const [size, preset] of Object.entries(BOARD_PRESETS)) {
    const game = createGame(Number(size), 5);
    assert.equal(game.bossRoundTarget, preset.bossRoundTarget);
    assert.equal(game.performanceTarget, preset.performanceTarget);
  }
  assert.deepEqual(Object.keys(BOARD_PRESETS).map(Number), [7, 8, 9, 10]);
  const custom = createGame(8, 5, 30, 15);
  assert.equal(custom.bossRoundTarget, 30);
  assert.equal(custom.performanceTarget, 15);
});
