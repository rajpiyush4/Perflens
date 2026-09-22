# CLAUDE.md - Perflens Web Workspace Guidelines

This document provides developer guidelines, environment setup info, and code style rules for working inside `apps/web`.

## 🛠️ Essential Commands

- `npm run dev`: Launch Next.js dev server (usually on http://localhost:3000).
- `npm run build`: Create production build with Next.js compiler.
- `npm run start`: Run production build.
- `npm run lint`: Execute Next.js ESLint checker.

## 🎨 Design & UI Philosophy

1. **Rich Aesthetics & Dark Mode**: Perflens uses a modern dark-themed interface with vibrant color accents (emerald for high scores, amber/red for warnings/failures).
2. **Component Library**: Use standard Radix UI primitives, Lucide React icons, and Tailwind CSS utility classes.
3. **Charts**: Use `Recharts` for audit score trends, Web Vitals metrics, and performance charts.
4. **Data Fetching**: Use `@tanstack/react-query` for client-side API requests, polling active audits, and caching results.

## 📐 Conventions & Best Practices

- **App Router**: Store routes inside `src/app/`. Keep route handlers thin and organize reusable components in `src/components/`.
- **Client vs Server Components**: Mark interactive client components explicit with `'use client'`. Keep data-fetching layouts server-rendered where appropriate.
- **State Management**: Use Zustand for global UI state and React Query for server state.
- **Shared Types**: Import shared models from `@perflens/types`.
