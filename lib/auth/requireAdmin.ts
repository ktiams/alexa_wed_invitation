import { createClient } from "@/lib/supabase/server";

/**
 * Las Server Actions son endpoints públicos: proxy.ts protege las páginas de /admin,
 * pero no las acciones. Toda acción de administración debe llamar a esto primero.
 * Hoy cualquier usuario autenticado en Supabase Auth es administrador.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return user;
}
