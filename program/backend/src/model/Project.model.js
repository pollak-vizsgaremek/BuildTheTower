import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';
import { User } from './User.model.js';

export const Project = sequelize.define('Project', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  ownerId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' }, onDelete: 'CASCADE' },
  code: { type: DataTypes.STRING(30), allowNull: false },
  name: { type: DataTypes.STRING(150), allowNull: false },
  location: { type: DataTypes.STRING(255), allowNull: false },
  status: { type: DataTypes.ENUM('active', 'preparation', 'warranty', 'completed'), allowNull: false, defaultValue: 'preparation' },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY, allowNull: false },
  budget: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  spent: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
  progress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  completedProgress: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  workers: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  currentPhase: { type: DataTypes.STRING(200), allowNull: false },
  health: { type: DataTypes.ENUM('normal', 'critical', 'handover'), allowNull: false, defaultValue: 'normal' },
  featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  isDemo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, { tableName: 'projects', timestamps: true, indexes: [{ unique: true, fields: ['ownerId', 'code'] }] });

export const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  projectId: { type: DataTypes.UUID, allowNull: false, references: { model: Project, key: 'id' }, onDelete: 'CASCADE' },
  title: { type: DataTypes.STRING(200), allowNull: false },
  dueDate: { type: DataTypes.DATEONLY, allowNull: false },
  responsible: { type: DataTypes.STRING(150), allowNull: false },
  status: { type: DataTypes.ENUM('prepared', 'review', 'confirmed', 'completed'), allowNull: false, defaultValue: 'prepared' },
  notes: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
}, { tableName: 'project_milestones', timestamps: true, indexes: [{ fields: ['projectId', 'dueDate'] }] });

Project.hasMany(Milestone, { foreignKey: 'projectId', as: 'milestones', onDelete: 'CASCADE' });
Milestone.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export function publicProject(project) {
  const { ownerId: _owner, ...data } = project.get({ plain: true });
  return { ...data, budget: Number(data.budget), spent: Number(data.spent) };
}
