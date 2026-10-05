# SaathHisab — Complete Build Plan & Design Guide

> Hand this whole file to Codex. Build phase by phase. Do not skip ahead. After each phase, run the checks listed under "Done when" before moving on.

---

## 0. Instructions for the AI coding agent (read first)

1. Build in the exact phase order in Section 15. Finish and verify one phase before starting the next.
2. **Frontend (`apps/web`) is React + TypeScript in strict mode** (no `any` unless commented with a reason). **Backend (`apps/server`) is plain JavaScript** (ES modules, Node 20+). No TypeScript, no `.ts` files, no build step on the backend. Use JSDoc comments for types in the engine and services.
3. **Reusable components first.** Never write raw styled markup inside a page if a base component exists in `components/ui` or `components/shared`. If one is missing, create it there first.
4. Never hardcode colors, spacing or radii in components. Use the design tokens in Section 10 (Tailwind theme + HeroUI theme).
5. **Money is always an integer in paisa** (Rs 100.50 = `10050`). Never use floats for money. Format only at the UI edge.
6. All balance calculation lives in a **pure function module** (`apps/server/src/modules/balances/balance.engine.js`) with Playwright tests. No calculation logic in controllers or React components.
7. Every write that touches more than one table runs in a **database transaction**.
8. Validate every request body/query/params with **Zod** on the backend. The frontend keeps its own Zod schemas (TypeScript) for forms. Keep the rules identical on both sides and note any change in `docs/DECISIONS.md`. There is **no shared package**.
9. Keep files small. One component per file. One responsibility per module.
10. **Use only the libraries named in this plan.** Security/auth libraries are limited to `bcrypt` (password hashing) and `cors` (CORS). Tests use **Playwright only**. Do not add helmet, express-rate-limit, argon2, jsonwebtoken, Vitest, Jest, Supertest or Testing Library.
11. Ask for nothing; where the spec is silent, choose the simplest safe option and note it in `docs/DECISIONS.md`.
12. Before installing HeroUI, check the **current official HeroUI installation docs** and pin the versions that match the Tailwind version you use. Do not mix incompatible Tailwind/HeroUI versions.

---

## 1. Product summary

**SaathHisab** is a web app for people who share expenses (flatmates, hostel friends, small families). Each member can clearly see:

- How much **I paid**
- What my **share** is
- Who I **owe**, and who owes **me**

Example: Zeeshan, Ali and Ahmed share a flat. Grocery Rs 6,000 paid by Zeeshan; Internet Rs 3,000 paid by Ali. Total Rs 9,000, share Rs 3,000 each. Zeeshan gets Rs 3,000, Ali is settled, Ahmed owes Rs 3,000.

Currency: **PKR only** in v1. Language: English UI in v1 (keep all strings in one place so Urdu can be added later).

---

## 2. Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18+, TypeScript, Vite |
| Styling | Tailwind CSS |
| UI library | **HeroUI** (`@heroui/react`) as the base, wrapped by our own components |
| Routing | React Router |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod (`@hookform/resolvers`) |
| Charts | Recharts |
| Icons | `lucide-react` |
| Animation | `framer-motion` (HeroUI dependency) — subtle use only |
| Backend | Node.js 20+, Express, **plain JavaScript (ES modules)** |
| Database | **MySQL 8 (InnoDB)** |
| ORM | Prisma (MySQL provider, used from JavaScript). Use `$queryRaw` for `SELECT ... FOR UPDATE` where needed |
| Password hashing | **`bcrypt` only** (cost 12) |
| Auth session | Server-side `sessions` table; random session id in an **HttpOnly, Secure, SameSite=Lax cookie** (read with `cookie-parser`) |
| CORS | **`cors` only** (credentials, strict frontend origin) |
| Validation | Zod |
| Uploads | `multer` + Cloudinary (receipt images), optional in v1 |
| Logging | `console` (simple structured messages), no logging library |
| Testing | **Playwright only** (engine tests, API tests via Playwright `request`, browser E2E) |
| Tooling | ESLint, Prettier, npm workspaces |

---

## 3. Repository structure (monorepo, npm workspaces)

