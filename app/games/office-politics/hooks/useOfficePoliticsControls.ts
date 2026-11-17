import type { Dispatch, SetStateAction } from "react";
import { canMove, canPlace, clickSquare } from "../utils/game";
import type { PoliticsGame } from "../utils/game";
import type { Piece } from "../interfaces/OfficePoliticsTypes";

// Human board input: plays square clicks through the engine and reports which
// squares are legal targets. Input is ignored while a computer seat is moving.
export default function useOfficePoliticsControls(
  game: PoliticsGame,
  setGame: Dispatch<SetStateAction<PoliticsGame>>,
  isComputerTurn: boolean,
) {
  return {
    handleSquareClick: (row: number, col: number) => {
      if (isComputerTurn) return;
      setGame((previous) => clickSquare(previous, row, col));
    },
    isValidMove: (
      piece: Piece,
      fromRow: number,
      fromCol: number,
      toRow: number,
      toCol: number,
    ) =>
      !game.gameOver &&
      !isComputerTurn &&
      piece.player === game.currentPlayer &&
      canMove(game.board, fromRow, fromCol, toRow, toCol),
    isValidPlacement: (row: number, col: number) =>
      !game.gameOver &&
      !isComputerTurn &&
      game.currentPlayer === "C" &&
      canPlace(game.board, row, col),
  };
}
