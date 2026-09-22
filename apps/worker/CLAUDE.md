# CLAUDE.md - Perflens Worker Guidelines

This document provides developer rules and architectural context for `apps/worker`.

## 🛠️ Commands

- `npm run dev`: Start worker using `ts-node src/index.ts`.
- `npm run build`: Compile TypeScript into `dist/`.
- `npm run start`: Launch compiled production worker (`dist/index.js`).

## 🏗️ Architecture & Operations

- **Queue Name**: `audit-queue`
- **Database Client**: Uses `@prisma/adapter-pg` pool connected to PostgreSQL.
- **Audit Steps**:
  1. Job received -> Audit status set to `RUNNING`.
  2. Launch Puppeteer -> Execute Lighthouse audit on target URL.
  3. Extract Lighthouse Category Scores (Performance, Accessibility, Best Practices, SEO) & Web Vitals (LCP, FCP, CLS, TTI, TBT, INP).
  4. Save scores and Web Vitals record in DB -> Audit status set to `COMPLETED`.
  5. Close Puppeteer browser in `finally` block to prevent memory leaks.
  6. On failure -> Update status to `FAILED` and log error.

## ⚠️ Important Rules

- **Concurrency Limit**: Keep worker concurrency strictly bounded (currently 2) to maintain reliable performance benchmarks.
- **Resource Management**: ALWAYS ensure `browser.close()` is called in a `finally` block to prevent orphaned Chromium processes.
- **Health Verification**: Retain memory and load checks prior to running heavy Lighthouse jobs.
