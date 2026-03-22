import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 5173,
    open: false
  },
  preview: {
    port: 4173
  },
  plugins: [react(),tailwindcss()]
});
