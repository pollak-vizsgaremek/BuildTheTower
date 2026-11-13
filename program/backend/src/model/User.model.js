import { DataTypes } from 'sequelize';
import { sequelize } from '../utils/database.js';

export const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
  fullName: { type: DataTypes.STRING(255), allowNull: true },
  password: { type: DataTypes.STRING(512), allowNull: true },
  googleId: { type: DataTypes.STRING(255), allowNull: true, unique: true },
  privacyAcceptedAt: { type: DataTypes.DATE, allowNull: false },
  role: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2 },
}, { tableName: 'users', timestamps: true });

export function publicUser(user) {
  return { id: user.id, username: user.username, email: user.email, fullName: user.fullName, role: user.role };
}
