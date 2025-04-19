"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useModal } from "@/app/context/ModalContext";
import ArenaInstructions from "./ArenaInstructions";
import ArenaBoard from "./ArenaBoard";
import ArenaGameState from "./ArenaGameState";
import BoardSelectBox from "./BoardSelect";
import BoardButton from "./BoardButton";
import useOfficeArena from "../hooks/useOfficeArena";
import { fadeIn } from "@/app/utils/motion";

const OfficeArenaGame = () => {
  const [boardSize, setBoardSize] = useState<number>(9);
  const [squareSize, setSquareSize] = useState<number>(40);
  const [staffCountTarget, setStaffCountTarget] = useState<number>(3);
  const { openModal } = useModal();
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
          <BoardButton
            onClick={() => openModal("Instructions", <ArenaInstructions />)}
          >
            Instruction
          </BoardButton>
          <BoardButton onClick={initializeBoard}>Reset</BoardButton>
        </div>
        <ArenaBoard
          board={board}
          squareSize={squareSize}
          selectedPiece={selectedPiece}
          isValidMove={isValidMove}
          handleSquareClick={handleSquareClick}
        />
        <ArenaGameState gameStatus={gameStatus} round={roundCount} />
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
      </motion.div>
    </AnimatePresence>
  );
};

export default OfficeArenaGame;
