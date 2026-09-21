"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  TowerType,
  UseBareboneTDResult,
  World,
} from "../interfaces/BareboneTDTypes";
import { GRID_W, SPEED_STEPS } from "../utils/constants";
import {
  initWorld,
  sellTower as sellTowerAction,
  startWave as startWaveAction,
  step,
  tryPlaceTower,
  upgradeTower as upgradeTowerAction,
} from "../utils/game";

export default function useBareboneTD(): UseBareboneTDResult {
  const [initialWorld] = useState(initWorld);
  const world = useRef<World>(initialWorld);
  const simNow = useRef(0);
  const [, setTick] = useState(0);
  const [scale, setScale] = useState(1);
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);
  const [selectedTowerId, setSelectedTowerId] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [speed, setSpeed] = useState<number>(SPEED_STEPS[0]);
  const speedRef = useRef(speed);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  /* responsive: scale the fixed-size grid to fit its container */
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / GRID_W);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* main loop, driven by a simulated clock so speed-up affects everything uniformly */
  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const frame = (real: number) => {
      const w = world.current;
      const realDt = Math.min(0.05, (real - last) / 1000);
      last = real;
      const dt = realDt * speedRef.current;
      simNow.current += dt * 1000;
      step(w, dt, simNow.current);
      if (w.phase === "gameover" && !w.recorded) {
        w.recorded = true;
        setBest((b) => Math.max(b, w.wave));
      }
      setTick((t) => t + 1);
      const done =
        w.phase === "gameover" &&
        w.impacts.length === 0 &&
        w.projectiles.length === 0;
      if (!done) raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

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
      if (tryPlaceTower(world.current, selectedTower, row, col))
        setTick((t) => t + 1);
    },
    [selectedTower],
  );

  const deselectTower = useCallback(() => {
    setSelectedTowerId(null);
  }, []);

  const upgradeSelectedTower = useCallback(() => {
    if (selectedTowerId == null) return;
    if (upgradeTowerAction(world.current, selectedTowerId))
      setTick((t) => t + 1);
  }, [selectedTowerId]);

  const sellSelectedTower = useCallback(() => {
    if (selectedTowerId == null) return;
    if (sellTowerAction(world.current, selectedTowerId)) {
      setSelectedTowerId(null);
      setTick((t) => t + 1);
    }
  }, [selectedTowerId]);

  const cycleSpeed = useCallback(() => {
    setSpeed((cur) => {
      const idx = SPEED_STEPS.indexOf(
        cur as (typeof SPEED_STEPS)[number],
      );
      return SPEED_STEPS[(idx + 1) % SPEED_STEPS.length];
    });
  }, []);

  const startWave = useCallback(() => {
    startWaveAction(world.current);
    setTick((t) => t + 1);
  }, []);

  const restart = useCallback(() => {
    world.current = initWorld();
    simNow.current = 0;
    setSelectedTower(null);
    setSelectedTowerId(null);
    setSpeed(SPEED_STEPS[0]);
    setTick((t) => t + 1);
  }, []);

  return {
    world: world.current,
    boardRef,
    scale,
    selectedTower,
    selectedTowerId,
    best,
    speed,
    now: simNow.current,
    selectTower,
    placeCell,
    cycleSpeed,
    upgradeSelectedTower,
    sellSelectedTower,
    deselectTower,
    startWave,
    restart,
  };
}
