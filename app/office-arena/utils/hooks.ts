import { GameBoard, Player } from "../interfaces/OfficeAreanaTypes";

export const isOccupiedBySamePlayer = (
  row: number,
  col: number,
  player: Player,
  currentBoard: GameBoard
): boolean => {
  const piece = currentBoard[row][col];
  return piece !== null && piece.player === player;
};

export const isValidPosition = (
  row: number,
  col: number,
  currentBoard: GameBoard
): boolean => {
  // Check if position is within board bounds
  if (
    row < 0 ||
    row >= currentBoard.length ||
    col < 0 ||
    col >= currentBoard[0].length
  ) {
    return false;
  }

  // Check if position is blocked by senior staff
  const piece = currentBoard[row][col];
  if (piece && piece.type === "staff" && piece.age > 2) {
    return false;
  }

  return true;
};
