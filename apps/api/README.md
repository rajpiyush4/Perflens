# Perflens API Service (`apps/api`)

The backend REST API and queue orchestration service for the Perflens performance analytics platform, built with **NestJS 11** and **Prisma ORM**.

---

## 🎯 Features

- **Project & Audit Management**: Endpoints for creating projects, retrieving performance audit histories, and triggering new performance scans.
- **Queue Dispatcher**: Integration with **BullMQ** to enqueue audit jobs into the `audit-queue` for processing by background workers.
- **Database Access**: Relational database operations using **Prisma 7** with PostgreSQL adapter (`@prisma/adapter-pg`).
- **Database Seeding**: Includes custom seed scripts for populating development environments.

---

## 🚀 Tech Stack

- **Framework**: NestJS 11
- **Database ORM**: Prisma 7 with PostgreSQL adapter (`@prisma/adapter-pg` & `pg`)
- **Queue System**: BullMQ 5 & ioredis
- **Testing**: Jest & Supertest

---

## 🛠️ Scripts

```bash
# Start in watch/development mode
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start:prod

# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Code formatting & linting
npm run lint
npm run format
```

---

## 📂 Directory Structure

```
src/
├── app.controller.ts     # Root controller
├── app.module.ts         # Root NestJS module
├── app.service.ts        # Health & info services
├── audit/                # Audit module, controller, service
├── project/              # Project management module
├── prisma/               # Prisma database service & module
├── common/               # Shared utilities & interceptors
├── main.ts               # Application entry point
└── seed.ts               # Database seed script
```

---

## ⚙️ Environment Variables

Set up a `.env` file in `apps/api` or root with:

```env
DATABASE_URL="postgresql://perflens_user:perflens_password@localhost:5432/perflens_db?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
PORT=3001
```
