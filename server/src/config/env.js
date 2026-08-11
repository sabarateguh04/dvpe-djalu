import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4002),
  CORS_ORIGINS: z.string().default('http://localhost:4002'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('8h'),
  DASHBOARD_DEMO_USER: z.string().default('admin'),
  DASHBOARD_DEMO_PASS: z.string().default('admin'),
  PORTAL_DEMO_USER: z.string().default('portal'),
  PORTAL_DEMO_PASS: z.string().default('portal'),
  VITE_DEV_SERVER: z.string().default('http://127.0.0.1:5173'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('[config] Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

const PLACEHOLDER_SECRET = 'change-me-to-a-long-random-value-before-deploying';

// Fail fast: never allow the placeholder secret (or a short/weak one) to run
// in production. This is the single most important guardrail for a mockup
// that ships with well-known demo credentials.
if (env.NODE_ENV === 'production') {
  if (!env.JWT_SECRET || env.JWT_SECRET === PLACEHOLDER_SECRET || env.JWT_SECRET.length < 32) {
    console.error(
      '[config] Refusing to start in production with a missing/placeholder/weak JWT_SECRET. ' +
        'Set a real, random, >=32 character JWT_SECRET in the environment.'
    );
    process.exit(1);
  }
}

export const config = {
  isProd: env.NODE_ENV === 'production',
  isDev: env.NODE_ENV === 'development',
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  corsOrigins: env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean),
  jwtSecret: env.JWT_SECRET,
  jwtExpiresIn: env.JWT_EXPIRES_IN,
  demo: {
    dashboard: { username: env.DASHBOARD_DEMO_USER, password: env.DASHBOARD_DEMO_PASS },
    portal: { username: env.PORTAL_DEMO_USER, password: env.PORTAL_DEMO_PASS },
  },
  viteDevServer: env.VITE_DEV_SERVER,
};
