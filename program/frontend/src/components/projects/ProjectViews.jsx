import { ArrowRight, Building2, MapPin, Pencil, Plus, UsersRound, CalendarDays } from 'lucide-react';
import Dialog from '../Dialog';
import { day, fullDate, money, quarter, projectStatuses, healthLabels, milestoneStatuses, isOverdue } from '../../lib/projects';

export function StatusBadge({ value, milestone = false }) {
  return <span className={`status-badge status-${value}`}>{(milestone ? milestoneStatuses : projectStatuses)[value] || healthLabels[value]}</span>;
}
export function ProgressBar({ value, segments, green = false, label = 'Előrehaladás' }) {
  return <div className={`project-progress ${green ? 'progress-green' : ''}`} role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
    {segments ? <><span className="segment-done" style={{ width: `${segments}%` }} /><span className="segment-active" style={{ width: `${value - segments}%` }} /></> : <span style={{ width: `${value}%` }} />}
  </div>;
}
export function PhaseOverview({ projects, year, onOpen }) {
  const inProgress = projects.filter(project => project.status === 'active' && project.health !== 'handover');
  const rows = inProgress.filter(project => project.featured);
  const displayed = (rows.length ? rows : inProgress).slice(0, 4);
  return <section className="phase-panel panel" aria-labelledby="phase-title"><header className="panel-header"><div className="section-title"><span className="title-marker" /><div><h2 id="phase-title">Kivitelezési Fázisok &amp; Ütemterv{year !== 'all' ? ` (${year})` : ''}</h2><p>Átfogó mérföldkövek és fázis előrehaladás</p></div></div>
    <div className="phase-legend"><span><i className="legend-done" />Befejezett</span><span><i className="legend-active" />Aktív fázis</span><span><i className="legend-next" />Következő</span></div></header>
    {displayed.length ? displayed.map(project => <button className="phase-row" key={project.id} onClick={() => onOpen(project)}>
      <div className="phase-row-heading"><Building2 size={16} /><strong>{project.name}</strong><span className="project-code">{project.code}</span><span className="phase-health"><StatusBadge value={project.health} /><b>{project.progress}%</b></span></div>
      <ProgressBar value={project.progress} segments={project.completedProgress} label={`${project.name} előrehaladása`} />
      <div className="phase-caption"><span>Aktuális fázis: {project.currentPhase}</span><span>Várható átadás: {quarter(project.endDate)}</span></div>
    </button>) : <p className="inline-empty">A szűrésben nincs folyamatban lévő kivitelezés.</p>}
  </section>;
}
export function ProjectCard({ project, onOpen }) {
  const next = project.milestones?.find(item => item.status !== 'completed');
  const spentPercent = project.budget ? Math.min(100, Math.round(project.spent / project.budget * 100)) : 0;
  return <article className="project-card" aria-label={project.name}>
    <div className="project-card-heading"><div><span className="card-code">{project.code}</span><h3>{project.name}</h3></div><StatusBadge value={project.health === 'normal' ? project.status : project.health} /></div>
    <p className="project-address"><MapPin size={12} />{project.location}</p>
    <div className="project-finance"><div><span>KÖLTSÉGKERET<br />FELHASZNÁLÁS</span><b>{money(project.spent)} / {money(project.budget)}</b></div>
      <ProgressBar value={spentPercent} green={project.health === 'handover'} label={`${project.name} költségkeret felhasználása`} />
      <div className="progress-caption"><span>Előrehaladás</span><b className={project.health === 'handover' ? 'text-green' : ''}>{project.progress}%</b></div>
    </div><div className="project-workers"><span>Helyszíni létszám:</span><b>{project.workers} fő</b></div>
    <footer><span>Mérföldkő: {next ? day(next.dueDate) : 'Nincs nyitott'}</span><button onClick={() => onOpen(project)} aria-label={`${project.name} megtekintése`}>Megtekintés <ArrowRight size={14} /></button></footer>
  </article>;
}
export function ProjectTable({ projects, onOpen }) {
  return <div className="table-scroll" role="region" aria-label="Projektek táblázata" tabIndex={0}><table className="data-table project-table"><thead><tr><th>Projekt</th><th>Helyszín</th><th>Státusz</th><th>Előrehaladás</th><th>Átadás</th><th>Művelet</th></tr></thead><tbody>
    {projects.map(project => <tr key={project.id}><td><small>{project.code}</small><strong>{project.name}</strong></td><td>{project.location}</td><td><StatusBadge value={project.status} /></td><td><span>{project.progress}%</span><ProgressBar value={project.progress} /></td><td>{fullDate(project.endDate)}</td><td><button className="table-action" onClick={() => onOpen(project)} aria-label={`${project.name} megtekintése`}>Részletek <ArrowRight size={13} /></button></td></tr>)}
  </tbody></table></div>;
}
export function MilestoneTable({ milestones, onOpen }) {
  return <div className="table-scroll" role="region" aria-label="Mérföldkövek táblázata" tabIndex={0}><table className="data-table milestone-table"><thead><tr><th>Dátum</th><th>Projekt</th><th>Mérföldkő / tevékenység</th><th>Felelős<br />alvállalkozó</th><th>Státusz</th><th>Művelet</th></tr></thead><tbody>
    {milestones.map(milestone => <tr key={milestone.id}><td className={isOverdue(milestone) ? 'overdue' : ''}><time dateTime={milestone.dueDate}>{fullDate(milestone.dueDate)}</time><small>{new Intl.DateTimeFormat('hu-HU', { weekday: 'long' }).format(new Date(`${milestone.dueDate}T12:00:00`))}</small></td>
      <td><strong>{milestone.project.name}</strong></td><td>{milestone.title}</td><td>{milestone.responsible}</td><td><StatusBadge value={milestone.status} milestone /></td><td><button className="table-action" onClick={() => onOpen(milestone)} aria-label={`${milestone.title} részletei`}>{milestone.status === 'prepared' ? 'Naplózás' : milestone.status === 'review' ? 'Jegyzőkönyv' : 'Részletek'}</button></td></tr>)}
  </tbody></table></div>;
}
export function ProjectDetails({ project, onClose, onEdit, onNewMilestone, onMilestone }) {
  return <Dialog title={project.name} onClose={onClose} wide><div className="detail-top"><span className="project-code">{project.code}</span><StatusBadge value={project.status} />{project.isDemo && <span className="demo-label">Mintaadat</span>}</div>
    <p className="detail-location"><MapPin size={16} />{project.location}</p><div className="detail-metrics"><div><span>Költségkeret</span><strong>{money(project.budget)}</strong></div><div><span>Felhasználás</span><strong>{money(project.spent)}</strong></div><div><span>Előrehaladás</span><strong>{project.progress}%</strong></div></div>
    <ProgressBar value={project.progress} segments={project.completedProgress} /><p className="detail-phase">Aktuális fázis: <strong>{project.currentPhase}</strong></p>
    <div className="detail-dates"><span><CalendarDays size={16} />{fullDate(project.startDate)} – {fullDate(project.endDate)}</span><span><UsersRound size={16} />{project.workers} fő</span></div>
    <div className="detail-section-heading"><h3>Mérföldkövek</h3><button className="secondary-action" onClick={() => onNewMilestone(project.id)}><Plus size={15} />Új mérföldkő</button></div>
    <div className="detail-milestones">{project.milestones?.length ? project.milestones.map(milestone => <button key={milestone.id} onClick={() => onMilestone({ ...milestone, project })}><span><b>{milestone.title}</b><small>{fullDate(milestone.dueDate)} · {milestone.responsible}</small></span><StatusBadge value={milestone.status} milestone /></button>) : <p className="inline-empty">Még nincs mérföldkő ehhez a projekthez.</p>}</div>
    <div className="dialog-actions"><button className="secondary-action" onClick={onClose}>Bezárás</button><button className="accent-button" onClick={() => onEdit(project)}><Pencil size={16} />Projekt szerkesztése</button></div>
  </Dialog>;
}
