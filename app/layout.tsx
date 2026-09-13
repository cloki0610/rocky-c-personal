import { Inter } from "next/font/google";
import type { Metadata } from "next";

import PageTransition from "./components/PageTransition";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rocky.C",
  description: "Welcome to my personal website, I'm Rocky.C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
