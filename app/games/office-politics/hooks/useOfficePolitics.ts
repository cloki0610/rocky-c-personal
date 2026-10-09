import { useState } from "react";
import { createGame, clickSquare, canMove, canPlace } from "../utils/game";
import useOfficePoliticsAI from "./useOfficePoliticsAI";
import type { Piece } from "../interfaces/OfficePoliticsTypes";

export default function useOfficePolitics(
  initBoardSize: number,
  initStaffCountTarget: number,
) {
  const [game, setGame] = useState(() =>
    createGame(initBoardSize, initStaffCountTarget),
  );
  const ai = useOfficePoliticsAI(game, setGame);
  return {
    ...game,
    ...ai,
    initializeBoard: () =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          previous.staffCountTarget,
          previous.bossRoundTarget,
          previous.performanceTarget,
        ),
      ),
    handleSquareClick: (row: number, col: number) => {
      if (ai.isComputerTurn) return;
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
      !ai.isComputerTurn &&
      piece.player === game.currentPlayer &&
      canMove(game.board, fromRow, fromCol, toRow, toCol),
    isValidPlacement: (row: number, col: number) =>
      !game.gameOver &&
      !ai.isComputerTurn &&
      game.currentPlayer === "C" &&
      canPlace(game.board, row, col),
    // A new board size also applies that size's recommended targets.
    setBoardSize: (size: number) =>
      setGame((previous) => createGame(size, previous.staffCountTarget)),
    setBossRoundTarget: (target: number) =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          previous.staffCountTarget,
          target,
          previous.performanceTarget,
        ),
      ),
    setStaffCountTarget: (target: number) =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          target,
          previous.bossRoundTarget,
          previous.performanceTarget,
        ),
      ),
    setPerformanceTarget: (target: number) =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          previous.staffCountTarget,
          previous.bossRoundTarget,
          target,
        ),
      ),
  };
}
