# Perflens - Root Workspace Guidelines

Welcome to the **Perflens** monorepo workspace! This file contains essential instructions, conventions, and workspace commands for Claude / AI assistants working on this project.

## 🛠️ Essential Commands

- `npm run dev`: Start all apps (`web`, `api`, `worker`) in parallel with hot reloading.
- `npm run build`: Build all workspaces using `npm run build --workspaces`.
- `npm run lint`: Lint all workspaces using `npm run lint --workspaces`.

To target specific workspace packages:
- `npm run dev --workspace=apps/web` (Next.js Dashboard)
- `npm run dev --workspace=apps/api` (NestJS API Service)
- `npm run dev --workspace=apps/worker` (BullMQ / Lighthouse Worker)

## 📁 Monorepo Structure

- `apps/web`: Next.js 16 (App Router) frontend with NextAuth, TanStack Query, Recharts, Zustand, and Tailwind CSS.
- `apps/api`: NestJS 11 backend service providing API endpoints, database interactions via Prisma (`@prisma/adapter-pg`), and queue producers via BullMQ.
- `apps/worker`: Node.js queue consumer running Puppeteer and Lighthouse to execute site audits and update database records.
- `packages/config`: Shared configurations across workspaces.
- `packages/types`: Shared TypeScript models and interfaces (`@perflens/types`).
- `packages/ui`: Shared UI component library (`@perflens/ui`).

## 💻 Tech Stack & Versions

- **Node.js**: >= 20.x
- **React**: 19.2.4
- **Next.js**: 16.2.5
- **NestJS**: 11.0.1
- **Prisma**: 7.8.0 / 7.10.0 with PostgreSQL native adapter (`@prisma/adapter-pg`)
- **Queue System**: BullMQ 5.76.6 with Redis
- **Auditing**: Lighthouse 12.0.0 & Puppeteer 22.0.0

## 📐 Code Style & Conventions

1. **TypeScript First**: Strict typing is enabled. Always leverage `@perflens/types` for shared domain models (e.g. `AuditResult`, `WebVitals`, `AuditStatus`).
2. **Modular Architecture**:
   - `apps/api`: NestJS module structure (`src/<feature>/<feature>.module.ts`, controller, service).
   - `apps/web`: Next.js App Router (`src/app/...`), UI components in `src/components/`, client state with Zustand / TanStack Query.
3. **Database Changes**: Database schema edits should be applied through Prisma migrations. Always test database queries using the `@prisma/adapter-pg` driver pattern.
4. **Asynchronous Operations**: Audits are heavy operations. Never run Lighthouse directly inside API requests; dispatch jobs to BullMQ `audit-queue` for `apps/worker` to process.
