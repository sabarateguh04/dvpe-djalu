import { createHash, randomUUID } from 'crypto';
import { logger } from './logger.js';

// Minimal stand-in for the "Immutable Audit Trail" module described in the
// DVPE proposal: every entry is hash-chained to the previous one, so any
// tampering with (or deletion from) the in-memory log breaks the chain and
// is detectable via verifyChain(). This is a mockup-scale illustration of
// the property, not a production tamper-evident log (which would persist
// the chain to append-only storage / WORM storage or a ledger).
const GENESIS_HASH = '0'.repeat(64);

const entries = [];
let lastHash = GENESIS_HASH;

function hashEntry(prevHash, record) {
  return createHash('sha256')
    .update(prevHash + JSON.stringify(record))
    .digest('hex');
}

export function recordAudit({ actor, action, area, ip, meta = {} }) {
  const record = {
    id: randomUUID(),
    ts: new Date().toISOString(),
    actor: actor || 'anonymous',
    action,
    area,
    ip: ip || 'unknown',
    meta,
    prevHash: lastHash,
  };
  record.hash = hashEntry(lastHash, {
    id: record.id,
    ts: record.ts,
    actor: record.actor,
    action: record.action,
    area: record.area,
    ip: record.ip,
    meta: record.meta,
    prevHash: record.prevHash,
  });
  lastHash = record.hash;
  entries.push(record);
  logger.info(`[audit] ${record.area}:${record.action} actor=${record.actor} ip=${record.ip}`);
  return record;
}

export function listAudit({ limit = 100 } = {}) {
  return entries.slice(-limit).reverse();
}

export function verifyChain() {
  let prev = GENESIS_HASH;
  for (const record of entries) {
    const expected = hashEntry(prev, {
      id: record.id,
      ts: record.ts,
      actor: record.actor,
      action: record.action,
      area: record.area,
      ip: record.ip,
      meta: record.meta,
      prevHash: record.prevHash,
    });
    if (expected !== record.hash || record.prevHash !== prev) {
      return { ok: false, brokenAt: record.id };
    }
    prev = record.hash;
  }
  return { ok: true, entries: entries.length };
}
