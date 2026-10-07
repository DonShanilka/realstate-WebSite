import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Port 3000 is one of the origins the FastAPI CORS config allows.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3000, strictPort: true },
});
