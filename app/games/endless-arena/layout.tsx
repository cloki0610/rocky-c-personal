import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rocky.C - Endless Arena",
  description:
    "Choose a Warrior or Ranger and survive endless waves of enemies and bosses in this keyboard-controlled arena game.",
};

export default function EndlessArenaLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="w-full h-[calc(100vh-6rem)] bg-gradient-to-b from-slate-950 to-slate-900 text-white flex items-center justify-center p-4 sm:p-6 select-none">
    {children}
  </div>;
}
