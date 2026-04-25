import { createClient } from "@/lib/supabase/server";
import { GiftQRCode } from "@/components/public/GiftQRCode";
import { GiftSubmissionForm } from "@/components/public/GiftSubmissionForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import type { WeddingSettings } from "@/lib/types/database";

export const metadata = {
  title: "Regalo - Anthony & Alexandra",
};

export default async function GiftPage({
  searchParams,
}: {
  searchParams: Promise<{ guestId?: string }>;
}) {
  const { guestId } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("wedding_settings").select("*").single();
  const settings = data as WeddingSettings | null;

  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-silver-light bg-white px-4 py-8 text-center sm:px-6 sm:py-10">
        <Link href="/" className="font-display text-2xl font-light italic text-charcoal transition-colors hover:text-muted sm:text-3xl">
          Anthony &amp; Alexandra
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-silver-dark sm:text-sm">5 de diciembre, 2026</p>
      </div>

      {guestId && (
        <div className="border-b border-silver-light bg-white px-4 py-8 text-center sm:px-6 sm:py-10">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center border border-silver text-silver-dark">+</div>
          <p className="mb-2 font-display text-2xl italic text-charcoal">Tu RSVP ha sido recibido</p>
          <p className="mx-auto max-w-xl text-sm text-muted">Gracias. Si deseas dejar un regalo, estas en el lugar correcto.</p>
        </div>
      )}

      {settings && <GiftQRCode settings={settings} />}

      <section className="bg-white px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <div className="border-t border-silver-light pt-10 sm:pt-12">
            <GiftSubmissionForm guestId={guestId} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
