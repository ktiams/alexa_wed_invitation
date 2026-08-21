import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const image = `${protocol}://${host}/og.png`;
  const title = "Anthony & Alexandra | 5 de diciembre de 2026";
  const description = "Acompáñanos a celebrar la boda de Anthony Ugarte y Alexandra Vargas en Finca Amada, San Sebastián.";
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: image, width: 1733, height: 908, alt: "Invitación de boda de Anthony y Alexandra" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
