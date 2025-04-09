import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";

import SiteMenu from "./components/SiteMenu";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rocky.C",
  description: "Welcome to my personal website, I'm Rocky.C@WorkL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={inter.className}>
          <SiteMenu />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}