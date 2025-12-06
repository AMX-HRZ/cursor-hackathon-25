import { Providers } from "@/components/Providers";
import CRTEffect from "@/components/effects/CRTEffect";
import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  variable: "--font-retro",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEND-AR | Nokia Y2K Repair System",
  description: "AI-Powered Clothing Repair - Nokia Y2K Edition",
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
    <html lang="en" className="dark">
      <body
        className={`${vt323.variable} ${pressStart.variable} antialiased crt-screen min-h-screen`}
        style={{ 
          fontFamily: "var(--font-retro), monospace",
          backgroundColor: "#040810"
        }}
      >
        {/* Y2K Deep Space Gradient Background */}
        <div 
          className="fixed inset-0 -z-20"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(0, 59, 122, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(157, 0, 255, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(255, 0, 170, 0.1) 0%, transparent 70%),
              linear-gradient(180deg, #040810 0%, #001020 50%, #040810 100%)
            `
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="fixed inset-0 -z-15 overflow-hidden pointer-events-none">
          {/* Cyan Orb - Top Left */}
          <div 
            className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 animate-[float-slow_20s_ease-in-out_infinite]"
            style={{
              background: "radial-gradient(circle, #00e5ff 0%, transparent 70%)",
              top: "-200px",
              left: "-200px",
            }}
          />
          {/* Magenta Orb - Bottom Right */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15 animate-[float-slow_25s_ease-in-out_infinite_reverse]"
            style={{
              background: "radial-gradient(circle, #ff00aa 0%, transparent 70%)",
              bottom: "-150px",
              right: "-150px",
            }}
          />
          {/* Purple Orb - Center */}
          <div 
            className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10 animate-[pulse-slow_15s_ease-in-out_infinite]"
            style={{
              background: "radial-gradient(circle, #9d00ff 0%, transparent 70%)",
              top: "40%",
              left: "30%",
            }}
          />
        </div>

        {/* Circuit Board Pattern Overlay */}
        <div
          className="fixed inset-0 opacity-[0.03] -z-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(90deg, #00e5ff 1px, transparent 1px),
              linear-gradient(#00e5ff 1px, transparent 1px),
              radial-gradient(circle at 20px 20px, #00e5ff 2px, transparent 2px)
            `,
            backgroundSize: "60px 60px, 60px 60px, 60px 60px"
          }}
        />

        {/* Hexagonal Tech Pattern */}
        <div
          className="fixed inset-0 opacity-[0.02] -z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 15v22L30 52 0 37V15z' fill='none' stroke='%2300e5ff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 52px"
          }}
        />

        {/* Nokia Plus Pattern */}
        <div
          className="fixed inset-0 opacity-[0.015] -z-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff00aa' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        {/* Horizontal Data Lines - Subtle */}
        <div
          className="fixed inset-0 opacity-[0.02] -z-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 100px,
              rgba(0, 229, 255, 0.5) 100px,
              rgba(0, 229, 255, 0.5) 101px
            )`
          }}
        />

        <Providers>{children}</Providers>
        <CRTEffect />
      </body>
    </html>
  );
}
