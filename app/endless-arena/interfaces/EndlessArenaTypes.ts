import type { RefObject } from "react";

export type ClassId = "warrior" | "ranger";
export type EnemyType = "minion" | "buffed" | "boss";
export type ArenaScreen = "select" | "game";
export type ArenaPhase = "fighting" | "clearing" | "lost";
export type KeyState = Partial<Record<string, boolean>>;

export interface Point {
  x: number;
  y: number;
}

export interface SizedEntity extends Point {
  size: number;
}

export interface AttackConfig {
  range: number;
  dmg: number;
  cd: number;
  show: number;
}

export interface MeleeAttack extends AttackConfig {
  mode: "burst";
}

export interface StunAttack extends AttackConfig {
  mode: "stun";
  duration: number;
  label: string;
}

export interface ProjectileAttack extends AttackConfig {
  mode: "projectile";
  speed: number;
  bulletSize: number;
  label: string;
}

export type RangedAttack = StunAttack | ProjectileAttack;
export type Attack = MeleeAttack | RangedAttack;

export interface FighterClass {
  id: ClassId;
  name: string;
  tag: string;
  color: string;
  glow: string;
  ring: string;
  text: string;
  btn: string;
  bar: string;
  size: number;
  speed: number;
  maxHp: number;
  heal: number;
  melee: MeleeAttack;
  ranged: RangedAttack;
  blurb: string;
  stats: Record<"Power" | "Range" | "Speed" | "Vitality", number>;
}

export interface EnemyConfig {
  size: number;
  speed: number;
  hp: number;
  dmg: number;
  cd: number;
  reach: number;
  color: string;
}

export interface StageScale {
  hp: number;
  dmg: number;
  speed: number;
}

export interface StagePlan {
  minions: number;
  buffed: number;
  boss: boolean;
}

export interface Enemy extends SizedEntity {
  id: number;
  type: EnemyType;
  hp: number;
  maxHp: number;
  speed: number;
  dmg: number;
  cd: number;
  reach: number;
  lastAtk: number;
  flash: number;
  stunUntil: number;
}

export interface StageEnemies {
  enemies: Enemy[];
  boss: Enemy | null;
}

export interface Player extends SizedEntity {
  cls: FighterClass;
  speed: number;
  hp: number;
  maxHp: number;
  melee: MeleeAttack;
  ranged: RangedAttack;
  meleeLast: number;
  meleeUntil: number;
  rangedLast: number;
  rangedUntil: number;
  flash: number;
  aim: Point;
}

export interface Bullet extends SizedEntity {
  id: number;
  dx: number;
  dy: number;
  speed: number;
  dmg: number;
  travelled: number;
  max: number;
  angle: number;
  color: string;
}

export interface Particle extends SizedEntity {
  key: number;
  color: string;
  t: number;
  spin: -1 | 1;
}

export interface World extends StageEnemies {
  phase: ArenaPhase;
  stage: number;
  player: Player;
  bullets: Bullet[];
  corpses: Particle[];
  clearTimer: number;
  recorded: boolean;
  camera: number;
}

export interface BarProps {
  hp: number;
  maxHp: number;
  color: string;
  height?: number;
}

export interface PipsProps {
  value: number;
  color: string;
}

export interface CharacterSelectProps {
  onStart: (clsId: ClassId) => void;
  best: number;
}

export interface UseEndlessArenaResult {
  screen: ArenaScreen;
  world: World | null;
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  best: number;
  startGame: (clsId: ClassId) => void;
  changeFighter: () => void;
}

export interface ArenaHeaderProps {
  player: Player;
  stage: number;
  best: number;
}

export interface ArenaControlsProps {
  player: Player;
  changeFighter: () => void;
}

export interface TimedWorldProps {
  world: World;
  now: number;
}

export interface ArenaParticlesProps {
  particles: Particle[];
}

export interface ArenaOverlaysProps {
  world: World;
  best: number;
  startGame: (clsId: ClassId) => void;
  changeFighter: () => void;
}

export interface ArenaBoardProps extends ArenaOverlaysProps {
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
}
