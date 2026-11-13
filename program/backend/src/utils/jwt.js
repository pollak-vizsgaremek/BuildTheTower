import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const SESSION_COOKIE = 'btt_session';
export const sessionOptions = () => ({ httpOnly: true, secure: config.production, sameSite: 'lax', path: '/' });

export function generateAccessToken(user, rememberMe = false) {
  return jwt.sign({}, config.secret, {
    algorithm: 'HS256', subject: String(user.id), issuer: 'build-the-tower',
    audience: 'build-the-tower-web', expiresIn: rememberMe ? '7d' : '8h',
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.secret, {
    algorithms: ['HS256'], issuer: 'build-the-tower', audience: 'build-the-tower-web',
  });
}
