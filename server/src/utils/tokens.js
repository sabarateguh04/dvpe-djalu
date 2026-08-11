import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    issuer: 'dvpe-server',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret, { issuer: 'dvpe-server' });
}
