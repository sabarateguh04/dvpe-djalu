// Extra layer on top of the per-IP express-rate-limit login limiter: an
// account-specific lockout so that a distributed attacker (many IPs) still
// can't hammer a single known username indefinitely.
const MAX_ATTEMPTS = 5;
const LOCK_MS = 5 * 60 * 1000;

const state = new Map(); // key -> { count, lockedUntil }

function key(area, username) {
  return `${area}:${String(username).toLowerCase()}`;
}

export function isLocked(area, username) {
  const entry = state.get(key(area, username));
  if (!entry) return false;
  if (entry.lockedUntil && entry.lockedUntil > Date.now()) return true;
  if (entry.lockedUntil && entry.lockedUntil <= Date.now()) {
    state.delete(key(area, username));
  }
  return false;
}

export function recordFailure(area, username) {
  const k = key(area, username);
  const entry = state.get(k) || { count: 0, lockedUntil: null };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCK_MS;
  }
  state.set(k, entry);
}

export function recordSuccess(area, username) {
  state.delete(key(area, username));
}
