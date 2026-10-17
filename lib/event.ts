// Datos del evento que usan la portada, "Cuándo y dónde", el calendario y los metadatos.
import { VENUE } from "@/lib/venue";
import { WEDDING_DATE } from "@/lib/utils/date";

export const SITE_URL = "https://alexa-wed-invitation.vercel.app";

export const EVENT = {
  couple: "Anthony & Alexandra",
  title: "Boda de Anthony & Alexandra",
  start: WEDDING_DATE,
  /** Texto largo de la fecha, con el día de la semana. */
  dateLong: "Sábado 5 de diciembre de 2026",
  dateShort: "5 de diciembre de 2026",
  time: "4:00 PM",
  timeNote: "Hora de Puerto Rico",
  location: `${VENUE.name}, ${VENUE.neighborhood}, ${VENUE.city}, PR ${VENUE.postalCode}`,
} as const;

/** Fecha en formato iCalendar/Google (UTC): 20261205T200000Z */
function toCalendarStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const description = `Ceremonia a las ${EVENT.time}. Código de vestimenta: casual elegante en blanco, crema o rosa. Invitación: ${SITE_URL}`;

/**
 * Enlace para agregar el evento en Google Calendar. Todavía no hay hora de fin,
 * así que el evento empieza y termina a la misma hora.
 */
export function googleCalendarUrl() {
  const stamp = toCalendarStamp(EVENT.start);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: EVENT.title,
    dates: `${stamp}/${stamp}`,
    details: description,
    location: EVENT.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** RFC 5545: líneas de máximo 75 caracteres; las siguientes empiezan con un espacio. */
function foldLine(line: string) {
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 73) parts.push(line.slice(i, i + 73));
  return parts.join("\r\n ");
}

/** Archivo .ics para Apple Calendar y Outlook. Sin DTEND porque aún no hay hora de fin. */
export function icsFile() {
  const stamp = toCalendarStamp(EVENT.start);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anthony & Alexandra//Invitacion//ES",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:boda-anthony-alexandra-20261205@alexa-wed-invitation.vercel.app",
    `DTSTAMP:${toCalendarStamp(new Date())}`,
    `DTSTART:${stamp}`,
    `SUMMARY:${escapeIcs(EVENT.title)}`,
    `LOCATION:${escapeIcs(EVENT.location)}`,
    `GEO:${VENUE.coordinates.lat};${VENUE.coordinates.lng}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `URL:${SITE_URL}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}
