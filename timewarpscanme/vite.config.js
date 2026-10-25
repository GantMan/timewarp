import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: {
    // Amplify Hosting serves this folder
    outDir: "build",
    // TensorFlow.js is big on its own; it's lazy-loaded with the scanner
    chunkSizeWarningLimit: 1500,
  },
})
