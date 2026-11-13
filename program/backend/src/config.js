import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3300),
  production: process.env.NODE_ENV === 'production',
  origins: (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(value => value.trim()),
  secret: process.env.ACCESS_TOKEN_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
};

export function validateConfig() {
  if (!config.secret || config.secret.length < 32 || config.secret.includes('replace-me')) {
    throw new Error('Az ACCESS_TOKEN_SECRET legyen legalább 32 karakteres, véletlenszerű titok a backend/.env fájlban.');
  }
}
