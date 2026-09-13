import { usePolitics } from "../context/PoliticsContext";
import { seniorCount } from "../utils/game";

export default function PoliticsGameState() {
  const { board, roundCount, gameStatus, currentPlayer, staffCountTarget, gameOver } = usePolitics();
  return (
    <div className="mb-5 space-y-3">
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-white px-3 py-1">Round {roundCount}</span>
        <span className="rounded-full bg-white px-3 py-1">Senior Staff: {seniorCount(board)} / {staffCountTarget}</span>
      </div>
      <p role="status" aria-live="polite" className="min-h-12 font-semibold">{gameStatus}</p>
      <div className="flex flex-wrap gap-2 text-xs">
        {([['A', 'Boss'], ['B', 'Manager'], ['C', 'Staff']] as const).map(([player, name]) => (
          <span key={player} className={`rounded-lg border px-3 py-2 ${!gameOver && currentPlayer === player ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}>
            {player}: {name}{!gameOver && currentPlayer === player ? ' · Your turn' : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