```
saathhisab/
├─ package.json                  # workspaces: apps/*
├─ playwright.config.js          # the ONLY test tool
├─ tests/                        # Playwright: engine/, api/, e2e/
├─ .editorconfig
├─ .prettierrc
├─ docs/
│  ├─ DECISIONS.md
│  └─ API.md
├─ apps/
│  ├─ server/
│  │  ├─ prisma/ (schema.prisma, migrations/, seed.js)
│  │  ├─ src/
│  │  │  ├─ app.js  server.js
│  │  │  ├─ config/ (env.js)
│  │  │  ├─ lib/ (prisma.js, errors.js, asyncHandler.js, cloudinary.js, money.js)
│  │  │  ├─ middleware/ (auth, requireGroupMember, requireGroupOwner,
│  │  │  │               validate, errorHandler, idempotency)   # all .js
│  │  │  └─ modules/
│  │  │     ├─ auth/        (routes, controller, service)
│  │  │     ├─ users/
│  │  │     ├─ groups/
│  │  │     ├─ invitations/
│  │  │     ├─ expenses/
│  │  │     ├─ settlements/
│  │  │     ├─ balances/    (balance.engine.js, suggest.engine.js, service, routes)
│  │  │     ├─ activity/
│  │  │     └─ uploads/
│  │  └─ package.json    # "type": "module" (plain JavaScript, files named *.routes.js, *.controller.js, *.service.js)
│  └─ web/
│     ├─ index.html  vite.config.ts  tailwind.config.ts  postcss.config.js
│     └─ src/
│        ├─ main.tsx  App.tsx
│        ├─ app/ (router.tsx, providers.tsx, queryClient.ts)
│        ├─ styles/ (index.css)
│        ├─ theme/ (tokens.ts, heroui.ts)
│        ├─ lib/ (api.ts, cn.ts, format.ts, money.ts, constants.ts, strings.ts)
│        ├─ hooks/ (useAuth, useGroup, useDebounce, useMediaQuery, useDisclosureState)
│        ├─ components/
│        │  ├─ ui/        # base, generic, reusable (Section 12.1)
│        │  ├─ shared/    # composite, app-aware but feature-agnostic (12.2)
│        │  └─ layout/    # shells (12.3)
│        ├─ features/
│        │  ├─ auth/ groups/ expenses/ settlements/ balances/ activity/ invitations/
│        │  └─ (each: api.ts, hooks.ts, components/, pages/ if needed)
│        ├─ pages/        # thin route components composing features
│        └─ types/
```

---

## 4. Product rules (source of truth)

1. PKR only. Amounts are positive integers in paisa. Zero and negative amounts are rejected.
2. Every expense has exactly **one payer**.
3. An expense is split among **selected participants** of the same group.
4. Split methods: **Equal** and **Custom** (exact amounts). The sum of shares **must equal** the expense amount exactly.
5. Equal split rounding: `base = floor(amount / n)`, `remainder = amount % n`. The first `remainder` participants (ordered by user id ascending, deterministic) get `base + 1` paisa. Example: Rs 100.00 (10000 paisa) among 3 → 3334 / 3333 / 3333.
6. Payer and all participants must be **active members of that group**.
7. Expense creator can edit/delete their expense (group owner can too). Every create/edit/delete writes an `activity_logs` row. **Delete is soft delete** (`deleted_at`).
8. Editing an expense keeps a snapshot of the old values in the activity log (`before` / `after` JSON).
9. Settlement flow: sender records payment → status `PENDING` → **only the receiver** can `CONFIRM` or `REJECT`. Only `CONFIRMED` settlements affect balances.
10. Partial settlements are allowed. Sender and receiver must be different active members.
11. A confirmed settlement cannot be edited or deleted. Mistakes are fixed by a new reverse settlement.
12. Removing a member sets `left_at`; their historical expenses/shares/settlements are **never deleted**. A member with a non-zero balance cannot be removed (show a clear error).
13. Balances are **calculated, never stored**.
14. Invitation links expire (default 7 days), are single-group, and can be revoked.
15. Only group members can read group data. Users cannot access other groups by changing IDs.

---

## 5. Database (MySQL 8, InnoDB, utf8mb4)

Use Prisma models mapped to the tables below. IDs: `CHAR(36)` UUID v7/v4 (or `BIGINT UNSIGNED` auto-increment with a public UUID column — pick UUID for simplicity). Money columns: `BIGINT` (paisa). Timestamps: `DATETIME(3)` UTC.

