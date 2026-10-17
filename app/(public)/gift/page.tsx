import { GiftSection } from "@/components/public/GiftSection";
import { GiftSubmissionForm } from "@/components/public/GiftSubmissionForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import { EVENT } from "@/lib/event";

export const metadata = {
  title: `Regalo · ${EVENT.couple}`,
};

export default async function GiftPage({
  searchParams,
}: {
  searchParams: Promise<{ guestId?: string }>;
}) {
  const { guestId } = await searchParams;

  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-silver-light bg-card px-4 py-8 text-center sm:px-6 sm:py-10">
        <Link href="/" className="font-display text-2xl font-light italic text-charcoal transition-colors hover:text-muted sm:text-3xl">
          Anthony &amp; Alexandra
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-silver-dark sm:text-sm">{EVENT.dateShort}</p>
      </div>

      {guestId && (
        <div className="border-b border-silver-light bg-nude-light px-4 py-8 text-center sm:px-6 sm:py-10">
          <p className="mb-2 font-display text-3xl italic text-charcoal">¡Gracias! Recibimos tu respuesta</p>
          <p className="mx-auto max-w-xl text-sm text-muted">Si deseas hacernos un regalo, aquí te explicamos cómo.</p>
        </div>
      )}

      <GiftSection showNotifyLink={false} />

      <section className="px-4 pb-14 sm:px-6">
        <div className="soft-card mx-auto max-w-xl px-5 py-8 sm:px-8">
          <GiftSubmissionForm guestId={guestId} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
