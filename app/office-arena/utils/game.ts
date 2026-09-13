import type { GameBoard, Player } from "../interfaces/OfficeAreanaTypes";

export interface ArenaGame {
  board: GameBoard;
  boardSize: number;
  staffCountTarget: number;
  selectedPiece: [number, number] | null;
  currentPlayer: Player;
  roundCount: number;
  gameStatus: string;
  gameOver: boolean;
}

const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const turnMessage: Record<Player, string> = {
  A: "Player A: select the Boss and move one square.",
  B: "Player B: select the Manager and move one square.",
  C: "Player C: place a Junior Staff member on an empty square.",
};

export function createGame(boardSize: number, staffCountTarget: number): ArenaGame {
  if (!Number.isInteger(boardSize) || boardSize < 5 || boardSize > 10) throw new RangeError("Board size must be between 5 and 10.");
  if (!Number.isInteger(staffCountTarget) || staffCountTarget < 3 || staffCountTarget > 10) throw new RangeError("Staff target must be between 3 and 10.");
  const board: GameBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  const center = Math.floor(boardSize / 2);
  board[center][center - 2] = { type: "boss", player: "A", age: 0 };
  board[center][center + 2] = { type: "manager", player: "B", age: 0 };
  return { board, boardSize, staffCountTarget, selectedPiece: null, currentPlayer: "A", roundCount: 1, gameStatus: turnMessage.A, gameOver: false };
}

export function seniorCount(board: GameBoard): number {
  return board.flat().filter(piece => piece?.type === "staff" && piece.age >= 2).length;
}

export function canMove(board: GameBoard, fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
  if (![fromRow, fromCol, toRow, toCol].every(Number.isInteger)) return false;
  const piece = board[fromRow]?.[fromCol];
  const target = board[toRow]?.[toCol];
  if (!piece || target === undefined || piece.type === "staff") return false;
  if (Math.abs(fromRow - toRow) + Math.abs(fromCol - toCol) !== 1 || target?.player === piece.player) return false;
  if (!target) return true;
  const seniors = seniorCount(board);
  if (piece.type === "boss") return target.type === "manager" || (target.type === "staff" && (target.age < 2 || seniors < 3));
  return (target.type === "boss" && seniors >= 3) || (target.type === "staff" && target.age < 2);
}

export function hasLegalMove(board: GameBoard, player: Player): boolean {
  return board.some((row, r) => row.some((piece, c) => piece?.player === player && directions.some(([dr, dc]) => canMove(board, r, c, r + dr, c + dc))));
}

function finish(game: ArenaGame, message: string): ArenaGame {
  return { ...game, selectedPiece: null, gameOver: true, gameStatus: `Game over! ${message}` };
}

// Resolve outcomes against the updated board, then skip a blocked leader's turn.
function advance(game: ArenaGame, nextPlayer: Player): ArenaGame {
  const pieces = game.board.flat();
  if (!pieces.some(piece => piece?.type === "boss")) return finish(game, "Manager wins by capturing the Boss.");
  if (!pieces.some(piece => piece?.type === "manager")) return finish(game, "Boss wins by capturing the Manager.");
  if (seniorCount(game.board) >= game.staffCountTarget) return finish(game, "Staff wins by reaching the Senior Staff target.");
  const bossCanMove = hasLegalMove(game.board, "A");
  const managerCanMove = hasLegalMove(game.board, "B");
  if (!bossCanMove && !managerCanMove) return finish(game, "Staff wins: neither leader has a legal move.");
  let player = nextPlayer;
  let skipped = "";
  if (player === "A" && !bossCanMove) { player = "B"; skipped = "Boss has no legal move; turn skipped. "; }
  if (player === "B" && !managerCanMove) { player = "C"; skipped = "Manager has no legal move; turn skipped. "; }
  return { ...game, selectedPiece: null, currentPlayer: player, gameStatus: skipped + turnMessage[player] };
}

export function clickSquare(game: ArenaGame, row: number, col: number): ArenaGame {
  if (game.gameOver || !Number.isInteger(row) || !Number.isInteger(col) || game.board[row]?.[col] === undefined) return game;
  const target = game.board[row][col];
  if (game.currentPlayer === "C") {
    if (target) return { ...game, gameStatus: "Choose an empty square for the new Staff member." };
    const board = game.board.map(line => line.map(piece => piece?.type === "staff" ? { ...piece, age: piece.age + 1 } : piece));
    board[row][col] = { type: "staff", player: "C", age: 0 };
    return advance({ ...game, board, roundCount: game.roundCount + 1 }, "A");
  }
  if (target?.player === game.currentPlayer) {
    const deselect = game.selectedPiece?.[0] === row && game.selectedPiece?.[1] === col;
    return { ...game, selectedPiece: deselect ? null : [row, col], gameStatus: deselect ? turnMessage[game.currentPlayer] : `Selected ${target.type}. Choose a highlighted square.` };
  }
  if (!game.selectedPiece) return { ...game, gameStatus: turnMessage[game.currentPlayer] };
  const [fromRow, fromCol] = game.selectedPiece;
  if (!canMove(game.board, fromRow, fromCol, row, col)) return { ...game, gameStatus: "Invalid move. Choose a highlighted square." };
  const board = game.board.map(line => [...line]);
  board[row][col] = board[fromRow][fromCol];
  board[fromRow][fromCol] = null;
  return advance({ ...game, board }, game.currentPlayer === "A" ? "B" : "C");
}
