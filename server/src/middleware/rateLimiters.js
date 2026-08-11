import rateLimit from 'express-rate-limit';

// Both demo accounts use well-known credentials (admin/admin, portal/portal)
// by explicit request for this mockup, which makes brute-force throttling on
// the login endpoint especially important: it's the one thing standing
// between "known demo password" and "trivially guessable password".
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam beberapa menit.' },
});

export const reportLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.' },
});

// Panic button must stay responsive in a genuine emergency, so the limit is
// generous, but still bounded to blunt automated abuse/spam of the alert
// pipeline.
export const panicLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan panic button dari perangkat ini.' },
});

export const statusLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.' },
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
