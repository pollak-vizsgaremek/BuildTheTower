import { Project, Milestone, publicProject } from '../model/Project.model.js';
import { User } from '../model/User.model.js';
import { sequelize } from '../utils/database.js';
import { AuthError } from '../utils/validation.js';
import { validateProject, validateMilestone } from '../utils/projectValidation.js';
import { sampleProjects } from '../data/sampleProjects.js';

export async function findProject(ownerId, id, options = {}) {
  const project = await Project.findOne({ where: { id, ownerId }, ...options });
  if (!project) throw new AuthError('A projekt nem található.', 404);
  return project;
}
export async function listProjects(ownerId) {
  const projects = await Project.findAll({ where: { ownerId }, include: [{ model: Milestone, as: 'milestones' }],
    order: [['createdAt', 'ASC'], ['code', 'ASC'], [{ model: Milestone, as: 'milestones' }, 'dueDate', 'ASC']] });
  return projects.map(publicProject);
}
export async function saveProject(ownerId, id, body) {
  const values = validateProject(body);
  try {
    if (!id) return publicProject(await Project.create({ ...values, ownerId }));
    const project = await findProject(ownerId, id);
    await project.update(values);
    return publicProject(project);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') throw new AuthError('Ez a projektkód már használatban van.', 409, { code: 'Válassz másik projektkódot.' });
    throw error;
  }
}
export async function saveMilestone(ownerId, projectId, id, body) {
  await findProject(ownerId, projectId);
  const values = validateMilestone(body);
  if (!id) return Milestone.create({ ...values, projectId });
  const milestone = await Milestone.findOne({ where: { id, projectId } });
  if (!milestone) throw new AuthError('A mérföldkő nem található.', 404);
  return milestone.update(values);
}
export async function importSamples(ownerId) {
  // Lock the owner, so simultaneous imports cannot duplicate the demonstration dataset.
  await sequelize.transaction(async transaction => {
    await User.findByPk(ownerId, { transaction, lock: transaction.LOCK.UPDATE });
    if (await Project.count({ where: { ownerId }, transaction })) throw new AuthError('Mintaadatok csak üres projektlistába tölthetők be.', 409);
    for (const { milestones, ...data } of sampleProjects) {
      const project = await Project.create({ ...data, ownerId, isDemo: true }, { transaction });
      await Milestone.bulkCreate(milestones.map(item => ({ ...item, projectId: project.id })), { transaction });
    }
  });
  return listProjects(ownerId);
}
