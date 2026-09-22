# CLAUDE.md - Shared Types Workspace Guidelines

Guidelines for maintaining shared TypeScript type definitions in `@perflens/types`.

## 🛠️ Commands

- `npm run type-check`: Verify TypeScript type safety (`tsc --noEmit`).
- `npm run lint`: Run ESLint across type files.

## 📐 Conventions

- Export all public types directly from `src/index.ts`.
- Ensure domain types match the database models defined in Prisma schemas and API contracts.
- Maintain strict non-breaking interface changes so `apps/web`, `apps/api`, and `apps/worker` stay in sync.
