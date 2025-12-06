import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import { DM_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  weight: ["400", "500"],
  variable: "--font-body",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RETHREAD | Scan. Repair. Rewear.",
  description: "AI-Powered Clothing Repair System",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmMono.variable} ${pressStart.variable} antialiased min-h-screen dot-grid-bg`}
        style={{
          fontFamily: 'var(--font-body), "DM Mono", "Space Mono", monospace',
        }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
