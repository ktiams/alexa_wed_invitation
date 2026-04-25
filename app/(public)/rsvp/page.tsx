import { RSVPForm } from "@/components/public/RSVPForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";

export const metadata = {
  title: "RSVP — Anthony & Alexandra",
};

export default function RSVPPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="py-10 px-6 text-center border-b border-silver-light bg-white">
        <Link
          href="/"
          className="font-display text-2xl font-light italic text-charcoal hover:text-muted transition-colors"
        >
          Anthony &amp; Alexandra
        </Link>
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mt-1">
          5 de diciembre, 2026
        </p>
      </div>
      <RSVPForm />
      <Footer />
    </main>
  );
}
