export type Player = "A" | "B" | "C";
export type PieceType = "boss" | "manager" | "staff";
export type GameBoard = (Piece | null)[][];

export interface Piece {
  player: Player;
  type: PieceType;
  age: number;
}

export interface GameBoardSquare {
  x: number;
  y: number;
}

export interface StaffLocation {
  row: number;
  col: number;
  age: number;
}

export interface PlayerCount {
  boss: number;
  manager: number;
  staff: number;
}

export type Square = [number, number];
export type Controller = "human" | "computer";
export type Controllers = Record<Player, Controller>;

export type AiAction =
  { kind: "move"; from: Square; to: Square } | { kind: "place"; at: Square };

export interface InstructionSection {
  title: string;
  rules: string[];
}
