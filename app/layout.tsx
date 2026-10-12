import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { VENUE_LINE } from "@/lib/venue";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Anthony & Alexandra — December 5, 2026",
  description:
    `You are cordially invited to celebrate the wedding of Anthony Ugarte & Alexandra Vargas. December 5, 2026 · ${VENUE_LINE}.`,
  openGraph: {
    title: "Anthony & Alexandra — December 5, 2026",
    description:
      `You are cordially invited to celebrate our wedding. December 5, 2026 · ${VENUE_LINE}.`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
