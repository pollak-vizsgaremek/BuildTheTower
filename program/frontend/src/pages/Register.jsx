import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { UserRound, Mail, LockKeyhole, UserRoundPlus, ArrowLeft, ExternalLink } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import GoogleSignIn from '../components/GoogleSignIn';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const { authenticate, user } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: '', email: '', password: '', passwordConfirmation: '', acceptPrivacy: false });
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/Vezerlopult" replace />;
  const change = event => {
    const { name, type, checked, value } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setFields(current => ({ ...current, [name]: '' })); setError('');
  };
  async function submit(path, body) {
    if (busy) return;
    if (path === '/register' && values.password !== values.passwordConfirmation) { setFields({ passwordConfirmation: 'A két jelszó nem egyezik.' }); return; }
    setBusy(true); setError(''); setFields({});
    try { await authenticate(path, body); navigate('/Vezerlopult', { replace: true }); }
    catch (err) { setError(err.message); setFields(err.fields || {}); }
    finally { setBusy(false); }
  }
  return <AuthLayout title="Regisztráció" subtitle="Hozz létre új fiókot, hogy hozzáférj a projektedhez." variant="register-page">
    <form onSubmit={event => { event.preventDefault(); submit('/register', values); }} aria-busy={busy}><fieldset disabled={busy}>
      <div className="form-fields">
        <FormField icon={UserRound} label="Felhasználónév" name="username" autoComplete="username" required minLength={3} maxLength={50} value={values.username} onChange={change} error={fields.username} />
        <FormField icon={Mail} label="E-mail cím" name="email" type="email" autoComplete="email" required maxLength={255} value={values.email} onChange={change} error={fields.email} />
        <FormField icon={LockKeyhole} label="Jelszó" name="password" type="password" autoComplete="new-password" required minLength={8} value={values.password} onChange={change} error={fields.password} />
        <FormField icon={LockKeyhole} label="Jelszó megerősítése" name="passwordConfirmation" type="password" autoComplete="new-password" required minLength={8} value={values.passwordConfirmation} onChange={change} error={fields.passwordConfirmation} />
      </div><p className="password-hint">Legalább 8 karakterből álló jelszót válassz.</p>
      <div className="privacy-check"><label className="checkbox-label"><input type="checkbox" name="acceptPrivacy" checked={values.acceptPrivacy} onChange={change} required aria-describedby={fields.acceptPrivacy ? 'privacy-error' : undefined} /><span>Elfogadom az <Link to="/adatvedelem" target="_blank" rel="noopener">Adatvédelmi nyilatkozatot <ExternalLink size={19} aria-hidden="true" /><span className="sr-only"> (új lapon)</span></Link></span></label>{fields.acceptPrivacy && <p className="field-error" id="privacy-error">{fields.acceptPrivacy}</p>}</div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit"><UserRoundPlus aria-hidden="true" />{busy ? 'Fiók létrehozása…' : 'Regisztráció'}</button>
    </fieldset></form>
    <GoogleSignIn register disabled={!values.acceptPrivacy || busy} onCredential={credential => submit('/google', { credential, acceptPrivacy: values.acceptPrivacy })} />
    <Link className="back-link" to="/login"><ArrowLeft aria-hidden="true" />Vissza a bejelentkezéshez</Link>
  </AuthLayout>;
}
