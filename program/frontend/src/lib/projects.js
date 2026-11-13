export const projectStatuses = { active: 'Kivitelezés', preparation: 'Előkészítés alatt', warranty: 'Garanciális', completed: 'Befejezett' };
export const healthLabels = { normal: 'Haladás rendben', critical: 'Kritikus fázis', handover: 'Átadás előtt' };
export const milestoneStatuses = { prepared: 'Előkészítve', review: 'Ellenőrzés alatt', confirmed: 'Visszaigazolva', completed: 'Teljesítve' };
export const money = value => `${new Intl.NumberFormat('hu-HU', { maximumFractionDigits: 1 }).format(Number(value) / 1000000)} M Ft`;
export const day = value => value ? new Intl.DateTimeFormat('hu-HU', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`)) : 'Nincs megadva';
export const fullDate = value => new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
export const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Budapest' }).format(new Date());
export const quarter = value => `${value.slice(0, 4)}. Q${Math.ceil(Number(value.slice(5, 7)) / 3)}`;
export const normalized = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('hu');
export const isOverdue = milestone => milestone.status !== 'completed' && milestone.dueDate < today();
export const flattenMilestones = projects => projects.flatMap(project => (project.milestones || []).map(milestone => ({ ...milestone, project }))).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
export function matchesSearch(project, query) {
  const haystack = normalized([project.name, project.code, project.location, project.currentPhase, ...(project.milestones || []).flatMap(m => [m.title, m.responsible])].join(' '));
  return normalized(query).split(/\s+/).every(word => haystack.includes(word));
}
