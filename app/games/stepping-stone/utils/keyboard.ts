import type { Side } from "../interfaces/SteppingStoneTypes";

export const normalizeKey = (event: KeyboardEvent): string =>
  event.key.length === 1 ? event.key.toLowerCase() : event.key;

export const sideForKey = (key: string): Side | null => {
  if (key === "ArrowUp" || key === "w") return "top";
  if (key === "ArrowDown" || key === "s") return "bottom";
  return null;
};
