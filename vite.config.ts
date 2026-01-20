import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Vite requires env variables to be stringified for the define plugin
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});