import type { Metadata, Viewport } from "next";
import { Silkscreen } from "next/font/google";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather Sim v1.0 - 32-Bit Edition",
  description:
    "A retro 32-bit pixel art weather simulation",
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
      <body className={`${silkscreen.className} font-sans`}>
        {children}
      </body>
    </html>
  );
}
