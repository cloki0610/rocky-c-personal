import type { TowerDef, TowerType } from "../interfaces/BareboneTDTypes";

/* ---------------- grid ---------------- */
export const TILE = 64;
export const COLS = 13;
export const ROWS = 7;
export const GRID_W = COLS * TILE;
export const GRID_H = ROWS * TILE;

export const STARTING_GOLD = 150;
export const STARTING_LIVES = 20;

/* ---------------- prep phase ---------------- */
export const PREP_TIME_MS = 30_000;

/* ---------------- speed control ---------------- */
export const SPEED_STEPS = [1, 2, 3, 5, 10] as const;

/* ---------------- tower economy ---------------- */
export const SELL_REFUND_RATE = 0.8;
export const MAX_TOWER_LEVEL = 5;
export const UPGRADE_COST_RATE = 0.6;
export const UPGRADE_DAMAGE_MULT = 0.15;
export const UPGRADE_DURATION_MS = 150;

/* row,col cells the path snakes through, left entrance to right exit */
export const PATH: [number, number][] = [
  [3, 0],
  [3, 1],
  [3, 2],
  [3, 3],
  [4, 3],
  [5, 3],
  [5, 4],
  [5, 5],
  [5, 6],
  [4, 6],
  [3, 6],
  [2, 6],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [2, 9],
  [3, 9],
  [4, 9],
  [5, 9],
  [5, 10],
  [5, 11],
  [5, 12],
];

export const PATH_SET = new Set(PATH.map(([r, c]) => `${r},${c}`));

/* ---------------- turrets ---------------- */
export const TOWER_DEFS: Record<TowerType, TowerDef> = {
  single: {
    type: "single",
    name: "Ranger Tower",
    description: "Fast single-target shots at long range.",
    cost: 50,
    range: 150,
    damage: 20,
    cooldown: 550,
    projectileSpeed: 640,
    color: "#fbbf24",
    ring: "ring-amber-400",
    label: "S",
  },
  splash: {
    type: "splash",
    name: "Mortar Tower",
    description: "Explosive shells damage every enemy in the blast.",
    cost: 90,
    range: 130,
    damage: 16,
    cooldown: 1400,
    projectileSpeed: 500,
    splashRadius: 60,
    color: "#f87171",
    ring: "ring-red-400",
    label: "E",
  },
  slow: {
    type: "slow",
    name: "Frost Tower",
    description: "Light damage that chills enemies, slowing their advance.",
    cost: 65,
    range: 140,
    damage: 6,
    cooldown: 650,
    projectileSpeed: 560,
    slowFactor: 0.45,
    slowDuration: 1600,
    color: "#38bdf8",
    ring: "ring-sky-400",
    label: "F",
  },
};

export const TOWER_LIST: TowerDef[] = [
  TOWER_DEFS.single,
  TOWER_DEFS.splash,
  TOWER_DEFS.slow,
];
