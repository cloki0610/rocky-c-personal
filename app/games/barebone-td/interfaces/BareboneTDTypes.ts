import type { RefObject } from "react";

export type TowerType = "single" | "splash" | "slow";
export type Phase = "playing" | "gameover";
export type EnemyKind = "grunt" | "brute";

export interface Point {
  x: number;
  y: number;
}

export interface TowerDef {
  type: TowerType;
  name: string;
  description: string;
  cost: number;
  range: number;
  damage: number;
  cooldown: number;
  projectileSpeed: number;
  color: string;
  ring: string;
  label: string;
  splashRadius?: number;
  slowFactor?: number;
  slowDuration?: number;
}

export interface Tower extends Point {
  id: number;
  type: TowerType;
  row: number;
  col: number;
  lastFired: number;
  level: number;
  totalCost: number;
}

export interface Enemy extends Point {
  id: number;
  kind: EnemyKind;
  wp: number;
  traveled: number;
  hp: number;
  maxHp: number;
  baseSpeed: number;
  reward: number;
  size: number;
  slowUntil: number;
  slowFactor: number;
  hitFlash: number;
}

export interface Projectile {
  id: number;
  type: TowerType;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startedAt: number;
  travelTime: number;
  targetId: number;
  damage: number;
  splashRadius?: number;
  slowFactor?: number;
  slowDuration?: number;
}

export interface Impact extends Point {
  key: number;
  t: number;
  radius: number;
  color: string;
}

export interface WavePlan {
  hp: number;
  speed: number;
  reward: number;
  spawnInterval: number;
  queue: EnemyKind[];
}

export interface World {
  phase: Phase;
  wave: number;
  waveActive: boolean;
  gold: number;
  lives: number;
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  impacts: Impact[];
  spawnQueue: EnemyKind[];
  spawnTimer: number;
  currentPlan: WavePlan | null;
  recorded: boolean;
  prepTimer: number;
}

export interface UseBareboneTDResult {
  world: World;
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  selectedTower: TowerType | null;
  selectedTowerId: number | null;
  best: number;
  speed: number;
  now: number;
  selectTower: (type: TowerType) => void;
  placeCell: (row: number, col: number) => void;
  cycleSpeed: () => void;
  upgradeSelectedTower: () => void;
  sellSelectedTower: () => void;
  deselectTower: () => void;
  startWave: () => void;
  restart: () => void;
}

export interface TDBoardProps {
  world: World;
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  now: number;
  selectedTower: TowerType | null;
  selectedTowerId: number | null;
  best: number;
  placeCell: (row: number, col: number) => void;
  restart: () => void;
}

export interface TDGridProps {
  selectedTower: TowerType | null;
  towers: Tower[];
  placeCell: (row: number, col: number) => void;
}

export interface TDTowerProps {
  tower: Tower;
  selected: boolean;
}

export interface TDEnemyProps {
  enemy: Enemy;
  now: number;
}

export interface TDProjectilesProps {
  projectiles: Projectile[];
  impacts: Impact[];
  now: number;
}

export interface TDHeaderProps {
  world: World;
  speed: number;
  startWave: () => void;
  cycleSpeed: () => void;
}

export interface TDToolbarProps {
  gold: number;
  selectedTower: TowerType | null;
  waveActive: boolean;
  selectTower: (type: TowerType) => void;
}

export interface TDOverlaysProps {
  world: World;
  best: number;
  restart: () => void;
}

export interface TDTowerPanelProps {
  tower: Tower | null;
  gold: number;
  waveActive: boolean;
  upgradeTower: () => void;
  sellTower: () => void;
  close: () => void;
}
