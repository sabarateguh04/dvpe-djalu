import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Content-Security-Policy: locked to same-origin for everything by default.
// Relaxed only for the Vite dev client (HMR uses inline-ish eval'd code and a
// websocket) so local development still works; production build serves
// plain static JS/CSS with no inline script, so the strict policy applies
// there unmodified.
export const helmetMiddleware = helmet({
  contentSecurityPolicy: config.isProd
    ? {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:'],
          fontSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
});

// Browser CORS allow-list. Note this has no effect on the Flutter mobile
// client: native HTTP requests don't send an Origin header and are not
// subject to the browser same-origin policy, so they always reach the API
// regardless of this list. The allow-list exists purely to stop some other
// website's JS from making credentialed cross-origin calls against a
// logged-in admin/portal browser session.
export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true); // same-origin / non-browser clients
    if (config.corsOrigins.includes(origin)) return callback(null, true);
    logger.warn(`[cors] blocked origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
});
