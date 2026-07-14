# شبكة دلال العراق

منصة إعلانات عقارية وسيارات عراقية كاملة — بيع وشراء العقارات والسيارات مع نظام مصادقة وحجرة رسائل ولوحة إدارة.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — شغل API server (port 8080)
- `pnpm --filter @workspace/dalal-app run dev` — شغل Frontend (port 5173)
- `pnpm run typecheck` — فحص TypeScript كامل
- `pnpm run build` — بناء كامل
- `pnpm --filter @workspace/db run push` — تطبيق تغييرات schema قاعدة البيانات
- Required env: `DATABASE_URL`, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Frontend**: React 19 + Vite + wouter (routing) + @tanstack/react-query + Tailwind CSS v4
- **API**: Express 5 (artifacts/api-server, port 8080)
- **DB**: PostgreSQL + Drizzle ORM (lib/db)
- **Auth**: JWT via jose + bcryptjs (stored in localStorage)
- Build: esbuild (CJS bundle) for API, Vite for frontend

## Where things live

- `artifacts/dalal-app/` — React + Vite SPA (Arabic RTL, orange theme)
  - `src/pages/` — صفحات: home, listings, listing-detail, login, register, add-listing, profile, chat, admin, privacy
  - `src/components/` — navigation.tsx, listing-card.tsx + shadcn UI components
  - `src/lib/api.ts` — fetch wrapper with JWT Bearer auth
  - `src/lib/utils.ts` — formatPrice, timeAgo, CITIES, CAR_BRANDS, REAL_ESTATE_TYPES
- `artifacts/api-server/src/routes/` — auth, listings, chats, admin routes
- `artifacts/api-server/src/lib/auth.ts` — JWT sign/verify + authMiddleware
- `lib/db/src/schema/` — users, listings, chats, messages tables

## Architecture decisions

- **React + Vite SPA** instead of Next.js (Next.js 15.1.6 is blocked by Replit package firewall)
- **JWT in localStorage** for auth (SPA pattern, no server-side sessions)
- **Vite proxy** `/api` → `http://localhost:8080` for development
- **Port 5173** for frontend (supported by workflow system; port 23352 is NOT supported)
- **No PostCSS config file** — Tailwind v4 uses `@tailwindcss/vite` plugin directly (no postcss.config.mjs needed)

## Product

- الصفحة الرئيسية مع بحث وإعلانات مميزة
- تصفح إعلانات بفلاتر (فئة، مدينة، نوع، سعر)
- إضافة إعلان بـ 3 خطوات (الفئة → التفاصيل → الموقع والصور)
- تفاصيل الإعلان مع اتصال، واتساب، ورسائل
- نظام رسائل بين المشترين والبائعين
- لوحة أدمن لإدارة الإعلانات والمستخدمين

## User preferences

- اللغة: عربية كاملة، اتجاه RTL
- الألوان: برتقالي (#f97316) كلون رئيسي
- الخط: Cairo (Google Fonts)
- بيانات الأدمن: هاتف 07740080310، كلمة المرور sofydono3?

## Gotchas

- **لا تستخدم Next.js** — محظور في Replit package firewall (403 على next-15.1.6.tgz)
- **Port 23352 غير مدعوم** من نظام workflows — استخدم المنافذ المدعومة فقط: 3000, 3001, 3002, 3003, 4200, 5000, 5173, 6000, 6800, 8000, 8008, 8080, 8099, 9000
- **احذف postcss.config.mjs** إذا وجد — يتعارض مع Tailwind v4 ويسبب خطأ 'autoprefixer not found'
- **استخدم restartWorkflow()** من code_execution sandbox بدلاً من restart_workflow tool للتحكم الأفضل
- **[services.env] في artifact.toml** — يمرر PORT و BASE_PATH للـ workflow تلقائياً

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
