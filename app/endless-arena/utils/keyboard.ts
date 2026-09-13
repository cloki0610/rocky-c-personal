export const normalizeKey = (event: KeyboardEvent): string =>
  event.key.length === 1 ? event.key.toLowerCase() : event.key;
