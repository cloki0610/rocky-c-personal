import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Rocky.C - Tower Defense",
  description:
    "Build turrets to hold the line through endless waves in this classic tower defense game.",
};

export default function BareboneTDLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="w-full h-[calc(100vh-6rem)] bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col items-center justify-center select-none py-8 px-4">
    {children}
  </div>;
}
