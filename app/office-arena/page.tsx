import OfficeArenaGame from "./components/OfficeArenaGame";
import type { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Rocky.C - Office Arena (Prototype)",
  description:
    "A chess game two players move their pieces against each other, and a third player tries to cause a draw \
or promote target amount of pieces.",
};

const OfficeChessPage = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <OfficeArenaGame />
    </main>
  );
};

export default OfficeChessPage;
