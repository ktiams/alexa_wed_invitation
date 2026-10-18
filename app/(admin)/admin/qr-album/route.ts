import QRCode from "qrcode";
import { ALBUM_UPLOAD_URL } from "@/lib/album";

// Imagen PNG del QR del álbum (1200 px, color cacao) para guardarla en el teléfono o
// mandarla a imprimir. proxy.ts la protege como el resto de /admin.
export async function GET() {
  const png = await QRCode.toBuffer(ALBUM_UPLOAD_URL, {
    type: "png",
    width: 1200,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#4a3830", light: "#ffffff" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="qr-album-anthony-alexandra.png"',
      "Cache-Control": "private, max-age=3600",
    },
  });
}
