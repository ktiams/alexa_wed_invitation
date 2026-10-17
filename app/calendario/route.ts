import { icsFile } from "@/lib/event";

// Evento de la boda para Apple Calendar y Outlook. En iPhone abre "Agregar al calendario".
export function GET() {
  return new Response(icsFile(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="boda-anthony-alexandra.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
