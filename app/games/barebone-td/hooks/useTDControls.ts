"use client";

import { useCallback, useState } from "react";
import type {
  TowerType,
  UseTDControlsOptions,
  UseTDControlsResult,
} from "../interfaces/BareboneTDTypes";
import { SPEED_STEPS } from "../utils/constants";
import {
  sellTower as sellTowerAction,
  startWave as startWaveAction,
  tryPlaceTower,
  upgradeTower as upgradeTowerAction,
} from "../utils/game";

/**
 * Player input: tower selection and placement, upgrade/sell of the selected
 * tower, starting waves, and game speed. Commands mutate the shared world
 * ref and call `refresh` to re-render.
 */
export default function useTDControls({
  world,
  refresh,
}: UseTDControlsOptions): UseTDControlsResult {
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number>(SPEED_STEPS[0]);

  const selectTower = useCallback((type: TowerType) => {
    setSelectedTower((cur) => (cur === type ? null : type));
    setSelectedTowerId(null);
  }, []);

  const placeCell = useCallback(
    (row: number, col: number) => {
      const tower = world.current.towers.find(
        (t) => t.row === row && t.col === col,
      );
      if (tower) {
        setSelectedTower(null);
        setSelectedTowerId((cur) => (cur === tower.id ? null : tower.id));
        return;
      }
      if (!selectedTower) return;
      if (tryPlaceTower(world.current, selectedTower, row, col)) refresh();
    },
    [world, refresh, selectedTower],
  );

  const deselectTower = useCallback(() => {
    setSelectedTowerId(null);
  }, []);

  const upgradeSelectedTower = useCallback(() => {
    if (selectedTowerId == null) return;
    if (upgradeTowerAction(world.current, selectedTowerId)) refresh();
  }, [world, refresh, selectedTowerId]);

  const sellSelectedTower = useCallback(() => {
    if (selectedTowerId == null) return;
    if (sellTowerAction(world.current, selectedTowerId)) {
      setSelectedTowerId(null);
      refresh();
    }
  }, [world, refresh, selectedTowerId]);

  const cycleSpeed = useCallback(() => {
    setSpeed((cur) => {
      const idx = SPEED_STEPS.indexOf(cur as (typeof SPEED_STEPS)[number]);
      return SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
    });
  }, []);

  const startWave = useCallback(() => {
    startWaveAction(world.current);
    refresh();
  }, [world, refresh]);

  const resetControls = useCallback(() => {
    setSelectedTower(null);
    setSelectedTowerId(null);
    setSpeed(SPEED_STEPS[0]);
  }, []);

  return {
    selectedTower,
    selectedTowerId,
    speed,
    selectTower,
    placeCell,
    cycleSpeed,
    upgradeSelectedTower,
    sellSelectedTower,
    deselectTower,
    startWave,
    resetControls,
  };
}
