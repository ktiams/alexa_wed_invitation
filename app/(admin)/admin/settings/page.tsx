import { createAdminClient } from "@/lib/supabase/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { WeddingSettings } from "@/lib/types/database";

async function getSettings(): Promise<WeddingSettings | null> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("wedding_settings").select("*").single();
  return data as WeddingSettings | null;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-charcoal mb-1">Configuración</h1>
        <p className="text-sm uppercase tracking-wider font-sans text-muted">
          Detalles de la boda y configuración
        </p>
      </div>

      {settings ? (
        <SettingsForm settings={settings} />
      ) : (
        <p className="text-sm font-sans text-muted">
          No se encontraron configuraciones. Ejecuta la migración de la base de datos.
        </p>
      )}
    </div>
  );
}
