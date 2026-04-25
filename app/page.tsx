import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/public/HeroSection";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { WeddingDetails } from "@/components/public/WeddingDetails";
import { DressCodeCard } from "@/components/public/DressCodeCard";
import { AdultsOnlyNotice } from "@/components/public/AdultsOnlyNotice";
import { VenueSection } from "@/components/public/VenueSection";
import { RSVPForm } from "@/components/public/RSVPForm";
import { GiftQRCode } from "@/components/public/GiftQRCode";
import { MessageCarousel } from "@/components/public/MessageCarousel";
import { Footer } from "@/components/public/Footer";
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
        <p className="font-display text-2xl italic text-muted">Proximamente</p>
      </main>
    );
  }

  return (
    <main className="pb-8">
      <HeroSection />
      <CountdownTimer />
      <WeddingDetails settings={settings} />
      <DressCodeCard />
      <AdultsOnlyNotice />
      <VenueSection />
      <RSVPForm />
      <GiftQRCode settings={settings} />
      {messages.length > 0 && <MessageCarousel messages={messages} />}
      <Footer />
    </main>
  );
}
