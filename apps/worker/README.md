# Perflens Background Audit Worker (`apps/worker`)

The background job worker for Perflens responsible for executing automated **Lighthouse** performance audits via **Puppeteer** and storing performance metrics in **PostgreSQL**.

---

## 🎯 Key Responsibilities

1. **Queue Processing**: Listens to Redis-backed BullMQ `audit-queue` for incoming performance audit jobs.
2. **Automated Audits**:
   - Launches headless Chrome instance via Puppeteer.
   - Runs Lighthouse audits across 4 main categories: Performance, Accessibility, Best Practices, and SEO.
   - Extracts Core Web Vitals: LCP (Largest Contentful Paint), FCP (First Contentful Paint), CLS (Cumulative Layout Shift), TTI (Time to Interactive), TBT (Total Blocking Time), and INP (Interaction to Next Paint).
3. **Database Syncing**: Updates audit status (`RUNNING`, `COMPLETED`, `FAILED`) and records score results directly using Prisma ORM.
4. **Health & Concurrency Control**: Monitors system CPU and free RAM before processing audits to prevent noisy measurements or out-of-memory worker crashes.

---

## ⚡ Tech Stack

- **Worker Engine**: BullMQ 5 & Redis (`ioredis`)
- **Audit Engine**: Lighthouse 12 & Puppeteer 22
- **Database Access**: Prisma 7 Client with PostgreSQL adapter (`@prisma/adapter-pg`)
- **Runtime**: TypeScript & Node.js

---

## 🛠️ Scripts

```bash
# Start worker in development mode (using ts-node)
npm run dev

# Compile TypeScript code to dist/
npm run build

# Run compiled worker process in production
npm run start
```

---

## 📂 Directory Structure

```
apps/worker/
├── src/
│   └── index.ts      # Main worker job handler & Lighthouse runner
├── dist/             # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

---

## ⚙️ Concurrency & Health Controls

- **Concurrency**: Set to 2 concurrent audit executions to preserve CPU accuracy and system stability.
- **System Checks**: Checks system free memory (< 512 MB triggers warning) and CPU load prior to launching browser instances.
