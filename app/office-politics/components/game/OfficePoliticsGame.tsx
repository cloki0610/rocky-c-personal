"use client";
import { usePolitics } from "../../context/PoliticsContext";
import PoliticsInstructions from "../instructions/PoliticsInstructions";
import PoliticsBoard from "../board/PoliticsBoard";
import BoardSetting from "../settings/BoardSetting";
import PoliticsGameState from "./PoliticsGameState";
import BoardButton from "./BoardButton";

export default function OfficePoliticsGame() {
  const { initializeBoard } = usePolitics();
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section
        aria-label="Game"
        className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">The office floor</h2>
          <BoardButton onClick={initializeBoard}>New game</BoardButton>
        </div>
        <PoliticsGameState />
        <PoliticsBoard />
        <p className="mt-3 text-sm text-slate-600">
          Select your piece, then a highlighted square. Staff can be placed on
          any empty square.
        </p>
      </section>
      <aside className="space-y-6">
        <section className="rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-semibold">Game settings</h2>
          <BoardSetting />
          <p className="mt-3 text-xs text-slate-500">
            Changing the board or victory target starts a new game. Square size
            only changes the display.
          </p>
        </section>
        <details className="rounded-2xl border border-slate-200 p-5" open>
          <summary className="mb-3 cursor-pointer text-lg font-semibold">
            How to play
          </summary>
          <PoliticsInstructions />
        </details>
      </aside>
    </div>
  );
}
