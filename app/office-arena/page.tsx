import type { Metadata } from "next";
import { ArenaProvider } from "./context/ArenaContext";
import OfficeArenaGame from "./components/OfficeArenaGame";

export const metadata: Metadata = {
  title: "Rocky.C - Office Arena",
  description: "A local three-player strategy game. Play as the Boss, Manager, or Staff and compete for control of the office.",
};

export default function OfficeArenaPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">Local multiplayer · 3 players</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Office Arena</h1>
        <p className="mt-3 max-w-2xl text-slate-600">One office. Three ambitions. Capture your rival or grow a team of Senior Staff to win.</p>
      </header>
      <ArenaProvider><OfficeArenaGame /></ArenaProvider>
    </main>
  );
}
