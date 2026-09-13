# Repository guide

## Application overview

Rocky.C is a personal website and playground for frontend prototypes. It uses Next.js 15 App Router, React 19, strict TypeScript, Tailwind CSS 4, and Framer Motion. Check `package.json` and `yarn.lock` for dependency versions.

- `/`: animated personal introduction.
- `/about`: profile and contact links.
- `/office-politics`: a local, same-device strategy game for three players.
- `/endless-arena`: a keyboard-controlled survival game with Warrior and Ranger classes.

The application currently has no API routes, database, authentication, or saved game persistence. Office Politics state lives in React memory and resets on reload.

## Project map

| Location                                                | Responsibility                                                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                                        | Shared layout, Inter font, site navigation, and default metadata                                                |
| `app/components/PageTransition.tsx`                     | next-transition-router page fades with reduced-motion support; browser Back/Forward navigation is unanimated    |
| `app/globals.css`                                       | Tailwind import, global styles, and view-transition feature detection                                           |
| `app/components/`                                       | Shared navigation, logo, and modal components                                                                   |
| `app/components/SiteMenu.tsx`                           | Responsive navigation using next-transition-router links and a named React ViewTransition around the site title |
| `app/context/ModalContext.tsx`                          | Shared modal state; Office Politics currently uses inline settings and instructions                             |
| `app/utils/menu.ts`                                     | Navigation destinations                                                                                         |
| `app/utils/motion.ts`                                   | Typed, reusable Framer Motion variants                                                                          |
| `app/endless-arena/page.tsx`                            | Client-rendered arena using the game hook                                                                       |
| `app/endless-arena/layout.tsx`                          | Server layout and arena route metadata                                                                          |
| `app/endless-arena/components/character-select/`        | Fighter selection and class stat pips                                                                           |
| `app/endless-arena/components/battlefield/`             | Arena board, combat visuals, enemies, and particles                                                             |
| `app/endless-arena/components/hud/`                     | Header, health bars, status, controls, and game-state overlays                                                  |
| `app/endless-arena/hooks/useEndlessArena.ts`            | Arena state, keyboard listeners, responsive sizing, and animation-loop lifecycle                                |
| `app/endless-arena/utils/constants.ts`                  | Arena dimensions, fighter classes, enemy stats, and keyboard bindings                                           |
| `app/endless-arena/utils/game.ts`                       | World initialization, progression, combat, geometry, and simulation helpers                                     |
| `app/endless-arena/utils/keyboard.ts`                   | Keyboard input normalization                                                                                    |
| `app/endless-arena/interfaces/EndlessArenaTypes.ts`     | All custom arena types, including game state and component props                                                |
| `app/office-politics/page.tsx`                          | Server-rendered page shell, metadata, and game provider                                                         |
| `app/office-politics/components/board/`                 | Interactive board and piece rendering                                                                           |
| `app/office-politics/components/settings/`              | Board, square-size, and victory-target controls                                                                 |
| `app/office-politics/components/game/`                  | Game layout, status, and new-game button                                                                        |
| `app/office-politics/components/instructions/`          | Game rules and how-to-play content                                                                              |
| `app/office-politics/context/PoliticsContext.tsx`       | Exposes game state and display settings to components                                                           |
| `app/office-politics/hooks/useOfficePolitics.ts`        | React adapter around the pure game engine                                                                       |
| `app/office-politics/utils/game.ts`                     | Move validation, turn advancement, promotions, and outcomes                                                     |
| `app/office-politics/utils/game.test.mjs`               | Node regression tests for game rules                                                                            |
| `app/office-politics/interfaces/OfficePoliticsTypes.ts` | Shared game types                                                                                               |
| `public/`                                               | SVG game pieces, social icons, and other static assets                                                          |

## Development and verification

Run commands from the repository root. `yarn.lock` is the tracked lockfile; use Yarn Classic when installing or changing dependencies (`yarn install --frozen-lockfile` for an unchanged dependency set). Avoid introducing a second lockfile. `package-lock.json` is currently ignored.

