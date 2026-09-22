# CLAUDE.md - Perflens API Service Guidelines

This guide details instructions and standards for AI coding assistants working within `apps/api`.

## 🛠️ Common Commands

- `npm run dev` or `npm run start:dev`: Launch NestJS dev server with watch mode enabled.
- `npm run build`: Compile NestJS application to `dist/`.
- `npm run start:prod`: Start compiled output from `dist/main.js`.
- `npm run test`: Run unit tests via Jest.
- `npm run test:e2e`: Execute end-to-end integration tests.
- `npm run lint`: Run ESLint and apply fixes across `src/**/*.ts`.

## 🏗️ Architecture & Conventions

1. **NestJS Modules**: Organining code by feature domain (e.g. `audit/`, `project/`, `prisma/`).
   - Every feature must have a `<feature>.module.ts`, `<feature>.controller.ts`, and `<feature>.service.ts`.
2. **Database Integration**:
   - Use `PrismaService` (in `src/prisma/prisma.service.ts`) for all database operations.
   - Database operations use PostgreSQL connection pool through `@prisma/adapter-pg`.
3. **Queue Operations**:
   - Queue producer logic uses `@nestjs/bullmq` to push jobs to `audit-queue`.
   - Ensure payload passed to `audit-queue` includes `auditId` and target `url`.
4. **Shared Types**:
   - Import domain data models from `@perflens/types` when defining responses or data structures.

## ⚠️ Important Notes

- Do not perform synchronous heavy auditing inside NestJS controllers or services. Dispatch audit jobs asynchronously to BullMQ.
- Keep route handlers thin; delegate business logic to NestJS services.
