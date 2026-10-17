import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fija la raíz al directorio del proyecto. Sin esto, con un git worktree bajo
    // .claude/worktrees/, Next.js elegía el checkout principal como raíz y el
    // watcher dejaba de recompilar el CSS (carpeta oculta).
    root: path.resolve(process.cwd()),
  },
  // Solo desarrollo: permite abrir `next dev` desde el celular por la IP de Tailscale
  // de la laptop. Sin esto Next 16 bloquea sus scripts y la página no se vuelve
  // interactiva (ni destellos, ni cuenta regresiva, ni barra fija).
  allowedDevOrigins: ["100.122.160.5"],
};

export default nextConfig;
