import bcrypt from 'bcryptjs';
import { config } from '../config/env.js';

// Passwords are hashed at boot even though the demo values are well-known -
// the app never stores or compares plaintext, so the same code path would
// be safe if real credentials were dropped in via environment variables.
const SALT_ROUNDS = 12;

export const users = {
  dashboard: {
    username: config.demo.dashboard.username,
    passwordHash: bcrypt.hashSync(config.demo.dashboard.password, SALT_ROUNDS),
    role: 'admin',
    displayName: 'Ajeng Pratiwi',
    title: 'Penyidik',
    mustChangePassword: true,
  },
  portal: {
    username: config.demo.portal.username,
    passwordHash: bcrypt.hashSync(config.demo.portal.password, SALT_ROUNDS),
    role: 'portal',
    displayName: 'Petugas Portal',
    title: 'Admin Portal',
    mustChangePassword: true,
  },
};

export function findUser(area, username) {
  const record = users[area];
  if (!record) return null;
  if (record.username.toLowerCase() !== String(username).toLowerCase()) return null;
  return record;
}

export function verifyPassword(record, password) {
  return bcrypt.compareSync(password, record.passwordHash);
}
