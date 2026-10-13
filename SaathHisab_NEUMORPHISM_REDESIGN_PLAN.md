# SaathHisab — Neumorphism Redesign Plan (Accessible Hybrid)

> Companion to `SaathHisab_BUILD_PLAN.md`. Hand both files to Codex. This file **only changes how the app looks**. It does not change any business rule, API, database table or calculation. Where this file conflicts with Section 10 (Design guide) of the build plan, **this file wins** for: 10.1 personality, the `background` / `surface` / `border` color tokens, 10.4 radius and shadows, and the visual style of every component in Section 12. Everything else in the build plan stays as is (stack rules, money rules, Playwright-only testing, only `components/ui` imports HeroUI).

---

## 0. Rules for the AI coding agent (read first)

1. **Styling only.** No changes to routes, API calls, query keys, schemas, engine code or component props that other code depends on. Component APIs stay backward compatible (new optional props are fine).
2. **One source of truth.** All neumorphic shadows and surface colors come from CSS variables defined in `apps/web/src/theme/neumorphism.css`, exposed to Tailwind as `nm-*` utilities. No raw `box-shadow` values and no hex colors anywhere else (`theme/` is the only place hex is allowed, as before).
3. **`Surface` is the only building block.** Create one base component `components/ui/Surface.tsx`. Card, Modal panel, Drawer panel, Popover, Dropdown menu, StatCard, etc. all compose `Surface`. Pages and features never write `nm-*` classes directly; they use components.
4. **No new libraries.** Use Tailwind's built-in plugin API (`tailwindcss/plugin`), CSS variables and HeroUI `classNames` slot overrides. HeroUI slot names differ by version, so read the installed version's docs for each component before overriding.
5. **Accessibility beats aesthetics.** If a neumorphic effect would make something hard to see or find, use the accessible fallback in Section 3. The tests in Section 9 are the judge, not the eye.
6. Work in the order of Section 10. Verify each stage's "Done when" before starting the next. Record any deviation in `docs/DECISIONS.md`.

---

## 1. Why a "hybrid" (read this, it shapes every decision)

Pure neumorphism (everything soft, same color as the background, shadow-only edges) has three known problems:

- **Low contrast:** soft shadows alone fail the 3:1 non-text contrast rule, so inputs and buttons can become hard to see.
- **Unclear affordance:** users can't tell what is pressable, which is bad for a money app where a mis-tap matters.
- **Dense data suffers:** a list of 40 expenses with a shadow on every row is noisy and slow on cheap phones.

So SaathHisab uses **accessible hybrid neumorphism**:

| Use soft shadows on | Keep flat (no soft shadows) on |
|---|---|
| Containers: cards, panels, modals, sidebar, bottom nav | Dense data: table rows, expense rows, activity items, member rows |
| Big or primary controls: buttons, FAB, segmented control, switch | Text, labels, icons |
| Inputs (inset) | Charts (flat marks inside a raised chart card) |
| Progress/gauge tracks (inset) | Chips, badges, status pills (flat tinted pill + border) |
| | Toasts and tooltips (clear flat elevation so they never blend in) |

Every interactive control must also carry a **non-shadow cue** (border, label, icon or fill). See 3.2.

---

## 2. Design language

**Feel:** calm, soft, tactile, premium fintech. Like a quiet physical dashboard. Rounded shapes, generous space, light from the top-left.

**Principles**

1. **One light source**, top-left, everywhere. Raised = light on top-left, dark on bottom-right. Inset is the reverse.
2. **Raised means "you can press / this is a container". Inset means "you type or it is a track". Pressed means "selected / active".** Never mix the meanings.
3. **Max two levels of nesting** (raised page → raised card → inset field is the deepest). Never a raised element inside a raised element inside a raised element.
4. **Color is used for meaning, not decoration.** Brand teal for the primary action, green for "you get", red for "you owe", amber for pending. The rest of the UI stays in calm neutrals.
5. **Space is part of the effect.** Soft shadows need room. Minimum 16 px between two raised elements on mobile, 24 px on desktop, so shadows never overlap.
6. **Fewer, bigger shapes.** Prefer one large raised card per section over many small ones.

---

## 3. Design tokens

