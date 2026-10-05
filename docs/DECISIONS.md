# SaathHisab Architectural & Implementation Decisions

This document tracks all key technical choices, trade-offs, and assumptions made during development.

## 1. Monorepo & Workspaces
- Monorepo using standard npm workspaces with `apps/server` and `apps/web`.
- Root manages dev orchestration (`concurrently`) and Playwright test suite.

## 2. Backend Language & Runtime
- Backend uses plain JavaScript with ES modules (`"type": "module"`). Node.js 20+.
- No TypeScript and no build step on the backend.
- JSDoc type annotations are used for calculation engines and services.
- Prisma ORM is configured for MySQL with Prisma Client generated into Node modules.

## 3. Frontend Technology
- Vite + React 18+ with TypeScript in strict mode.
- Tailwind CSS with HeroUI component library.
- HeroUI components are encapsulated inside `src/components/ui/` and never directly imported elsewhere.

## 4. Money Representation
- All currency values are stored as unsigned 64-bit integer paisa (PKR).
- 1 PKR = 100 paisa (e.g. Rs 100.50 = 10050).
- Floating-point calculations are strictly forbidden for currency.

## 5. Security & Auth Architecture
- Server-side `sessions` table.
- Session IDs are stored in an HttpOnly, Secure (in production), SameSite=Lax cookie.
- Password hashing using `bcrypt` (cost 12).
- Strict CORS using the `cors` package with origin whitelist and credentials enabled.
