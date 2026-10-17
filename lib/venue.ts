// Datos del lugar de la boda. Único sitio donde se define el venue en el código.
// (La tabla wedding_settings de Supabase también guarda venue_name/venue_city para el admin.)

export const VENUE = {
  name: "Hacienda El Mabú",
  city: "San Sebastián",
  cityShort: "San Sebastián, PR",
  country: "Puerto Rico",
  neighborhood: "Barrio Pozas",
  postalCode: "00586",
  coordinates: { lat: 18.3229211, lng: -67.0164977 },
  /** Ficha del lugar en Google Maps (nombre, fotos, reseñas). */
  mapsPlaceUrl: "https://maps.google.com/?cid=15454482936456856535",
  /** Ruta en Google Maps directo al pin del lugar. */
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=18.3229211,-67.0164977&travelmode=driving",
  /** Ruta en Waze al mismo punto. */
  wazeUrl: "https://waze.com/ul?ll=18.3229211,-67.0164977&navigate=yes",
  /** Foto del lugar para "Cuándo y dónde". null hasta tener el archivo en public/images/venue/. */
  photo: null as { src: string; width: number; height: number } | null,
};

export const VENUE_LINE = `${VENUE.name}, ${VENUE.city}, ${VENUE.country}`;
