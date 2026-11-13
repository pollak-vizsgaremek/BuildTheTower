import { useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { LockKeyhole, Mail, LogIn, X } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import FormField from '../components/FormField';
import GoogleSignIn from '../components/GoogleSignIn';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { authenticate, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const [busy, setBusy] = useState(false);
  const dialog = useRef(null);
  const destination = /^\/(Vezerlopult|Projektek|Munkatarsak|Dokumentumok)$/i.test(location.state?.from || '') ? location.state.from : '/Vezerlopult';
  if (user) return <Navigate to={destination} replace />;
  const change = event => {
    const { name, type, checked, value } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setFields(current => ({ ...current, [name]: '' })); setError('');
  };
  async function submit(path, body) {
    if (busy) return;
    setBusy(true); setError(''); setFields({});
    try { await authenticate(path, body); navigate(destination, { replace: true }); }
    catch (err) { setError(err.message); setFields(err.fields || {}); }
    finally { setBusy(false); }
  }
  return <AuthLayout title="Bejelentkezés" subtitle="Kérjük, jelentkezzen be a folytatáshoz." variant="login-page">
    <form onSubmit={event => { event.preventDefault(); submit('/login', values); }} aria-busy={busy}><fieldset disabled={busy}>
      <div className="form-fields">
        <FormField icon={Mail} label="E-mail cím" name="email" type="email" autoComplete="email" required maxLength={255} value={values.email} onChange={change} error={fields.email} />
        <FormField icon={LockKeyhole} label="Jelszó" name="password" type="password" autoComplete="current-password" required value={values.password} onChange={change} error={fields.password} />
      </div>
      <div className="form-options"><label className="checkbox-label"><input name="rememberMe" type="checkbox" checked={values.rememberMe} onChange={change} />Emlékezzen rám</label><button className="text-button" type="button" onClick={() => dialog.current.showModal()}>Elfelejtette a jelszavát?</button></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit"><LogIn aria-hidden="true" />{busy ? 'Bejelentkezés…' : 'Bejelentkezés'}</button>
    </fieldset></form>
    <GoogleSignIn disabled={busy} onCredential={credential => submit('/google', { credential, rememberMe: values.rememberMe })} />
    <p className="switch-page">Még nincs fiókja? <Link to="/register">Regisztráció</Link></p>
    <footer className="auth-footer">Aktív Munkaterület – Budaparl Építési Csoport<span>Tervrajzok &amp; Dokumentumok</span></footer>
    <dialog ref={dialog} className="help-dialog" aria-labelledby="password-help-title"><button className="dialog-close" aria-label="Bezárás" onClick={() => dialog.current.close()}><X /></button>
      <h2 id="password-help-title">Elfelejtette a jelszavát?</h2><p>Jelszava visszaállításához kérje a munkaterület rendszergazdájának segítségét. Az automatikus e-mailes jelszó-visszaállítás még nem érhető el.</p><p>Google-fiók esetén a Google bejelentkezési felületén állíthatja vissza a hozzáférését.</p><button className="primary-button" onClick={() => dialog.current.close()}>Rendben</button>
    </dialog>
  </AuthLayout>;
}
