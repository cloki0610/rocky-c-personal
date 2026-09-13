import type { ClassId, EnemyConfig, EnemyType, FighterClass } from "../interfaces/EndlessArenaTypes";

/* ---------------- constants ---------------- */
export const WORLD_W: number = 2400;
export const WORLD_H: number = 600;
export const VIEW_W: number = 800;
export const VIEW_H: number = 600;

/* ---------------- playable classes ---------------- */
export const CLASSES: Record<ClassId, FighterClass> = {
  warrior: {
    id: "warrior",
    name: "Warrior",
    tag: "MELEE FIGHTER",
    color: "#3b82f6",
    glow: "rgba(59,130,246,.45)",
    ring: "ring-blue-500",
    text: "text-blue-400",
    btn: "bg-blue-600 hover:bg-blue-500",
    bar: "bg-gradient-to-r from-blue-500 to-sky-400",
    size: 44,
    speed: 235,
    maxHp: 140,
    heal: 45,
    melee: { mode: "burst", range: 108, dmg: 34, cd: 420, show: 190 },
    ranged: {
      mode: "stun",
      range: 200,
      dmg: 0,
      cd: 2200,
      show: 340,
      duration: 1000,
      label: "SHOCKWAVE",
    },
    blurb:
      "Heavy armour, heavy swing. The shockwave deals no damage — it freezes every minion in range for a second so you can carve through the crowd.",
    stats: { Power: 5, Range: 2, Speed: 3, Vitality: 5 },
  },
  ranger: {
    id: "ranger",
    name: "Ranger",
    tag: "RANGED FIGHTER",
    color: "#22d3ee",
    glow: "rgba(34,211,238,.45)",
    ring: "ring-cyan-400",
    text: "text-cyan-300",
    btn: "bg-cyan-600 hover:bg-cyan-500",
    bar: "bg-gradient-to-r from-cyan-500 to-teal-300",
    size: 36,
    speed: 310,
    maxHp: 85,
    heal: 30,
    melee: { mode: "burst", range: 72, dmg: 13, cd: 500, show: 160 },
    ranged: {
      mode: "projectile",
      range: 620,
      dmg: 16,
      cd: 420,
      show: 110,
      speed: 900,
      bulletSize: 12,
      label: "ARROW",
    },
    blurb:
      "Fast and fragile. Arrows fly in the direction you're moving and cross most of the screen. The blade is for emergencies only.",
    stats: { Power: 3, Range: 5, Speed: 5, Vitality: 2 },
  },
};
export const CLASS_LIST = [CLASSES.warrior, CLASSES.ranger];

export const TYPES: Record<EnemyType, EnemyConfig> = {
  minion: { size: 30, speed: 95, hp: 30, dmg: 8, cd: 900, reach: 42, color: "#ef4444" },
  buffed: { size: 44, speed: 138, hp: 70, dmg: 15, cd: 800, reach: 54, color: "#a855f7" },
  boss: { size: 66, speed: 84, hp: 260, dmg: 18, cd: 1000, reach: 78, color: "#f97316" },
};

export const TRACKED_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "a", "s"];