All values below are **starting values**. The contrast tests in Section 9 are authoritative: if a value fails, darken the text or border color until it passes and note it in `docs/DECISIONS.md`.

### 3.1 Colors (`theme/tokens.ts` + `theme/neumorphism.css`)

Neumorphism needs the **page background and card surface to be the same color**. This replaces the white-card-on-grey look from the old Section 10.2.

| Token | Light | Dark | Use |
|---|---|---|---|
| `nm-bg` (page AND surface) | `#E6EBF2` | `#1C222B` | App background and every raised/inset surface |
| `nm-light` (highlight shadow) | `rgba(255,255,255,0.90)` | `rgba(255,255,255,0.045)` | Top-left shadow |
| `nm-dark` (depth shadow) | `rgba(163,177,198,0.55)` | `rgba(0,0,0,0.55)` | Bottom-right shadow |
| `foreground` | `#1E293B` | `#E6EAF0` | Main text |
| `muted` | `#5B6577` | `#9AA6B8` | Secondary text (must stay ≥ 4.5:1) |
| `hairline` | `#6B7588` | `#7C8799` | 1 px border on inputs and other controls that need a visible boundary (must be ≥ 3:1 against `nm-bg`) |
| `border-soft` | `rgba(15,23,42,0.10)` | `rgba(255,255,255,0.10)` | Dividers inside cards, flat-mode borders |
| `primary` (filled button) | `#0B7F70` with white text | `#2CC5AF` with `#06201C` text | Primary actions |
| `primary-soft` | `#D5EFEA` | `#173B37` | Selected states, tinted fills |
| `success` text / "you get" | `#166534` | `#4ADE80` | Positive balance |
| `danger` text / "you owe" | `#B91C1C` | `#F87171` | Negative balance, destructive |
| `warning` text / pending | `#92400E` | `#FBBF24` | Pending settlements |
| `success-soft` / `danger-soft` / `warning-soft` | `#DCFCE7` / `#FEE2E2` / `#FEF3C7` | `#12301E` / `#3A1717` / `#3A2B0C` | Flat pill backgrounds |

Notes: the primary filled color is darker than the old `#0F9D8A` because white text on `#0F9D8A` is only about 3.4:1. Category chart palette from the build plan stays unchanged; check each color is visible on `nm-bg`.

### 3.2 The non-shadow cue rule (WCAG non-text contrast)

- **Inputs, selects, textareas, search, MoneyInput, date picker:** inset shadow **plus** a 1 px `hairline` border.
- **Buttons:** a visible text label (≥ 4.5:1) or an icon with an `aria-label` (icon ≥ 3:1). Secondary buttons also get a 1 px `border-soft`.
- **Switch / checkbox / radio:** the checked state uses `primary` fill or a check mark, never only a shadow change.
- **Selected tab / nav item / segment:** `primary-soft` fill or a `primary` indicator bar or text color change, plus the pressed shadow.
- **Focus:** `outline: 2px solid var(--primary)`, `outline-offset: 3px` on `:focus-visible`, on every focusable element. Never use shadow change as the only focus signal.
- **Disabled:** flat (no raised shadow), 55% opacity, `cursor-not-allowed`, `aria-disabled`.

### 3.3 Shadow recipes (CSS variables)

Define in `theme/neumorphism.css` under `:root` and `.dark` (or the theme class the app uses), driven by `nm-light` / `nm-dark`:

```css
:root {
  --nm-raised-xs: 3px 3px 6px var(--nm-dark),  -3px -3px 6px var(--nm-light);
  --nm-raised-sm: 5px 5px 10px var(--nm-dark), -5px -5px 10px var(--nm-light);
  --nm-raised-md: 8px 8px 16px var(--nm-dark), -8px -8px 16px var(--nm-light);
  --nm-raised-lg: 12px 12px 24px var(--nm-dark), -12px -12px 24px var(--nm-light);
  --nm-inset-sm:  inset 3px 3px 6px var(--nm-dark),  inset -3px -3px 6px var(--nm-light);
  --nm-inset-md:  inset 5px 5px 10px var(--nm-dark), inset -5px -5px 10px var(--nm-light);
  --nm-pressed:   var(--nm-inset-sm);
}

/* Accessible flat fallback: same variable names, no soft shadows */
html[data-nm="off"] {
  --nm-raised-xs: 0 0 0 1px var(--border-soft);
  --nm-raised-sm: 0 0 0 1px var(--border-soft);
  --nm-raised-md: 0 0 0 1px var(--border-soft), 0 2px 8px rgba(15, 23, 42, 0.08);
  --nm-raised-lg: 0 0 0 1px var(--border-soft), 0 4px 16px rgba(15, 23, 42, 0.10);
  --nm-inset-sm:  inset 0 0 0 1px var(--hairline);
  --nm-inset-md:  inset 0 0 0 1px var(--hairline);
  --nm-pressed:   inset 0 0 0 1px var(--hairline);
}
```

