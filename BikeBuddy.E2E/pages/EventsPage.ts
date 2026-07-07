import type { Locator, Page } from '@playwright/test';

export class EventsPage {
  readonly page: Page;

  readonly createEventButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.createEventButton = page.getByRole('button', { name: 'Создать событие' });
  }

  async goto() {
    await this.page.goto('/events');
  }

  async openCreate() {
    await this.createEventButton.click();
  }

  eventByName(name: string): Locator {
    // Fallback: we don't yet have a stable test id for event cards.
    // If the UI changes, replace this with getByTestId('event-card') + filter.
    return this.page.getByRole('link').filter({ hasText: name }).first();
  }
}
