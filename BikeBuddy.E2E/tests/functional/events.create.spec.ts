import { expect, test } from '@playwright/test';

import { CreateEventPage } from '../../pages/CreateEventPage';
import { EventsPage } from '../../pages/EventsPage';

test('создание события через UI', async ({ page }) => {
  const eventsPage = new EventsPage(page);

  await eventsPage.goto();
  await expect(page).toHaveURL(/\/events(\/|$)/);

  await eventsPage.openCreate();
  await expect(page).toHaveURL(/\/events\/create(\/|$)/);

  const createPage = new CreateEventPage(page);

  const eventName = `E2E событие ${Date.now()}`;

  await createPage.fill({
    name: eventName,
    description: 'Создано Playwright E2E тестом (описание >= 20 символов)',
    participantsCount: 5,
  });

  await createPage.submitForm();

  // The UI navigates to /events after successful creation (see frontend EventForm).
  // We still keep a small fallback for direct details navigation.
  await expect(
    page,
    'After submit the app should navigate to /events (or /events/{id} in some flows)'
  ).toHaveURL(/\/events(\/|$)/);

  // Note: current UI navigates back to /events after create.
  // If it ever navigates directly to details, the title is rendered as a heading.
  if (/\/events\/[a-f0-9-]+/i.test(page.url())) {
    await expect(
      page.getByRole('heading', { name: eventName }),
      'Event title should be visible on details page'
    ).toBeVisible();
    return;
  }

  await expect(eventsPage.eventByName(eventName), 'Created event should be visible in the list').toBeVisible();
});
