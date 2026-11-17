import type { Side } from "../interfaces/SteppingStoneTypes";

export const sideForKey = (key: string): Side | null => {
  if (key === "ArrowUp" || key === "w") return "top";
  if (key === "ArrowDown" || key === "s") return "bottom";
  return null;
};
