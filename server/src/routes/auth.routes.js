import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config/env.js';
import { validateBody } from '../middleware/validate.js';
import { loginLimiter } from '../middleware/rateLimiters.js';
import { COOKIE_NAMES, cookieOptions } from '../middleware/auth.js';
import { findUser, verifyPassword } from '../data/users.js';
import { isLocked, recordFailure, recordSuccess } from '../data/loginAttempts.js';
import { signToken, verifyToken } from '../utils/tokens.js';
import { recordAudit } from '../utils/audit.js';

const router = Router();

const loginSchema = z.object({
  area: z.enum(['dashboard', 'portal']),
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

router.post('/login', loginLimiter, validateBody(loginSchema), (req, res) => {
  const { area, username, password } = req.body;
  const ip = req.ip;

  if (isLocked(area, username)) {
    recordAudit({ actor: username, action: 'login_blocked_locked', area, ip });
    return res.status(429).json({
      error: 'Akun ini sementara dikunci karena terlalu banyak percobaan gagal. Coba lagi dalam beberapa menit.',
    });
  }

  const record = findUser(area, username);
  const ok = record && verifyPassword(record, password);

  if (!ok) {
    recordFailure(area, username);
    recordAudit({ actor: username, action: 'login_failed', area, ip });
    // Deliberately generic message: don't reveal whether the username or
    // the password was the wrong part (avoids user enumeration).
    return res.status(401).json({ error: 'Username atau password salah.' });
  }

  recordSuccess(area, username);
  const token = signToken({ sub: record.username, role: record.role, area, name: record.displayName });
  res.cookie(COOKIE_NAMES[area], token, cookieOptions(config.isProd));
  recordAudit({ actor: record.username, action: 'login_success', area, ip });

  res.json({
    user: {
      username: record.username,
      displayName: record.displayName,
      title: record.title,
      role: record.role,
      mustChangePassword: record.mustChangePassword,
    },
  });
});

router.post('/logout', (req, res) => {
  const area = req.body?.area === 'dashboard' ? 'dashboard' : 'portal';
  res.clearCookie(COOKIE_NAMES[area], { path: '/' });
  recordAudit({ actor: req.body?.username, action: 'logout', area, ip: req.ip });
  res.json({ ok: true });
});

router.get('/session', (req, res) => {
  const read = (area) => {
    const token = req.cookies?.[COOKIE_NAMES[area]];
    if (!token) return null;
    try {
      const payload = verifyToken(token);
      return { username: payload.sub, role: payload.role, name: payload.name };
    } catch {
      return null;
    }
  };
  res.json({ dashboard: read('dashboard'), portal: read('portal') });
});

export default router;
