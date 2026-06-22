import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";

// Standard Vite config for local development and self-hosted builds.
// TanStack Start is configured to use src/server.ts as its server entry
// (our SSR error wrapper) instead of the framework's default entry.
export default defineConfig({
  server: {
    host: true,
    port: 8080,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
    }),
    viteReact(),
    // Plain Node.js production server by default, but switches to Vercel preset when building on Vercel.
    nitro({ preset: process.env.VERCEL ? "vercel" : "node-server" }),
  ],
});