```sql
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE sessions (            -- server-side sessions (id stored in HttpOnly cookie)
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_user (user_id)
);

CREATE TABLE `groups` (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type ENUM('FLAT','HOSTEL','FAMILY','TRIP','OTHER') NOT NULL DEFAULT 'FLAT',
  currency CHAR(3) NOT NULL DEFAULT 'PKR',
  created_by CHAR(36) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE group_members (
  id CHAR(36) PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role ENUM('OWNER','MEMBER') NOT NULL DEFAULT 'MEMBER',
  joined_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  left_at DATETIME(3) NULL,
  UNIQUE KEY uq_group_user (group_id, user_id),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE invitations (
  id CHAR(36) PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL UNIQUE,   -- store SHA-256 of token, never the raw token
  created_by CHAR(36) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  revoked_at DATETIME(3) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE expenses (
  id CHAR(36) PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  title VARCHAR(150) NOT NULL,
  amount BIGINT UNSIGNED NOT NULL,               -- paisa, > 0
  paid_by CHAR(36) NOT NULL,
  category ENUM('GROCERY','RENT','UTILITIES','INTERNET','FOOD','TRANSPORT','HOUSEHOLD','ENTERTAINMENT','OTHER') NOT NULL DEFAULT 'OTHER',
  split_method ENUM('EQUAL','CUSTOM') NOT NULL,
  expense_date DATE NOT NULL,
  note VARCHAR(500) NULL,
  receipt_url VARCHAR(500) NULL,
  created_by CHAR(36) NOT NULL,
  idempotency_key VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  deleted_at DATETIME(3) NULL,
  UNIQUE KEY uq_expense_idem (group_id, created_by, idempotency_key),
  INDEX idx_expenses_group_date (group_id, expense_date),
  CONSTRAINT chk_expense_amount CHECK (amount > 0),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (paid_by) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE expense_shares (
  id CHAR(36) PRIMARY KEY,
  expense_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  share_amount BIGINT UNSIGNED NOT NULL,          -- paisa, >= 0
  UNIQUE KEY uq_expense_user (expense_id, user_id),
  FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE settlements (
  id CHAR(36) PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  from_user_id CHAR(36) NOT NULL,                 -- sender / payer
  to_user_id CHAR(36) NOT NULL,                   -- receiver
  amount BIGINT UNSIGNED NOT NULL,
  status ENUM('PENDING','CONFIRMED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  note VARCHAR(300) NULL,
  idempotency_key VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  responded_at DATETIME(3) NULL,
  UNIQUE KEY uq_settle_idem (group_id, from_user_id, idempotency_key),
  INDEX idx_settle_group_status (group_id, status),
  CONSTRAINT chk_settle_amount CHECK (amount > 0),
  CONSTRAINT chk_settle_diff CHECK (from_user_id <> to_user_id),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (from_user_id) REFERENCES users(id),
  FOREIGN KEY (to_user_id) REFERENCES users(id)
);

CREATE TABLE activity_logs (
  id CHAR(36) PRIMARY KEY,
  group_id CHAR(36) NOT NULL,
  actor_id CHAR(36) NOT NULL,
  action VARCHAR(50) NOT NULL,                    -- e.g. EXPENSE_CREATED, SETTLEMENT_CONFIRMED
  entity_type VARCHAR(30) NOT NULL,
  entity_id CHAR(36) NULL,
  meta JSON NULL,                                 -- before/after snapshots, amounts
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX idx_activity_group_time (group_id, created_at),
  FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_id) REFERENCES users(id)
);
```

Notes:
- MySQL cannot enforce "share sum = expense amount" with a CHECK; enforce in the service layer inside the transaction.
- Use `SELECT ... FOR UPDATE` on the settlement row when confirming/rejecting, so double-clicks and simultaneous requests cannot confirm twice.
- Include a seed script: 3 users (Zeeshan, Ali, Ahmed), 1 group, the Rs 6,000 / Rs 3,000 example.

---

## 6. Calculation engine (pure, fully unit-tested)

Location: `apps/server/src/modules/balances/`.

### 6.1 Balance formula

```
balance(user) =
    SUM(expenses paid by user, not deleted)
  - SUM(shares assigned to user, on non-deleted expenses)
  + SUM(CONFIRMED settlements where from_user = user)
  - SUM(CONFIRMED settlements where to_user = user)
```

- `balance > 0` → user should **receive** money.
- `balance < 0` → user should **pay** money.
- Sum of all balances in a group is always exactly `0`. Assert this in tests and in a dev-only runtime check.

### 6.2 API of the engine (plain JavaScript with JSDoc)

```js
/** @typedef {number} Paisa  integer paisa */

/**
 * @param {{
 *   expenses: {id:string, paidBy:string, amount:Paisa}[],
 *   shares: {expenseId:string, userId:string, amount:Paisa}[],
 *   settlements: {from:string, to:string, amount:Paisa,
 *                 status:'PENDING'|'CONFIRMED'|'REJECTED'|'CANCELLED'}[]
 * }} input
 * @returns {Map<string, Paisa>} userId -> balance
 */
export function computeBalances(input) {}

/** @returns {{userId:string, amount:Paisa}[]} */
export function splitEqual(amount, userIdsSorted) {}

/** throws if shares do not sum exactly to amount */
export function validateCustomSplit(amount, shares) {}

/** @returns {{from:string, to:string, amount:Paisa}[]} */
export function suggestTransfers(balances) {}
```

### 6.3 Suggested transfers (greedy)

1. Split into creditors (balance > 0) and debtors (balance < 0, use absolute value).
2. Sort both descending by amount.
3. Repeatedly match largest debtor with largest creditor, transfer `min(debt, credit)`, reduce both, remove zeros.
4. Result is a **suggestion**, not guaranteed minimal. The UI label is "Suggested payments".

### 6.4 Required tests (Playwright, `tests/engine/*.spec.js`; import the engine and run in Node, no browser needed)

