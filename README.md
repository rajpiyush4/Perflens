# Perflens 🚀

**Frontend Performance Analytics & Benchmarking Platform**

Perflens is an end-to-end, monorepo-based web application performance monitoring and auditing platform. It enables teams to run automated Lighthouse performance audits, measure Core Web Vitals (LCP, FCP, CLS, TTI, TBT, INP), track historical trends over time, and manage projects in real time.

---

## 🏗️ Architecture & Monorepo Overview

Perflens is structured as an `npm` workspace monorepo:

```
Perflens/
├── apps/
│   ├── api/        # NestJS REST API server & BullMQ queue manager
│   ├── web/        # Next.js 16 (App Router) full-stack analytics dashboard
│   └── worker/     # Node.js background worker executing Lighthouse & Puppeteer audits
└── packages/
    ├── config/     # Shared configuration (ESLint, TypeScript, Prisma)
    ├── types/      # Shared TypeScript type definitions & data interfaces
    └── ui/         # Shared React component library
```

---

## ⚡ Tech Stack

- **Frontend (`apps/web`)**: Next.js 16 (App Router), React 19, Tailwind CSS v4, TanStack React Query v5, Recharts, Zustand, NextAuth.js v4, Lucide React, Radix UI / Shadcn.
- **Backend API (`apps/api`)**: NestJS 11, Prisma ORM 7 (`@prisma/adapter-pg`), BullMQ 5, PostgreSQL, Redis (`ioredis`), RxJS.
- **Background Worker (`apps/worker`)**: Node.js, BullMQ, Lighthouse 12, Puppeteer 22, Prisma Client.
- **Shared Packages**: `@perflens/types`, `@perflens/config`, `@perflens/ui`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **PostgreSQL**: `v15` or higher running on port `5432`
- **Redis**: `v7` or higher running on port `6379`

### Environment Setup

Ensure PostgreSQL and Redis instances are running (or use Docker):

```bash
docker-compose up -d
```

### Installation

Install dependencies at the monorepo root:

```bash
npm install
```

---

## 🛠️ Development & Commands

Run all applications and services in parallel across workspaces:

```bash
# Start dev servers for web, api, and worker in parallel
npm run dev

# Build all applications and packages
npm run build

# Run linting across all packages
npm run lint
```

### Running Workspaces Individually

```bash
# Run Next.js Web Frontend
npm run dev --workspace=apps/web

# Run NestJS API Server
npm run dev --workspace=apps/api

# Run Background Worker
npm run dev --workspace=apps/worker
```

---

## 📄 License

[MIT](LICENSE)
