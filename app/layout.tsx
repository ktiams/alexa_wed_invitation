import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { VENUE } from "@/lib/venue";
import { EVENT, SITE_URL } from "@/lib/event";

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

const title = `${EVENT.couple} · ${EVENT.dateShort}`;
const description = `Estás invitado a nuestra boda en ${VENUE.name}, ${VENUE.city}. Confirma tu asistencia aquí.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_PR",
    siteName: EVENT.couple,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf5ef",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable} h-full`}>
      <body className="min-h-full bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