Because components only use the variables, the whole app switches to the flat fallback by setting `data-nm="off"` on `<html>`. No per-component code.

Mobile: below 768 px cap blur at 16 px (use the `md` recipe instead of `lg` for big surfaces).

### 3.4 Shape and spacing

- Radius: buttons and inputs `16px`, cards `24px`, modals and sheets `28px`, avatars/switches/FAB `full`.
- Card padding: 20 px mobile, 24 px desktop. Gap between sibling cards: 16 / 24 px.
- Touch targets ≥ 44 px (unchanged).
- Optional convex feel for large buttons only: `background-image: linear-gradient(145deg, rgba(255,255,255,0.35), rgba(0,0,0,0.04))` over `nm-bg`. Do not use on cards (keeps them calm and cheap to render).

### 3.5 Typography tweaks

Keep Inter + Plus Jakarta Sans. On neumorphic surfaces: body text ≥ 14 px, labels weight 500, headings 600, money 700 with `tabular-nums`. Do not use light (300) weights anywhere.

### 3.6 Motion

- Hover (desktop pointer only, `@media (hover: hover)`): raised goes one level up (`md` → `lg`) over 150 ms.
- Press: swap to `--nm-pressed` and scale 0.99, 120 ms.
- Animate `box-shadow` only on the single element being interacted with. Never animate shadows on lists. Page and list entrance uses opacity and transform only.
- `prefers-reduced-motion`: no scale, no shadow transitions.

---

## 4. Tailwind and HeroUI wiring

1. `theme/neumorphism.css` holds the variables above and is imported by `styles/index.css`.
2. In `tailwind.config.ts`, add a plugin with Tailwind's built-in `plugin()` that generates these utilities:

   `nm-flat`, `nm-raised-xs|sm|md|lg`, `nm-inset-sm|md`, `nm-pressed` (each sets `background-color: var(--nm-bg)` and `box-shadow: var(--nm-…)`), and `nm-hairline` (1 px border with `var(--hairline)`).

3. Extend Tailwind colors from the tokens (`nm-bg`, `foreground`, `muted`, `primary`, `primary-soft`, `success`, `danger`, `warning` and their `-soft` variants) so classes like `bg-nm-bg` and `text-muted` work. Do not write hex in components.
4. HeroUI theme (`theme/heroui.ts`): set `background` and `content1` to `nm-bg`, set radius to the values in 3.4, and make HeroUI's own default shadows `none`. In each `components/ui` wrapper, override HeroUI slots with `classNames` so the slot uses our `nm-*` utility (for example the Card `base` slot uses `nm-raised-md`, the Input `inputWrapper` slot uses `nm-inset-sm nm-hairline`). Pass `shadow="none"` where HeroUI offers it.
5. The theme toggle keeps working (light/dark). Add a second setting, **Effects: Soft (default) / Flat**, stored on `<html data-nm="on|off">` and in `localStorage` (wrapped in try/catch). Initialize before first paint to avoid a flash. Place the control in Profile and in the playground.
6. Auto-fallback to flat when the user's system asks for it: `@media (prefers-contrast: more)` and `@media (forced-colors: active)` set the same variables as `html[data-nm="off"]`.

### The `Surface` component (single building block)

```tsx
// components/ui/Surface.tsx
type SurfaceProps = {
  variant?: 'raised' | 'inset' | 'pressed' | 'flat'; // default 'raised'
  level?: 'xs' | 'sm' | 'md' | 'lg';                 // raised/inset only, default 'md'
  radius?: 'control' | 'card' | 'sheet' | 'full';    // 16 / 24 / 28 / full
  interactive?: boolean;  // adds hover lift + pressed state + focus ring
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
};
```

