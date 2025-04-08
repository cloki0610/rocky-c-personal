import ArenaPiece from "./ArenaPiece";
import type {
  GameBoard,
  Piece,
} from "../interfaces/OfficeAreanaTypes";

interface ArenaBoardProps {
  board: GameBoard;
  squareSize: number;
  selectedPiece: [number, number] | null;
  isValidMove: (
    piece: Piece,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
  ) => boolean;
  handleSquareClick: (row: number, col: number) => void;
}

const ArenaBoard = ({
  board,
  squareSize,
  selectedPiece,
  isValidMove,
  handleSquareClick,
}: ArenaBoardProps) => {
  return (
    <div className="mb-4">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => {
            const isSelected =
              selectedPiece &&
              selectedPiece[0] === rowIndex &&
              selectedPiece[1] === colIndex;
            const targetSquare =
              selectedPiece && board[selectedPiece[0]][selectedPiece[1]];
            const isPossibleMove =
              selectedPiece &&
              targetSquare &&
              isValidMove(
                targetSquare,
                selectedPiece[0],
                selectedPiece[1],
                rowIndex,
                colIndex,
              );
            const isSenior = board[rowIndex][colIndex] && board[rowIndex][colIndex].age >= 2;

            return (
              <div
                key={colIndex}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                style={{
                  width: `${squareSize}px`,
                  height: `${squareSize}px`,
                  backgroundColor:
                    (rowIndex + colIndex) % 2 === 0 ? "#f0d9b5" : "#b58863",
                  border: isSelected
                    ? "2px solid red"
                    : isPossibleMove
                    ? "2px solid green"
                    : "1px solid #000",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: `${squareSize * 0.6}px`,
                  position: "relative",
                }}
              >
                {cell && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ArenaPiece piece={cell} isSenior={isSenior} />
                  </div>
                )}
                {isPossibleMove && !cell && (
                  <div className="w-1/3 h-1/3 rounded-full bg-green-500 opacity-50"></div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ArenaBoard;
