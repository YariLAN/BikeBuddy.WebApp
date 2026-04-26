---
name: crud-vertical-slice
description: Implements end-to-end .NET feature flow from controller endpoint to application service, repository, and DTO mapping with CQRS-style command/query support. Use when user asks to add or modify domain entity logic across API, service layer, repository interfaces/implementations, and domain-to-contract mapping in BikeBuddy-style architecture.
---

# CRUD Vertical Slice

## Purpose

Build a complete feature slice for a domain entity through:
- controller endpoint
- application service (interface + implementation)
- command/query models
- repository contract + repository implementation
- domain-to-contract (DTO) mapping

Default style is aligned to BikeBuddy project patterns.  
If a pattern is missing, use the fallback rules in this skill.

## Activation Triggers

Apply this skill when user asks to:
- add endpoint/controller action
- add service and its interface
- implement command/query flow
- add repository method or new repository
- map Domain models to Contract DTOs
- implement end-to-end feature for an entity

## Discovery First (Mandatory)

Before editing:
1. Identify entity/module boundary (e.g. `Event`, `Chat`, `Profile`, `Auth`).
2. Locate nearest existing examples in:
   - `src/BikeBuddy.API/Controllers`
   - `src/BikeBuddy.Application/Services`
   - `src/BikeBuddy.Infrastructure.PostgreSQL/Repositories`
   - `src/BikeBuddy.Application/Mappers` (or equivalent mapper location)
   - `src/BikeBuddy.Contracts`
3. Mirror current naming, folder structure, DI style, and result/error handling.
4. Prefer extending existing abstractions over creating new ones.

## Output Contract

For each request, produce:
1. Endpoint in existing controller or new controller action.
2. Service interface and implementation in `BikeBuddy.Application`.
3. Command/Query object(s) used by service.
4. Repository interface updates in Application layer.
5. Repository implementation updates in Infrastructure layer.
6. Domain -> DTO mapper changes.
7. DI registrations if required.
8. Build/test verification commands and status.

## Naming Rules

Use existing naming conventions first. If absent, apply:
- Service folder: `<FeatureName>Service`
- Service class: `<FeatureName>Service`
- Service interface: `I<FeatureName>Service`
- Command: `<Action><Entity>Command`
- Query: `<Action><Entity>Query`
- Repository interface: `I<Entity>Repository` or existing scoped repository
- Mapper: `<Entity>Mapper`

Examples:
- `CreateEventService`, `ICreateEventService`, `CreateEventCommand`
- `GetChatMessagesService`, `IGetChatMessagesService`, `GetChatMessagesQuery`

## CQRS Rules

- **Command**: state-changing operations (create/update/delete/join/leave/confirm/cancel).
- **Query**: read-only operations (get/list/details/history).
- Do not mix mutation logic into query handlers/services.
- Keep command/query payloads explicit; avoid passing raw controller DTOs deep into domain logic.

## Implementation Workflow

Use this checklist and keep exactly one item in progress.

```text
Feature Slice Progress
- [ ] 1. Analyze existing module patterns
- [ ] 2. Add/extend contract DTOs
- [ ] 3. Add command/query models
- [ ] 4. Add service interface
- [ ] 5. Implement service logic
- [ ] 6. Extend repository interface
- [ ] 7. Implement repository method
- [ ] 8. Add/update mapper
- [ ] 9. Wire endpoint/controller action
- [ ] 10. Register DI (if needed)
- [ ] 11. Build and run focused tests
```

## Layer-by-Layer Rules

### 1) Controller / Endpoint

- Reuse existing controller if module already exists.
- Keep controller thin: validate input, call service, map result to HTTP response.
- Do not place business logic in controller.
- Use existing project response conventions (status codes, error envelopes, problem details).

### 2) Application Service

- Always create/update `I...Service` contract with async signatures.
- Implementation orchestrates:
  - command/query validation (if project does this here)
  - repository calls
  - domain rules invocation
  - mapper conversion to contract DTO
- Do not leak infrastructure details from service.

### 3) Command / Query Models

- Place near feature service/module according to current project layout.
- Keep immutable where practical.
- Include only fields needed for use case.

### 4) Repository Contract

- Define repository method in Application layer interface.
- Method names should reflect intent (`Create...`, `Get...`, `Update...`, `Exists...`).
- Return domain model/value objects where possible, not transport DTOs.

### 5) Repository Implementation

- Implement in Infrastructure repository matching interface.
- Keep SQL/ORM-specific code only here.
- Preserve cancellation token flow and async API.
- If extending existing repository, follow local method ordering/style.

### 6) Mapping Domain -> Contract

- Mapping must be explicit and deterministic.
- Add/extend mapper methods instead of ad-hoc mapping in controllers/services.
- Ensure nested value objects and enums are mapped consistently.

## Fallback Rules (When Project Pattern Is Unclear)

1. Keep endpoint thin and push logic into service.
2. Introduce separate command/query model per use case.
3. Add repository methods at interface first, then implementation.
4. Centralize mapping in mapper classes.
5. Use async + cancellation token on IO boundaries.

## Quality Gate (Mandatory Before Final Response)

Run:
1. Build for affected solution/project.
2. Focused tests for touched module (if available).
3. Linter/analyzers if configured.

If any command fails:
- include exact failing step
- fix code
- rerun until green or clearly document blocker

## Final Response Format

When finishing a task with this skill, respond with:
1. Changed files grouped by layer (API / Application / Infrastructure / Contracts).
2. Short explanation of business flow (`endpoint -> service -> repository -> mapper`).
3. Verification commands executed and outcomes.
4. Any assumptions or TODOs that need user decision.

## Anti-Patterns (Do Not Do)

- Fat controllers with business logic.
- Repository returning transport DTOs directly (unless project explicitly does this).
- Mixing command and query responsibilities.
- Hidden mapping inside random service/controller blocks.
- Breaking existing naming conventions without reason.

