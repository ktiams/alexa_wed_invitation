import { RSVPForm } from "@/components/public/RSVPForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";

export const metadata = {
  title: "RSVP - Anthony & Alexandra",
};

export default function RSVPPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-silver-light bg-white px-4 py-8 text-center sm:px-6 sm:py-10">
        <Link href="/" className="font-display text-2xl font-light italic text-charcoal transition-colors hover:text-muted sm:text-3xl">
          Anthony &amp; Alexandra
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-silver-dark sm:text-sm">5 de diciembre, 2026</p>
      </div>
      <RSVPForm />
      <Footer />
    </main>
  );
}
