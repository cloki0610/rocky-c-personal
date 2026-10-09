import type {
  AiAction,
  GameBoard,
  Player,
  Square,
} from "../interfaces/OfficePoliticsTypes";
import type { PoliticsGame } from "./game.ts";
import {
  canMove,
  canPlace,
  clickSquare,
  hasLegalMove,
  isGuarded,
  performance,
  seniorCount,
} from "./game.ts";

// The computer chooses one action per call and plays it through `clickSquare`,
// so it follows exactly the same rules as a person at the board.

const WIN = 10_000;
const LOSS = -5_000;
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

const distance = ([r1, c1]: Square, [r2, c2]: Square) =>
  Math.abs(r1 - r2) + Math.abs(c1 - c2);

export function findPiece(board: GameBoard, type: "boss" | "manager") {
  for (let r = 0; r < board.length; r++)
    for (let c = 0; c < board[r].length; c++)
      if (board[r][c]?.type === type) return [r, c] as Square;
  return null;
}

export function legalMoves(board: GameBoard, player: Player) {
  const moves: { from: Square; to: Square }[] = [];
  board.forEach((row, r) =>
    row.forEach((piece, c) => {
      if (piece?.player !== player) return;
      for (const [dr, dc] of directions)
        if (canMove(board, r, c, r + dr, c + dc))
          moves.push({ from: [r, c], to: [r + dr, c + dc] });
    }),
  );
  return moves;
}

export function legalPlacements(board: GameBoard) {
  const squares: Square[] = [];
  board.forEach((row, r) =>
    row.forEach((_, c) => {
      if (canPlace(board, r, c)) squares.push([r, c]);
    }),
  );
  return squares;
}

function staffPieces(board: GameBoard) {
  const pieces: { at: Square; age: number }[] = [];
  board.forEach((row, r) =>
    row.forEach((piece, c) => {
      if (piece?.type === "staff") pieces.push({ at: [r, c], age: piece.age });
    }),
  );
  return pieces;
}

// Staff would reach the Senior target on the next placement.
function staffAboutToWin(board: GameBoard, staffCountTarget: number) {
  const maturing = staffPieces(board).filter(({ age }) => age === 1);
  return seniorCount(board) + maturing.length >= staffCountTarget;
}

function movePiece(board: GameBoard, from: Square, to: Square): GameBoard {
  const next = board.map((line) => [...line]);
  next[to[0]][to[1]] = next[from[0]][from[1]];
  next[from[0]][from[1]] = null;
  return next;
}

function placeStaff(board: GameBoard, [row, col]: Square): GameBoard {
  const next = board.map((line) =>
    line.map((piece) =>
      piece?.type === "staff" ? { ...piece, age: piece.age + 1 } : piece,
    ),
  );
  next[row][col] = { type: "staff", player: "C", age: 0 };
  return next;
}

function captureValue(board: GameBoard, [row, col]: Square) {
  const target = board[row][col];
  if (target?.type !== "staff") return 0;
  return target.age >= 2 ? 60 : target.age === 1 ? 50 : 25;
}

// How much the Boss wants a Staff piece: Juniors one placement from
// promotion matter most, and Seniors only while fewer than three exist.
function bossInterest(board: GameBoard, age: number) {
  if (age >= 2) return seniorCount(board) >= 3 ? 0 : 40;
  return age === 1 ? 30 : 15;
}

// Pull toward Staff the Boss can still capture. Staff next to the Manager are
// protected for now, but the Manager may have to leave them.
function huntValue(board: GameBoard, at: Square) {
  return staffPieces(board).reduce((total, piece) => {
    const guard = isGuarded(board, ...piece.at) ? 0.4 : 1;
    const weight = bossInterest(board, piece.age) * guard;
    return total + weight / distance(at, piece.at);
  }, 0);
}

// The most valuable capture the Boss could make from where it stands.
function bossThreat(board: GameBoard) {
  return legalMoves(board, "A").reduce(
    (best, { to }) => Math.max(best, captureValue(board, to)),
    0,
  );
}

// Value of the Staff the Manager shields from a nearby Boss.
function guardValue(board: GameBoard, manager: Square, boss: Square) {
  return staffPieces(board).reduce((total, piece) => {
    if (distance(manager, piece.at) !== 1) return total;
    const urgency = distance(boss, piece.at) <= 3 ? 1 : 0.4;
    return total + bossInterest(board, piece.age) * urgency;
  }, 0);
}

