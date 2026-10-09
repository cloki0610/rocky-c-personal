import type { InstructionSection } from "../interfaces/OfficePoliticsTypes";
import { BOARD_PRESETS, PERFORMANCE_REACH } from "./game";

// How-to-play content, grouped by topic. Numbers come from the engine so the
// rules text stays in sync with the actual targets.
export const INSTRUCTION_SECTIONS: InstructionSection[] = [
  {
    title: "Turns",
    rules: [
      "Play on the same device, or hand any role to the computer in the Players panel. Computer players follow the same rules and move after a short pause.",
      "Each round, the Boss (A) moves once, the Manager (B) makes two moves in a row, then Staff (C) places one Junior. A round ends after the Staff placement.",
      "A leader with no legal move skips its turn, and a blocked Manager skips any move it has left.",
    ],
  },
  {
    title: "Moving and capturing",
    rules: [
      "The Boss and Manager move one square up, down, left, or right. Staff never move.",
      "Both leaders can capture Junior Staff. The Boss can capture Senior Staff only while fewer than three Seniors are on the board; the Manager can never capture Seniors.",
      "Staff directly next to the Manager (not diagonally) are protected: the Boss cannot capture them. Protected Staff show a shield.",
      "The Boss can always capture the Manager. The Manager can capture the Boss once at least three Seniors are on the board.",
    ],
  },
  {
    title: "Placing and promoting Staff",
    rules: [
      "Each new Junior goes on an empty square directly next to (not diagonal to) an existing Staff member. With no Staff on the board, it goes directly next to the Manager. Legal squares are highlighted and marked with a dot.",
      "If no such square is free, the round ends without a placement and no Staff age.",
      "Each placement ages the existing Staff by one. A Junior becomes a Senior after surviving two placements; the new Junior starts at age zero.",
    ],
  },
  {
    title: "How each role wins",
    rules: [
      "Boss: capture the Manager, or survive the selected number of rounds.",
      `Manager: capture the Boss, or reach the performance target. Performance counts Staff within ${PERFORMANCE_REACH} steps of the Manager, so diagonal neighbours count: each Junior adds 1 and each Senior adds 3.`,
      "Staff: reach the Senior target, or leave neither leader with a legal move.",
      "If several goals are reached on the same placement, the Senior target comes first, then the Manager's performance, then Staff blocking both leaders, then the Boss's survival.",
    ],
  },
  {
    title: "Settings",
    rules: [
      `The default game is a 9×9 board with a Senior target of five, ${BOARD_PRESETS[9].bossRoundTarget} rounds for the Boss, and a performance target of ${BOARD_PRESETS[9].performanceTarget}.`,
      `Choosing a board size sets its recommended Boss rounds and performance target: ${Object.entries(
        BOARD_PRESETS,
      )
        .map(
          ([size, preset]) =>
            `${size}×${size}: ${preset.bossRoundTarget} rounds, performance ${preset.performanceTarget}`,
        )
        .join("; ")}. You can change them afterwards.`,
      "Changing the board size or any target starts a new game. Square size only changes the display, and switching a role between human and computer keeps the current game.",
    ],
  },
];
