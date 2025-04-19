import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import type { Metadata } from "next";

import SiteMenu from "./components/SiteMenu";
import { ModalProvider } from "@/app/context/ModalContext";
import "./globals.css";
import Modal from "./components/Modal";

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
        <ModalProvider>
          <body className={inter.className}>
            <SiteMenu />
            {children}
          </body>
          <Modal />
        </ModalProvider>
      </html>
    </ViewTransitions>
  );
}
