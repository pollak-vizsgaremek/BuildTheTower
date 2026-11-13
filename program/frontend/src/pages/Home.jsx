import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { LogOut, FolderClosed, UsersRound, HardHat } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import BuildingMark from '../components/BuildingMark';
export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try { await logout(); navigate('/login', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="workspace-page"><header className="workspace-header"><div className="brand"><BuildingMark /><p>AKTÍV MUNKATERÜLET<span>Budaparl Építési Csoport</span></p></div><button className="outline-button" disabled={busy} onClick={signOut}><LogOut size={20} />{busy ? 'Kijelentkezés…' : 'Kijelentkezés'}</button></header>
    <section className="welcome-card"><span className="eyebrow">VEZÉRLŐPULT</span><h1>Üdvözlünk, {user.fullName || user.username}!</h1><p>Sikeresen bejelentkeztél a munkaterületre.</p><p className="account-email">{user.email}</p>{error && <p className="form-error" role="alert">{error}</p>}
      <div className="workspace-links"><Link to="/Projektek"><HardHat />Projektek</Link><Link to="/Dokumentumok"><FolderClosed />Dokumentumok</Link><Link to="/Munkatarsak"><UsersRound />Munkatársak</Link></div>
    </section></main>;
}
