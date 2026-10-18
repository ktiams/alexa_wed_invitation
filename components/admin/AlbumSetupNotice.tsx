// Aviso mientras no se haya aplicado la migración 002 (tabla de fotos y almacenamiento).
export function AlbumSetupNotice() {
  return (
    <div className="rounded-3xl border border-gold/50 bg-nude-light px-5 py-5 font-body text-sm text-charcoal">
      <p className="font-semibold">El álbum todavía no está listo.</p>
      <p className="mt-2 text-muted">
        Falta preparar la base de datos: en Supabase → SQL Editor, ejecutar completo{" "}
        <code>supabase/migrations/002_album.sql</code>. No toca datos existentes.
      </p>
    </div>
  );
}