function scoreBossMove(game: PoliticsGame, from: Square, to: Square) {
  if (game.board[to[0]][to[1]]?.type === "manager") return WIN;
  const board = movePiece(game.board, from, to);
  const manager = findPiece(board, "manager");
  if (!manager) return WIN;
  const gap = distance(to, manager);
  // The Manager answers with two moves; with three Seniors it may capture.
  if (seniorCount(board) >= 3 && gap <= 2) return LOSS;
  const mobility = legalMoves(board, "A").length;
  // Standing on the team's edge also takes placement squares away from Staff.
  const placements = legalPlacements(board).length;
  return (
    captureValue(game.board, to) * 2 +
    huntValue(board, to) +
    mobility * 3 -
    placements * 2 -
    (seniorCount(board) < 3 ? gap : 0)
  );
}

function scoreManagerMove(game: PoliticsGame, from: Square, to: Square) {
  if (game.board[to[0]][to[1]]?.type === "boss") return WIN;
  const board = movePiece(game.board, from, to);
  const boss = findPiece(board, "boss");
  if (!boss) return WIN;
  const gap = distance(to, boss);
  const lastMove = game.managerMovesRemaining <= 1;
  // Next to the Boss after the last move means the Boss can capture.
  if (gap === 1 && lastMove) return LOSS;
  const mobility = legalMoves(board, "B").length;
  const seniors = seniorCount(board);
  // With three Seniors the Manager hunts the Boss; until then it mentors the
  // team, standing next to the Staff the Boss is closing in on.
  const team = staffPieces(board);
  const nearestStaff = team.length
    ? Math.min(...team.map((piece) => distance(to, piece.at)))
    : 0;
  const pressure =
    seniors >= 3
      ? -gap * 12
      : guardValue(board, to, boss) - bossThreat(board) - nearestStaff * 3;
  const target = game.board[to[0]][to[1]];
  // The Manager needs three Seniors to win, so it spares Staff unless the
  // team is about to reach its target on the next placement.
  const capture =
    target?.type !== "staff"
      ? 0
      : target.age === 1 && staffAboutToWin(game.board, game.staffCountTarget)
        ? 200
        : -captureValue(game.board, to);
  // Keep direct reports close to build performance.
  const reports = performance(board) * 6;
  return capture + mobility * 3 + pressure + reports - (gap === 1 ? 30 : 0);
}

function scoreStaffPlacement(game: PoliticsGame, at: Square) {
  const board = placeStaff(game.board, at);
  if (!hasLegalMove(board, "A") && !hasLegalMove(board, "B")) return WIN;
  const boss = findPiece(board, "boss");
  const manager = findPiece(board, "manager");
  // A Junior survives longer the further it sits from the Boss. The Manager
  // only hunts Staff when the team is one placement from winning.
  const bossGap = boss ? distance(at, boss) : 99;
  const managerGap = manager ? distance(at, manager) : 99;
  const managerHunts = staffAboutToWin(board, game.staffCountTarget);
  const safety = Math.min(
    isGuarded(board, ...at) ? 4 : bossGap - 1,
    managerHunts ? managerGap - 2 : 4,
    4,
  );
  const blocked =
    legalMoves(game.board, "A").length -
    legalMoves(board, "A").length +
    legalMoves(game.board, "B").length -
    legalMoves(board, "B").length;
  // Keep room to grow so the team is not boxed in next round.
  const room = legalPlacements(board).length;
  // Placing near the Manager feeds its performance target.
  const feeds = performance(board) - performance(game.board);
  return safety * 10 + Math.min(bossGap, 6) + blocked * 2 + room - feeds * 6;
}

function pickBest<T>(
  options: T[],
  score: (option: T) => number,
  random: () => number,
) {
  let best: T | null = null;
  let bestScore = -Infinity;
  for (const option of options) {
    // A small random term breaks ties so the computer is not predictable.
    const value = score(option) + random();
    if (value > bestScore) {
      best = option;
      bestScore = value;
    }
  }
  return best;
}

export function chooseAiAction(
  game: PoliticsGame,
  random: () => number = Math.random,
): AiAction | null {
  if (game.gameOver) return null;
  if (game.currentPlayer === "C") {
    const at = pickBest(
      legalPlacements(game.board),
      (square) => scoreStaffPlacement(game, square),
      random,
    );
    return at ? { kind: "place", at } : null;
  }
  const score = game.currentPlayer === "A" ? scoreBossMove : scoreManagerMove;
  const move = pickBest(
    legalMoves(game.board, game.currentPlayer),
    ({ from, to }) => score(game, from, to),
    random,
  );
  return move ? { kind: "move", ...move } : null;
}

export function playAiAction(
  game: PoliticsGame,
  action: AiAction,
): PoliticsGame {
  if (action.kind === "place")
    return clickSquare(game, action.at[0], action.at[1]);
  const selected = clickSquare(
    { ...game, selectedPiece: null },
    action.from[0],
    action.from[1],
  );
  return clickSquare(selected, action.to[0], action.to[1]);
}

export function takeAiTurn(
  game: PoliticsGame,
  random: () => number = Math.random,
): PoliticsGame {
  const action = chooseAiAction(game, random);
  return action ? playAiAction(game, action) : game;
}