The following commands use installed local dependencies:

```sh
npm run dev                         # Development server on localhost:3000
npm run format                      # Format all supported source and documentation files with Prettier
npm run test:office-politics           # Pure game-engine regression tests
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js app
npm run build                      # Production compilation and static generation
npm run start                      # Serve the completed production build
```

- The engine tests import TypeScript directly from `.mjs`; use a Node runtime with native TypeScript stripping enabled. They have been verified with Node 26.7.0. The repository does not currently pin Node via `engines` or a version file.
- The existing `lint` script invokes `next lint`; use the direct ESLint command above with the current Next.js 15 setup.
- On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.
- `next/font/google` loads Inter; a fresh build may need network access to fetch the font.
- For game-logic changes, run the engine tests, type check, lint, and build. Add regression coverage for changed behavior rather than duplicating implementation details.
- For UI changes, check desktop and narrow mobile layouts, keyboard interaction, game status announcements, and browser runtime errors. Large boards should scroll inside their panel without overflowing the page.
- No browser-test runner is declared in `package.json`; do not assume a committed end-to-end suite exists.
- Documentation-only changes need factual and diff review, not an application rebuild.

## Office Politics invariants

Keep `game.ts`, its tests, and `PoliticsInstructions.tsx` consistent when changing rules.

- Each round runs one Boss move (A), two consecutive Manager moves (B), then Staff placement (C). Invalid moves do not consume a move; a blocked Manager skips any remaining moves. Leaders move one square horizontally or vertically; Staff cannot move.
- Both leaders can capture Junior Staff. The Boss can always capture the Manager and can capture Senior Staff only when fewer than three Seniors are on the board.
- The Manager cannot capture Senior Staff and can capture the Boss only with at least three Seniors on the board.
- Each valid Staff placement ages existing Staff by one and adds a new Junior at age zero. Staff become Senior at age two. Invalid input must not age pieces or advance the round.
- Capturing the opposing leader wins immediately. The Boss also wins after surviving the selected number of complete rounds (1-100, default 10); a round completes after valid Staff placement. Staff target and blocked-leader wins take priority over survival on the same placement. Staff wins at the selected Senior target or when neither leader has a legal move. A single blocked leader skips their turn.
- Determine outcomes from the updated board. Draw detection uses actual legal moves, not a bounded path search or speculative future captures.
- Supported board sizes are 5–10; the engine accepts Senior targets of 3–10, and settings offer 5–10. Defaults are a 9×9 board, 40px squares, and a target of five.
- The default target ends the game as soon as five Seniors exist, letting the Manager use its three-Senior capture rule before Staff wins.
- Changes to board size or either victory target start a new game. Square-size changes preserve gameplay. Finished games ignore board input and clear selection.

## Change conventions

- Inspect the working tree before editing and preserve unrelated user changes.
- Keep rules in the pure engine and UI concerns in components. Use functional React state updates; do not mutate prior boards, rows, or pieces, or maintain duplicate piece-count and staff-location state.
- Keep route metadata in server components. Add `"use client"` at interactive boundaries that need hooks, context, or browser APIs.
- Follow existing TypeScript and Tailwind conventions. The `@/` alias resolves from the repository root. Prefer existing components and SVG assets before adding dependencies.
- Preserve semantic buttons, accessible square labels, visible focus, and live game-status updates. Do not make color the only indication of an available action.
- Keep animation helpers typed against Framer Motion. Use next-transition-router links for internal navigation and preserve reduced-motion support in the page transition provider.
- Save source files as UTF-8. Avoid unrelated formatting, dependency upgrades, or generated-file changes; do not commit `.next/`, `node_modules/`, or TypeScript build caches.
- Summarize behavior changes, verification performed, and any remaining limitations. Update this guide when architecture, commands, or game rules change.
