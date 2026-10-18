import { AdminNav } from "@/components/admin/AdminNav";
import { SparklesCore } from "@/components/ui/sparkles";
import { LIGHT_SPARKLES } from "@/lib/sparkles";
import { countPending } from "@/lib/album";

// Panel de los novios: Invitados, Autorizaciones (fotos por aprobar) y Fotos.
// Los destellos van fijos detrás de todo, más suaves que en la invitación para leer listas.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const pendingPhotos = await countPending();

  return (
    <div className="relative isolate min-h-[100svh] bg-cream">
      <SparklesCore
        {...LIGHT_SPARKLES}
        particleDensity={45}
        maxSize={5}
        maxOpacity={0.8}
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      />
      <AdminNav pendingPhotos={pendingPhotos} />
      <main className="mx-auto w-full max-w-3xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 lg:pb-16 lg:pt-10">
        {children}
      </main>
    </div>
  );
}
