# Repository guide

## Application overview

Rocky.C is a personal website and playground for frontend prototypes. It uses Next.js 16 App Router, React 19, strict TypeScript, Tailwind CSS 4, and Framer Motion. Check `package.json` and `yarn.lock` for dependency versions.

- `/`: animated personal introduction.
- `/about`: profile and contact links.
- `/games`: game list page; the navigation bar links to it instead of listing each game.
- `/games/office-politics`: a local, same-device strategy game for three players.
- `/games/endless-arena`: a keyboard-controlled survival game with Warrior and Ranger classes.
- `/games/barebone-td`: an endless-wave tower defense game with three tower types, upgrades, selling, and 1x-10x speed control.
- `/games/stepping-stone`: an endless bridge-crossing game where the player picks the stable top or bottom stone, loses health on wrong guesses, and heals at checkpoints every ten stones.
- `/games/dr-dual`: a best-of-three Doctor Fighter mirror duel against a computer opponent (Easy/Normal/Hard). The mouse moves and attacks; Q/W/E/R cast abilities toward the cursor. Only player-vs-computer exists; the engine is player-agnostic so a local two-player mode can reuse it.

The application currently has no API routes, database, authentication, or saved game persistence. Office Politics state, the Barebone TD best-wave score, the Stepping Stone best distance, and the Dr. Dual win/loss record live in React memory and reset on reload.

## Project map

