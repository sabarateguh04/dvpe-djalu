import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The dashboard and portal apps each use client-side routing
// (react-router BrowserRouter with basename "/dashboard" / "/portal"). Vite's
// dev server only knows about the two real .html entry points below, so a
// deep link like /dashboard/kasus needs to be rewritten to
// /dashboard/index.html before Vite's own middleware sees it. This mirrors
// the SPA-fallback routes the Express server registers for the production
// build in ../server/src/static.js.
function spaFallback() {
  return {
    name: 'dvpe-spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const url = req.url.split('?')[0];
        if (url.includes('.')) return next(); // real asset request, leave alone
        if (url.startsWith('/dashboard')) req.url = '/dashboard/index.html';
        else if (url.startsWith('/portal')) req.url = '/portal/index.html';
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), spaFallback()],
  server: {
    host: '127.0.0.1', // internal only - the Express API on :4002 proxies to this, browsers never hit it directly
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dashboard: path.resolve(__dirname, 'dashboard/index.html'),
        portal: path.resolve(__dirname, 'portal/index.html'),
      },
    },
  },
});
