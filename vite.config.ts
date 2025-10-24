import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/planalto': {
            target: 'https://www.planalto.gov.br',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/planalto/, ''),
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Fix: `__dirname` is not available in all contexts, use `process.cwd()` for a reliable project root path.
          '@': path.resolve(process.cwd()),
        }
      }
    };
});