import type { Side } from "../interfaces/SteppingStoneTypes";

/* seconds for the arc from the current platform to the chosen stone */
export const JUMP_DURATION_S = 0.55;
/* seconds for a safe stone to slide left and become the new platform */
export const PAN_DURATION_S = 0.35;
/* seconds, the fall that follows landing on a breaking stone */
export const FALL_DURATION_S = 0.65;
/* ms the checkpoint toast stays up before the engine clears justHealed */
export const HEAL_TOAST_MS = 1100;

/* stone columns shown at once, including the one underfoot */
export const COLUMNS_NARROW = 3;
export const COLUMNS_WIDE = 5;
export const WIDE_QUERY = "(min-width: 1024px)";

/* horizontal centre of a scene column, as a percentage of the scene width */
export const columnX = (index: number, columns: number) =>
  ((index + 0.5) / columns) * 100;

/* row anchors, as percentages of the crossing scene's height */
export const ROW_Y: Record<Side | "start", number> = {
  top: 28,
  start: 50,
  bottom: 72,
};
/* how far above the higher stone the jump arc peaks */
export const JUMP_PEAK = 22;
/* how far below the breaking stone the player drops before vanishing */
export const FALL_DEPTH = 45;
