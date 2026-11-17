import { useState } from "react";
import { createGame } from "../utils/game";
import useOfficePoliticsAI from "./useOfficePoliticsAI";
import useOfficePoliticsControls from "./useOfficePoliticsControls";

export default function useOfficePolitics(
  initBoardSize: number,
  initStaffCountTarget: number,
) {
  const [game, setGame] = useState(() =>
    createGame(initBoardSize, initStaffCountTarget),
  );
  const ai = useOfficePoliticsAI(game, setGame);
  const controls = useOfficePoliticsControls(game, setGame, ai.isComputerTurn);
  return {
    ...game,
    ...ai,
    ...controls,
    initializeBoard: () =>
      setGame((previous) =>
        createGame(
          previous.boardSize,
          previous.staffCountTarget,
          previous.bossRoundTarget,
          previous.performanceTarget,
        ),
      ),
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
