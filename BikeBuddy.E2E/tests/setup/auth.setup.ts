import fs from 'fs/promises';
import path from 'path';

import { expect, test } from '@playwright/test';

import { LoginPage } from '../../pages/LoginPage';

test('auth: save storageState', async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  expect(email, 'E2E_EMAIL must be set in BikeBuddy.E2E/.env').toBeTruthy();
  expect(password, 'E2E_PASSWORD must be set in BikeBuddy.E2E/.env').toBeTruthy();

  const storageStatePath = path.resolve(__dirname, '../../playwright/.auth/user.json');
  await fs.mkdir(path.dirname(storageStatePath), { recursive: true });

  await page.goto('/');
  await page.getByRole('button', { name: 'Войти' }).click();

  const loginPage = new LoginPage(page);
  await loginPage.login(String(email), String(password));

  await expect(page, 'After login the app should redirect to /events').toHaveURL(/\/events(\/|$)/);

  await page.context().storageState({ path: storageStatePath });
});
