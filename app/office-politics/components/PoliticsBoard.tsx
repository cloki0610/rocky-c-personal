import { usePolitics } from "../context/PoliticsContext";
import PoliticsPiece from "./PoliticsPiece";

export default function PoliticsBoard() {
  const { board, selectedPiece, squareSize, currentPlayer, gameOver, handleSquareClick, isValidMove } = usePolitics();
  const selected = selectedPiece ? board[selectedPiece[0]][selectedPiece[1]] : null;
  return (
    <div className="max-w-full overflow-x-auto pb-2" aria-label="Office Politics board">
      <div className="mx-auto w-max overflow-hidden rounded-lg border-2 border-slate-700">
        {board.map((row, r) => (
          <div key={r} className="flex">
            {row.map((piece, c) => {
              const isSelected = selectedPiece?.[0] === r && selectedPiece?.[1] === c;
              const possible = !!(selectedPiece && selected && isValidMove(selected, selectedPiece[0], selectedPiece[1], r, c));
              const senior = piece?.type === "staff" && piece.age >= 2;
              const interactive = !gameOver && (piece?.player === currentPlayer || possible || (currentPlayer === "C" && !piece));
              return (
                <button
                  key={c}
                  type="button"
                  disabled={gameOver}
                  aria-label={`Row ${r + 1}, column ${c + 1}: ${piece ? `${senior ? 'Senior Staff' : piece.type}, Player ${piece.player}` : 'empty'}${possible ? ', legal move' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => handleSquareClick(r, c)}
                  className="relative flex shrink-0 items-center justify-center border border-black/10 focus-visible:z-10 focus-visible:outline-4 focus-visible:outline-blue-600"
                  style={{ width: squareSize, height: squareSize, backgroundColor: isSelected ? '#fde68a' : possible ? '#a7f3d0' : (r + c) % 2 === 0 ? '#e2e8f0' : '#cbd5e1', cursor: interactive ? 'pointer' : 'default' }}
                >
                  {piece && <PoliticsPiece piece={piece} isSenior={senior} />}
                  {possible && !piece && <span className="h-3 w-3 rounded-full bg-emerald-700" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