- The Rs 9,000 example → Zeeshan +300000, Ali 0, Ahmed −300000 (paisa).
- 10000 split among 3 → 3334/3333/3333, sum exact.
- Custom split with wrong sum throws.
- Pending/rejected settlements ignored; confirmed ones change balances.
- Deleted expenses ignored.
- Sum of balances is always 0 (property-style test with random data).
- `suggestTransfers` applied to balances brings everyone to 0.

---

## 7. REST API (all under `/api/v1`, JSON)

Auth cookie required except where noted. All errors use one shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": [] } }
```

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/signup` | Create account (public) |
| POST | `/auth/login` | Login (public) |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Current user |
| PATCH | `/users/me` | Update name/avatar |
| GET | `/groups` | My groups (with my balance per group) |
| POST | `/groups` | Create group (creator becomes OWNER) |
| GET | `/groups/:groupId` | Group details + members (member only) |
| PATCH | `/groups/:groupId` | Edit name/type (owner) |
| DELETE | `/groups/:groupId/members/:userId` | Remove member (owner; blocked if balance ≠ 0) |
| POST | `/groups/:groupId/leave` | Leave group (blocked if balance ≠ 0) |
| POST | `/groups/:groupId/invitations` | Create invite link (owner) |
| DELETE | `/groups/:groupId/invitations/:id` | Revoke |
| GET | `/invitations/:token` | Preview invite (group name, inviter) |
| POST | `/invitations/:token/accept` | Join group |
| GET | `/groups/:groupId/expenses` | List (filters: month, category, paidBy, search; cursor pagination) |
| POST | `/groups/:groupId/expenses` | Create (supports `Idempotency-Key` header) |
| GET | `/groups/:groupId/expenses/:id` | Detail with shares |
| PATCH | `/groups/:groupId/expenses/:id` | Edit (creator/owner) |
| DELETE | `/groups/:groupId/expenses/:id` | Soft delete (creator/owner) |
| POST | `/groups/:groupId/uploads/receipt` | Receipt upload (image, ≤5 MB) |
| GET | `/groups/:groupId/balances` | Balances per member + my summary + suggested transfers |
| GET | `/groups/:groupId/summary` | Dashboard stats (total spend, my paid, my share, by category, by month) |
| GET | `/groups/:groupId/settlements` | List settlements |
| POST | `/groups/:groupId/settlements` | Record payment (status PENDING) |
| POST | `/groups/:groupId/settlements/:id/confirm` | Receiver only |
| POST | `/groups/:groupId/settlements/:id/reject` | Receiver only |
| POST | `/groups/:groupId/settlements/:id/cancel` | Sender only, while PENDING |
| GET | `/groups/:groupId/activity` | Activity feed (cursor pagination) |
| GET | `/groups/:groupId/export.csv` | CSV export (Phase 8) |

Response money fields are **integer paisa** (e.g. `amount: 600000`). Frontend formats them.

---

## 8. Backend rules & security checklist

