import test from 'node:test';
import assert from 'node:assert/strict';
import { validateProject, validateMilestone, validDate } from '../src/utils/projectValidation.js';
import { sampleProjects } from '../src/data/sampleProjects.js';

test('project validation rejects invalid dates, budgets, progress and unknown status', () => {
  const project = sampleProjects[0];
  assert.equal(validateProject(project).code, 'PRJ-2025-04');
  for (const change of [{ budget: -1 }, { budget: '120' }, { spent: Infinity }, { progress: 101 }, { progress: 1.5 }, { workers: -5 }, { status: 'admin' }, { endDate: '2025-02-30' }, { endDate: '2024-01-01' }, { completedProgress: 99 }, { name: '' }, { code: '<script>' }]) {
    assert.throws(() => validateProject({ ...project, ...change }), { status: 400 });
  }
  const data = validateProject({ ...project, ownerId: 'another-user', isDemo: true, role: 1 });
  assert.equal(data.ownerId, undefined);
  assert.equal(data.isDemo, undefined);
  assert.equal(validDate('2024-02-29'), true);
  assert.equal(validDate('2025-02-29'), false);
});

test('milestone validation and demonstration data satisfy the API contract', () => {
  for (const project of sampleProjects) {
    assert.doesNotThrow(() => validateProject(project));
    for (const milestone of project.milestones) assert.doesNotThrow(() => validateMilestone(milestone));
  }
  const milestone = sampleProjects[0].milestones[0];
  assert.throws(() => validateMilestone({ ...milestone, notes: 'x'.repeat(5001) }), { status: 400 });
  assert.throws(() => validateMilestone({ ...milestone, dueDate: 'tomorrow' }), { status: 400 });
  assert.throws(() => validateMilestone({ ...milestone, status: 'anything' }), { status: 400 });
});
