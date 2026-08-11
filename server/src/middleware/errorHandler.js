import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
}

// Centralized error handler: never leak stack traces or internal error
// messages to the client in production, but log full detail server-side.
export function errorHandler(err, req, res, _next) {
  logger.error(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: config.isProd ? 'Terjadi kesalahan pada server.' : (err.message || 'Internal error'),
  });
}
