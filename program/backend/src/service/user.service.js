import { randomUUID } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../model/User.model.js';
import { encrypt, passwordCompare } from '../utils/passwordEncrypt.js';
import { AuthError, validateCredentials } from '../utils/validation.js';
import { config } from '../config.js';

// A valid hash also makes unknown-account login attempts perform a password comparison.
const dummyHash = await encrypt(randomUUID());
const google = new OAuth2Client();

export async function login(body) {
  const { email, password } = validateCredentials(body);
  const user = await User.findOne({ where: { email } });
  const matches = await passwordCompare(password, user?.password || dummyHash);
  if (!user?.password || !matches) throw new AuthError('Hibás e-mail cím vagy jelszó.', 401);
  return user;
}

export async function register(body) {
  const { email, password, username } = validateCredentials(body, true);
  return User.create({ email, username, password: await encrypt(password), role: 2, privacyAcceptedAt: new Date() });
}

export async function googleLogin(body) {
  if (!config.googleClientId) throw new AuthError('A Google-belépés még nincs beállítva.', 503);
  if (typeof body.credential !== 'string' || body.credential.length > 10000) throw new AuthError('Hiányzó vagy hibás Google-azonosító.', 400);
  let payload;
  try {
    const ticket = await google.verifyIdToken({ idToken: body.credential, audience: config.googleClientId });
    payload = ticket.getPayload();
  } catch {
    throw new AuthError('A Google-azonosítás sikertelen. Próbáld újra.', 401);
  }
  if (!payload?.email_verified || !payload.email || !payload.sub) throw new AuthError('Megerősített Google e-mail cím szükséges.', 401);
  const existing = await User.findOne({ where: { googleId: payload.sub } });
  if (existing) return existing;
  if (body.acceptPrivacy !== true) throw new AuthError('Új Google-fiókhoz fogadd el az adatkezelési tájékoztatót a regisztrációs oldalon.', 400);
  const email = payload.email.toLowerCase();
  if (await User.findOne({ where: { email } })) throw new AuthError('Ezzel az e-mail címmel már van fiók. Jelentkezz be a jelszavaddal.', 409);
  return User.create({
    email, googleId: payload.sub, fullName: payload.name?.slice(0, 255),
    username: `google_${randomUUID().replaceAll('-', '')}`, role: 2, privacyAcceptedAt: new Date(),
  });
}
