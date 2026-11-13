import { useState } from 'react';
import { Save } from 'lucide-react';
import Dialog from '../Dialog';
import { projectsApi } from '../../lib/api';
import { today, projectStatuses, healthLabels } from '../../lib/projects';

export default function ProjectForm({ project, onClose, onSaved }) {
  const currentDate = today();
  const [values, setValues] = useState(project ? { ...project, budget: project.budget / 1000000, spent: project.spent / 1000000 } : {
    code: '', name: '', location: '', status: 'preparation', health: 'normal', startDate: currentDate, endDate: currentDate,
    budget: 0, spent: 0, progress: 0, completedProgress: 0, workers: 0, currentPhase: 'Előkészítés és tervezés', featured: true,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  function change(event) {
    const { name, value, type, checked } = event.target;
    setValues(current => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
    setFields(current => ({ ...current, [name]: '' }));
  }
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError(''); setFields({});
    const body = { ...values, budget: Math.round(Number(values.budget) * 100000000) / 100, spent: Math.round(Number(values.spent) * 100000000) / 100,
      progress: Number(values.progress), completedProgress: Number(values.completedProgress), workers: Number(values.workers) };
    try { await projectsApi(project ? `/${project.id}` : '', { method: project ? 'PUT' : 'POST', body: JSON.stringify(body) }); onSaved(); }
    catch (err) { setError(err.message); setFields(err.fields || {}); }
    finally { setBusy(false); }
  }
  const input = (name, label, attributes = {}) => <label className={`editor-field ${['name', 'location', 'currentPhase'].includes(name) ? 'field-span' : ''}`}>
    <span>{label}</span><input name={name} value={values[name]} onChange={change} required aria-invalid={Boolean(fields[name])} aria-describedby={fields[name] ? `project-${name}-error` : undefined} {...attributes} />
    {fields[name] && <small className="field-error" id={`project-${name}-error`}>{fields[name]}</small>}
  </label>;
  const select = (name, label, options) => <label className="editor-field"><span>{label}</span><select name={name} value={values[name]} onChange={change}>{Object.entries(options).map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  return <Dialog title={project ? 'Projekt szerkesztése' : 'Új projekt indítása'} onClose={() => !busy && onClose()} wide>
    <p className="dialog-intro">A projekt adatai a saját munkaterületedre kerülnek.</p>
    <form onSubmit={submit}><fieldset disabled={busy}><div className="editor-grid">
      {input('name', 'Projekt neve', { maxLength: 150, placeholder: 'Pl. Duna Pearl Lakópark B Épület' })}
      {input('code', 'Projektkód', { maxLength: 30, placeholder: `PRJ-${currentDate.slice(0, 4)}-01`, pattern: '[A-Za-z0-9_-]+' })}
      {select('status', 'Státusz', projectStatuses)}
      {input('location', 'Helyszín', { maxLength: 255, placeholder: 'Település, utca, házszám' })}
      {input('startDate', 'Kezdés', { type: 'date', min: '2000-01-01', max: '2100-12-31' })}
      {input('endDate', 'Tervezett átadás', { type: 'date', min: values.startDate, max: '2100-12-31' })}
      {input('budget', 'Költségkeret (millió Ft)', { type: 'number', min: 0, max: 999999, step: 0.01 })}
      {input('spent', 'Felhasznált keret (millió Ft)', { type: 'number', min: 0, max: 999999, step: 0.01 })}
      {input('progress', 'Előrehaladás (%)', { type: 'number', min: 0, max: 100 })}
      {input('completedProgress', 'Lezárt fázisok aránya (%)', { type: 'number', min: 0, max: values.progress })}
      {input('workers', 'Helyszíni létszám (fő)', { type: 'number', min: 0, max: 100000 })}
      {select('health', 'Haladás jelzése', healthLabels)}
      {input('currentPhase', 'Aktuális fázis', { maxLength: 200 })}
    </div><label className="editor-check"><input name="featured" type="checkbox" checked={values.featured} onChange={change} />Kiemelés a helyszínek áttekintésében</label>
      {error && <p role="alert" className="form-error">{error}</p>}
      <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Mégse</button><button className="accent-button" type="submit"><Save size={16} />{busy ? 'Mentés…' : 'Projekt mentése'}</button></div>
    </fieldset></form>
  </Dialog>;
}
