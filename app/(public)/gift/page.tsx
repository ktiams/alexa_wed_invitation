import { createClient } from "@/lib/supabase/server";
import { GiftQRCode } from "@/components/public/GiftQRCode";
import { GiftSubmissionForm } from "@/components/public/GiftSubmissionForm";
import { Footer } from "@/components/public/Footer";
import Link from "next/link";
import type { WeddingSettings } from "@/lib/types/database";

export const metadata = {
  title: "Regalo — Anthony & Alexandra",
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
      {/* Header */}
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

      {/* Confirmation message */}
      {guestId && (
        <div className="py-10 px-6 text-center bg-white border-b border-silver-light">
          <div className="w-10 h-10 border border-silver flex items-center justify-center mx-auto mb-4 text-silver-dark">
            ✓
          </div>
          <p className="font-display text-2xl italic text-charcoal mb-2">
            Tu RSVP ha sido recibido
          </p>
          <p className="text-sm font-sans text-muted">
            ¡Gracias! Si deseas dejar un regalo, estás en el lugar correcto.
          </p>
        </div>
      )}

      {/* Gift QR code */}
      {settings && <GiftQRCode settings={settings} />}

      {/* Gift submission form */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-md mx-auto">
          <div className="border-t border-silver-light pt-12">
            <GiftSubmissionForm guestId={guestId} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
