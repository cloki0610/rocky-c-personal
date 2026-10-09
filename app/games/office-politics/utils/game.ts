import type { GameBoard, Player } from "../interfaces/OfficePoliticsTypes";

export interface PoliticsGame {
  board: GameBoard;
  boardSize: number;
  staffCountTarget: number;
  bossRoundTarget: number;
  performanceTarget: number;
  managerMovesRemaining: number;
  selectedPiece: [number, number] | null;
  currentPlayer: Player;
  roundCount: number;
  gameStatus: string;
  gameOver: boolean;
}

const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];
const turnMessage: Record<Player, string> = {
  A: "Player A: select the Boss and move one square.",
  B: "Player B: select the Manager and move one square.",
  C: "Player C: place a Junior Staff member on a highlighted square.",
};

// Recommended targets per board size, tuned with computer-only simulations
// so each role wins a fair share of games (7x7 still favours the Boss).
export const BOARD_PRESETS: Record<
  number,
  { bossRoundTarget: number; performanceTarget: number }
> = {
  7: { bossRoundTarget: 12, performanceTarget: 12 },
  8: { bossRoundTarget: 12, performanceTarget: 11 },
  9: { bossRoundTarget: 10, performanceTarget: 11 },
  10: { bossRoundTarget: 10, performanceTarget: 10 },
};

export function createGame(
  boardSize: number,
  staffCountTarget: number,
  bossRoundTarget: number = BOARD_PRESETS[boardSize]?.bossRoundTarget ?? 10,
  performanceTarget: number = BOARD_PRESETS[boardSize]?.performanceTarget ?? 11,
): PoliticsGame {
  if (!Number.isInteger(boardSize) || boardSize < 7 || boardSize > 10)
    throw new RangeError("Board size must be between 7 and 10.");
  if (
    !Number.isInteger(staffCountTarget) ||
    staffCountTarget < 3 ||
    staffCountTarget > 10
  )
    throw new RangeError("Staff target must be between 3 and 10.");
  if (
    !Number.isInteger(bossRoundTarget) ||
    bossRoundTarget < 1 ||
    bossRoundTarget > 100
  )
    throw new RangeError(
      "Boss survival target must be between 1 and 100 rounds.",
    );
  if (
    !Number.isInteger(performanceTarget) ||
    performanceTarget < 3 ||
    performanceTarget > 40
  )
    throw new RangeError("Performance target must be between 3 and 40.");
  const board: GameBoard = Array.from({ length: boardSize }, () =>
    Array(boardSize).fill(null),
  );
  const center = Math.floor(boardSize / 2);
  board[center][center - 2] = { type: "boss", player: "A", age: 0 };
  board[center][center + 2] = { type: "manager", player: "B", age: 0 };
  return {
    board,
    boardSize,
    staffCountTarget,
    bossRoundTarget,
    performanceTarget,
    managerMovesRemaining: 0,
    selectedPiece: null,
    currentPlayer: "A",
    roundCount: 1,
    gameStatus: turnMessage.A,
    gameOver: false,
  };
}

// Staff this close to the Manager are its direct reports.
export const PERFORMANCE_REACH = 2;

// The Manager's performance: each direct report scores 1 as a Junior and 3
// as a Senior.
export function performance(board: GameBoard): number {
  const managerRow = board.findIndex((line) =>
    line.some((piece) => piece?.type === "manager"),
  );
  if (managerRow < 0) return 0;
  const managerCol = board[managerRow].findIndex(
    (piece) => piece?.type === "manager",
  );
  return board.reduce(
    (total, line, r) =>
      line.reduce((sum, piece, c) => {
        if (piece?.type !== "staff") return sum;
        const reach = Math.abs(r - managerRow) + Math.abs(c - managerCol);
        if (reach > PERFORMANCE_REACH) return sum;
        return sum + (piece.age >= 2 ? 3 : 1);
      }, total),
    0,
  );
}

export function seniorCount(board: GameBoard): number {
  return board
    .flat()
    .filter((piece) => piece?.type === "staff" && piece.age >= 2).length;
}

function statusMessage(game: PoliticsGame): string {
  return game.currentPlayer === "B"
    ? `${turnMessage.B} ${game.managerMovesRemaining} move${game.managerMovesRemaining === 1 ? "" : "s"} remaining.`
    : turnMessage[game.currentPlayer];
}

// The Manager protects Staff standing directly next to it from the Boss.
export function isGuarded(board: GameBoard, row: number, col: number): boolean {
  return directions.some(
    ([dr, dc]) => board[row + dr]?.[col + dc]?.type === "manager",
  );
}

export function canMove(
  board: GameBoard,
  fromRow: number,
  fromCol: number,
  toRow: number,
  toCol: number,
): boolean {
  if (![fromRow, fromCol, toRow, toCol].every(Number.isInteger)) return false;
  const piece = board[fromRow]?.[fromCol];
  const target = board[toRow]?.[toCol];
  if (!piece || target === undefined || piece.type === "staff") return false;
  if (
    Math.abs(fromRow - toRow) + Math.abs(fromCol - toCol) !== 1 ||
    target?.player === piece.player
  )
    return false;
  if (!target) return true;
  const seniors = seniorCount(board);
  if (piece.type === "boss")
    return (
      target.type === "manager" ||
      (target.type === "staff" &&
        !isGuarded(board, toRow, toCol) &&
        (target.age < 2 || seniors < 3))
    );
  return (
    (target.type === "boss" && seniors >= 3) ||
    (target.type === "staff" && target.age < 2)
  );
}

