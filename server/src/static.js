import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { COOKIE_NAMES } from './middleware/auth.js';
import { verifyToken } from './utils/tokens.js';
import { logger } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

// Plain static files - no bundler, no build step, nothing to compile.
// dashboard/ and portal/ are ordinary multi-page sites (real .html files,
// real <a href> navigation) rather than a client-routed single-page app,
// so there's no history-fallback/basename complexity either: what you see
// in the URL bar is the actual file being served.
const ASSET_RE = /\.(css|js|mjs|png|jpg|jpeg|svg|ico|woff2?|map|webmanifest)$/i;

// Server-side auth gate for the two demo-gated preview areas (see README's
// "Security notes" for why this gate exists at all). Only applied to page
// navigations (.html / bare directory requests) - CSS/JS assets are always
// served regardless of login state, since they carry no sensitive data
// themselves (the actual case/report data is behind /api/*, which has its
// own, separate auth check on every request).
function pageGuard(area) {
  return (req, res, next) => {
    if (ASSET_RE.test(req.path)) return next();
    if (req.path === '/login.html') return next();
    const token = req.cookies?.[COOKIE_NAMES[area]];
    if (!token) return res.redirect(`/${area}/login.html`);
    try {
      verifyToken(token);
      return next();
    } catch {
      return res.redirect(`/${area}/login.html`);
    }
  };
}

export function attachFrontend(app) {
  app.use('/shared', express.static(path.join(publicDir, 'shared')));
  app.use('/dashboard', pageGuard('dashboard'), express.static(path.join(publicDir, 'dashboard')));
  app.use('/portal', pageGuard('portal'), express.static(path.join(publicDir, 'portal')));
  app.get('/', (req, res) => res.redirect('/portal/'));
  logger.info(`[static] serving plain HTML/CSS/JS from ${publicDir} (no build step)`);
}
