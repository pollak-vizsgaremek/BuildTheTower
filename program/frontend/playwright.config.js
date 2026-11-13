import { defineConfig, devices } from '@playwright/test';
const port = process.env.E2E_PORT || '5173';
export default defineConfig({
  testDir: './tests', fullyParallel: false, workers: 1, timeout: 30000,
  use: { baseURL: `http://localhost:${port}`, channel: 'chrome', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1548, height: 1016 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', channel: 'chrome' } },
  ],
  webServer: { command: `npm run dev -- --host 127.0.0.1 --port ${port}`, url: `http://localhost:${port}`, reuseExistingServer: true },
});
