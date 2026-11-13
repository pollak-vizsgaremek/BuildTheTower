import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

test('project persistence, milestone updates, ownership and transactional sample import', { skip: !process.env.TEST_DB_NAME }, async t => {
  assert.match(process.env.TEST_DB_NAME, /_test$/);
  process.env.DB_NAME = process.env.TEST_DB_NAME;
  process.env.ACCESS_TOKEN_SECRET = 'project-integration-test-secret-at-least-32-characters';
  const { app } = await import('../../src/app.js');
  const { sequelize } = await import('../../src/utils/database.js');
  const { User } = await import('../../src/model/User.model.js');
  const { Project, Milestone } = await import('../../src/model/Project.model.js');
  const { generateAccessToken } = await import('../../src/utils/jwt.js');
  const { sampleProjects } = await import('../../src/data/sampleProjects.js');
  await sequelize.sync();
  const owners = [];
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/v1/projects`;
  t.after(async () => {
    for (const owner of owners) await owner.destroy();
    await new Promise(resolve => server.close(resolve));
    await sequelize.close();
  });
  for (let i = 0; i < 2; i++) { const id = randomUUID().slice(0, 10); owners.push(await User.create({ username: `proj_${id}`, email: `${id}@example.test`, privacyAcceptedAt: new Date(), role: 2 })); }
  const cookies = owners.map(owner => `btt_session=${generateAccessToken(owner)}`);
  const request = (path = '', method = 'GET', body, owner = 0) => fetch(url + path, {
    method, headers: { Cookie: cookies[owner], 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}),
  });
  assert.equal((await fetch(url)).status, 401);
  const values = { ...sampleProjects[0], ownerId: owners[1].id, isDemo: true };
  const created = await request('', 'POST', values);
  assert.equal(created.status, 201);
  const { project } = await created.json();
  assert.equal(project.ownerId, undefined);
  assert.equal(project.isDemo, false);
  assert.equal((await Project.findByPk(project.id)).ownerId, owners[0].id);
  assert.equal((await request('', 'POST', values)).status, 409);
  assert.equal((await request('', 'POST', { ...values, code: 'BAD', endDate: '2025-02-30' })).status, 400);
  assert.equal((await request(`/${project.id}`, 'PUT', values, 1)).status, 404);
  assert.equal((await (await request('', 'GET', null, 1)).json()).projects.length, 0);
  const milestoneValues = values.milestones[0];
  assert.equal((await request(`/${project.id}/milestones`, 'POST', milestoneValues, 1)).status, 404);
  const createdMilestone = await request(`/${project.id}/milestones`, 'POST', milestoneValues);
  assert.equal(createdMilestone.status, 201);
  const { milestone } = await createdMilestone.json();
  assert.equal((await request(`/${project.id}/milestones/${milestone.id}`, 'PUT', { ...milestoneValues, status: 'completed', notes: 'Műszaki átadás elfogadva.' })).status, 200);
  assert.equal((await request(`/${project.id}/milestones/${milestone.id}`, 'PUT', milestoneValues, 1)).status, 404);
  const stored = await Milestone.findByPk(milestone.id);
  assert.equal(stored.status, 'completed');
  assert.equal(stored.notes, 'Műszaki átadás elfogadva.');
  assert.equal((await request(`/${project.id}`, 'PUT', { ...values, name: 'Frissített projekt', progress: 82 })).status, 200);
  const listed = (await (await request()).json()).projects;
  assert.equal(listed[0].name, 'Frissített projekt');
  assert.equal(listed[0].progress, 82);
  assert.equal(typeof listed[0].budget, 'number');
  assert.equal(listed[0].milestones[0].notes, 'Műszaki átadás elfogadva.');
  assert.equal((await request('/samples', 'POST', {})).status, 409);
  const simultaneous = await Promise.all([request('/samples', 'POST', {}, 1), request('/samples', 'POST', {}, 1)]);
  assert.deepEqual(simultaneous.map(response => response.status).sort(), [201, 409]);
  const samples = (await (await request('', 'GET', null, 1)).json()).projects;
  assert.equal(samples.length, 7);
  assert.equal(samples.flatMap(item => item.milestones).length, 12);
  assert.equal(samples.every(item => item.isDemo), true);
});
