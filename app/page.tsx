import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/public/HeroSection";
import { LoveStorySection } from "@/components/public/LoveStorySection";
import { EventDetails } from "@/components/public/EventDetails";
import { GuestGuidelines } from "@/components/public/GuestGuidelines";
import { RSVPForm } from "@/components/public/RSVPForm";
import { GiftSection } from "@/components/public/GiftSection";
import { MessageCarousel } from "@/components/public/MessageCarousel";
import { Footer } from "@/components/public/Footer";
import { StickyRSVPBar } from "@/components/public/StickyRSVPBar";
import { EnvelopeIntro } from "@/components/public/EnvelopeIntro";
import { AlbumSection } from "@/components/public/AlbumSection";
import type { WeddingSettings, GuestMessage } from "@/lib/types/database";

async function getPageData() {
  const supabase = await createClient();

  const [settingsRes, messagesRes] = await Promise.all([
    supabase.from("wedding_settings").select("*").single(),
    supabase
      .from("guest_messages")
      .select("id, guest_id, guest_name, message, is_approved, is_public, created_at, updated_at")
      .eq("is_approved", true)
      .eq("is_public", true)
      .order("created_at", { ascending: false }),
  ]);

  return {
    settings: settingsRes.data as WeddingSettings | null,
    messages: (messagesRes.data ?? []) as GuestMessage[],
  };
}

export default async function HomePage() {
  const { settings, messages } = await getPageData();

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
      {messages.length > 0 && <MessageCarousel messages={messages} />}
      <Footer />
      <StickyRSVPBar />
    </main>
  );
}
