import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/utils/types/env";
import "./globals.css";
import Provider from "@/utils/context/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tilby",
  description: "Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
