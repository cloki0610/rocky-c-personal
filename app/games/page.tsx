import type { Metadata } from "next/types";

import GamesContent from "./components/GamesContent";

export const metadata: Metadata = {
  title: "Rocky.C - Games",
  description:
    "Browse Rocky.C's browser games. Enjoy playing these fun and addictive games directly in your browser.",
};

const GamesPage = () => {
  return (
    <main className="h-[calc(100vh-6rem)] w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <GamesContent />
      </div>
    </main>
  );
};

export default GamesPage;
