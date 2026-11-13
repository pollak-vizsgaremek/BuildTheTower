import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';
let googleScript;
function loadGoogle() {
  if (window.google?.accounts) return Promise.resolve();
  if (!googleScript) googleScript = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.onload = resolve;
    script.onerror = () => { script.remove(); googleScript = null; reject(new Error('A Google-belépés nem tölthető be.')); };
    document.head.append(script);
  });
  return googleScript;
}
export default function GoogleSignIn({ register = false, disabled = false, onCredential }) {
  const container = useRef(null);
  const callback = useRef(onCredential);
  useEffect(() => { callback.current = onCredential; }, [onCredential]);
  const [status, setStatus] = useState('loading');
  useEffect(() => {
    let cancelled = false;
    async function setup() {
      try {
        const { googleClientId } = await api('/config');
        if (cancelled) return;
        if (!googleClientId) { setStatus('unconfigured'); return; }
        if (disabled) { setStatus('disabled'); return; }
        await loadGoogle();
        if (cancelled) return;
        window.google.accounts.id.initialize({ client_id: googleClientId, callback: response => callback.current(response.credential), auto_select: false });
        window.google.accounts.id.renderButton(container.current, { theme: 'outline', size: 'large', text: register ? 'signup_with' : 'signin_with', locale: 'hu', width: Math.min(400, container.current.clientWidth) });
        setStatus('ready');
      } catch { if (!cancelled) setStatus('error'); }
    }
    setup(); return () => { cancelled = true; };
  }, [disabled, register]);
  return <div className="google-section"><div className="divider"><span>vagy</span></div>
    <div ref={container} className={`google-widget ${status === 'ready' && !disabled ? '' : 'google-hidden'}`} />
    {(status !== 'ready' || disabled) && <button className="social-button" type="button" disabled aria-describedby="google-status">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z"/><path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.96-3.38.96-2.6 0-4.81-1.76-5.6-4.12H3.05v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.92a6 6 0 0 1 0-3.84v-2.6H3.05a10 10 0 0 0 0 9.04l3.35-2.6Z"/><path fill="#EA4335" d="M12 5.96c1.47 0 2.79.5 3.83 1.5l2.87-2.88A9.63 9.63 0 0 0 12 2a10 10 0 0 0-8.95 5.48l3.35 2.6C7.19 7.72 9.4 5.96 12 5.96Z"/></svg>
      {register ? 'Regisztráció Google-fiókkal' : 'Bejelentkezés Google-fiókkal'}</button>}
    {status !== 'ready' && <p id="google-status" className="google-note" role="status">{status === 'loading' ? 'Google-belépés betöltése…' : status === 'unconfigured' ? 'A Google-belépés beállítása folyamatban.' : status === 'disabled' ? 'Előbb fogadd el az adatkezelési tájékoztatót.' : 'A Google-belépés jelenleg nem érhető el.'}</p>}
  </div>;
}
