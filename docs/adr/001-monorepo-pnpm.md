# ADR 001: Adoption of a Monorepo with PNPM Workspaces

## Date

March 7, 2026

## Status

Accepted

## Context

The Igris Platform is a complex multiplatform ecosystem. It requires coordination between a backend API (Node.js/Fastify), web interfaces (React), mobile applications (React Native), and an isolated artificial intelligence engine (Python).

Maintaining multiple separate repositories (Polyrepo) would create friction when sharing base configurations (such as TypeScript and ESLint) and global typings between the backend and frontend, in addition to making integration testing more difficult.

## Decision

We decided to adopt a **Monorepo architecture managed with PNPM Workspaces**. The project structure is strictly divided into:

* `apps/`: Executable end-user applications (api, web, mobile).
* `packages/`: Shared libraries and configurations (db, ui, configs).
* `services/`: Microservices written in other languages that have their own dependency managers (such as the Python ML engine).

## Consequences

### Positive

* **Code Sharing:** Type definitions, Drizzle ORM schemas, and UI components can be imported internally without the need to publish packages to NPM.
* **Atomic Commits:** Changes to the API contract and the corresponding frontend adaptations can be submitted in the same commit (single Pull Request).
* **Efficiency:** PNPM uses hard links, saving disk space and significantly speeding up dependency installation.

### Negative (Trade-offs)

* A higher initial learning curve for managing cross-package dependencies.
* The need to configure more sophisticated CI/CD pipelines (GitHub Actions) to ensure deployments are triggered only for applications (`apps`) that have actually changed.
