import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Fix: Cast process to any to avoid the TypeScript error "Property 'cwd' does not exist on type 'Process'".
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // This maps the API_KEY from your environment to the frontend code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
    }
  };
});