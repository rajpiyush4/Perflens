# Perflens Web Client (`apps/web`)

The frontend web application for Perflens — a modern, dark-mode performance analytics dashboard built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.

---

## 🎯 Features

- **Performance Analytics Dashboard**: Visualizes Lighthouse scores (Performance, Accessibility, Best Practices, SEO) and Core Web Vitals (LCP, FCP, CLS, TTI, TBT, INP) using **Recharts**.
- **Live Audit Status**: Real-time polling and updates for running performance audits powered by **TanStack React Query**.
- **Authentication System**: Email and credentials authentication powered by **NextAuth.js** and Prisma adapter.
- **Projects Management**: Seamless UI to create projects, configure target URLs, view audit histories, and trigger new scans.
- **State Management**: Client-side ui states managed via **Zustand**.

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS v4, Radix UI / Shadcn, Lucide React icons, Sonner toasts
- **Data Fetching**: TanStack React Query v5 & Axios
- **State Management**: Zustand
- **Charts**: Recharts
- **Authentication**: NextAuth.js v4 with `@auth/prisma-adapter`

---

## 🛠️ Scripts

```bash
# Start Next.js development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start

# Run ESLint check
npm run lint
```

---

## 📂 Directory Structure

```
src/
├── app/                  # Next.js App Router (pages, API routes, layouts)
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── dashboard/        # Dashboard & analytics pages
│   ├── projects/         # Project management pages
│   └── api/              # Next.js API routes / NextAuth handler
├── components/           # UI components (charts, dialogs, cards, navigation)
├── context/              # React Context providers (QueryClientProvider, AuthProvider)
├── lib/                  # Utility functions, API clients, Prisma instance
└── types/                # Component & page type definitions
```

---

## ⚙️ Environment Variables

Create a `.env` file inside `apps/web` or root:

```env
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="postgresql://perflens_user:perflens_password@localhost:5432/perflens_db?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```
