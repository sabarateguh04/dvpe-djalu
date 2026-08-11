#!/usr/bin/env node
// Generates server/.env from server/.env.example with a fresh, real random
// JWT_SECRET already filled in - so a new clone/pull needs just one command
// instead of hand-copying + generating a secret + editing it in. Never
// overwrites an existing .env (deletes it yourself first if you really want
// to regenerate), and .env itself is still gitignored - this script is what
// gets committed/pulled, not the secrets it produces.
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const examplePath = path.resolve(__dirname, '../.env.example');

if (existsSync(envPath)) {
  console.log(`${envPath} already exists - leaving it alone.`);
  console.log('Delete it first (or edit it directly) if you want to regenerate.');
  process.exit(0);
}

const secret = randomBytes(32).toString('hex');
let content = readFileSync(examplePath, 'utf8');
content = content.replace(
  'JWT_SECRET=change-me-to-a-long-random-value-before-deploying',
  `JWT_SECRET=${secret}`
);

writeFileSync(envPath, content, { mode: 0o600 });

console.log(`Created ${envPath} with a fresh random JWT_SECRET.\n`);
console.log('Review it before starting the server, in particular:');
console.log('  - NODE_ENV        (development locally, production on a server)');
console.log('  - HTTPS_ENABLED   (set to "false" if this server has no TLS/reverse-proxy in front yet)');
console.log('  - DASHBOARD_DEMO_PASS / PORTAL_DEMO_PASS (rotate away from admin/admin & portal/portal if this is reachable by anyone else)');
