import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "bkmrks",
  description: "A app for bookmarking",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["bookmarks"],
  icons: [
    { rel: "apple-touch-icon", url: "/icons/bookmark.png" },
    { rel: "icon", url: "/icons/bookmark.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-woodsmoke-900`}
      >
        {children}
      </body>
    </html>
  );
}
