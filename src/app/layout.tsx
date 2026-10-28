import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Treserve — Plan Today · Travel Tomorrow",
  description:
    "Professional flight itinerary documents and temporary flight reservations for visa applications and travel planning. Clear, transparent, and trusted worldwide.",
  keywords: [
    "flight itinerary",
    "temporary flight reservation",
    "flight reservation for visa",
    "flight itinerary document",
    "travel planning",
    "visa application proof of travel",
  ],
  authors: [{ name: "Treserve Travel Technologies" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/images/app-icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Treserve — Plan Today · Travel Tomorrow",
    description:
      "Professional flight itinerary documents and temporary flight reservations for visa applications and travel planning.",
    type: "website",
    locale: "en_US",
    siteName: "Treserve",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1F33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F5F7FA] text-[#0B1F33] selection:bg-[#E8F2FF] selection:text-[#1769E0]">
        {children}
      </body>
    </html>
  );
}