It maps `variant` + `level` to the `nm-*` utility, applies radius, and handles hover/press/focus per Section 3.2 and 3.6. Every other surface-like component is built from it.

---

## 5. Component mapping (everything in Section 12 of the build plan)

### 5.1 Base components (`components/ui/`)

| Component | New look |
|---|---|
| `Surface` (new) | See above |
| `Card` (+ header/body/footer) | `Surface raised md card`. Divider inside cards is `border-soft`, never a shadow |
| `Button` primary | Filled `primary`, white text, `raised sm`, pressed state on click, loading spinner keeps width |
| `Button` secondary | `raised sm` on `nm-bg` with `border-soft`, label in `foreground` |
| `Button` ghost | No shadow at rest, `raised xs` on hover, label in `primary` |
| `Button` soft | `primary-soft` fill, no shadow |
| `Button` danger | Filled `danger` text on `danger-soft` at rest; filled `danger` with white text for the confirm button in `ConfirmDialog` |
| `IconButton` | Circular `raised sm`, 44 px, icon ≥ 3:1, required `aria-label` |
| `Input`, `PasswordInput`, `Textarea`, `Select`, `MultiSelect`, `DatePicker` | `inset sm` + `hairline`, 16 px radius, label above the field (never placeholder-only), error state: `danger` hairline plus message with an icon |
| `MoneyInput` | Larger inset field, `Rs` prefix, 28 px `tabular-nums` value, auto-focus on the Add Expense screen |
| `Checkbox`, `RadioGroup` | Unchecked: small inset square/circle with hairline. Checked: `primary` fill with a check mark |
| `Switch` | Inset track with hairline, raised thumb; on state fills the track with `primary-soft` and shows an on-icon |
| `SegmentedControl` | Inset track; the selected segment is a raised thumb with `primary` text. Used for Equal/Custom |
| `Tabs` | Inset track with raised selected tab, or underline-style on desktop sidebar pages |
| `Modal`, `Drawer` | `Surface raised lg sheet`, scrim behind it (`rgba` dark overlay) so the sheet separates clearly. Bottom sheet on mobile |
| `ConfirmDialog` | Modal; destructive confirm uses the filled danger button |
| `Dropdown` / `Menu`, `Popover` | Flat elevated panel (`nm-raised-sm` plus `border-soft`), items flat with `primary-soft` hover/selected |
| `Tooltip`, `Toast`, `Alert` / `Callout` | Flat tinted fill + 1 px border + icon. No neumorphism (must never blend into the page) |
| `Badge`, `Chip` | Flat pill: `*-soft` fill, matching text color, 1 px border |
| `Avatar`, `AvatarGroup` | Circular `raised xs`, initials ≥ 4.5:1, group overlap uses a 2 px `nm-bg` ring |
| `Skeleton` | `inset sm` shapes with a slow opacity pulse (no moving shadows) |
| `Spinner` | `primary` arc, no shadow |
| `ProgressBar` | Inset track, `primary` (or semantic color) fill with a flat edge |
| `Divider` | 1 px `border-soft` |
| `Table` | **Flat.** One raised card around the table, header row `muted` text on `nm-bg`, row dividers `border-soft`, hover row `primary-soft`. Collapses to flat card rows on mobile |
| `Pagination` / `LoadMore` | Secondary button style |
| `Heading`, `Text`, `Money` | Unchanged except colors from the new tokens |
| `Container`, `Stack`, `Grid`, `VisuallyHidden` | Unchanged |

### 5.2 Shared composite components (`components/shared/`)

