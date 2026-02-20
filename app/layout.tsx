import type { Metadata, Viewport } from "next";
import { Silkscreen } from "next/font/google";
import "./globals.css";

const pixelFont = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather Sim v1.0 - 32-Bit Edition",
  description: "A retro 32-bit pixel art weather simulation",
};

export const viewport: Viewport = {
  themeColor: "#2a2a4a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>{children}</body>
    </html>
  );
}
