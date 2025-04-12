import OfficeArenaGame from "./components/OfficeArenaGame";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Rocky.C - Office Arena (Beta)",
  description:
    "A chess game two players move their pieces against each other, and a third player tries to cause a draw.",
};

const OfficeChessPage = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold">Office Arena</h1>
      <OfficeArenaGame />
    </main>
  );
};

export default OfficeChessPage;