| Component | New look |
|---|---|
| `PageHeader`, `SectionHeader` | Text only on the page background, no shadow |
| `StatCard` | `Surface raised md card`; icon sits in a small `inset sm` circle; value uses `Money` |
| `BalanceBadge` | Flat pill: `success-soft` with an up-arrow icon and "gets back", `danger-soft` with a down-arrow icon and "owes", muted pill with a check icon and "settled up" |
| `EmptyState`, `ErrorState`, `LoadingState` | Centered inside a raised card; icon in an inset circle; CTA is a primary button |
| `MemberAvatar`, `MemberPicker`, `MemberMultiPicker` | Avatar raised xs; picker is an inset field; multi-picker options are flat rows with a check mark for selected plus `primary-soft` |
| `CategoryIcon` / `CategoryBadge` / `CategorySelect` | Icon in a small inset circle tinted with the category color from `lib/constants.ts`; badge is a flat pill |
| `StatusChip` | Flat pill with icon (Pending amber, Confirmed green, Rejected red, Cancelled muted) |
| `ConfirmActionButton` | Uses Button + ConfirmDialog styles |
| `CopyField` | Inset field + raised copy icon button; shows a "Copied" check for 2 s |
| `ThemeToggle` | Raised circular icon button; add **EffectsToggle** (Soft/Flat) next to it in Profile |
| `UserMenu`, `GroupSwitcher` | Raised trigger button; menu as in Dropdown |
| `FormSection` | Title above, fields inside one raised card |
| `FileDropzone` | Inset dashed-border area (dashed `hairline`), preview raised xs |
| `ImagePreviewModal` | Modal on a dark scrim |
| `DateRangeFilter`, `MonthPicker`, `SearchInput`, `FilterBar` | Inset fields and a single raised bar. Filter chips are flat pills |
| `ActivityItem` | **Flat** row: icon in an inset circle, sentence, relative time |
| `ChartCard` | One raised card; the chart inside is flat. Gridlines `border-soft`; use the category palette; check the visible contrast of the chart marks on `nm-bg` |

### 5.3 Layout components (`components/layout/`)

| Component | New look |
|---|---|
| `AppShell` | Page background `nm-bg`. Desktop: floating raised `Sidebar` with 16 px margin from the screen edge and 24 px content gap |
| `Sidebar` | `Surface raised lg sheet`; nav items flat; active item = pressed (inset) + `primary` text + left indicator bar |
| `TopBar` | Flat on the page background (no bar shadow); search is an inset field; icon buttons raised |
| `BottomNav` (mobile) | Floating raised bar, 12 px from the bottom and sides, respects safe-area inset; active tab = pressed + `primary` icon and label; center **Add** button is a circular raised FAB filled with `primary`, sticking up slightly |
| `AuthLayout` | Centered raised card on `nm-bg`; brand mark on top |
| `GroupLayout`, `PageContainer` | Spacing only |
| `ProtectedRoute`, `GroupRoute` | No visual change |

### 5.4 Feature components

- **balances:** `BalanceSummaryCard` is the hero: one large raised card. Top line "You are owed" or "You owe" (label first), then the amount in 44 px `Money` (green or red), under it an **inset gauge** showing paid vs share (`ProgressBar`). `MemberBalanceList` is one raised card with flat rows. `SuggestedTransfersList`: one raised card, each suggestion is a flat row with an inset amount pill and a small raised "Record payment" button. `GroupSpendCard` and `MySpendCard` are separate `StatCard`s (they are different numbers, keep them visually separate and labeled).
- **expenses:** `ExpenseList` = date headers on the page background plus one raised card per date group with flat `ExpenseRow`s. `ExpenseForm` = single column of inset fields inside a raised `FormSection`, sticky primary submit bar on mobile (raised, safe-area aware). `SplitEditor` = `SegmentedControl` + flat rows with inset amount fields; the "remaining Rs X" line turns `danger` when not zero and `success` with a check when zero. AI components (`AiExpenseBox`, `AiQuestionPrompt`, `AiFilledChip`): box is an inset textarea in a raised card, chips are flat `primary-soft` pills.
- **settlements:** `SettlementCard` is a raised card (these are the few important actionable items), status as `StatusChip`, Confirm button primary, Reject secondary with danger text. `SettlementList` tabs use the inset-track `Tabs`.
- **groups:** `GroupCard` raised md; hover lifts one level on desktop.
- **dashboard:** `CategoryPieChart` and `MonthlySpendBarChart` inside `ChartCard`; `PendingActionsCard` raised with an amber `StatusChip`.

---

## 6. Screen-by-screen notes