- `requireAuth` → loads user from cookie. `requireGroupMember` → checks active membership for `:groupId`. `requireGroupOwner` for owner-only routes. **Every group route uses these**; never trust IDs from the client.
- Services receive `(actorId, groupId, input)` and re-verify that payer/participants are active members.
- Expense create/edit: one `prisma.$transaction` → insert/update expense, replace shares, write activity log. Validate share sum inside it.
- Settlement confirm: transaction → `SELECT ... FOR UPDATE` the row → check `status === 'PENDING'` and `actor === to_user_id` → set CONFIRMED, `responded_at`, write activity log.
- Idempotency: if `Idempotency-Key` header exists and the same key was used by the same user in the same group, return the original result instead of creating a duplicate. Frontend generates a UUID per form open and disables the submit button while pending.
- **CORS with the `cors` package only**: allow only `CLIENT_ORIGIN`, `credentials: true`. No other security middleware packages. Cookies: `HttpOnly`, `Secure` in production, `SameSite=Lax`.
- Hash passwords with **`bcrypt` only** (cost 12). Never log passwords/tokens.
- Invitation token: 32 random bytes, base64url; store only SHA-256 hash.
- Upload: image MIME allow-list, size limit, random filenames.
- Central error handler; never leak stack traces in production.
- `.env.example` documents: `DATABASE_URL` (mysql://…), `COOKIE_SECRET`, `CLIENT_ORIGIN`, `CLOUDINARY_*`, `NODE_ENV`, `PORT`.

---

## 9. Environment & scripts

Root `package.json` scripts: `dev` (runs server + web together), `build` (web only), `lint`, `test` (= `playwright test`), `db:migrate`, `db:seed`, `db:reset:test`, `db:studio`.

Local MySQL via `docker-compose.yml` (mysql:8, port 3306, volume, utf8mb4).

---

## 10. Design guide

### 10.1 Design personality

Clean, calm, trustworthy, modern fintech feel. Friendly, not corporate. Lots of whitespace, soft rounded cards, one strong brand color, clear money colors (green = you get, red = you owe). **Mobile-first**: most users will add expenses from a phone.

### 10.2 Color tokens

Define in `theme/tokens.ts`, feed into `tailwind.config.ts` and the HeroUI theme (`theme/heroui.ts`). Never use raw hex in components.

| Token | Light | Dark | Use |
|---|---|---|---|
| `primary` (Emerald/Teal) | `#0F9D8A` (hover `#0B7F70`, soft `#E6F6F3`) | `#2CC5AF` | Buttons, links, active nav |
| `secondary` (Indigo) | `#4F46E5` | `#818CF8` | Charts, accents |
| `success` / "you get" | `#16A34A` (soft `#DCFCE7`) | `#4ADE80` | Positive balance |
| `danger` / "you owe" | `#DC2626` (soft `#FEE2E2`) | `#F87171` | Negative balance, delete |
| `warning` / pending | `#D97706` (soft `#FEF3C7`) | `#FBBF24` | Pending settlements |
| `background` | `#F7F8FA` | `#0B0F14` | App background |
| `surface` (cards) | `#FFFFFF` | `#141A21` | Cards, modals |
| `border` | `#E5E7EB` | `#232B35` | Dividers |
| `foreground` | `#0F172A` | `#E6EAF0` | Main text |
| `muted` | `#64748B` | `#94A3B8` | Secondary text |

Category chart palette (consistent per category, defined once in `lib/constants.ts`): Grocery `#16A34A`, Rent `#4F46E5`, Utilities `#F59E0B`, Internet `#0EA5E9`, Food `#EF4444`, Transport `#8B5CF6`, Household `#14B8A6`, Entertainment `#EC4899`, Other `#64748B`.

Support **light and dark mode** via HeroUI/Tailwind `class` strategy with a theme toggle.

### 10.3 Typography

- Font: **Inter** (body/UI) with `Plus Jakarta Sans` for headings and big money numbers. Fallback: system-ui.
- Scale (px): 12 caption, 14 body-sm, 16 body, 18 lead, 20 h4, 24 h3, 30 h2, 36 h1, 44 hero money.
- Weights: 400 body, 500 labels, 600 headings, 700 money.
- Money uses `tabular-nums` so digits align.
- Line height 1.5 body, 1.2 headings.

### 10.4 Spacing, radius, elevation

- 4 px base grid: 4, 8, 12, 16, 24, 32, 48, 64.
- Page padding: 16 mobile, 24 tablet, 32 desktop. Content max width 1120 px (forms 640 px).
- Radius: inputs/buttons `12px`, cards `20px`, modals `24px`, chips/avatars `full`.
- Shadows: cards `0 1px 2px rgba(15,23,42,.04), 0 4px 16px rgba(15,23,42,.06)`; modals deeper. Dark mode uses borders more than shadows.
- Touch targets ≥ 44 px height on mobile.

### 10.5 Motion

Subtle and fast: 150–200 ms ease-out. Page/list fade-up on mount, button press scale 0.98, number count-up on dashboard totals (optional). Respect `prefers-reduced-motion`.

### 10.6 Layout behavior

- **Mobile (<768)**: top app bar + **bottom tab navigation** (Overview, Expenses, Add (center FAB), Settle, Activity). Forms open full-screen or as bottom sheets.
- **Tablet/Desktop (≥768)**: left sidebar (group switcher, nav), top bar (search, theme toggle, user menu), content area. Add Expense opens a centered modal/drawer.
- Always provide loading skeletons, empty states with an illustration/icon + CTA, and friendly inline errors.

### 10.7 Money display rules

- Format: `Rs 6,000` (no decimals if paisa = 0), `Rs 100.50` otherwise. One function `formatPKR(paisa)` in `apps/web/src/lib/money.ts`.
- Positive balance: green with "gets back". Negative: red with "owes". Zero: muted with "settled up".
- Large hero number on the balance card; always show label above it.
- Never show a bare number without a label.

### 10.8 Accessibility

Contrast AA minimum; visible focus rings; labels on every input; aria-labels on icon buttons; color never the only signal (use icons/text with green/red); keyboard-navigable modals (HeroUI handles most of this).

---

## 11. Frontend architecture rules

- HeroUI components are **wrapped** by our `components/ui` layer. Pages and features import from `@/components/ui`, **not** directly from `@heroui/react` (only the `ui` folder imports HeroUI). This lets us restyle or replace later.
- Server data only through TanStack Query hooks inside `features/*/hooks.ts`. Query keys centralised per feature (`groupKeys`, `expenseKeys`, …). After successful mutations, invalidate the relevant keys (balances, expenses, activity, summary).
- `lib/api.ts`: thin fetch wrapper (`credentials: 'include'`, JSON, error normalisation, 401 → redirect to login).
- Forms: React Hook Form + Zod resolver, using the frontend's own Zod schemas in `features/*/schemas.ts`. Form fields use our `FormField`-style wrappers.
- Route guards: `ProtectedRoute` (needs login), `GroupRoute` (loads group + membership).
- Routes:

```
/login  /signup
/join/:token
/groups                         # my groups
/groups/new
/g/:groupId                     # overview (balances + suggested payments)
/g/:groupId/expenses
/g/:groupId/expenses/new
/g/:groupId/expenses/:id
/g/:groupId/expenses/:id/edit
/g/:groupId/settle
/g/:groupId/activity
/g/:groupId/members
/g/:groupId/settings
/profile
*  → NotFound
```

---

## 12. Component library (build ALL of these as reusable pieces)

Every component: typed props, `className` passthrough via `cn()`, supports light/dark, has a short usage comment. Add a dev-only `/_playground` route that renders every component in `ui/` and `shared/` in all variants (acts as our Storybook).

### 12.1 Base components — `components/ui/`

| Component | Notes |
|---|---|
| `Button` | variants: primary, secondary, ghost, danger, soft; sizes sm/md/lg; `isLoading`, `leftIcon`, `rightIcon`, `fullWidth` |
| `IconButton` | required `aria-label`; sizes |
| `Input` | label, helper, error, start/end content, clearable |
| `PasswordInput` | show/hide toggle |
| `MoneyInput` | Rs prefix; user types rupees (e.g. `100.50`), emits **integer paisa**; blocks invalid characters |
| `Textarea` | label, counter |
| `Select` | label, options, error |
| `MultiSelect` | for participants |
| `DatePicker` | wraps HeroUI date input |
| `Checkbox`, `Switch`, `RadioGroup`, `SegmentedControl` | SegmentedControl used for Equal/Custom split |
| `Card` (+ `CardHeader`, `CardBody`, `CardFooter`) | consistent radius/shadow |
| `Modal` (+ header/body/footer) | responsive: bottom sheet on mobile |
| `Drawer` | side panel |
| `ConfirmDialog` | title, message, confirm label, danger variant, async confirm with loading |
| `Dropdown` / `Menu` | action menus |
| `Tabs` | |
| `Badge`, `Chip` | status chips |
| `Avatar`, `AvatarGroup` | initials fallback, deterministic color from name |
| `Tooltip`, `Popover` | |
| `Skeleton` | line, circle, card variants |
| `Spinner` | |
| `Divider` | |
| `Table` | responsive; collapses to card list on mobile |
| `Pagination` / `LoadMore` | |
| `ProgressBar` | |
| `Toast` / `useToast` | success/error/info |
| `Alert` / `Callout` | inline messages |
| `Heading`, `Text`, `Money` (typography primitives) | `Money` renders `formatPKR` with tone (positive/negative/neutral) and size |
| `VisuallyHidden`, `Container`, `Stack`, `Grid` | layout primitives |

### 12.2 Shared composite components — `components/shared/`

| Component | Purpose |
|---|---|
| `PageHeader` | title, subtitle, breadcrumbs, action slot |
| `SectionHeader` | title + optional "View all" link |
| `EmptyState` | icon, title, description, CTA |
| `ErrorState` | message + retry |
| `LoadingState` | skeleton wrappers per layout |
| `StatCard` | label, value, icon, trend/hint |
| `BalanceBadge` | "gets back Rs X" / "owes Rs X" / "settled up" |
| `MemberAvatar` | avatar + name + optional role chip |
| `MemberPicker` | select one member (payer, receiver) |
| `MemberMultiPicker` | select participants with "select all" |
| `CategoryIcon` / `CategoryBadge` | icon + color per category |
| `CategorySelect` | |
| `StatusChip` | Pending / Confirmed / Rejected / Cancelled |
| `ConfirmActionButton` | button that opens `ConfirmDialog` |
| `CopyField` | read-only text + copy button (invite link) |
| `ThemeToggle` | |
| `UserMenu` | profile, logout |
| `GroupSwitcher` | dropdown of my groups |
| `FormSection` | titled group of fields |
| `FileDropzone` | image upload with preview, size/type validation |
| `ImagePreviewModal` | receipt viewer |
| `DateRangeFilter`, `MonthPicker` | |
| `SearchInput` | debounced |
| `FilterBar` | month, category, member filters |
| `ActivityItem` | icon + sentence + relative time |
| `ChartCard` | card wrapper with title + chart slot + empty state |
| `Money formatters` | `formatPKR`, `formatDate`, `formatRelativeTime` in `lib/format.ts` |

### 12.3 Layout components — `components/layout/`

`AppShell` (switches sidebar vs bottom nav), `Sidebar`, `TopBar`, `BottomNav`, `AuthLayout` (centered card with brand panel), `GroupLayout` (loads group, renders sub-nav), `ProtectedRoute`, `GroupRoute`, `PageContainer`.

### 12.4 Feature components — `features/*/components/`

**auth**: `LoginForm`, `SignupForm`.

**groups**: `GroupCard` (name, type, member avatars, my balance), `GroupList`, `CreateGroupForm`, `GroupSettingsForm`, `MemberList`, `MemberRow` (with remove action for owner), `InviteDialog` (generate link, copy, revoke, expiry text), `JoinGroupCard`.

**expenses**: `ExpenseForm` (title, `MoneyInput`, payer, date, category, participants, split method, receipt, note), `SplitEditor` (shows computed equal shares or editable custom shares with live "remaining Rs X" indicator), `ExpenseCard` / `ExpenseRow`, `ExpenseList` (grouped by date), `ExpenseDetail`, `ExpenseShareTable`, `ExpenseFilters`, `DeleteExpenseButton`.

**balances**: `BalanceSummaryCard` (hero: "You are owed / You owe"), `MemberBalanceList`, `SuggestedTransfersList` (each with "Record payment" action), `GroupSpendCard`, `MySpendCard`.

**settlements**: `SettlementForm` (receiver, amount prefilled from suggestion, note), `SettlementCard`, `SettlementList` (tabs: Pending for me, Sent by me, History), `SettlementActions` (confirm/reject/cancel with dialogs).

**activity**: `ActivityFeed` with `ActivityItem`.

**dashboard**: `CategoryPieChart` (donut), `MonthlySpendBarChart`, `RecentExpensesCard`, `PendingActionsCard`.

---

## 13. Screen specifications

1. **Login / Signup** — `AuthLayout`; email + password; inline errors; link between the two.
2. **My Groups** — grid of `GroupCard`; "Create group" button; empty state with CTA; shows "You owe / get back" per group.
3. **Group Overview** — top: `BalanceSummaryCard` for me. Below: `SuggestedTransfersList`, `MemberBalanceList`, `PendingActionsCard` (settlements waiting for my confirmation), `RecentExpensesCard`, quick "Add expense" FAB.
4. **Expenses** — `FilterBar` + grouped `ExpenseList`; infinite/load-more; empty state.
5. **Add/Edit Expense** — single-column form; amount field is large and auto-focused; split section updates live; sticky submit bar on mobile; disabled while submitting.
6. **Expense Detail** — amount, payer, date, category, receipt thumbnail (opens preview), share table, edit/delete (if allowed), small history list.
7. **Settle Up** — tabs (Suggested / Pending / History). Receiver sees Confirm/Reject on pending items; sender sees Cancel.
8. **Activity** — chronological feed with filters by type.
9. **Members** — list with roles, invite button (owner), leave group button.
10. **Settings** — rename group, change type, danger zone.
11. **Dashboard widgets** (on overview or a Stats tab) — total group spend, my paid vs my share (shown separately, clearly labeled), category donut, monthly bars, month/category filters.
12. **Join via link** — shows group name + inviter, "Join group" button; redirects to login first if needed, then back.
13. **Profile** — name, avatar, theme.
14. **NotFound / Error boundary** pages.

Every screen: loading skeleton, empty state, error state with retry.

---

## 14. Testing plan (Playwright only)

One test tool: `@playwright/test`. No Vitest, Jest, Supertest or Testing Library. Config in `playwright.config.js` at the repo root, with a `webServer` entry that starts the server and web app, and a separate **test MySQL database** (`DATABASE_URL` for tests) reset by `npm run db:reset:test` before the suite. Run DB-touching tests serially (`workers: 1`). Projects: desktop Chromium and a mobile viewport (375 px, e.g. Pixel 5).

**`tests/engine/` — pure logic (no browser)**
- Balance engine, `splitEqual`, `validateCustomSplit`, `suggestTransfers` (all cases in 6.4).
- `money.js` helpers: `"100.5"` → `10050`, formatting of paisa.

**`tests/api/` — Playwright `request` fixture against the running server**
- Auth: signup, login, logout, `me`; wrong password rejected.
- Group isolation: user C gets 403/404 on group of A and B.
- Expense create with exact shares; share-sum mismatch rejected; zero/negative amount rejected.
- Same `Idempotency-Key` twice creates exactly one expense.
- Settlement: confirm by non-receiver rejected; double confirm succeeds only once; partial payment updates balances only after confirmation.
- Member with non-zero balance cannot be removed.
- Forced failure mid-save leaves no partial expense (rollback check).
- Invitation: expired and revoked links refused.

**`tests/e2e/` — browser**
- Component behavior through the UI: `MoneyInput` (typing `100.5` saves `10050`), `SplitEditor` remaining-amount indicator, `ConfirmDialog`, `BalanceBadge` colors/labels.
- Full scenario: 3 users → create group → join via invite → add equal and custom expense → record partial settlement → receiver confirms → balances verified.
- Mobile viewport: bottom nav visible, Add Expense usable at 375 px.
- Dark mode toggle persists.

---

## 15. Phased build plan

### Phase 0 — Foundation (Day 1–2)
- Create monorepo (workspaces `apps/*`), TypeScript config for the web app only, ESLint, Prettier, Playwright config.
- Server skeleton (plain JavaScript, ES modules): Express app, `cors`, env validation (Zod), console logging, error handler, health route.
- Docker MySQL + Prisma setup + first migration (all tables from Section 5) + seed.
- Web skeleton: Vite, Tailwind, HeroUI provider, theme tokens, Inter + Plus Jakarta fonts, router, QueryClient, `cn`, `api.ts`.
- Money utils in `apps/web/src/lib/money.ts` and `apps/server/src/lib/money.js` (same behavior in both).
**Done when:** `npm run dev` runs both apps; `/api/v1/health` returns OK; web shows a themed placeholder page; dark/light toggle works.

### Phase 1 — Design system (Day 3–6)
- Build **all** components in Section 12.1 and 12.2 and layouts in 12.3.
- Build `/_playground` page showing every component and variant, in both themes, at mobile and desktop widths.
**Done when:** playground renders everything without console errors; components only import HeroUI inside `components/ui`; keyboard and screen-reader labels checked on Button, Modal, Input, Select.

### Phase 2 — Auth & groups (Week 2)
- Backend: signup/login/logout/me, session cookie, groups CRUD, members, invitations (hashed tokens, expiry, revoke, accept), middleware (`requireAuth`, `requireGroupMember`, `requireGroupOwner`).
- Frontend: auth pages, protected routing, My Groups, Create Group, Members, Invite dialog, Join page, Settings.
**Done when:** two accounts join one group via link; a third unrelated account gets 403/404 for that group's data; expired/revoked links are refused.

### Phase 3 — Expenses (Week 3)
- Backend: expense CRUD with transaction, share validation, soft delete, activity logs, idempotency, filters + pagination, receipt upload (Cloudinary).
- Frontend: `ExpenseForm`, `SplitEditor`, list, detail, edit, delete, filters.
**Done when:** equal and custom splits save with exact sums; negative/zero rejected; double-click makes one expense; failing mid-save leaves no half data.

### Phase 4 — Calculation engine & balances (Week 4)
- Implement `balance.engine.js` + `suggest.engine.js` with all Playwright engine tests from 6.4.
- Balances + summary endpoints. Frontend: `BalanceSummaryCard`, `MemberBalanceList`, `SuggestedTransfersList`.
**Done when:** the Rs 9,000 example shows Zeeshan +3,000 / Ali settled / Ahmed −3,000 in the UI, and all engine tests pass.

### Phase 5 — Settlements (Week 5)
- Backend: create/confirm/reject/cancel with row locking, activity logs, rules from Section 4.
- Frontend: `SettlementForm`, lists with tabs, confirm/reject/cancel dialogs, pending-actions card on overview.
**Done when:** partial payment → pending → receiver confirms → balances update; non-receiver cannot confirm; double confirm only works once.

### Phase 6 — Dashboard & polish (Week 6)
- Summary charts, filters, activity feed, empty/loading/error states everywhere, toasts, mobile polish (bottom nav, bottom sheets), accessibility pass, dark-mode pass.
**Done when:** every screen has all three states; Lighthouse accessibility ≥ 90 on main screens; app is comfortable at 375 px width.

### Phase 7 — Verification & real trial (Week 7)
- Run the full Playwright suite (engine, API, E2E; desktop and mobile projects); fix failures.
- Security checks: change group ID in URL (denied), repeat requests (no duplicates), forced error mid-save (no partial data), non-receiver confirm (denied).
- Deploy (frontend static host + Node host + managed MySQL), HTTPS cookies verified.
- Trial with 3–4 real users for 1–2 weeks; log confusion points and time-to-add-expense.

### Phase 8 — Advanced (Week 8+, priority order)
1. Recurring bills (monthly rent/internet drafts)
2. Item-wise splitting
3. CSV export
4. Notifications (new expense, pending settlement)
5. Receipt OCR (suggest only, user verifies)
6. Urdu language via `lib/strings.ts`

---

## 16. Definition of done (whole project)

- All Phase 0–7 "Done when" checks pass.
- Backend contains no TypeScript; frontend is TypeScript strict.
- Only `bcrypt` and `cors` are used for security; the only test runner is Playwright (check `package.json` files).
- No float money anywhere (grep for `parseFloat`, `toFixed` used on stored amounts).
- No raw HeroUI imports outside `components/ui`.
- No hardcoded hex colors outside `theme/` and `lib/constants.ts`.
- README with setup steps, env variables, scripts, and a 2-minute demo scenario.
- `docs/DECISIONS.md` lists every assumption made.
- Portfolio assets prepared: live demo link, screenshots, short case study (problem, DB design, rounding + balance decisions, permissions, idempotency, tests, user feedback), 2-minute demo video: add expense → balances update → partial payment → confirmation.

**First milestone:** 3 users, 1 group, equal + custom expenses, correct balances.
