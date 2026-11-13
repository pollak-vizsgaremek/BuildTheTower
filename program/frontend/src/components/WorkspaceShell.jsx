import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { Search, PanelLeftClose, Menu, ChevronDown, Plus, Bell, LayoutDashboard, Pickaxe, UsersRound, FolderClosed, ShieldCheck, Settings, CircleHelp, LogOut, ChevronsUpDown, X, Building2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import BuildingMark from './BuildingMark';
import Dialog from './Dialog';
import { day } from '../lib/projects';

export default function WorkspaceShell({ children, search, onSearch, onNewProject, onNewMilestone, notifications, onMilestone, activeCount, workers, hasProjects }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [info, setInfo] = useState(null);
  const [logoutError, setLogoutError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const searchRef = useRef(null);
  const drawer = useRef(null);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  useEffect(() => {
    function shortcut(event) { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); searchRef.current?.focus(); } }
    function closeMenus(event) {
      for (const ref of [menuRef, profileRef]) if (ref.current && (event.key === 'Escape' || (event.type === 'pointerdown' && !ref.current.contains(event.target)))) ref.current.open = false;
    }
    document.addEventListener('keydown', shortcut); document.addEventListener('keydown', closeMenus); document.addEventListener('pointerdown', closeMenus);
    return () => { document.removeEventListener('keydown', shortcut); document.removeEventListener('keydown', closeMenus); document.removeEventListener('pointerdown', closeMenus); };
  }, []);
  function toggleSidebar() { if (window.matchMedia('(max-width: 1000px)').matches) drawer.current.showModal(); else setCollapsed(!collapsed); }
  function openInfo(name) { drawer.current.close(); setInfo(name); }
  async function signOut() {
    setLoggingOut(true); setLogoutError('');
    try { await logout(); navigate('/login', { replace: true }); } catch (error) { setLogoutError(error.message); } finally { setLoggingOut(false); }
  }
  const nav = <><div className="workspace-picker"><BuildingMark /><span>AKTÍV MUNKATERÜLET<strong>Budaparl Építési Csoport</strong></span><button className="icon-button" title="Munkaterület adatai" aria-label="Munkaterület adatai" onClick={() => openInfo('workspace')}><ChevronsUpDown size={14} /></button></div>
    <nav aria-label="Fő navigáció"><p className="nav-caption">OPERATÍV MODULOK</p>
      {[['/Vezerlopult', LayoutDashboard, 'Vezérlőpult'], ['/Projektek', Pickaxe, 'Projektek & Ütemterv'], ['/Munkatarsak', UsersRound, 'Munkatársak & Alvállalkozók'], ['/Dokumentumok', FolderClosed, 'Tervrajzok & Dokumentumok']].map(([to, Icon, label]) => <NavLink key={to} to={to} title={label} onClick={() => drawer.current.close()}><Icon size={17} /><span>{label}</span></NavLink>)}
      <p className="nav-caption support-caption">IRÁNYÍTÁS & TÁMOGATÁS</p>
      <button onClick={() => openInfo('safety')} title="Munkavédelem (HSE)"><ShieldCheck size={17} /><span>Munkavédelem (HSE)</span></button>
      <button onClick={() => openInfo('settings')} title="Beállítások"><Settings size={17} /><span>Beállítások</span></button>
      <button onClick={() => openInfo('help')} title="Súgó & Támogatás"><CircleHelp size={17} /><span>Súgó & Támogatás</span></button>
    </nav><div className="site-status"><div>HELYSZÍNI STÁTUSZ <i /></div><p>Aktív projektek:<strong>{activeCount} db</strong></p><p>Helyszíni létszám:<strong>{workers} fő</strong></p></div></>;
  return <div className={`workspace-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className="app-sidebar"><div className="sidebar-logo"><img src="/images/brand-logo.png" alt="BuildTheTower" /><button className="icon-button" onClick={toggleSidebar} aria-label={collapsed ? 'Oldalsáv kinyitása' : 'Oldalsáv összecsukása'}><PanelLeftClose size={17} /></button></div>{nav}</aside>
    <dialog className="mobile-navigation" ref={drawer}><div className="drawer-heading"><img src="/images/brand-logo.png" alt="BuildTheTower" /><button className="icon-button" aria-label="Navigáció bezárása" onClick={() => drawer.current.close()}><X size={22} /></button></div>{nav}</dialog>
    <div className="workspace-body"><header className="app-topbar"><button className="icon-button mobile-menu-button" onClick={toggleSidebar} aria-label="Navigáció megnyitása"><Menu size={22} /></button>
      <label className="global-search"><Search size={17} /><span className="sr-only">Keresés a munkaterületen</span><input ref={searchRef} value={search} onChange={event => onSearch(event.target.value)} placeholder="Keresés projektekben, helyszínekben, mérföldkövekben…" /><kbd>Ctrl+K</kbd></label>
      <details className="topbar-dropdown" ref={menuRef}><summary className="accent-button"><Plus size={16} /><span>Új bejegyzés</span><ChevronDown size={13} /></summary><div className="dropdown-panel"><button onClick={() => { menuRef.current.open = false; onNewProject(); }}><Building2 size={16} />Új projekt</button><button disabled={!hasProjects} onClick={() => { menuRef.current.open = false; onNewMilestone(); }}><Plus size={16} />Új mérföldkő</button></div></details>
      <button className="notification-button icon-button" aria-label={`Értesítések: ${notifications.length} nyitott mérföldkő`} onClick={() => setInfo('notifications')}><Bell size={19} />{notifications.length > 0 && <span>{notifications.length}</span>}</button>
      <details className="profile-dropdown topbar-dropdown" ref={profileRef}><summary><span className="user-avatar">{(user.fullName || user.username).slice(0, 2).toUpperCase()}<i /></span><span className="user-info"><strong>{user.fullName || user.username}</strong><small>{user.role === 1 ? 'Rendszergazda' : 'Munkatárs'}</small></span><ChevronDown size={13} /></summary><div className="dropdown-panel"><span className="profile-email">{user.email}</span><button onClick={() => { profileRef.current.open = false; setInfo('settings'); }}><Settings size={16} />Fiókadatok</button><button disabled={loggingOut} onClick={signOut}><LogOut size={16} />{loggingOut ? 'Kilépés…' : 'Kijelentkezés'}</button>{logoutError && <p role="alert" className="field-error">{logoutError}</p>}</div></details>
    </header>{children}</div>
    {info && <Dialog title={{ workspace: 'Aktív munkaterület', safety: 'Munkavédelem (HSE)', settings: 'Fiók és megjelenés', help: 'Súgó & Támogatás', notifications: 'Nyitott mérföldkövek' }[info]} onClose={() => setInfo(null)}>
      {info === 'workspace' && <div className="info-copy"><BuildingMark /><h3>Budaparl Építési Csoport</h3><p>A projektlista jelenleg a saját fiókodhoz kapcsolódik. A közös vállalati munkaterület és a tagmeghívás még nincs beállítva.</p></div>}
      {info === 'safety' && <div className="info-copy"><ShieldCheck size={36} /><p>A munkavédelmi modul fejlesztés alatt áll. Projektedhez ellenőrzést és határidőt már most is rögzíthetsz mérföldkőként.</p><button className="accent-button" disabled={!hasProjects} onClick={() => { setInfo(null); onNewMilestone(); }}><Plus size={16} />Mérföldkő rögzítése</button></div>}
      {info === 'settings' && <div className="info-copy"><dl><dt>Felhasználónév</dt><dd>{user.username}</dd><dt>E-mail cím</dt><dd>{user.email}</dd><dt>Fióktípus</dt><dd>{user.role === 1 ? 'Rendszergazda' : 'Munkatárs'}</dd></dl><label className="editor-check"><input type="checkbox" checked={collapsed} onChange={event => setCollapsed(event.target.checked)} />Kompakt oldalsáv asztali nézetben</label></div>}
      {info === 'help' && <div className="info-copy"><h3>Projektek kezelése</h3><p>Az „Új projekt indítása” gombbal rögzíthetsz építkezést. A Megtekintés gomb megnyitja az adatokat, ahonnan szerkeszteni és mérföldkövet felvenni is lehet.</p><h3>Keresés és nézetek</h3><p>A Ctrl+K a keresőre ugrik. Név, projektkód, helyszín, mérföldkő és felelős alapján kereshetsz. A státusz-, év- és haladásszűrők együtt működnek.</p><h3>Mérföldkövek</h3><p>A táblázat műveletgombjával módosítható a státusz és a feljegyzés. A mentett feljegyzés szöveges fájlként letölthető.</p></div>}
      {info === 'notifications' && <div className="notification-list">{notifications.length ? notifications.map(item => <button key={item.id} onClick={() => { setInfo(null); onMilestone(item); }}><span><b>{item.title}</b><small>{item.project.name}</small></span><time>{day(item.dueDate)}</time></button>) : <p>Nincs nyitott mérföldkő.</p>}</div>}
    </Dialog>}
  </div>;
}
