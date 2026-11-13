import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BarChart3, LayoutGrid, Table2, PlusCircle, Search, SlidersHorizontal, Flag, BellRing, TrendingUp, ChevronDown, ChevronUp, X, FolderOpen, RefreshCw, Database, Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import WorkspaceShell from '../components/WorkspaceShell';
import ProjectForm from '../components/projects/ProjectForm';
import MilestoneForm from '../components/projects/MilestoneForm';
import { PhaseOverview, ProjectCard, ProjectTable, MilestoneTable, ProjectDetails } from '../components/projects/ProjectViews';
import { projectsApi } from '../lib/api';
import { flattenMilestones, matchesSearch, projectStatuses, isOverdue, today } from '../lib/projects';
import './projects.css';

export default function Projektek() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [year, setYear] = useState(null);
  const [view, setView] = useState('gantt');
  const [advanced, setAdvanced] = useState(false);
  const [health, setHealth] = useState('all');
  const [sort, setSort] = useState('featured');
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [milestoneFilter, setMilestoneFilter] = useState('open');
  const [allMilestones, setAllMilestones] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');
  const [importing, setImporting] = useState(false);
  const milestonesRef = useRef(null);
  const navigate = useNavigate();
  const { reload } = useAuth();
  const load = useCallback(async signal => {
    setLoading(true); setError('');
    try { setProjects((await projectsApi('', { signal })).projects); }
    catch (err) {
      if (err.name === 'AbortError') return;
      if (err.status === 401) { await reload(); navigate('/login', { replace: true }); }
      else setError(err.message);
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [navigate, reload]);
  useEffect(() => { const controller = new AbortController(); load(controller.signal); return () => controller.abort(); }, [load]);
  useEffect(() => { if (notice) { const timer = setTimeout(() => setNotice(''), 6000); return () => clearTimeout(timer); } }, [notice]);
  const selectedYear = year ?? (projects.length && projects.every(project => project.isDemo) ? '2025' : 'all');
  const years = useMemo(() => [...new Set(projects.flatMap(project => {
    const from = Number(project.startDate.slice(0, 4)), to = Number(project.endDate.slice(0, 4));
    return Array.from({ length: to - from + 1 }, (_, index) => String(from + index));
  }))].sort().reverse(), [projects]);
  const candidates = projects.filter(project => (selectedYear === 'all' || (project.startDate <= `${selectedYear}-12-31` && project.endDate >= `${selectedYear}-01-01`)) && matchesSearch(project, query));
  const filtered = candidates.filter(project => (status === 'all' || project.status === status) && (health === 'all' || project.health === health) && (!overdueOnly || project.milestones.some(isOverdue))).sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name, 'hu');
    if (sort === 'deadline') return a.endDate.localeCompare(b.endDate);
    if (sort === 'progress') return b.progress - a.progress;
    return Number(b.featured) - Number(a.featured) || ['normal', 'critical', 'handover'].indexOf(a.health) - ['normal', 'critical', 'handover'].indexOf(b.health) || a.createdAt.localeCompare(b.createdAt);
  });
  const allPending = flattenMilestones(projects).filter(item => item.status !== 'completed');
  const filteredMilestones = flattenMilestones(filtered).filter(item => milestoneFilter === 'all' || (milestoneFilter === 'open' && item.status !== 'completed') || (milestoneFilter === 'overdue' && isOverdue(item)));
  const cards = view === 'gantt' ? (filtered.some(project => project.featured) ? filtered.filter(project => project.featured) : filtered).slice(0, 3) : filtered;
  const count = value => candidates.filter(project => project.status === value).length;
  const newProject = () => setDialog({ type: 'project' });
  const openProject = project => setDialog({ type: 'details', project });
  const openMilestone = milestone => setDialog({ type: 'milestone', milestone });
  const newMilestone = projectId => setDialog({ type: 'milestone', projectId });
  function saved() { setDialog(null); setNotice('A változtatások sikeresen mentve.'); load(); }
  async function importSamples() {
    setImporting(true); setError('');
    try { setProjects((await projectsApi('/samples', { method: 'POST', body: '{}' })).projects); setYear('2025'); setNotice('A bemutatóprojektek és mérföldkövek betöltve.'); }
    catch (err) { setError(err.message); } finally { setImporting(false); }
  }
  function reset() { setQuery(''); setStatus('all'); setYear('all'); setHealth('all'); setOverdueOnly(false); setSort('featured'); }
  function showMilestones() { setMilestoneFilter('open'); setAllMilestones(true); milestonesRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); }
  return <WorkspaceShell search={query} onSearch={setQuery} onNewProject={newProject} onNewMilestone={() => newMilestone()} onMilestone={openMilestone} notifications={allPending}
    activeCount={projects.filter(project => project.status === 'active').length} workers={projects.filter(project => project.status === 'active').reduce((sum, project) => sum + project.workers, 0)} hasProjects={projects.length > 0}>
    <main className="projects-page"><header className="projects-heading"><div><p className="page-eyebrow"><TrendingUp size={15} />OPERATÍV KIVITELEZÉSI TÉRKÉP</p><h1>Projektek &amp; Kivitelezési Ütemterv</h1><p className="page-subtitle">Aktív építkezések, mérföldkövek és fázisok áttekintése</p></div>
      <div className="heading-actions"><div className="view-switch" role="group" aria-label="Projekt nézet">
        {[[BarChart3, 'gantt', 'Gantt-diagram'], [LayoutGrid, 'cards', 'Kártya nézet'], [Table2, 'table', 'Táblázat nézet']].map(([Icon, value, label]) => <button key={value} onClick={() => setView(value)} className={view === value ? 'selected' : ''} aria-pressed={view === value}><Icon size={15} /><span>{label}</span></button>)}
      </div><button className="accent-button new-project-button" onClick={newProject}><PlusCircle size={16} />Új projekt indítása</button></div>
    </header>
    {notice && <div className="project-toast" role="status">{notice}<button className="icon-button" aria-label="Értesítés bezárása" onClick={() => setNotice('')}><X size={16} /></button></div>}
    <section className="project-filters panel" aria-label="Projektek szűrése"><label className="local-search"><Search size={15} /><span className="sr-only">Projekt keresése</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Keresés projekt név vagy kód alapján…" />{query && <button className="icon-button" aria-label="Keresés törlése" onClick={() => setQuery('')}><X size={14} /></button>}</label>
      <div className="filter-bottom"><div className="filter-selects"><label><span>Státusz:</span><select aria-label="Projekt státusza" value={status} onChange={event => setStatus(event.target.value)}><option value="all">Minden</option>{Object.entries(projectStatuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label><span>Kivitelezés éve:</span><select aria-label="Kivitelezés éve" value={selectedYear} onChange={event => setYear(event.target.value)}><option value="all">Minden év</option>{years.map(value => <option key={value}>{value}</option>)}</select></label><button className={`filter-toggle icon-button ${advanced ? 'active' : ''}`} aria-label="További szűrők" aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}><SlidersHorizontal size={16} /></button></div>
        <div className="project-counters"><button onClick={() => setStatus(status === 'active' ? 'all' : 'active')} aria-pressed={status === 'active'}><i className="dot-green" /><b>{count('active')}</b> Aktív kivitelezés</button><button onClick={() => setStatus(status === 'preparation' ? 'all' : 'preparation')} aria-pressed={status === 'preparation'}><i className="dot-yellow" /><b>{count('preparation')}</b> Előkészítés alatt</button><button onClick={() => setStatus(status === 'warranty' ? 'all' : 'warranty')} aria-pressed={status === 'warranty'}><i className="dot-blue" /><b>{count('warranty')}</b> Garanciális</button></div>
        <button className="milestone-counter" onClick={showMilestones}><Flag size={16} /><b>{flattenMilestones(filtered).filter(item => item.status !== 'completed').length}</b> Nyitott mérföldkő</button>
      </div>{advanced && <div className="advanced-filters"><label>Haladás<select value={health} onChange={event => setHealth(event.target.value)}><option value="all">Mindegyik</option><option value="normal">Haladás rendben</option><option value="critical">Kritikus fázis</option><option value="handover">Átadás előtt</option></select></label><label>Rendezés<select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Kiemelés szerint</option><option value="name">Név szerint</option><option value="deadline">Átadás szerint</option><option value="progress">Előrehaladás szerint</option></select></label><label className="editor-check"><input type="checkbox" checked={overdueOnly} onChange={event => setOverdueOnly(event.target.checked)} />Lejárt mérföldkővel</label><button className="subtle-button" onClick={reset}>Szűrők törlése</button></div>}
    </section>
    {loading ? <div className="projects-empty panel" role="status"><RefreshCw className="loading-icon" size={30} /><h2>Projektek betöltése…</h2></div> : error ? <div className="projects-empty panel"><p role="alert" className="form-error">{error}</p><button className="secondary-action" onClick={() => load()}><RefreshCw size={16} />Újrapróbálás</button></div> : !projects.length ? <section className="projects-empty panel"><FolderOpen size={44} /><h2>Itt kezdődik a következő projekted</h2><p>Hozz létre egy építkezést, és kövesd egy helyen a költségeket, a haladást és a szakipari határidőket.</p><div><button className="accent-button" onClick={newProject}><PlusCircle size={17} />Első projekt létrehozása</button><button className="secondary-action" disabled={importing} onClick={importSamples}><Database size={17} />{importing ? 'Betöltés…' : 'Mintaadatok betöltése'}</button></div><small>A mintaadatok a látványterv 2025-ös, fiktív projektjeit tartalmazzák.</small></section> : !filtered.length ? <section className="projects-empty panel"><Search size={35} /><h2>Nincs a szűrésnek megfelelő projekt</h2><p>Próbálj másik keresést, vagy töröld a szűrőket.</p><button className="secondary-action" onClick={reset}>Szűrők törlése</button></section> : <>
      {projects.some(project => project.isDemo) && <div className="sample-indicator"><Database size={12} />A munkaterület bemutatóadatokat is tartalmaz.</div>}
      {view === 'gantt' && <PhaseOverview projects={filtered} year={selectedYear} onOpen={openProject} />}
      <section className="project-overview" aria-labelledby="overview-title"><div className="overview-heading"><div><h2 id="overview-title">{view === 'gantt' ? 'Aktív Helyszínek Részletes Áttekintése' : 'Projektek Részletes Áttekintése'}</h2><p>Pénzügyi lehívás, létszám és közelgő műszaki mérföldkövek</p></div><span>Megjelenítve: <b>{view === 'table' ? filtered.length : cards.length}</b> {view === 'gantt' ? 'kiemelt projekt' : 'projekt'}{view === 'gantt' && filtered.length > cards.length && <button onClick={() => setView('cards')}>Összes ({filtered.length})</button>}</span></div>
        {view === 'table' ? <div className="panel"><ProjectTable projects={filtered} onOpen={openProject} /></div> : <div className="project-card-grid">{cards.map(project => <ProjectCard key={project.id} project={project} onOpen={openProject} />)}</div>}
      </section>
      <section className="milestones-panel panel" ref={milestonesRef} aria-labelledby="milestones-title"><header className="panel-header"><div className="section-title"><BellRing size={20} /><div><h2 id="milestones-title">Mérföldkövek &amp; Szakipari Határidők</h2><p>A kiválasztott projektek kivitelezési és átadási feladatai</p></div></div><div className="milestone-actions"><select aria-label="Mérföldkövek szűrése" value={milestoneFilter} onChange={event => { setMilestoneFilter(event.target.value); setAllMilestones(false); }}><option value="open">Nyitott mérföldkövek</option><option value="all">Összes mérföldkő</option><option value="overdue">Lejárt határidők</option></select><button className="icon-button" title="Új mérföldkő" aria-label="Új mérföldkő" onClick={() => newMilestone()}><Plus size={19} /></button></div></header>
        {filteredMilestones.length ? <><MilestoneTable milestones={allMilestones ? filteredMilestones : filteredMilestones.slice(0, 3)} onOpen={openMilestone} />{filteredMilestones.length > 3 && <button className="show-more" onClick={() => setAllMilestones(!allMilestones)}>{allMilestones ? 'Kevesebb megjelenítése' : `Összes mérföldkő megjelenítése (${filteredMilestones.length})`}{allMilestones ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>}</> : <p className="inline-empty">Nincs a szűrésnek megfelelő mérföldkő.</p>}
      </section>
      <footer className="projects-footer"><span>Aktív Munkaterület · Budaparl Építési Csoport</span><span>Mai nap: {today().replaceAll('-', '. ')}.</span></footer>
    </>}
    </main>
    {dialog?.type === 'project' && <ProjectForm project={dialog.project} onClose={() => setDialog(null)} onSaved={saved} />}
    {dialog?.type === 'details' && <ProjectDetails project={dialog.project} onClose={() => setDialog(null)} onEdit={project => setDialog({ type: 'project', project })} onNewMilestone={newMilestone} onMilestone={openMilestone} />}
    {dialog?.type === 'milestone' && <MilestoneForm projects={projects} milestone={dialog.milestone} projectId={dialog.projectId} onClose={() => setDialog(null)} onSaved={saved} />}
  </WorkspaceShell>;
}
