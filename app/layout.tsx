import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const _ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

const _notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Weather Observatory",
  description:
    "Atmospheric observation and weather monitoring station.",
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${_ibmPlexMono.variable} ${_notoSerifJP.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
