// Datos para el regalo por ATH Móvil.
//
// La cuenta de Alexa es personal: ATH Móvil no ofrece un botón web para enviar dinero a una
// cuenta personal, así que los invitados envían a su número desde la app ("Enviar dinero").
// El botón de pago oficial (github.com/evertec/athmovil-javascript-api) solo funciona con una
// cuenta ATH Business y su token público; si la abren, se llena `businessPublicToken`.
export const ATH_MOVIL = {
  recipientName: "Alexa Vargas",
  /** Número registrado en ATH Móvil, solo dígitos. */
  phone: "9392248043",
  /** Token público de ATH Business para el botón oficial. Vacío mientras sea cuenta personal. */
  businessPublicToken: "",
};

/** 9392248043 → 939-224-8043 */
export function formatPhone(digits: string) {
  return digits.replace(/^(\d{3})(\d{3})(\d{4})$/, "$1-$2-$3");
}
