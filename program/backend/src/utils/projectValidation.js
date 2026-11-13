import { AuthError } from './validation.js';

function text(body, key, max, fields, optional = false) {
  const value = typeof body[key] === 'string' ? body[key].trim() : '';
  if ((!optional && !value) || value.length > max) fields[key] = `A mező ${optional ? 'legfeljebb' : '1–'}${max} karakter lehet.`;
  return value;
}
export function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2000-01-01' || value > '2100-12-31') return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
function date(body, key, fields) {
  if (!validDate(body[key])) fields[key] = 'Érvényes dátum szükséges 2000 és 2100 között.';
  return body[key];
}
function number(body, key, max, fields, integer = false) {
  const value = body[key];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max || (integer && !Number.isInteger(value))) {
    fields[key] = `0 és ${max} közötti ${integer ? 'egész ' : ''}szám szükséges.`;
  }
  return value;
}
function choice(body, key, choices, fields) {
  if (!choices.includes(body[key])) fields[key] = 'Válassz érvényes értéket.';
  return body[key];
}
function finish(result, fields) {
  if (Object.keys(fields).length) throw new AuthError('Kérjük, ellenőrizd a megadott adatokat.', 400, fields);
  return result;
}
export function validateProject(input) {
  const body = input && typeof input === 'object' ? input : {};
  const fields = {};
  const result = {
    code: text(body, 'code', 30, fields).toUpperCase(), name: text(body, 'name', 150, fields),
    location: text(body, 'location', 255, fields), currentPhase: text(body, 'currentPhase', 200, fields),
    status: choice(body, 'status', ['active', 'preparation', 'warranty', 'completed'], fields),
    health: choice(body, 'health', ['normal', 'critical', 'handover'], fields),
    startDate: date(body, 'startDate', fields), endDate: date(body, 'endDate', fields),
    budget: number(body, 'budget', 999999999999, fields), spent: number(body, 'spent', 999999999999, fields),
    progress: number(body, 'progress', 100, fields, true), completedProgress: number(body, 'completedProgress', 100, fields, true),
    workers: number(body, 'workers', 100000, fields, true), featured: body.featured === true,
  };
  if (!/^[A-Z0-9_-]+$/.test(result.code)) fields.code = 'A projektkód betűt, számot, kötőjelet és aláhúzást tartalmazhat.';
  if (result.endDate < result.startDate) fields.endDate = 'A befejezés nem előzheti meg a kezdést.';
  if (result.completedProgress > result.progress) fields.completedProgress = 'A lezárt szakaszok aránya nem lehet nagyobb az előrehaladásnál.';
  return finish(result, fields);
}
export function validateMilestone(input) {
  const body = input && typeof input === 'object' ? input : {};
  const fields = {};
  return finish({
    title: text(body, 'title', 200, fields), dueDate: date(body, 'dueDate', fields),
    responsible: text(body, 'responsible', 150, fields), notes: text(body, 'notes', 5000, fields, true),
    status: choice(body, 'status', ['prepared', 'review', 'confirmed', 'completed'], fields),
  }, fields);
}
