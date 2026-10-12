import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Fija la raíz al directorio del proyecto. Sin esto, con un git worktree bajo
    // .claude/worktrees/, Next.js elegía el checkout principal como raíz y el
    // watcher dejaba de recompilar el CSS (carpeta oculta).
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
