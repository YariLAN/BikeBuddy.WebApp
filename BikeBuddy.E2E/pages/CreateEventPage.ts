import type { Locator, Page } from '@playwright/test';

export type CreateEventData = {
  name: string;
  description: string;
  participantsCount: number;
};

export class CreateEventPage {
  readonly page: Page;

  readonly name: Locator;
  readonly description: Locator;
  readonly participantsCount: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;

    // The form fields are rendered with labels via RenderFormField.
    this.name = page.getByLabel('Название');
    this.description = page.getByLabel('Описание');

    // Label in UI: "Количество участников заезда (включая вас)"
    this.participantsCount = page.getByLabel(/Количество участников/i);

    this.submit = page.getByRole('button', { name: 'Создать событие' });
  }

  async fill(data: CreateEventData) {
    await this.name.fill(data.name);
    await this.description.fill(data.description);
    await this.participantsCount.fill(String(data.participantsCount));
  }

  async submitForm() {
    await this.submit.click();
  }
}
