"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import useOfficePolitics from "../hooks/useOfficePolitics";

interface PoliticsContextType extends ReturnType<typeof useOfficePolitics> {
  squareSize: number;
  setSquareSize: (size: number) => void;
}
const PoliticsContext = createContext<PoliticsContextType | undefined>(undefined);
export const PoliticsProvider = ({ children }: { children: ReactNode }) => {
  const [squareSize, setSquareSize] = useState(40);
  const game = useOfficePolitics(9, 3);
  return <PoliticsContext.Provider value={{ ...game, squareSize, setSquareSize }}>{children}</PoliticsContext.Provider>;
};
export const usePolitics = () => {
  const context = useContext(PoliticsContext);
  if (!context) throw new Error("usePolitics must be used within an PoliticsProvider");
  return context;
};
