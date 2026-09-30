import type {
  AbilityInfo,
  AbilityKey,
  AiProfile,
  Difficulty,
  FighterId,
  Vec,
} from "../interfaces/DrDualTypes";

/* arena, in world pixels; the board scales it to fit */
export const ARENA_W = 900;
export const ARENA_H = 540;
export const FIGHTER_R = 24;

export const MAX_HP = 600;
export const HP_REGEN = 2; // per second
export const MOVE_SPEED = 140; // px per second

/* melee: range is centre to centre */
export const ATTACK_RANGE = 70;
export const ATTACK_DAMAGE = 30;
export const ATTACK_COOLDOWN = 1.75; // fixed seconds between swings; nothing shortens it
export const SWING_TIME = 0.4; // visual only: the hit lands when the swing starts
export const MELEE_HIT_TIME = 0.3; // visual only: impact burst on the target

/* Q — Infected Cleaver: thrown toward the cursor, slows on hit */
export const CLEAVER = {
  cost: 25,
  cooldown: 4,
  speed: 720,
  range: 520,
  radius: 10,
  base: 55,
  currentHpRatio: 0.1,
  slow: 0.35,
  slowTime: 1.5,
} as const;

/* W — Burning Agony: toggled aura that drains your own health */
export const BURN = {
  drain: 12, // own HP per second
  dps: 32,
  radius: 120, // from the caster's centre to the target's edge
  toggleCooldown: 1,
  minHp: 40, // switches itself off below this
  shownEvery: 16, // group burn ticks into one damage number
} as const;

/* E — Blunt Force Trauma: next melee hits harder the more health you are missing */
export const TRAUMA = {
  cost: 15,
  cooldown: 6,
  window: 4,
  base: 25,
  missingBonus: 110,
} as const;

/* R — Sadism: heal over time that grows with missing health */
export const SADISM = {
  cooldown: 40,
  base: 80,
  missingRatio: 0.6,
  duration: 6,
  speedBonus: 0.2,
} as const;

export const ROUNDS_TO_WIN = 2;
export const COUNTDOWN_TIME = 3;
export const ROUND_OVER_TIME = 2.5;
export const FLOATER_LIFE = 0.9;
export const HIT_FLASH_TIME = 0.15;

export const SPAWNS: Record<FighterId, Vec> = {
  player: { x: 210, y: ARENA_H / 2 },
  cpu: { x: ARENA_W - 210, y: ARENA_H / 2 },
};

export const FIGHTER_NAMES: Record<FighterId, string> = {
  player: "You",
  cpu: "CPU",
};

/* ---------------- UI ---------------- */
export const MARKER_LIFE = 0.45;

export const ABILITY_COOLDOWNS: Record<AbilityKey, number> = {
  q: CLEAVER.cooldown,
  w: BURN.toggleCooldown,
  e: TRAUMA.cooldown,
  r: SADISM.cooldown,
};

export const ABILITIES: AbilityInfo[] = [
  {
    key: "q",
    name: "Infected Cleaver",
    summary: `Throw a cleaver toward the cursor. Costs ${CLEAVER.cost} HP; deals ${CLEAVER.base} + ${CLEAVER.currentHpRatio * 100}% of the target's current HP and slows.`,
  },
  {
    key: "w",
    name: "Burning Agony",
    summary: `Toggle a burning aura: ${BURN.dps} damage/s to a nearby enemy while it drains ${BURN.drain} of your HP/s.`,
  },
  {
    key: "e",
    name: "Blunt Force Trauma",
    summary: `Costs ${TRAUMA.cost} HP. Your next melee hit deals bonus damage — more the lower your health.`,
  },
  {
    key: "r",
    name: "Sadism",
    summary: `Heal over ${SADISM.duration}s and move ${SADISM.speedBonus * 100}% faster. Heals more the lower your health.`,
  },
];

export const AI_PROFILES: Record<Difficulty, AiProfile> = {
  easy: {
    label: "Easy",
    blurb: "Slow to react, throws wide, never dodges.",
    reaction: 0.6,
    aimError: 0.35,
    lead: 0,
    dodge: 0,
    healAt: 0.25,
  },
  normal: {
    label: "Normal",
    blurb: "Leads some throws and sometimes sidesteps.",
    reaction: 0.35,
    aimError: 0.14,
    lead: 0.6,
    dodge: 0.35,
    healAt: 0.35,
  },
  hard: {
    label: "Hard",
    blurb: "Quick, accurate, and dodges most cleavers.",
    reaction: 0.18,
    aimError: 0.05,
    lead: 1,
    dodge: 0.75,
    healAt: 0.4,
  },
};

export const DIFFICULTIES: Difficulty[] = ["easy", "normal", "hard"];
