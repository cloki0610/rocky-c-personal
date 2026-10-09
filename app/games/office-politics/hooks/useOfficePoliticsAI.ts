import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { chooseAiAction, playAiAction } from "../utils/ai";
import type { PoliticsGame } from "../utils/game";
import type {
  Controller,
  Controllers,
  Player,
} from "../interfaces/OfficePoliticsTypes";

const AI_TURN_DELAY_MS = 700;
const DEFAULT_CONTROLLERS: Controllers = { A: "human", B: "human", C: "human" };

// Plays computer-controlled seats after a short pause so people can follow
// each move. Changing the game or the seats cancels a pending computer move.
export default function useOfficePoliticsAI(
  game: PoliticsGame,
  setGame: Dispatch<SetStateAction<PoliticsGame>>,
) {
  const [controllers, setControllers] =
    useState<Controllers>(DEFAULT_CONTROLLERS);
  const isComputerTurn =
    !game.gameOver && controllers[game.currentPlayer] === "computer";

  useEffect(() => {
    if (!isComputerTurn) return;
    const timer = window.setTimeout(() => {
      const action = chooseAiAction(game);
      if (action)
        setGame((previous) =>
          previous === game ? playAiAction(previous, action) : previous,
        );
    }, AI_TURN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [game, isComputerTurn, setGame]);

  return {
    controllers,
    isComputerTurn,
    setController: (player: Player, controller: Controller) =>
      setControllers((previous) => ({ ...previous, [player]: controller })),
  };
}
