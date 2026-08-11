import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../../web/dist');

// This is what keeps the whole system on a single port (4002) in BOTH dev
// and production, as required:
//  - production: the API process serves the pre-built Vite output directly
//    (`npm run build` first), no separate frontend server/port at all.
//  - development: a Vite dev server still runs (for fast HMR), but only on
//    an internal loopback port that is never exposed - the API process
//    transparently proxies everything that isn't /api/* to it, so from the
//    browser's point of view there is still only ever one origin/port.
export function attachFrontend(app) {
  if (config.isProd) {
    // Cache-Control matters here as more than performance tuning: Vite
    // content-hashes every file under assets/ (safe to cache forever - a
    // change produces a new filename), but the two entry HTML files keep a
    // fixed name and are what reference those hashed filenames. Without an
    // explicit "no-cache" on the HTML, browsers are free to serve a stale
    // cached copy of dashboard/index.html on plain reload - which then
    // still points at yesterday's JS/CSS bundle even though the server has
    // moved on, making a freshly-shipped fix look like it "didn't apply".
    app.use(
      express.static(distDir, {
        index: false,
        redirect: false,
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );
    app.get(/^\/dashboard(\/.*)?$/, (req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(distDir, 'dashboard', 'index.html'));
    });
    app.get(/^\/portal(\/.*)?$/, (req, res) => {
      res.set('Cache-Control', 'no-cache');
      res.sendFile(path.join(distDir, 'portal', 'index.html'));
    });
    app.get('/', (req, res) => res.redirect('/portal'));
    logger.info(`[static] serving built frontend from ${distDir}`);
    return null;
  }

  const proxy = createProxyMiddleware({
    target: config.viteDevServer,
    changeOrigin: true,
    ws: true,
    logLevel: 'silent',
  });
  app.use((req, res, next) => {
    if (req.path === '/') return res.redirect('/portal');
    return next();
  });
  app.use(proxy);
  logger.info(`[static] proxying non-/api requests to Vite dev server at ${config.viteDevServer}`);
  return proxy; // caller wires this into the http.Server's 'upgrade' event for HMR websockets
}
