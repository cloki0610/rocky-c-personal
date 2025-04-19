"use client";
import { createContext, useContext, useState, ReactNode } from "react";

import useOfficeArena from "../hooks/useOfficeArena";

const INIT_BOARD_SIZE = 9;
const INIT_SQUARE_SIZE = 40;
const INIT_STAFF_COUNT_TARGET = 3;

interface ArenaContextType extends ReturnType<typeof useOfficeArena> {
    squareSize: number;
    setSquareSize: (size: number) => void;
}

const ArenaContext = createContext<ArenaContextType | undefined>(undefined);

export const ArenaProvider = ({ children }: { children: ReactNode }) => {
  const [squareSize, setSquareSize] = useState<number>(INIT_SQUARE_SIZE);
  const {
    board,
    roundCount,
    selectedPiece,
    gameStatus,
    boardSize,
    staffCountTarget,
    currentPlayer,
    initializeBoard,
    handleSquareClick,
    isValidMove,
    setBoardSize,
    setStaffCountTarget,
  } = useOfficeArena(INIT_BOARD_SIZE, INIT_STAFF_COUNT_TARGET);

  return (
    <ArenaContext.Provider
      value={{
        board,
        roundCount,
        selectedPiece,
        gameStatus,
        boardSize,
        staffCountTarget,
        squareSize,
        currentPlayer,
        initializeBoard,
        handleSquareClick,
        isValidMove,
        setBoardSize,
        setStaffCountTarget,
        setSquareSize,
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
};

export const useArena = () => {
  const context = useContext(ArenaContext);
  if (context === undefined) {
    throw new Error("useArena must be used within a ArenaProvider");
  }
  return context;
};
