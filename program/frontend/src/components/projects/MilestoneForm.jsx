import { useState } from 'react';
import { Download, Save } from 'lucide-react';
import Dialog from '../Dialog';
import { projectsApi } from '../../lib/api';
import { today, milestoneStatuses, fullDate } from '../../lib/projects';

export default function MilestoneForm({ projects, milestone, projectId, onClose, onSaved }) {
  const [values, setValues] = useState(milestone || { title: '', dueDate: today(), responsible: '', status: 'prepared', notes: '' });
  const [selectedProjectId, setSelectedProjectId] = useState(milestone?.projectId || projectId || projects[0]?.id || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [fields, setFields] = useState({});
  const change = event => { setValues(current => ({ ...current, [event.target.name]: event.target.value })); setFields(current => ({ ...current, [event.target.name]: '' })); };
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError('');
    try { await projectsApi(`/${selectedProjectId}/milestones${milestone ? `/${milestone.id}` : ''}`, { method: milestone ? 'PUT' : 'POST', body: JSON.stringify(values) }); onSaved(); }
    catch (err) { setError(err.message); setFields(err.fields || {}); }
    finally { setBusy(false); }
  }
  function download() {
    const project = projects.find(item => item.id === selectedProjectId);
    const text = `MÉRFÖLDKŐ – MENTETT FELJEGYZÉS\n${project.name} (${project.code})\n\n${milestone.title}\nHatáridő: ${fullDate(milestone.dueDate)}\nFelelős: ${milestone.responsible}\nStátusz: ${milestoneStatuses[milestone.status]}\n\n${milestone.notes || 'Nincs feljegyzés.'}\n`;
    const url = URL.createObjectURL(new Blob(['\uFEFF', text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${project.code}-merfoldko.txt`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const input = (name, label, props = {}) => <label className={`editor-field ${name === 'title' ? 'field-span' : ''}`}><span>{label}</span>
    <input name={name} value={values[name]} onChange={change} required aria-invalid={Boolean(fields[name])} aria-describedby={fields[name] ? `milestone-${name}-error` : undefined} {...props} />
    {fields[name] && <small className="field-error" id={`milestone-${name}-error`}>{fields[name]}</small>}</label>;
  return <Dialog title={milestone ? 'Mérföldkő részletei és naplózása' : 'Új mérföldkő'} onClose={() => !busy && onClose()} wide>
    <p className="dialog-intro">Rögzítsd a szakipari határidőt, a felelőst és az aktuális állapotot.</p>
    <form onSubmit={submit}><fieldset disabled={busy}><div className="editor-grid">
      <label className="editor-field field-span"><span>Projekt</span><select value={selectedProjectId} disabled={Boolean(milestone)} required onChange={event => setSelectedProjectId(event.target.value)}>{projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label>
      {input('title', 'Mérföldkő / tevékenység', { maxLength: 200 })}
      {input('dueDate', 'Határidő', { type: 'date', min: '2000-01-01', max: '2100-12-31' })}
      {input('responsible', 'Felelős / alvállalkozó', { maxLength: 150 })}
      <label className="editor-field"><span>Státusz</span><select name="status" value={values.status} onChange={change}>{Object.entries(milestoneStatuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label className="editor-field field-span"><span>Feljegyzés / jegyzőkönyv szövege</span><textarea name="notes" value={values.notes} onChange={change} maxLength={5000} rows={4} /><small>A mentés a korábbi feljegyzést frissíti.</small></label>
    </div>{error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions">{milestone && <button className="secondary-action download-note" type="button" onClick={download}><Download size={16} />Mentett feljegyzés</button>}<button className="secondary-action" type="button" onClick={onClose}>Mégse</button><button className="accent-button" type="submit"><Save size={16} />{busy ? 'Mentés…' : 'Mérföldkő mentése'}</button></div>
    </fieldset></form>
  </Dialog>;
}