1. **Login / Signup:** raised card on `nm-bg`, inset fields, one primary button, link to the other page. Errors inline with icon.
2. **My Groups:** grid of raised `GroupCard`s with 24 px gaps; "Create group" primary button; empty state in a raised card.
3. **Group Overview:** `BalanceSummaryCard` hero, then Suggested payments, Pending actions, Member balances, Recent expenses. Mobile: one column, 16 px gaps. Desktop: 12-column grid, hero spans full width.
4. **Expenses:** `FilterBar` as one raised bar, then grouped lists. Load-more as secondary button.
5. **Add/Edit Expense:** amount field big and first; split section updates live; sticky submit bar on mobile.
6. **Expense Detail:** one raised card for the summary, a second for the share table (flat table inside), receipt thumbnail raised xs, actions at the bottom.
7. **Settle Up:** inset-track tabs (Suggested / Pending / History).
8. **Activity:** one raised card containing the flat feed.
9. **Members / Settings:** one raised card each; destructive actions in a separate "Danger zone" card with a `danger` hairline and filled danger confirm in the dialog.
10. **Profile:** theme toggle and Effects (Soft/Flat) toggle.

All loading, empty and error states keep the build plan's rule: every screen has all three.

---

## 7. Dark mode

Neumorphism is hardest in dark mode, so:

- Background `#1C222B` (not near-black), highlight shadow is very faint (`0.045` white), depth shadow `0.55` black. Do not use pure `#000`.
- Prefer slightly stronger `hairline` and `border-soft` in dark so edges stay readable.
- Filled primary button uses the light teal with dark text for contrast.
- Test every screen in both themes (Section 9).

---

## 8. Performance and robustness

- No per-row shadows in long lists (rows are flat). Max about 12 raised elements visible at once on a screen.
- Avoid `backdrop-filter` and animated blurs.
- Do not animate shadows on more than one element at a time.
- Skeletons pulse opacity only.
- Must stay smooth on a low-end Android phone at 375 px. Check by throttling CPU in Playwright (Chromium CDP `Emulation.setCPUThrottlingRate` at 4×) and confirming interactions still complete within the test timeouts.
- If a screen needs more than the cap above, convert the least important raised elements to flat.

---

## 9. Testing (Playwright only, no new tools)

Put these in `tests/e2e/design/`. Use `@playwright/test` features only (`toHaveScreenshot`, `emulateMedia`, `page.evaluate`, `boundingBox`). Write the small contrast helper as plain JS in `tests/helpers/contrast.js` (WCAG relative luminance formula). Do not add a contrast or accessibility library.

1. **Text contrast:** for a list of important selectors on each main screen (body text, muted text, `Money` values green/red, labels, button labels, chip text, nav labels), compute the text color against the effective background (walk up to the first non-transparent background). Fail if below 4.5:1 (3:1 for text ≥ 24 px or bold ≥ 18.7 px). Run in light, dark and flat modes.
2. **Non-text contrast:** inputs' `hairline` border color vs `nm-bg` ≥ 3:1; focus outline vs background ≥ 3:1.
3. **Focus visibility:** press Tab through Login, Add Expense and Settle screens; each focused element has a computed outline width ≥ 2 px.
4. **Every input has a visible boundary:** all `input`, `textarea`, `select` on the main screens have a non-zero border or `hairline` outline in computed style.
5. **Touch targets:** at 375 px, every visible button, link and input is ≥ 44 px tall (using `boundingBox`).
6. **No horizontal scroll** at 375 px on every main route.
7. **Flat fallback:** toggling Effects to Flat sets `data-nm="off"`, computed `box-shadow` of a Card contains no blur larger than 16 px, and screens remain usable. With `emulateMedia({ forcedColors: 'active' })` the page still renders and passes the focus test. If the installed Playwright supports `emulateMedia({ contrast: 'more' })`, assert the same auto-fallback; otherwise skip that single assertion and note it in `docs/DECISIONS.md`.
8. **Theme persistence:** reload keeps light/dark and Soft/Flat. No flash of the wrong theme (assert `data-nm` and theme class are set before the first paint by checking them on `DOMContentLoaded`).
9. **Visual snapshots (`toHaveScreenshot`):** Login, Group Overview, Expenses, Add Expense, Settle Up, Playground. For each: light and dark, desktop (1280 px) and mobile (375 px). Generate baselines on one machine/OS only and commit them; mask dynamic content (dates, relative times).
10. **Performance smoke:** with 4× CPU throttle, opening Add Expense and typing an amount completes inside the normal timeout. Count visible elements with a non-`none` box-shadow on the Expenses screen with 50 rows; fail if more than 25.
11. **Regression:** the existing full E2E scenario (3 users, expense, partial settlement, confirmation) still passes unchanged.

