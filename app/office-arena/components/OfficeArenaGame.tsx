"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ArenaInstructions from "./ArenaInstructions";
import ArenaBoard from "./ArenaBoard";
import ArenaGameState from "./ArenaGameState";
import BoardSelectBox from "./BoardSelect";
import useOfficeArena from "../hooks/useOfficeArena";
import Modal from "@/app/components/Modal";
import { fadeIn } from "@/app/utils/motion";

const OfficeArenaGame = () => {
  const [boardSize, setBoardSize] = useState<number>(9);
  const [squareSize, setSquareSize] = useState<number>(60);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {
    board,
    roundCount,
    selectedPiece,
    gameStatus,
    initializeBoard,
    handleSquareClick,
    isValidMove,
  } = useOfficeArena(boardSize);

  const resizeBoard = (newSize: number) => {
    setBoardSize(newSize);
  };

  const adjustSquareSize = (newSize: number) => {
    setSquareSize(newSize);
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={fadeIn("right", "tween", 0.5, 1, 0.75)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="flex flex-col items-center p-4 max-w-full"
      >
        <div className="mb-4 flex space-x-4">
          <BoardSelectBox
            initSize={boardSize}
            options={[5, 6, 7, 8, 9, 10]}
            handleChange={resizeBoard}
            boxType="board"
          />
          <BoardSelectBox
            initSize={squareSize}
            options={[40, 50, 60, 70, 80]}
            handleChange={adjustSquareSize}
            boxType="square"
          />
          <button
            onClick={initializeBoard}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors"
          >
            Reset Game
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-md transition-colors"
          >
            Instruction
          </button>
        </div>
        <ArenaGameState gameStatus={gameStatus} round={roundCount} />
        <ArenaBoard
          board={board}
          squareSize={squareSize}
          selectedPiece={selectedPiece}
          isValidMove={isValidMove}
          handleSquareClick={handleSquareClick}
        />
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Instruction"
        >
          <ArenaInstructions />
        </Modal>
      </motion.div>
    </AnimatePresence>
  );
};

export default OfficeArenaGame;