// A new Junior joins the team next to an existing Staff piece. With no Staff
// on the board, it must be placed one step from the Manager.
export function canPlace(board: GameBoard, row: number, col: number): boolean {
  if (!Number.isInteger(row) || !Number.isInteger(col)) return false;
  if (board[row]?.[col] !== null) return false;
  const anchor = board.flat().some((piece) => piece?.type === "staff")
    ? "staff"
    : "manager";
  return directions.some(
    ([dr, dc]) => board[row + dr]?.[col + dc]?.type === anchor,
  );
}

export function hasLegalPlacement(board: GameBoard): boolean {
  return board.some((line, r) => line.some((_, c) => canPlace(board, r, c)));
}

export function hasLegalMove(board: GameBoard, player: Player): boolean {
  return board.some((row, r) =>
    row.some(
      (piece, c) =>
        piece?.player === player &&
        directions.some(([dr, dc]) => canMove(board, r, c, r + dr, c + dc)),
    ),
  );
}

function finish(game: PoliticsGame, message: string): PoliticsGame {
  return {
    ...game,
    selectedPiece: null,
    gameOver: true,
    gameStatus: `Game over! ${message}`,
  };
}

// Resolve outcomes against the updated board, then skip a blocked leader's turn.
function advance(game: PoliticsGame, nextPlayer: Player): PoliticsGame {
  const pieces = game.board.flat();
  if (!pieces.some((piece) => piece?.type === "boss"))
    return finish(game, "Manager wins by capturing the Boss.");
  if (!pieces.some((piece) => piece?.type === "manager"))
    return finish(game, "Boss wins by capturing the Manager.");
  if (seniorCount(game.board) >= game.staffCountTarget)
    return finish(game, "Staff wins by reaching the Senior Staff target.");
  if (performance(game.board) >= game.performanceTarget)
    return finish(game, "Manager wins by reaching the performance target.");
  const bossCanMove = hasLegalMove(game.board, "A");
  const managerCanMove = hasLegalMove(game.board, "B");
  if (!bossCanMove && !managerCanMove)
    return finish(game, "Staff wins: neither leader has a legal move.");
  if (game.roundCount > game.bossRoundTarget)
    return finish(
      game,
      `Boss wins by surviving ${game.bossRoundTarget} rounds.`,
    );
  let player = nextPlayer;
  let skipped = "";
  if (player === "A" && !bossCanMove) {
    player = "B";
    skipped = "Boss has no legal move; turn skipped. ";
  }
  if (player === "B" && !managerCanMove) {
    player = "C";
    skipped = "Manager has no legal move; turn skipped. ";
  }
  // A boxed-in team cannot grow: the round ends without placement or aging.
  if (player === "C" && !hasLegalPlacement(game.board)) {
    const next = advance(
      { ...game, currentPlayer: "C", roundCount: game.roundCount + 1 },
      "A",
    );
    return next.gameOver
      ? next
      : {
          ...next,
          gameStatus: `${skipped}Staff has no legal placement; round ends. ${next.gameStatus}`,
        };
  }
  const next = {
    ...game,
    selectedPiece: null,
    currentPlayer: player,
    managerMovesRemaining:
      player === "B"
        ? game.currentPlayer === "B"
          ? game.managerMovesRemaining
          : 2
        : 0,
  };
  return { ...next, gameStatus: skipped + statusMessage(next) };
}

export function clickSquare(
  game: PoliticsGame,
  row: number,
  col: number,
): PoliticsGame {
  if (
    game.gameOver ||
    !Number.isInteger(row) ||
    !Number.isInteger(col) ||
    game.board[row]?.[col] === undefined
  )
    return game;
  const target = game.board[row][col];
  if (game.currentPlayer === "C") {
    if (!canPlace(game.board, row, col))
      return {
        ...game,
        gameStatus: game.board.flat().some((piece) => piece?.type === "staff")
          ? "Place the new Staff member on an empty square next to existing Staff."
          : "Place the first Staff member on an empty square next to the Manager.",
      };
    const board = game.board.map((line) =>
      line.map((piece) =>
        piece?.type === "staff" ? { ...piece, age: piece.age + 1 } : piece,
      ),
    );
    board[row][col] = { type: "staff", player: "C", age: 0 };
    return advance({ ...game, board, roundCount: game.roundCount + 1 }, "A");
  }
  if (target?.player === game.currentPlayer) {
    const deselect =
      game.selectedPiece?.[0] === row && game.selectedPiece?.[1] === col;
    return {
      ...game,
      selectedPiece: deselect ? null : [row, col],
      gameStatus: deselect
        ? statusMessage(game)
        : `Selected ${target.type}. Choose a highlighted square.`,
    };
  }
  if (!game.selectedPiece) return { ...game, gameStatus: statusMessage(game) };
  const [fromRow, fromCol] = game.selectedPiece;
  if (!canMove(game.board, fromRow, fromCol, row, col))
    return {
      ...game,
      gameStatus: "Invalid move. Choose a highlighted square.",
    };
  const board = game.board.map((line) => [...line]);
  board[row][col] = board[fromRow][fromCol];
  board[fromRow][fromCol] = null;
  const remaining =
    game.currentPlayer === "B" ? game.managerMovesRemaining - 1 : 0;
  return advance(
    { ...game, board, managerMovesRemaining: remaining },
    game.currentPlayer === "A" || remaining > 0 ? "B" : "C",
  );
}
