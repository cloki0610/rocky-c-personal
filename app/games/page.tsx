import type { Metadata } from "next/types";

import GamesContent from "./components/GamesContent";

export const metadata: Metadata = {
  title: "Rocky.C - Games",
  description:
    "Browse Rocky.C's browser games: Office Politics, Endless Arena, and Tower Defense.",
};

const GamesPage = () => {
  return (
    <main className="mx-auto w-full h-[calc(100vh-6rem)] max-w-6xl overflow-y-auto px-4 py-8 sm:px-6">
      <GamesContent />
    </main>
  );
};

export default GamesPage;
