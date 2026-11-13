import { config, validateConfig } from './config.js';
import { app } from './app.js';
import { sequelize } from './utils/database.js';

try {
  validateConfig();
  await sequelize.authenticate();
  // Create missing tables only. Never alter or drop existing application data at startup.
  await sequelize.sync();
  const server = app.listen(config.port, () => console.log(`Backend: http://localhost:${config.port}`));
  const stop = () => server.close(async () => { await sequelize.close(); process.exit(0); });
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
} catch (error) {
  console.error(`Nem sikerült elindítani a backendet: ${error.message}`);
  await sequelize.close();
  process.exitCode = 1;
}
