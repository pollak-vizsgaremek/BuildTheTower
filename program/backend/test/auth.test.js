import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { validateCredentials } from '../src/utils/validation.js';
import { encrypt, passwordCompare } from '../src/utils/passwordEncrypt.js';
import { config } from '../src/config.js';
import { generateAccessToken, verifyAccessToken } from '../src/utils/jwt.js';
config.secret = 'test-only-secret-that-is-at-least-32-characters';
const valid = { email: ' Example@TEST.hu ', username: 'Teszt_Elek', password: 'biztonsagos123', passwordConfirmation: 'biztonsagos123', acceptPrivacy: true };

test('registration normalizes email and rejects invalid input', () => {
  assert.equal(validateCredentials(valid, true).email, 'example@test.hu');
  for (const change of [{ email: 'wrong' }, { username: 'a' }, { password: 'short' }, { passwordConfirmation: 'different' }, { acceptPrivacy: false }, { password: 'á'.repeat(37) }]) {
    assert.throws(() => validateCredentials({ ...valid, ...change }, true), { status: 400 });
  }
  assert.throws(() => validateCredentials({ email: {}, password: [] }), { status: 400 });
});

test('password hashes are salted and reject wrong passwords', async () => {
  const first = await encrypt(valid.password);
  const second = await encrypt(valid.password);
  assert.notEqual(first, second);
  assert.equal(await passwordCompare(valid.password, first), true);
  assert.equal(await passwordCompare('wrong', first), false);
});

test('sessions have correct expiry, no personal data and reject tampering', () => {
  for (const [remember, seconds] of [[false, 8 * 3600], [true, 7 * 86400]]) {
    const token = generateAccessToken({ id: 'example-id', password: 'secret', email: 'private@test.hu' }, remember);
    const decoded = verifyAccessToken(token);
    assert.equal(decoded.exp - decoded.iat, seconds);
    assert.equal(decoded.sub, 'example-id');
    assert.equal(decoded.password, undefined);
    assert.equal(decoded.email, undefined);
    assert.throws(() => verifyAccessToken(token + 'bad'));
  }
  const expired = jwt.sign({}, config.secret, { expiresIn: -1, audience: 'build-the-tower-web', issuer: 'build-the-tower' });
  assert.throws(() => verifyAccessToken(expired));
});
