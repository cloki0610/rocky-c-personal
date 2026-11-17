import type { HTMLAttributes, ReactNode, RefObject } from "react";

/* keys currently held down, keyed by normalized key name */
export type KeyState = Partial<Record<string, boolean>>;

export interface UseHeldKeysResult {
  keys: RefObject<KeyState>;
  resetKeys: () => void;
}

export interface UseBoardScaleResult {
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
}

export interface ScaledStageProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "style"
> {
  boardRef: RefObject<HTMLDivElement | null>;
  scale: number;
  /* unscaled stage size in world pixels */
  width: number;
  height: number;
  /* drawn on top of the scaled stage at screen size, e.g. HUD and overlays */
  overlay?: ReactNode;
  children: ReactNode;
}

export interface GameOverAction {
  label: string;
  onClick: () => void;
  /* background and hover classes; defaults to the emerald primary button */
  className?: string;
}

export interface GameOverDialogProps {
  title: string;
  titleClassName?: string;
  message: ReactNode;
  detail?: ReactNode;
  highlight: ReactNode;
  primaryAction: GameOverAction;
  secondaryAction?: GameOverAction;
  className?: string;
}

export interface OverlayBannerProps {
  className?: string;
  children: ReactNode;
}

export interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  height?: number;
  /* when set, the bar is exposed as a labelled meter */
  label?: string;
  /* text centred over the bar */
  children?: ReactNode;
}

export interface DiamondPipsProps {
  total: number;
  filled: number;
  label: string;
  pipClassName: string;
  filledClassName: string;
  emptyClassName: string;
  role?: "status";
  className?: string;
}

export interface ControlHint {
  keys: string;
  label: ReactNode;
  keyClassName?: string;
}

export interface ControlHintsProps {
  hints: ControlHint[];
  /* trailing content such as a menu button */
  children?: ReactNode;
}
