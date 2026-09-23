export type Side = "top" | "bottom";
export type Phase = "playing" | "jumping" | "falling" | "gameover";

export interface World {
  phase: Phase;
  health: number;
  /* position on the bridge; falls rewind it to the last checkpoint */
  stonesCrossed: number;
  /* furthest stone reached this run, used for scoring */
  furthest: number;
  sinceCheckpoint: number;
  stableSide: Side;
  /* stone the player currently stands on; null on the starting bank */
  standingOn: Side | null;
  /* stone of the last checkpoint reached; null for the starting bank */
  checkpointSide: Side | null;
  jumpSide: Side | null;
  fallSide: Side | null;
  justHealed: boolean;
  /* survivable falls this run; lets the UI replace crumbled stones */
  retries: number;
}

export interface UseSteppingStoneResult {
  world: World;
  best: number;
  choose: (side: Side) => void;
  land: () => void;
  acknowledgeFall: () => void;
  restart: () => void;
}

export interface SSCrossingProps {
  world: World;
  choose: (side: Side) => void;
  land: () => void;
  acknowledgeFall: () => void;
}

/* platform: the stone underfoot; active: the pair to jump to; preview: ahead */
export type StoneKind = "platform" | "active" | "preview";

export interface SSStoneProps {
  side: Side;
  stoneNumber: number;
  kind: StoneKind;
  checkpoint: boolean;
  broken: boolean;
  disabled: boolean;
  onChoose: (side: Side) => void;
}

export interface SSColumnProps {
  world: World;
  stoneNumber: number;
  index: number;
  columns: number;
  slideIn: boolean;
  choose: (side: Side) => void;
}

export interface SSPlayerProps {
  world: World;
  columns: number;
  onLand: () => void;
  onFallComplete: () => void;
}

export interface SSHeaderProps {
  world: World;
  best: number;
}

export interface SSHeartsProps {
  health: number;
}

export interface SSOverlaysProps {
  world: World;
  best: number;
  restart: () => void;
}
