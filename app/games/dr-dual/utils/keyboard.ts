import type { AbilityKey } from "../interfaces/DrDualTypes";

/* maps a key press to an ability; ignores held-key repeats and shortcuts */
export const abilityKeyFor = (event: KeyboardEvent): AbilityKey | null => {
  if (event.repeat || event.ctrlKey || event.metaKey || event.altKey)
    return null;
  const key = event.key.toLowerCase();
  return key === "q" || key === "w" || key === "e" || key === "r" ? key : null;
};
