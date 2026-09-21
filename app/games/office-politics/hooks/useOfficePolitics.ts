import { useState } from "react";
import { createGame, clickSquare, canMove } from "../utils/game";
import type { Piece } from "../interfaces/OfficePoliticsTypes";

export default function useOfficePolitics(
  initBoardSize: number,
  initStaffCountTarget: number,
) {
  const [game, setGame] = useState(() =>
    createGame(initBoardSize, initStaffCountTarget),
  );
  return {
    ...game,
    initializeBoard: () =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          previous.staffCountTarget,
          previous.bossRoundTarget,
        ),
      ),
    handleSquareClick: (row: number, col: number) =>
      setGame((previous) => clickSquare(previous, row, col)),
    isValidMove: (
      piece: Piece,
      fromRow: number,
      fromCol: number,
      toRow: number,
      toCol: number,
    ) =>
      !game.gameOver &&
      piece.player === game.currentPlayer &&
      canMove(game.board, fromRow, fromCol, toRow, toCol),
    setBoardSize: (size: number) =>
      setGame((previous) =>
        createGame(size, previous.staffCountTarget, previous.bossRoundTarget),
      ),
    setBossRoundTarget: (target: number) =>
      setGame((previous) =>
        createGame(previous.boardSize, previous.staffCountTarget, target),
      ),
    setStaffCountTarget: (target: number) =>
      setGame((previous) =>
        createGame(previous.boardSize, target, previous.bossRoundTarget),
      ),
  };
}
