"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { updateWeddingSettings } from "@/lib/actions/admin/settings";
import type { WeddingSettings } from "@/lib/types/database";

interface SettingsFormProps {
  settings: WeddingSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [form, setForm] = useState({
    couple_name: settings.couple_name,
    bride_name: settings.bride_name,
    groom_name: settings.groom_name,
    venue_name: settings.venue_name,
    venue_city: settings.venue_city,
    venue_country: settings.venue_country,
    dress_code: settings.dress_code,
    gift_qr_url: settings.gift_qr_url ?? "",
    gift_instructions: settings.gift_instructions ?? "",
  });

  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  function handleSave() {
    startTransition(async () => {
      await updateWeddingSettings(settings.id, {
        ...form,
        gift_qr_url: form.gift_qr_url || null,
        gift_instructions: form.gift_instructions || null,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <div className="premium-card w-full max-w-4xl px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Nombre de la pareja" value={form.couple_name} onChange={set("couple_name")} />
        <Input label="Nombre de la novia" value={form.bride_name} onChange={set("bride_name")} />
        <Input label="Nombre del novio" value={form.groom_name} onChange={set("groom_name")} />
      </div>

      <div className="mt-6 border-t border-silver-light pt-6">
        <div className="grid gap-5 md:grid-cols-3">
          <Input label="Nombre del lugar" value={form.venue_name} onChange={set("venue_name")} className="md:col-span-3" />
          <Input label="Ciudad" value={form.venue_city} onChange={set("venue_city")} />
          <Input label="Pais" value={form.venue_country} onChange={set("venue_country")} />
        </div>
      </div>

      <div className="mt-6 border-t border-silver-light pt-6">
        <div className="grid gap-5">
          <Textarea label="Codigo de Vestimenta" value={form.dress_code} onChange={set("dress_code")} rows={2} />
          <Input
            label="URL del codigo QR de regalo"
            value={form.gift_qr_url}
            onChange={set("gift_qr_url")}
            placeholder="https://..."
          />
          <Textarea
            label="Instrucciones de regalo"
            value={form.gift_instructions}
            onChange={set("gift_instructions")}
            rows={3}
            placeholder="Instrucciones para los invitados..."
          />
        </div>
      </div>

      <Button variant="primary" size="md" onClick={handleSave} loading={isPending} className="mt-6 w-full sm:w-auto">
        {saved ? "Guardado" : "Guardar Configuracion"}
      </Button>
    </div>
  );
}
