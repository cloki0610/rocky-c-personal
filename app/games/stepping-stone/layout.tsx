import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rocky.C - Stepping Stone",
  description:
    "Cross an endless bridge by picking the stable stone. Guess wrong and you'll fall back to your last checkpoint — reach one every ten stones to recover full health.",
};

export default function SteppingStoneLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full select-none flex-col items-center justify-center bg-gradient-to-b from-sky-900 to-slate-950 px-4 py-8 text-white">
      {children}
    </div>
  );
}
