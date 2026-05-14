import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // This ensures Vite treats your app as a SPA and generates the index.html
    build: {
      outDir: "dist/client",
    }
  }
});