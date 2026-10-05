// src/app/layout.tsx
import type { Metadata } from "next";
import { Newsreader, Onest } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talaba hujjat tizimi",
  description: "Talabalar uchun hujjat yaratish va boshqarish tizimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body
        className={`${newsreader.variable} ${onest.variable} font-sans antialiased bg-paper text-ink`}
      >
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
