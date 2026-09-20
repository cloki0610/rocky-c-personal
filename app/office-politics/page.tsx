import type { Metadata } from "next";
import { PoliticsProvider } from "./context/PoliticsContext";
import OfficePoliticsGame from "./components/game/OfficePoliticsGame";

export const metadata: Metadata = {
  title: "Rocky.C - Office Politics",
  description:
    "A local three-player strategy game. Play as the Boss, Manager, or Staff and compete for control of the office.",
};

export default function OfficePoliticsPage() {
  return (
    <main className="mx-auto w-full h-[calc(100vh-6rem)] max-w-6xl px-4 py-8 sm:px-6">
      <PoliticsProvider>
        <OfficePoliticsGame />
      </PoliticsProvider>
    </main>
  );
}
