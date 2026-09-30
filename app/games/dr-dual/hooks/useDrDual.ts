"use client";

import { useCallback, useRef, useState } from "react";
import type {
  Difficulty,
  DualScreen,
  FighterId,
  MatchRecord,
  UseDrDualResult,
  World,
} from "../interfaces/DrDualTypes";
import { initWorld } from "../utils/game";
import useDualGameLoop from "./useDualGameLoop";
import usePlayerControls from "./usePlayerControls";

/**
 * Screen flow and session record for the duel; composes the simulation loop
 * and the player's controls around one shared world ref.
 */
export default function useDrDual(): UseDrDualResult {
  const [screen, setScreen] = useState<DualScreen>("select");
  const [runId, setRunId] = useState(0);
  const [record, setRecord] = useState<MatchRecord>({ wins: 0, losses: 0 });
  const world = useRef<World | null>(null);
  const active = screen === "game";

  const onMatchOver = useCallback((winner: FighterId | null) => {
    setRecord((r) =>
      winner === "player"
        ? { ...r, wins: r.wins + 1 }
        : { ...r, losses: r.losses + 1 },
    );
  }, []);

  useDualGameLoop({ world, active, runId, onMatchOver });
  const { resetControls, ...controls } = usePlayerControls({ world, active });

  const startMatch = useCallback(
    (difficulty: Difficulty) => {
      world.current = initWorld(difficulty);
      resetControls();
      setScreen("game");
      setRunId((r) => r + 1);
    },
    [resetControls],
  );

  const backToMenu = useCallback(() => setScreen("select"), []);

  return {
    screen,
    world: world.current,
    record,
    startMatch,
    backToMenu,
    ...controls,
  };
}