| Location                                                      | Responsibility                                                                                                      |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                                              | Shared layout, Inter font, site navigation, and default metadata                                                    |
| `app/components/PageTransition.tsx`                           | next-transition-router page fades with reduced-motion support; browser Back/Forward navigation is unanimated        |
| `app/globals.css`                                             | Tailwind import, global styles, and view-transition feature detection                                               |
| `app/components/`                                             | Shared navigation, logo, and modal components                                                                       |
| `app/components/SiteMenu.tsx`                                 | Responsive navigation using next-transition-router links and a named React ViewTransition around the site title     |
| `app/context/ModalContext.tsx`                                | Shared modal state; Office Politics currently uses inline settings and instructions                                 |
| `app/utils/menu.ts`                                           | Navigation destinations                                                                                             |
| `app/utils/motion.ts`                                         | Typed, reusable Framer Motion variants                                                                              |
| `app/games/page.tsx`                                          | Server-rendered game list page and metadata                                                                         |
| `app/games/components/GamesContent.tsx`                       | Client-rendered game cards linking to each game with next-transition-router                                         |
| `app/games/utils/constants.ts`                                | Game list entries (name, description, href) and list animations; add new games here                                 |
| `app/games/endless-arena/page.tsx`                            | Client-rendered arena using the game hook                                                                           |
| `app/games/endless-arena/layout.tsx`                          | Server layout and arena route metadata                                                                              |
| `app/games/endless-arena/components/character-select/`        | Fighter selection and class stat pips                                                                               |
| `app/games/endless-arena/components/battlefield/`             | Arena board, combat visuals, enemies, and particles                                                                 |
| `app/games/endless-arena/components/hud/`                     | Header, health bars, status, controls, and game-state overlays                                                      |
| `app/games/endless-arena/hooks/useEndlessArena.ts`            | Arena state, keyboard listeners, responsive sizing, and animation-loop lifecycle                                    |
| `app/games/endless-arena/utils/constants.ts`                  | Arena dimensions, fighter classes, enemy stats, and keyboard bindings                                               |
| `app/games/endless-arena/utils/game.ts`                       | World initialization, progression, combat, geometry, and simulation helpers                                         |
| `app/games/endless-arena/utils/keyboard.ts`                   | Keyboard input normalization                                                                                        |
| `app/games/endless-arena/interfaces/EndlessArenaTypes.ts`     | All custom arena types, including game state and component props                                                    |
| `app/games/office-politics/page.tsx`                          | Server-rendered page shell, metadata, and game provider                                                             |
| `app/games/office-politics/components/board/`                 | Interactive board and piece rendering                                                                               |
| `app/games/office-politics/components/settings/`              | Board, square-size, and victory-target controls                                                                     |
| `app/games/office-politics/components/game/`                  | Game layout, status, and new-game button                                                                            |
| `app/games/office-politics/components/instructions/`          | Game rules and how-to-play content                                                                                  |
| `app/games/office-politics/context/PoliticsContext.tsx`       | Exposes game state and display settings to components                                                               |
| `app/games/office-politics/hooks/useOfficePolitics.ts`        | React adapter around the pure game engine                                                                           |
| `app/games/office-politics/utils/game.ts`                     | Move validation, turn advancement, promotions, and outcomes                                                         |
| `app/games/office-politics/utils/game.test.mjs`               | Node regression tests for game rules                                                                                |
| `app/games/office-politics/interfaces/OfficePoliticsTypes.ts` | Shared game types                                                                                                   |
| `app/games/barebone-td/page.tsx`                              | Client-rendered tower defense page composing the board and HUD from the game hook                                   |
| `app/games/barebone-td/layout.tsx`                            | Server layout with route metadata and the dark full-height game frame                                               |
| `app/games/barebone-td/components/board/`                     | Grid, tower, enemy, and projectile rendering                                                                        |
| `app/games/barebone-td/components/hud/`                       | Header, tower toolbar, selected-tower panel (upgrade/sell), and game-state overlays                                 |
| `app/games/barebone-td/hooks/useBareboneTD.ts`                | Mutable world ref, requestAnimationFrame loop on a speed-scaled simulated clock, board scaling, and selection state |
| `app/games/barebone-td/utils/constants.ts`                    | Grid size, enemy path, economy, speed steps, and tower definitions                                                  |
| `app/games/barebone-td/utils/game.ts`                         | Wave planning, tower placement, upgrades, selling, and the simulation step                                          |
| `app/games/barebone-td/interfaces/BareboneTDTypes.ts`         | Tower, enemy, projectile, and world types                                                                           |
| `app/games/stepping-stone/page.tsx`                           | Client-rendered crossing page composing the scene, header, overlays, and controls from the game hook                |
| `app/games/stepping-stone/layout.tsx`                         | Server layout with route metadata and the full-height game frame                                                    |
| `app/games/stepping-stone/components/board/`                  | Crossing scene, stone columns and buttons, and reduced-motion-aware Framer Motion player jump/fall animation        |
| `app/games/stepping-stone/components/hud/`                    | Header with score and health, keyboard hints, and the game-over overlay                                             |
| `app/games/stepping-stone/hooks/useSteppingStone.ts`          | React adapter around the pure engine: world state, best score, checkpoint-toast timer, and keyboard listener        |
| `app/games/stepping-stone/hooks/useSceneColumns.ts`           | Responsive visible-column count (three narrow, five at `lg`) via `matchMedia`                                       |
| `app/games/stepping-stone/utils/constants.ts`                 | Animation durations, column counts, and scene layout anchors                                                        |
| `app/games/stepping-stone/utils/game.ts`                      | Health and checkpoint constants, jump resolution, falls, checkpoint rewinds, and healing                            |
| `app/games/stepping-stone/utils/game.test.mjs`                | Node regression tests for the crossing engine                                                                       |
| `app/games/stepping-stone/utils/keyboard.ts`                  | Keyboard normalization and ArrowUp/W, ArrowDown/S stone bindings                                                    |
| `app/games/stepping-stone/interfaces/SteppingStoneTypes.ts`   | World, phase, and component prop types                                                                              |
| `app/games/dr-dual/page.tsx`                                  | Client-rendered duel page composing the header, status bars, arena, and ability bar from the game hook              |
| `app/games/dr-dual/layout.tsx`                                | Server layout with route metadata and the scrollable full-height game frame                                         |
| `app/games/dr-dual/components/arena/`                         | Arena board with pointer handlers, Doctor sprites, burn aura, cleavers, aim guide, and damage numbers                |
| `app/games/dr-dual/components/hud/`                           | Header, health/round/status bars, Q/W/E/R ability buttons with cooldowns, and round/match overlays                  |
| `app/games/dr-dual/components/setup/`                         | Ability overview and CPU difficulty selection                                                                       |
| `app/games/dr-dual/hooks/useDrDual.ts`                        | Screen flow, match start, session record; composes the loop and controls hooks                                      |
| `app/games/dr-dual/hooks/useDualGameLoop.ts`                  | requestAnimationFrame loop, per-run CPU brain, simulation step, match-over report                                   |
| `app/games/dr-dual/hooks/usePlayerControls.ts`                | Mouse move/attack orders, cursor aim, Q/W/E/R keys, ability buttons, board scaling                                  |
| `app/games/dr-dual/utils/game.ts`                             | World setup and the move/attack/cast commands                                                                       |
| `app/games/dr-dual/utils/simulation.ts`                       | Simulation `step`: timers, regen, burn, movement, melee, cleavers, and round resolution                             |
| `app/games/dr-dual/utils/ai.ts`                               | CPU opponent that issues the same commands as the player, tuned per difficulty                                      |
| `app/games/dr-dual/utils/constants.ts`                        | Arena, fighter, and ability constants; ability descriptions, cooldown display values, and CPU difficulty profiles   |
| `app/games/dr-dual/utils/helpers.ts`                          | Vector math, ability damage/heal formulas, move speed, ability readiness, and damage-number floaters                |
| `app/games/dr-dual/utils/keyboard.ts`                         | Q/W/E/R key mapping that ignores repeats and modifier shortcuts                                                     |
| `app/games/dr-dual/utils/game.test.mjs`                       | Node regression tests for the duel engine                                                                           |
| `app/games/dr-dual/interfaces/DrDualTypes.ts`                 | World, fighter, CPU, and component prop types                                                                       |
| `public/`                                                     | SVG game pieces, social icons, and other static assets                                                              |

