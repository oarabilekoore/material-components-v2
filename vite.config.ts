import { defineConfig } from "npm:vite";
import { tsrx } from "npm:@tsrx/vite-plugin-tsrx";

export default defineConfig({
  plugins: [tsrx()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
