import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/public/HeroSection";
import { LoveStorySection } from "@/components/public/LoveStorySection";
import { EventDetails } from "@/components/public/EventDetails";
import { GuestGuidelines } from "@/components/public/GuestGuidelines";
import { RSVPForm } from "@/components/public/RSVPForm";
import { GiftSection } from "@/components/public/GiftSection";
import { Footer } from "@/components/public/Footer";
import { StickyRSVPBar } from "@/components/public/StickyRSVPBar";
import { EnvelopeIntro } from "@/components/public/EnvelopeIntro";
import { AlbumSection } from "@/components/public/AlbumSection";
import type { WeddingSettings } from "@/lib/types/database";

// Los mensajes del RSVP son privados para los novios (se leen en /admin), así que la
// invitación ya no muestra una sección pública de deseos.
async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("wedding_settings").select("*").single();
  return data as WeddingSettings | null;
}

export default async function HomePage() {
  const settings = await getSettings();

  if (!settings) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-display text-2xl italic text-muted">Próximamente</p>
      </main>
    );
  }

  return (
    <main className="pb-24 lg:pb-0">
      <EnvelopeIntro />
      <HeroSection />
      <LoveStorySection />
      <EventDetails />
      <GuestGuidelines />
      <RSVPForm />
      <GiftSection />
      <AlbumSection />
      <Footer />
      <StickyRSVPBar />
    </main>
  );
}
