import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { UniqueConstraintError, ValidationError } from 'sequelize';
import { config } from './config.js';
import { authRouter } from './controller/auth.controller.js';
import { projectRouter } from './controller/project.controller.js';

export const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: config.origins, credentials: true }));
app.use((req, res, next) => {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && req.headers.origin && !config.origins.includes(req.headers.origin)) {
    return res.status(403).json({ message: 'Nem engedélyezett kérésforrás.' });
  }
  next();
});
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRouter);
app.use((_req, res) => res.status(404).json({ message: 'Nem található végpont.' }));
app.use((error, _req, res, _next) => {
  if (error instanceof UniqueConstraintError) return res.status(409).json({ message: 'Ez az e-mail cím vagy felhasználónév már foglalt.' });
  if (error instanceof ValidationError) return res.status(400).json({ message: 'A megadott adatok érvénytelenek.' });
  const status = error.status >= 400 && error.status < 500 ? error.status : error.status === 503 ? 503 : 500;
  if (status === 500) console.error('Szerverhiba:', error.name);
  res.status(status).json({ message: status === 500 ? 'Szerverhiba történt. Kérjük, próbáld újra később.' : error.type === 'entity.parse.failed' ? 'Hibás JSON kérés.' : error.message, fields: error.fields });
});
