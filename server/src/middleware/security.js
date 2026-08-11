import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

// Content-Security-Policy: locked to same-origin for everything by default.
// Relaxed only for the Vite dev client (HMR uses inline-ish eval'd code and a
// websocket) so local development still works; production build serves
// plain static JS/CSS with no inline script, so the strict policy applies
// there unmodified.
// Built as a plain object first rather than inlining booleans into the
// helmet() call - helmet's sub-middleware options accept `false` (disable)
// or a config object (enable+configure), but do NOT reliably treat a bare
// `true` as "enable with defaults". Omitting the key entirely is what
// actually gets helmet's normal enabled-by-default behavior, so the
// httpsEnabled=true branches below just leave the key out rather than
// setting it to `true`.
const helmetOptions = {
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
          // Only when actually behind TLS (config.httpsEnabled) - this
          // directive makes the browser silently rewrite every sub-resource
          // request (the JS/CSS bundle) to https://. On a plain-HTTP
          // deployment with no TLS listener, that upgraded request just
          // fails, the bundle never loads, and the page renders blank.
          ...(config.httpsEnabled ? { upgradeInsecureRequests: [] } : {}),
        },
      }
    : false,
  crossOriginEmbedderPolicy: false,
};

// Both of these are meaningless on plain HTTP - browsers ignore them
// outright (logging a console warning in the process) unless the origin is
// HTTPS or localhost. Only disable them explicitly when NOT behind TLS;
// otherwise leave the keys out entirely so helmet's normal defaults apply.
if (!config.httpsEnabled) {
  helmetOptions.crossOriginOpenerPolicy = false;
  helmetOptions.hsts = false;
}

export const helmetMiddleware = helmet(helmetOptions);

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
