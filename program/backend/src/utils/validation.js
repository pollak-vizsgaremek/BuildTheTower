export class AuthError extends Error {
  constructor(message, status = 400, fields = {}) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

export function validateCredentials(body, registration = false) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const fields = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) fields.email = 'Adj meg egy érvényes e-mail címet.';
  if (!password || Buffer.byteLength(password, 'utf8') > 72) fields.password = 'A jelszó megadása kötelező, legfeljebb 72 bájt lehet.';
  if (registration) {
    if (!/^[\p{L}\p{N}_.-]{3,50}$/u.test(username)) fields.username = '3–50 betű, szám, pont, kötőjel vagy aláhúzás használható.';
    if (password.length < 8) fields.password = 'A jelszó legalább 8 karakter legyen.';
    if (body.passwordConfirmation !== password) fields.passwordConfirmation = 'A két jelszó nem egyezik.';
    if (body.acceptPrivacy !== true) fields.acceptPrivacy = 'Az adatkezelési tájékoztató elfogadása kötelező.';
  }
  if (Object.keys(fields).length) throw new AuthError('Kérjük, ellenőrizd a megadott adatokat.', 400, fields);
  return { email, password, username };
}
