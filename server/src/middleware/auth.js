import { verifyToken } from '../utils/tokens.js';

export const COOKIE_NAMES = {
  dashboard: 'dvpe_dashboard_session',
  portal: 'dvpe_portal_session',
};

// Shared cookie options for session cookies issued by /api/auth/login.
// - httpOnly: not readable from JS, blunts XSS token theft
// - sameSite=strict: cookie is never sent on cross-site navigations/requests,
//   which is the primary CSRF defense for this app (no state-changing GET
//   endpoints, and the only cookie-authenticated writes are same-site fetch
//   calls made by our own dashboard/portal SPA)
// - secure: only sent over HTTPS once deployed behind TLS; disabled for
//   plain-HTTP localhost development
export function cookieOptions(isProd) {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProd,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000,
  };
}

function extractToken(req, cookieName) {
  if (req.cookies && req.cookies[cookieName]) return req.cookies[cookieName];
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function guard(area, expectedRole) {
  return (req, res, next) => {
    const token = extractToken(req, COOKIE_NAMES[area]);
    if (!token) {
      return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    try {
      const payload = verifyToken(token);
      if (payload.role !== expectedRole) {
        return res.status(403).json({ error: 'Akses ditolak untuk peran ini.' });
      }
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Sesi tidak valid atau telah kedaluwarsa.' });
    }
  };
}

// Role-based route guards (RBAC), one per area, matching the two demo
// accounts. Accepts either the httpOnly session cookie (browser SPA) or a
// Bearer token (kept available for parity with the mobile client / API
// testing tools), but the web login flow only ever issues the cookie.
export const requireDashboardAuth = guard('dashboard', 'admin');
export const requirePortalAuth = guard('portal', 'portal');
