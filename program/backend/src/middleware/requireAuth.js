import { User } from '../model/User.model.js';
import { SESSION_COOKIE, verifyAccessToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  let subject;
  try { subject = verifyAccessToken(req.cookies[SESSION_COOKIE]).sub; }
  catch { return res.status(401).json({ message: 'A munkamenet lejárt. Jelentkezz be újra.' }); }
  const user = await User.findByPk(subject, { attributes: ['id', 'username', 'email', 'role'] });
  if (!user) return res.status(401).json({ message: 'A felhasználói fiók nem található.' });
  req.user = user;
  res.set('Cache-Control', 'no-store');
  next();
}
