import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";

export type FighterId = "player" | "cpu";
export type AbilityKey = "q" | "w" | "e" | "r";
export type Difficulty = "easy" | "normal" | "hard";
export type DualScreen = "select" | "game";
export type MatchPhase = "countdown" | "fighting" | "roundOver" | "matchOver";
export type FloaterKind = "damage" | "empowered" | "heal";

export interface Vec {
  x: number;
  y: number;
}

export interface Fighter {
  id: FighterId;
  pos: Vec;
  /* displacement per second on the last step, used by the CPU to lead its throws */
  vel: Vec;
  /* radians, 0 = facing right */
  facing: number;
  hp: number;
  moveTarget: Vec | null;
  /* ordered to chase and melee the opponent */
  attacking: boolean;
  attackCd: number;
  cooldowns: Record<AbilityKey, number>;
  burning: boolean;
  /* burn damage dealt since the last damage number was shown */
  burnShown: number;
  /* seconds left on the empowered next attack */
  empowered: number;
  healRate: number;
  healTime: number;
  slow: number;
  /* seconds left on the melee swing animation */
  swing: number;
  /* whether the current swing was the empowered (E) hit */
  swingEmpowered: boolean;
  /* seconds left on the impact burst from the opponent's melee hit */
  meleeHit: number;
  hitFlash: number;
  roundsWon: number;
}

export interface Cleaver {
  id: number;
  owner: FighterId;
  pos: Vec;
  dir: Vec;
  traveled: number;
}

export interface Floater {
  id: number;
  pos: Vec;
  text: string;
  kind: FloaterKind;
  age: number;
}

export interface World {
  phase: MatchPhase;
  difficulty: Difficulty;
  round: number;
  /* seconds left in the countdown or round-over pause */
  timer: number;
  fighters: Record<FighterId, Fighter>;
  cleavers: Cleaver[];
  floaters: Floater[];
  roundWinner: FighterId | null;
  matchWinner: FighterId | null;
  /* status text for the live region */
  announcement: string;
  time: number;
  nextId: number;
  recorded: boolean;
}

export interface AiProfile {
  label: string;
  blurb: string;
  /* seconds between decisions */
  reaction: number;
  /* max radians of random aim error */
  aimError: number;
  /* 0-1: how much of the target's movement the throw leads */
  lead: number;
  /* 0-1: chance to sidestep an incoming cleaver */
  dodge: number;
  /* health fraction at which the CPU uses its heal */
  healAt: number;
}

export interface AiBrain {
  thinkIn: number;
  dodgeFor: number;
}

export interface ClickMarker {
  pos: Vec;
  kind: "move" | "attack";
  at: number;
}

export interface MatchRecord {
  wins: number;
  losses: number;
}

export interface AbilityInfo {
  key: AbilityKey;
  name: string;
  summary: string;
}

export interface UseDualGameLoopOptions {
  world: RefObject<World | null>;
  active: boolean;
  runId: number;
  onMatchOver: (winner: FighterId | null) => void;
}

export interface UsePlayerControlsOptions {
  world: RefObject<World | null>;
  active: boolean;
}

export interface UsePlayerControlsResult {
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  aim: Vec;
  marker: ClickMarker | null;
  resetControls: () => void;
  castFromButton: (key: AbilityKey) => void;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onContextMenu: (e: ReactMouseEvent<HTMLDivElement>) => void;
}

export interface UseDrDualResult {
  screen: DualScreen;
  world: World | null;
  record: MatchRecord;
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  aim: Vec;
  marker: ClickMarker | null;
  startMatch: (difficulty: Difficulty) => void;
  backToMenu: () => void;
  castFromButton: (key: AbilityKey) => void;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onContextMenu: (e: ReactMouseEvent<HTMLDivElement>) => void;
}

export interface DifficultySelectProps {
  record: MatchRecord;
  onStart: (difficulty: Difficulty) => void;
}

export interface DualArenaProps {
  world: World;
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  aim: Vec;
  marker: ClickMarker | null;
  record: MatchRecord;
  startMatch: (difficulty: Difficulty) => void;
  backToMenu: () => void;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onContextMenu: (e: ReactMouseEvent<HTMLDivElement>) => void;
}

export interface DoctorFighterProps {
  fighter: Fighter;
}

export interface CleaverSpriteProps {
  cleaver: Cleaver;
  time: number;
}

export interface AimGuideProps {
  fighter: Fighter;
  aim: Vec;
  marker: ClickMarker | null;
  time: number;
}

export interface FloatersProps {
  floaters: Floater[];
}

export interface DualHeaderProps {
  world: World;
  backToMenu: () => void;
}

export interface FighterStatusProps {
  world: World;
}

export interface HealthBarProps {
  hp: number;
  color: string;
  label: string;
}

export interface AbilityBarProps {
  fighter: Fighter;
  canCast: boolean;
  castFromButton: (key: AbilityKey) => void;
}

export interface DualOverlaysProps {
  world: World;
  record: MatchRecord;
  startMatch: (difficulty: Difficulty) => void;
  backToMenu: () => void;
}
