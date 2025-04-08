export type Player = "A" | "B" | "C";
export type PieceType = "boss" | "manager" | "staff" | "SeniorStaff";
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
