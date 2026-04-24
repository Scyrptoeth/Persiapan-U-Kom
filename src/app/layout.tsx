import type { Metadata } from "next";
import { Albert_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Persiapan U-Kom",
  description: "Website belajar Ujian Kompetensi DJP dengan Flipcard dan Tes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}
