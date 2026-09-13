"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import useOfficeArena from "../hooks/useOfficeArena";

interface ArenaContextType extends ReturnType<typeof useOfficeArena> {
  squareSize: number;
  setSquareSize: (size: number) => void;
}
const ArenaContext = createContext<ArenaContextType | undefined>(undefined);
export const ArenaProvider = ({ children }: { children: ReactNode }) => {
  const [squareSize, setSquareSize] = useState(40);
  const game = useOfficeArena(9, 3);
  return <ArenaContext.Provider value={{ ...game, squareSize, setSquareSize }}>{children}</ArenaContext.Provider>;
};
export const useArena = () => {
  const context = useContext(ArenaContext);
  if (!context) throw new Error("useArena must be used within an ArenaProvider");
  return context;
};
