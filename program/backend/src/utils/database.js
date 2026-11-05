import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "btt",
  process.env.DB_USERNAME || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  },
);
