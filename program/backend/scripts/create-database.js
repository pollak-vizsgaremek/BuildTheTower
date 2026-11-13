import 'dotenv/config';
import mysql from 'mysql2/promise';
const name = process.env.DB_NAME || 'btt';
if (!/^[a-zA-Z0-9_]+$/.test(name)) throw new Error('A DB_NAME csak betűt, számot és aláhúzást tartalmazhat.');
const connection = await mysql.createConnection({ host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USERNAME || 'root', password: process.env.DB_PASSWORD || '' });
try {
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  console.log(`Az adatbázis rendelkezésre áll: ${name}`);
} finally { await connection.end(); }