## Development and verification

Run commands from the repository root. `yarn.lock` is the tracked lockfile; use Yarn Classic when installing or changing dependencies (`yarn install --frozen-lockfile` for an unchanged dependency set). Avoid introducing a second lockfile. `package-lock.json` is currently ignored.

The following commands use installed local dependencies:

```sh
npm run dev                         # Development server on localhost:3000
npm run format                      # Format all supported source and documentation files with Prettier
node --test app/games/office-politics/utils/game.test.mjs   # Office Politics engine regression tests
node --test app/games/stepping-stone/utils/game.test.mjs    # Stepping Stone engine regression tests
node --test app/games/dr-dual/utils/game.test.mjs     # Dr. Dual engine regression tests
node node_modules/typescript/bin/tsc --noEmit
node node_modules/eslint/bin/eslint.js app
npm run build                      # Production compilation and static generation
npm run start                      # Serve the completed production build
```

- The engine test files import TypeScript directly from `.mjs`; use a Node runtime with native TypeScript stripping enabled. They have been verified with Node 26.7.0. The repository does not currently pin Node via `engines` or a version file.
- The `package.json` `lint` script invokes `next lint`, which Next.js 16 removed; use the direct ESLint command above. The `test:office-politics` script still points at the old `app/office-politics/` path and fails until it is updated to `app/games/office-politics/`, so run the test file directly as shown.
- On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm.ps1`.
- `next/font/google` loads Inter; a fresh build may need network access to fetch the font.
- For game-logic changes, run that game's engine tests, type check, lint, and build. Add regression coverage for changed behavior rather than duplicating implementation details.
- Only run the test file for the game folder you are working on (for example, `node --test app/games/<name>/utils/game.test.mjs`). Do not run, edit, or otherwise touch test files belonging to other games.
- For UI changes, check desktop and narrow mobile layouts, keyboard interaction, game status announcements, and browser runtime errors. Large boards should scroll inside their panel without overflowing the page.
- No browser-test runner is declared in `package.json`; do not assume a committed end-to-end suite exists.
- Documentation-only changes need factual and diff review, not an application rebuild.

## Office Politics invariants

Keep `game.ts`, `simulation.ts`, their tests, and `PoliticsInstructions.tsx` consistent when changing rules.

- Each round runs one Boss move (A), two consecutive Manager moves (B), then Staff placement (C). Invalid moves do not consume a move; a blocked Manager skips any remaining moves. Leaders move one square horizontally or vertically; Staff cannot move.
- Both leaders can capture Junior Staff. The Boss can always capture the Manager and can capture Senior Staff only when fewer than three Seniors are on the board.
- The Manager cannot capture Senior Staff and can capture the Boss only with at least three Seniors on the board.
- Each valid Staff placement ages existing Staff by one and adds a new Junior at age zero. Staff become Senior at age two. Invalid input must not age pieces or advance the round.
- Capturing the opposing leader wins immediately. The Boss also wins after surviving the selected number of complete rounds (1-100, default 10); a round completes after valid Staff placement. Staff target and blocked-leader wins take priority over survival on the same placement. Staff wins at the selected Senior target or when neither leader has a legal move. A single blocked leader skips their turn.
- Determine outcomes from the updated board. Draw detection uses actual legal moves, not a bounded path search or speculative future captures.
- Supported board sizes are 5–10; the engine accepts Senior targets of 3–10, and settings offer 5–10. Defaults are a 9×9 board, 40px squares, and a target of five.
- The default target ends the game as soon as five Seniors exist, letting the Manager use its three-Senior capture rule before Staff wins.
- Changes to board size or either victory target start a new game. Square-size changes preserve gameplay. Finished games ignore board input and clear selection.

## Stepping Stone invariants

Keep `game.ts`, `simulation.ts`, their tests, and the board animations consistent when changing rules.

- Each step offers a top and bottom stone; one side, chosen at random, is stable. Choosing a stone only starts the jump (`jumping`), and the outcome is decided in `landJump` when the player's landing animation finishes.
- A stable landing advances `stonesCrossed`, updates `furthest`, and picks a new stable side. Every tenth stone since the last checkpoint is a checkpoint: health refills to five and `justHealed` shows a brief toast.
- A wrong landing costs one health and enters `falling`. After the fall animation, zero health ends the game; otherwise the player goes back to the last checkpoint (or the starting bank), loses progress made since then, and gets a new stable side.
- The score is the furthest stone reached, not the current position. The best score is kept in React memory only.
- Engine actions called in the wrong phase return the world unchanged, so repeated key presses mid-animation have no effect.

## Dr. Dual invariants

Keep `game.ts`, `simulation.ts`, their tests, the ability descriptions in `constants.ts`, and the CPU in `ai.ts` consistent when changing rules. Gameplay constants live in `constants.ts` and pure formulas in `helpers.ts`. Node loads these files in tests, so the engine files import each other with explicit `.ts` extensions (enabled by `allowImportingTsExtensions` in `tsconfig.json`) and must not import React or browser-only modules.

- Both fighters are identical Dr. Mundos-like fighters with 600 HP and slow passive regeneration. Orders and casts are rejected outside the `fighting` phase.
- Clicking (left or right) on the opponent orders a chase-and-melee attack; clicking elsewhere moves there, and holding the button keeps steering. Positions stay inside the arena and bodies cannot overlap.
- Q throws a cleaver toward the cursor for an HP cost; it deals a base amount plus a share of the target's current HP and slows on hit. W toggles a burning aura that drains the caster and damages an opponent within range; it switches itself off at low HP. E costs HP and empowers the next melee hit, with bonus damage that grows as the caster's HP falls. Melee swings on a fixed 1.75-second cooldown that nothing shortens. R heals over time, with a larger heal the lower the caster's HP, and grants bonus speed while healing.
- Health costs can never reduce the caster to zero; an ability that cannot be paid is not cast.
- A knockout ends the round; a double knockout is a draw that awards no round. The first fighter to two round wins takes the match. Each round starts with a countdown and full health, cooldowns, and positions.
- The CPU acts only through `commandMove`, `commandAttack`, and `castAbility`, so it follows the same rules as the player.

## Change conventions

- Inspect the working tree before editing and preserve unrelated user changes.
- Keep rules in the pure engine and UI concerns in components. Use functional React state updates; do not mutate prior boards, rows, or pieces, or maintain duplicate piece-count and staff-location state.
- Keep route metadata in server components. Add `"use client"` at interactive boundaries that need hooks, context, or browser APIs.
- New games live under `app/games/<name>/` with their own `layout.tsx` or `page.tsx` metadata, and need an entry in `app/games/utils/constants.ts` to appear on `/games`. The navigation bar (`app/utils/menu.ts`) lists only Games and About.
- Follow existing TypeScript and Tailwind conventions. The `@/` alias resolves from the repository root. Prefer existing components and SVG assets before adding dependencies.
- Preserve semantic buttons, accessible square labels, visible focus, and live game-status updates. Do not make color the only indication of an available action.
- Keep animation helpers typed against Framer Motion. Use next-transition-router links for internal navigation and preserve reduced-motion support in the page transition provider.
- Save source files as UTF-8. Avoid unrelated formatting, dependency upgrades, or generated-file changes; do not commit `.next/`, `node_modules/`, or TypeScript build caches.
- Summarize behavior changes, verification performed, and any remaining limitations. Update this guide when architecture, commands, or game rules change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
