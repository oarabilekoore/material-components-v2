import { defineConfig } from "vite";

export default defineConfig({
  root: "apps/demo",
  plugins: [],
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
