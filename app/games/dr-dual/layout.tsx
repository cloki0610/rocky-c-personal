import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rocky.C - Dr. Dual",
  description:
    "'Dr' versus 'Dr': throw cleavers, burn, smash, and heal your way through a best-of-three duel against the computer.",
};

export default function DrDualLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-[calc(100vh-6rem)] w-full select-none flex-col items-center overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-6 text-white">
      <div className="my-auto flex w-full justify-center">{children}</div>
    </div>
  );
}
