# CLAUDE.md - Shared Config Workspace Guidelines

Guidelines for maintaining shared configuration files within `@perflens/config`.

## 🎯 Purpose

Centralize ESLint, Prettier, TypeScript, and Prisma configurations to maintain code style and tooling consistency across all apps and packages in the Perflens monorepo.

## 📐 Guidelines

- When introducing new linting rules or tsconfig options, verify compatibility across both Next.js (`apps/web`) and NestJS (`apps/api`).
- Keep shared configurations minimal and extendable so specific applications can customize settings when strictly necessary.
