# DisbursePro — Enterprise Disbursement & Expense Management Platform

## Project Overview
An enterprise disbursement platform for the Zambian market — a control, visibility, and orchestration layer for enterprise money movement. Licensed custodians hold funds; the platform manages workflows, approvals, and audit trails. Think "Soldo/Pleo for emerging markets."

**Client:** Publicly traded technology company (competitive RFP)
**Status:** Prototype/design phase — no backend connected
**Sibling project:** D:\neobank — NeoBank digital banking prototype (same Savanna design system)
**GitHub:** https://github.com/stephencoduor/disbursement-platform

## Tech Stack
- **Frontend:** React 19 + Vite 8 + TypeScript 5 + Tailwind CSS v4 + shadcn/ui (base-ui)
- **Backend (planned):** Orchestration layer connecting to custodian APIs + mobile money providers
- **Design System:** Savanna — deep forest greens + warm golds (shared with NeoBank)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Font:** Geist Variable (via @fontsource-variable/geist)
- **Routing:** React Router v7 with lazy loading

## Design System — Savanna
Identical to NeoBank. CSS custom properties in oklch color space (defined in `src/index.css`):
- **Primary:** `oklch(0.45 0.1 160)` — Deep Forest Green (#2D6A4F)
- **Gold:** `oklch(0.78 0.14 80)` — Warm Gold accent (#E9B949)
- **Sidebar:** `oklch(0.22 0.06 160)` — Dark green sidebar
- **Background:** `oklch(0.99 0.005 100)` — Warm off-white (#FAFAF5)
- Full dark mode support via `.dark` class on `<html>`
- Theme toggle (light/dark/system) in all layout headers

## Pages (28 total)

### Auth (2 pages)
| Route | File | Description |
|-------|------|-------------|
| `/login` | `pages/auth/login.tsx` | Email/phone (+260) login with company code |
| `/register` | `pages/auth/register.tsx` | 4-step company registration |

### Platform Operator (5 pages)
| Route | File | Description |
|-------|------|-------------|
| `/platform` | `pages/platform/index.tsx` | System KPIs, volume/revenue charts, carrier distribution |
| `/platform/companies` | `pages/platform/companies.tsx` | Company table with wallet balance, users, status |
| `/platform/companies/:id` | `pages/platform/company-detail.tsx` | Company detail: wallet history, transactions, limits |
| `/platform/revenue` | `pages/platform/revenue.tsx` | Platform fee income, carrier pass-through, by-company |
| `/platform/settings` | `pages/platform/settings.tsx` | 3-tier limits, fee schedules, carrier integration status |

### Company Portal (16 pages)
| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `pages/dashboard/index.tsx` | Wallet balance card, quick actions, spend chart, recent |
| `/employees` | `pages/employees/index.tsx` | Employee registry with search, filter, pagination |
| `/employees/new` | `pages/employees/new.tsx` | Add employee: name, +260 phone, carrier, cost centre |
| `/employees/:id` | `pages/employees/detail.tsx` | Employee profile, disbursement history |
| `/employees/bulk-upload` | `pages/employees/bulk-upload.tsx` | CSV drag-drop, template, preview, validation |
| `/disburse` | `pages/disburse/single.tsx` | 3-step: select employee → amount/purpose/intent → review |
| `/disburse/bulk` | `pages/disburse/bulk.tsx` | Bulk CSV upload with batch preview and fee summary |
| `/disburse/review/:id` | `pages/disburse/review.tsx` | Full disbursement breakdown |
| `/approvals` | `pages/approvals/index.tsx` | Approval queue: pending/approved/rejected tabs |
| `/approvals/:id` | `pages/approvals/detail.tsx` | Approve/reject with comments |
| `/transactions` | `pages/transactions/index.tsx` | Filterable history with CSV/PDF export |
| `/transactions/:id` | `pages/transactions/detail.tsx` | Status timeline, fee breakdown, receipt upload |
| `/reports` | `pages/reports/index.tsx` | Charts: by purpose, employee, period, cost centre |
| `/settings` | `pages/settings/index.tsx` | 5 tabs: Profile, Users, Limits, Cost Centres, Workflows |
| `/audit-log` | `pages/audit-log/index.tsx` | Filterable action log with severity badges |
| `/coming-soon` | `pages/coming-soon/index.tsx` | Grid of Phase 2 feature cards |

### Phase 2 Previews (5 pages — visible but grayed out)
| Route | File | Description |
|-------|------|-------------|
| `/cards` | `pages/phase2/cards.tsx` | Corporate Cards mockup |
| `/deposits` | `pages/phase2/deposits.tsx` | Self-service Deposits preview |
| `/mobile-app` | `pages/phase2/mobile-app.tsx` | Employee App phone mockup |
| `/forex` | `pages/phase2/forex.tsx` | Multi-currency conversion preview |
| `/integrations` | `pages/phase2/integrations.tsx` | ERP integration grid |

## Architecture
```
src/
├── App.tsx                    # Router with 28 lazy-loaded routes
├── main.tsx                   # Entry point wrapped in ThemeProvider
├── index.css                  # Savanna design system tokens (light + dark)
├── components/
│   ├── layout/                # AuthLayout, PlatformLayout, CompanyLayout + sidebars
│   ├── shared/                # Domain components (fee-breakdown, status-badge, etc.)
│   └── ui/                    # 23 shadcn components + theme-toggle
├── data/
│   ├── types.ts               # All domain interfaces
│   ├── mock.ts                # Platform stats, company stats, audit log
│   ├── companies.ts           # 6 Zambian companies
│   ├── employees.ts           # 15 employees with carriers and cost centres
│   ├── disbursements.ts       # 11 disbursement transactions
│   └── fee-config.ts          # Fee calculation engine
├── lib/
│   ├── utils.ts               # cn() utility
│   ├── theme-context.tsx      # ThemeProvider + useTheme hook
│   └── format.ts              # fmtZMW(), fmtCompact(), fmtDate(), fmtPhone()
└── pages/                     # All 28 pages organized by module
```

### Layouts
- **AuthLayout** (`components/layout/auth-layout.tsx`) — Split screen: green brand panel + form. DisbursePro branding with Banknote icon.
- **PlatformLayout** (`components/layout/platform-layout.tsx`) — Platform Operator sidebar with [PLATFORM] badge. Nav: Dashboard, Companies, Revenue, Settings.
- **CompanyLayout** (`components/layout/company-layout.tsx`) — Company sidebar with wallet balance display, pending approvals badge, "Coming Soon" section with lock icons. Mobile responsive.

### User Roles
| Role | Access | Description |
|------|--------|-------------|
| Platform Operator | `/platform/*` | System-wide: manage companies, credit wallets, view revenue |
| Company Admin | `/dashboard`, `/settings` | Company-level: manage account, policies, users |
| Finance User | `/disburse`, `/employees` | Initiate disbursements, manage employees |
| Approver | `/approvals` | Review and approve/reject disbursements |
| Auditor | `/audit-log`, `/reports` | Read-only access to everything |

### Custody Model
The platform does NOT hold funds. Customer funds sit in wallets managed by a licensed custodian. The platform connects via API to query balances, initiate disbursements, and receive confirmations.

### Fee Model
- **Carrier fee:** Varies by carrier and intent (withdrawal ~2.5%, purchase ~0.5%)
- **Platform fee:** 1% (minimum ZMW 2)
- **3-tier limit hierarchy:** Network > Platform > Company (lowest wins)

### shadcn/ui Notes
Same as NeoBank — uses **base-ui** primitives (NOT Radix):
- `DropdownMenuTrigger` uses `render=` prop instead of `asChild`
- `Select.onValueChange` returns `(value: string | null)` — wrap with `(val) => setState(val ?? "")`
- Import path: `@/components/ui/*`

## Mock Data
All dummy data is **realistic Zambian context** — never lorem ipsum or generic names.
- Currency: ZMW (Zambian Kwacha)
- Phone format: +260 97X/96X/95X
- Mobile money carriers: Airtel Money, MTN MoMo, Zamtel Kwacha
- Platform operator: Chanda Mutale
- 6 companies: Copperbelt Transport (650 drivers), Lusaka Fresh Foods (180), Zambezi Logistics (420), Kafue Mining Supplies (95), Livingstone Tourism Group (210), Kitwe Construction (340)
- Primary company admin: Mwamba Kapumba, Finance Director, Copperbelt Transport
- 15 employees with Zambian names across cost centres (Northern Route, Southern Route, City Fleet, Long Haul, Maintenance)
- Disbursement purposes: fuel, trip allowance, repairs, meals, advances, salary, supplies

## Screenshots
34 screenshots in `screenshots/` (01-login through 34-approvals-dark), including 6 dark mode variants.

## Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
npm run build        # TypeScript check + production build
npx tsc --noEmit     # TypeScript check only
```

## Development Rules
- All mock data must use realistic Zambian names, locations, currencies (ZMW), phone numbers (+260)
- Never use lorem ipsum or generic test names
- Design system colors: use Tailwind classes with CSS vars (bg-primary, text-gold, etc.)
- Dark mode: `.dark` class on document root, all tokens defined in index.css
- Always verify `tsc --noEmit` + `vite build` pass after changes
- Save screenshots to `screenshots/` after completing visual changes
- Fee calculation uses pure functions in `data/fee-config.ts`
- Phase 2 pages must be visible but grayed out (per RFP requirement)

## RFP Context
- **Engagement:** MVP-first ($10K-$20K), then Full Build ($80K-$150K)
- **MVP scope:** Mobile money only, company-side tool (accountant's tool, not driver's tool)
- **Phase 2:** Corporate cards, self-service deposits, employee app, forex, ERP integrations
- **IP transfer:** Full source code handover at MVP completion
- **Reference platforms:** Soldo, Routable, Tipalti, Ramp
