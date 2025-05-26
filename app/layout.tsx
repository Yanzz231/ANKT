import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ANKT - Perlengkapan Bayi Bekas Berkualitas",
  description:
    "Marketplace terpercaya untuk perlengkapan bayi bekas berkualitas. Hemat budget, dukung lingkungan.",
  keywords:
    "perlengkapan bayi, bayi bekas, stroller bekas, car seat bekas, mainan bayi",
  icons: {
    icon: "/logo.png", 
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
