"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import ArenaInstructions from "./ArenaInstructions";
import ArenaBoard from "./ArenaBoard";
import ArenaGameState from "./ArenaGameState";
import BoardSelectBox from "./BoardSelect";
import BoardButton from "./BoardButton";
import Modal from "@/app/components/Modal";
import useOfficeArena from "../hooks/useOfficeArena";
import { fadeIn } from "@/app/utils/motion";

const OfficeArenaGame = () => {
  const [boardSize, setBoardSize] = useState<number>(9);
  const [squareSize, setSquareSize] = useState<number>(40);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [staffCountTarget, setStaffCountTarget] = useState<number>(3);
  const {
    board,
    roundCount,
    selectedPiece,
    gameStatus,
    initializeBoard,
    handleSquareClick,
    isValidMove,
  } = useOfficeArena(boardSize, staffCountTarget);

  const resizeBoard = (newSize: number) => {
    setBoardSize(newSize);
    initializeBoard();
  };

  const adjustSquareSize = (newSize: number) => {
    setSquareSize(newSize);
    initializeBoard();
  };

  const adjustStaffCountTarget = (newCount: number) => {
    setStaffCountTarget(newCount);
    initializeBoard();
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
          <BoardButton onClick={() => setIsModalOpen(true)}>
            Instruction
          </BoardButton>
          <BoardButton onClick={initializeBoard}>Reset</BoardButton>
        </div>
        <ArenaGameState gameStatus={gameStatus} round={roundCount} />
        <ArenaBoard
          board={board}
          squareSize={squareSize}
          selectedPiece={selectedPiece}
          isValidMove={isValidMove}
          handleSquareClick={handleSquareClick}
        />
        <div className="mt-4 flex flex-col lg:flex-row w-full lg:w-auto gap-2">
          <BoardSelectBox
            title="Board Size: "
            initSize={boardSize}
            options={[5, 6, 7, 8, 9, 10]}
            handleChange={resizeBoard}
            boxType="board"
          />
          <BoardSelectBox
            title="Square Size: "
            initSize={squareSize}
            options={[40, 50, 60, 70, 80]}
            handleChange={adjustSquareSize}
            boxType="square"
          />
          <BoardSelectBox
            title="Staff Count to Win: "
            initSize={staffCountTarget}
            options={[3, 4, 5, 6, 7, 8, 9, 10]}
            handleChange={adjustStaffCountTarget}
            boxType="staffCount"
          />
        </div>
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
