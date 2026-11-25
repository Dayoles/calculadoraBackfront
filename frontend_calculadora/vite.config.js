import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // El Backend solo acepta peticiones desde el puerto 5173 (CORS)
  server: { port: 5173, strictPort: true },
});
