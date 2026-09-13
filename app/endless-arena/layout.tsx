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
  return children;
}
