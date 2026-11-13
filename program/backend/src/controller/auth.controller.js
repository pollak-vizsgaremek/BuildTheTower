import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, register, googleLogin } from '../service/user.service.js';
import { User, publicUser } from '../model/User.model.js';
import { config } from '../config.js';
import { SESSION_COOKIE, sessionOptions, generateAccessToken, verifyAccessToken } from '../utils/jwt.js';

export const authRouter = Router();
authRouter.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { message: 'Túl sok belépési próbálkozás. Próbáld újra 15 perc múlva.' } });
const registerLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false,
  message: { message: 'Túl sok regisztrációs próbálkozás. Próbáld újra később.' } });

authRouter.get('/config', (_req, res) => res.json({ googleClientId: config.googleClientId }));

function signIn(res, user, rememberMe, status = 200) {
  const options = sessionOptions();
  if (rememberMe) options.maxAge = 7 * 24 * 60 * 60 * 1000;
  res.cookie(SESSION_COOKIE, generateAccessToken(user, rememberMe), options);
  res.status(status).json({ user: publicUser(user) });
}

authRouter.post('/login', loginLimit, async (req, res) => signIn(res, await login(req.body ?? {}), req.body?.rememberMe === true));
authRouter.post('/register', registerLimit, async (req, res) => signIn(res, await register(req.body ?? {}), false, 201));
authRouter.post('/google', loginLimit, async (req, res) => signIn(res, await googleLogin(req.body ?? {}), req.body?.rememberMe === true));

authRouter.get('/me', async (req, res) => {
  let subject;
  try { subject = verifyAccessToken(req.cookies[SESSION_COOKIE]).sub; }
  catch { return res.status(401).json({ message: 'A munkamenet lejárt. Jelentkezz be újra.' }); }
  const user = await User.findByPk(subject);
  if (!user) return res.status(401).json({ message: 'A felhasználói fiók nem található.' });
  res.json({ user: publicUser(user) });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, sessionOptions());
  res.status(204).end();
});
