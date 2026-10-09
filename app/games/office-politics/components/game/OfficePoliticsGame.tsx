import PoliticsInstructions from "../instructions/PoliticsInstructions";
import PoliticsBoard from "../board/PoliticsBoard";
import BoardSetting from "../settings/BoardSetting";
import PlayerSetting from "../settings/PlayerSetting";
import PoliticsGameState from "./PoliticsGameState";

export default function OfficePoliticsGame() {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section
        aria-label="Game"
        className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6"
      >
        <div className="mb-5 flex flex-col items-start justify-between gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            3 players · Human or computer
          </p>
          <h2 className="text-4xl font-bold tracking-tight">Office Politics</h2>
          <p className="max-w-2xl text-slate-600">
            One office. Three ambitions. Capture your rival or grow a team of
            Senior Staff to win.
          </p>
        </div>
        <PoliticsGameState />
        <PoliticsBoard />
        <p className="mt-3 text-sm text-slate-600">
          Select your piece, then a highlighted square. Staff joins the team on
          a highlighted square next to existing Staff, or next to the Manager
          when no Staff remain.
        </p>
      </section>
      <aside className="space-y-6">
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">Players</h2>
          <PlayerSetting />
          <p className="mt-3 text-xs text-slate-500">
            Hand any role to the computer. Changes apply immediately without
            restarting the game.
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">Game settings</h2>
          <BoardSetting />
          <p className="mt-3 text-xs text-slate-500">
            Changing the board or a victory target starts a new game. A new
            board size also sets the recommended Boss rounds and performance
            target for that size. Square size only changes the display.
          </p>
        </section>
        <details className="rounded-2xl border border-slate-200 p-5">
          <summary className="mb-3 cursor-pointer text-lg font-semibold">
            How to play
          </summary>
          <PoliticsInstructions />
        </details>
      </aside>
    </div>
  );
}
