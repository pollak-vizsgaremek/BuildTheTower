import { FolderClosed, PanelsTopLeft, UsersRound, ShieldCheck } from 'lucide-react';
import BuildingMark from './BuildingMark';
const features = [[FolderClosed, 'Dokumentumok kezelése'], [PanelsTopLeft, 'Tervrajzok megtekintése'], [UsersRound, 'Valós idejű együttműködés'], [ShieldCheck, 'Biztonságos hozzáférés']];
export default function AuthLayout({ title, subtitle, children, variant = '' }) {
  return <main className={`auth-page ${variant}`}>
    <section className="brand-panel" aria-label="Aktív Munkaterület bemutatkozás"><div className="brand-content">
      <div className="brand"><BuildingMark /><p>AKTÍV MUNKATERÜLET<span>Budaparl Építési Csoport</span></p></div>
      <h1>Tervrajzok &amp;<br />Dokumentumok</h1>
      <p className="brand-description">Hatékony projektmenedzsment<br className="desktop-break" /> és dokumentumkezelés egy helyen.</p>
      <ul className="features">{features.map(([Icon, text]) => <li key={text}><Icon strokeWidth={2} /><span>{text}</span></li>)}</ul>
    </div></section>
    <section className="auth-card" aria-labelledby="auth-title"><header className="auth-heading"><BuildingMark /><h2 id="auth-title">{title}</h2><p>{subtitle}</p></header>{children}</section>
    <div className="corner-ribbon" aria-hidden="true" />
  </main>;
}
