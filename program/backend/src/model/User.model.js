import { DataTypes } from "sequelize";
import { ModelDefined, Optional } from "sequelize";
import { sequelize } from "../utils/database.js";
import UserAttributes from "../types/User.js";

export const UserModel = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(512),
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  },
);
