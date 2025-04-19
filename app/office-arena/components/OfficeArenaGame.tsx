"use client";
import { motion, AnimatePresence } from "framer-motion";

import { useModal } from "@/app/context/ModalContext";
import { fadeIn } from "@/app/utils/motion";
import { useArena } from "../context/ArenaContext";
import ArenaInstructions from "./ArenaInstructions";
import ArenaBoard from "./ArenaBoard";
import BoardSetting from "./BoardSetting";
import ArenaGameState from "./ArenaGameState";
import BoardButton from "./BoardButton";

const OfficeArenaGame = () => {
  const { openModal } = useModal();
  const { initializeBoard } = useArena();

  return (
    <AnimatePresence>
      <motion.div
        variants={fadeIn("right", "tween", 0.5, 1, 0.75)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="flex flex-col items-center max-w-full"
      >
        <div className="mb-4 flex space-x-4">
          <BoardButton
            onClick={() => openModal("Instructions", <ArenaInstructions />)}
          >
            Instruction
          </BoardButton>
          <BoardButton onClick={initializeBoard}>New Game</BoardButton>
          <BoardButton onClick={() => openModal("Settings", <BoardSetting />)}>
            Settings
          </BoardButton>
        </div>
        <ArenaBoard />
        <ArenaGameState />
      </motion.div>
    </AnimatePresence>
  );
};

export default OfficeArenaGame;
