import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { config } from './config/env.js';
import { helmetMiddleware, corsMiddleware } from './middleware/security.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { attachFrontend } from './static.js';
import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import portalRoutes from './routes/portal.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import { logger } from './utils/logger.js';
import { users } from './data/users.js';

const app = express();

// Trust the first hop proxy (e.g. an nginx/TLS terminator in front of this
// process) so req.ip / rate limiting see the real client address rather
// than the proxy's. Harmless when there is no proxy (running bare locally).
app.set('trust proxy', 1);

app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());
if (config.isDev) app.use(morgan('dev'));

app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api', reportsRoutes); // /api/reports, /api/reports/:id/status, /api/panic

app.get('/api/health', (req, res) => res.json({ ok: true, env: config.nodeEnv }));

app.use('/api', notFoundHandler);

const proxy = attachFrontend(app);

app.use(errorHandler);

const server = app.listen(config.port, () => {
  logger.info(`DVPE server listening on http://localhost:${config.port} (${config.nodeEnv})`);
  logger.info(`  Dashboard: http://localhost:${config.port}/dashboard  (login: ${users.dashboard.username} / ${config.demo.dashboard.password})`);
  logger.info(`  Portal:    http://localhost:${config.port}/portal     (login: ${users.portal.username} / ${config.demo.portal.password})`);
  if (config.isDev) {
    logger.warn('Demo credentials are active. Do not expose this server beyond localhost/your team without changing them.');
  }
});

// Wire Vite HMR websocket proxying (dev only - attachFrontend returns null
// in production since no proxy is used there).
if (proxy) {
  server.on('upgrade', proxy.upgrade);
}
