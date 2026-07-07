import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;

    const form = page.locator('form');

    // Prefer user-visible locators; keep a minimal fallback for the current markup.
    this.email = form.getByPlaceholder('Введите логин или email');
    this.password = form.getByLabel('Пароль').or(form.locator('#password'));
    this.submit = form.getByRole('button', { name: 'Войти', exact: true });
  }

  async goto() {
    // The app currently opens the login dialog from the root page.
    await this.page.goto('/');
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
