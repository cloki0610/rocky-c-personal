/* single characters are lower-cased so W and w map to the same binding */
export const normalizeKey = (event: KeyboardEvent): string =>
  event.key.length === 1 ? event.key.toLowerCase() : event.key;
