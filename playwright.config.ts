import { defineConfig, devices } from '@playwright/test'
import path from 'path'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    actionTimeout: 15000,
  },
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          executablePath: path.join(
            process.cwd(),
            '.playwright-browsers',
            'chromium-1217',
            'chrome-win64',
            'chrome.exe'
          ),
        },
      },
    },
  ],
webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: true,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})

