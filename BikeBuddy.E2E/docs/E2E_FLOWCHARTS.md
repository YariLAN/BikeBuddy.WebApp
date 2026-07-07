# E2E Flowcharts (Playwright)

Этот файл содержит схемы (flowchart) основных E2E-сценариев.

## Create Event flow

```mermaid
flowchart TD
  A([Start: test "создание события через UI"]) --> B[Open /events]
  B --> C{On events page?}
  C -- yes --> D[Click "Создать событие"]
  C -- no --> C1[Fail: toHaveURL(/events)]

  D --> E{On /events/create?}
  E -- yes --> F[Fill form fields]
  E -- no --> E1[Fail: toHaveURL(/events/create)]

  F --> G[Click submit]
  G --> H{Where did we navigate?}

  H -- "/events/{id}" --> I[Assert event title visible]
  H -- "/events" --> J[Assert created event visible in list]
  H -- other --> K[Poll URL until details/list or timeout]
  K --> H

  I --> L([End])
  J --> L
```

### Notes
- В тесте не используются `waitForTimeout()`; ожидания строятся через web-first `expect(...)` и `expect.poll(...)`.
- Если UI будет возвращать детальный ID другим паттерном URL — обновим условие ветвления в тесте.