Add a **Playground "Neumorphism" section** (`/_playground`) that shows `Surface` in every variant and level, every base component, in light/dark and Soft/Flat, side by side. It is the visual reference and the screenshot target.

---

## 10. Rollout stages

### N0 — Tokens and tooling (Day 1)
- Add `theme/neumorphism.css`, color tokens, Tailwind plugin with `nm-*` utilities, HeroUI theme overrides, `data-nm` attribute logic with no-flash init, `Surface` component.
- Playground section with `Surface` variants.
**Done when:** Playground shows all `Surface` variants in 4 combinations (light/dark × soft/flat), contrast tests for the tokens pass, and no hex colors exist outside `theme/` and `lib/constants.ts`.

### N1 — Base components (Day 2–4)
- Restyle all of 5.1 using `Surface`/`nm-*`. Keep props unchanged.
**Done when:** every base component is in the Playground in all variants and states (default, hover, pressed, focus, disabled, error), tests 1–5 pass for them, and the old full E2E suite still passes.

### N2 — Shared and layout components (Day 5–6)
- Restyle 5.2 and 5.3: AppShell, Sidebar, TopBar, BottomNav with FAB, StatCard, BalanceBadge, EmptyState and the rest.
**Done when:** navigation works on mobile and desktop, bottom nav respects safe-area, tests 5 and 6 pass.

### N3 — Screens (Day 7–9)
- Apply Section 5.4 and 6 screen by screen in this order: Overview → Add Expense → Expenses → Settle Up → Groups → Auth → Detail/Activity/Members/Settings/Profile.
**Done when:** every screen matches the notes in Section 6, has loading/empty/error states, and visual snapshots are generated.

### N4 — Dark mode, flat fallback, performance (Day 10)
- Tune dark tokens, finish Effects toggle, auto-fallback media queries, run the throttled-CPU checks and fix hot spots.
**Done when:** tests 7, 8 and 10 pass.

### N5 — QA and real feedback (Day 11–12)
- Run the full Playwright suite on desktop and mobile projects.
- Show the Soft and Flat versions to 3–4 real users. Ask them to find and press the main actions without help. If anyone hesitates on what is pressable, strengthen the cue (border, label, fill) for that control and note it in `docs/DECISIONS.md`.
**Done when:** the full suite is green and the trial notes are recorded.

---

## 11. Definition of done (redesign)

- No change to API, DB, engine, routes or business logic. The existing E2E scenario passes.
- All soft-shadow styling comes only from `nm-*` utilities and CSS variables; no raw `box-shadow` or hex outside `theme/`.
- Pages and features contain no `nm-*` classes; only `components/ui` and `components/layout` do.
- Soft and Flat modes both work and persist; flat mode is automatic for `prefers-contrast: more` and `forced-colors`.
- Light and dark pass the contrast, focus, touch-target and no-horizontal-scroll tests.
- Dense data (tables, expense rows, activity, member rows) is flat.
- Playground shows the whole system; screenshots committed.
- `docs/DECISIONS.md` lists every changed token value and every skipped test assertion.

## 12. Do and Don't (quick reference for review)

| Do | Don't |
|---|---|
| Same color for page and surface | White cards on a grey page (old style) |
| One light source, top-left | Mixed shadow directions |
| Inset only for inputs and tracks | Inset on buttons or cards |
| Raised only on big shapes with space around | Raised on tiny elements, chips or table rows |
| Hairline border on every input | Shadow-only input boundaries |
| Color + icon + text for money meaning | Color alone for green/red |
| Flat banners for toasts and errors | Neumorphic toasts that blend into the page |
| Animate one shadow at a time | Animate shadows in lists |
