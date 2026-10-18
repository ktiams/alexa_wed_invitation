import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Supabase (plan gratis) pausa el proyecto tras 7 días sin actividad. Vercel Cron llama
// esta ruta todos los días (ver vercel.json) y hace una lectura mínima con la llave
// pública, lo que cuenta como actividad. No devuelve datos.
// Si CRON_SECRET está definida en Vercel, solo responde a Vercel Cron, que manda
// "Authorization: Bearer <CRON_SECRET>".
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await supabase.from("wedding_settings").select("id").limit(1);

  if (error) {
    console.error("keepalive: Supabase no respondió", error.message);
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true, at: new Date().toISOString() });
}
