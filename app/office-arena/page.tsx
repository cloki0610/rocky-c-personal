import type { Metadata } from "next/types";

import { ArenaProvider } from "./context/ArenaContext";
import { ModalProvider } from "../context/ModalContext";
import OfficeArenaGame from "./components/OfficeArenaGame";

export const metadata: Metadata = {
  title: "Rocky.C - Office Arena (Prototype)",
  description:
    "A chess game two players move their pieces against each other, and a third player tries to cause a draw \
or promote target amount of pieces.",
};

const OfficeArenaPage = () => {
  return (
    <main className="flex flex-col items-center p-4">
      <ArenaProvider>
        <ModalProvider>
          <OfficeArenaGame />
        </ModalProvider>
      </ArenaProvider>
    </main>
  );
};

export default OfficeArenaPage;
