# DisbursePro Disbursement Platform — Gap Analysis & Implementation Plan

**Product:** DisbursePro — Enterprise Disbursement & Expense Management Platform
**Client:** Publicly traded technology company (competitive RFP)
**MVP Budget:** USD 15,000
**Full Build Budget:** USD 95,000
**Date:** April 2026

---

## 1. Executive Summary

DisbursePro is an enterprise disbursement and expense management platform targeting Zambian companies that need to move money to field workers (drivers, miners, farm hands) via mobile money networks. The concept is "Soldo/Pleo for emerging markets" — structured, auditable mobile money disbursements replacing cash envelopes and ad-hoc transfers.

**What exists today:** A 28-page React prototype with the Lagoon design system (deep teal + turquoise + coral), a fully functional client-side fee calculation engine, realistic Zambian mock data (6 companies, 15 employees, 11 disbursement transactions), three layout systems (Auth, Platform Operator, Company Portal), and five Phase 2 preview pages. The prototype demonstrates every user-facing workflow: login, employee management, single and bulk disbursement with real-time fee calculation, approval workflows, transaction history, reporting dashboards, platform operator management, and audit logging.

**What does NOT exist:** No backend server, no database, no authentication system, no carrier API integration (Airtel Money, MTN MoMo, Zamtel Kwacha), no custodian wallet API, no real disbursement processing, no approval workflow engine, no audit trail persistence, and no deployment infrastructure.

**Key architectural decision:** DisbursePro is NOT a bank. It does not hold customer funds. All funds sit with a Bank of Zambia (BOZ) licensed custodian. The platform is an orchestration layer — it manages workflows, approvals, fee calculations, and audit trails. This custody separation is a regulatory requirement and a core architectural principle. Apache Fineract is optional and only useful if the custodian requires a general ledger (GL) reconciliation layer.

**The gap:** The prototype is approximately 30% of the total product. The remaining 70% is backend infrastructure, carrier integrations, security hardening, and production deployment. This document maps every gap, prioritizes them, and provides a sprint-by-sprint implementation plan.

---

## 2. Current State Assessment

### 2.1 What Is Built

| Category | Details |
|---|---|
| **Pages** | 28 total: 2 auth, 5 platform operator, 16 company portal, 5 Phase 2 previews |
| **Tech Stack** | React 19 + Vite 8 + TypeScript 5 + Tailwind CSS v4 + shadcn/ui (base-ui) |
| **Design System** | Lagoon v4 — deep teal (#0B3B3C), turquoise (#2EC4B6), coral CTA (#F4845F), glassmorphic headers, blue-tinted backgrounds (#E8F4F8), light-only |
| **Charts** | Recharts — spend by purpose (donut), volume over time (line/bar), carrier distribution (pie) |
| **Icons** | Lucide React |
| **Font** | Plus Jakarta Sans Variable |
| **Routing** | React Router v7 with lazy loading for all 28 routes |
| **Fee Engine** | Pure TypeScript functions in `src/data/fee-config.ts` — carrier rates, platform fees, levy placeholder, 3-tier limit validation |
| **Type System** | Complete domain interfaces in `src/data/types.ts` — 18 types covering Company, Employee, Disbursement, FeeBreakdown, AuditEntry, PlatformStats, CompanyStats |
| **Mock Data** | 6 Zambian companies, 15 employees with carriers and cost centres, 11 disbursement transactions, platform stats, audit log entries |
| **Formatting** | `src/lib/format.ts` — ZMW currency formatting, compact numbers, dates, phone numbers |

### 2.2 Pages by Module

**Auth (2 pages)**
- Login with company code + email/phone (+260) + password
- 4-step company registration wizard

**Platform Operator (5 pages)**
- Dashboard with system KPIs, volume/revenue charts, carrier distribution
- Company management table with wallet balance, users, status
- Company detail with wallet history, transactions, limits
- Revenue tracking — platform fee income, carrier pass-through, by-company breakdown
- Settings — 3-tier limits, fee schedules, carrier integration status

**Company Portal (16 pages)**
- Dashboard with wallet balance card, quick actions, spend chart, recent transactions
- Employee registry with search, filter, pagination
- Add employee form (name, +260 phone, carrier, cost centre)
- Employee detail with disbursement history
- Bulk employee CSV upload with drag-drop, template, preview, validation
- Single disbursement — 3-step wizard (select employee, amount/purpose/intent, review)
- Bulk disbursement — CSV upload with batch preview and fee summary
- Disbursement review with full breakdown
- Approval queue with pending/approved/rejected tabs
- Approval detail with approve/reject actions
- Transaction history with filterable columns and CSV/PDF export buttons
- Transaction detail with status timeline, fee breakdown, receipt upload placeholder
- Reports — charts by purpose, employee, period, cost centre
- Settings — 5 tabs (Profile, Users, Limits, Cost Centres, Workflows)
- Audit log with filterable action log and severity badges
- Coming Soon — Phase 2 feature card grid

**Phase 2 Previews (5 pages — visible but grayed out)**
- Corporate Cards, Self-service Deposits, Employee Mobile App, Forex, ERP Integrations

### 2.3 Fee Engine (Working)

The fee calculation engine in `src/data/fee-config.ts` is fully functional:

- **Carrier fees:** Withdrawal 2.5%, Purchase 0.5% (all carriers)
- **Platform fee:** 1% of net amount, minimum ZMW 2
- **Levy:** 0% (placeholder for future government levies)
- **Gross amount:** net + carrier fee + platform fee + levy
- **3-tier limit validation:** Network (ZMW 10,000) > Platform (ZMW 5,000/txn, ZMW 8,000/employee/day, ZMW 500,000/company/day) > Company (configurable, must be <= platform)
- All calculations use pure functions with rounding to 2 decimal places

### 2.4 Data Model (Defined)

Complete TypeScript interfaces exist for all domain entities:
- `Company` — 13 fields including wallet balance, available balance, held balance
- `Employee` — 13 fields including NRC, carrier, cost centre, total disbursed
- `Disbursement` — 22 fields covering full lifecycle from initiation through approval to completion
- `FeeBreakdown` — 5 fields: net, carrier fee, platform fee, levy, gross
- `AuditEntry` — 8 fields: action, category, user, role, details, severity, timestamp, IP
- `PlatformStats` and `CompanyStats` — dashboard aggregation types
- Enums for carrier, purpose, intent, status, role, company status, employee status

### 2.5 What Does NOT Work

| Component | Status |
|---|---|
| Authentication | Mock only — no JWT, no Keycloak, no session management |
| Data persistence | All data is in-memory mock — no database |
| Carrier API integration | No connection to Airtel Money, MTN MoMo, or Zamtel Kwacha |
| Custodian wallet API | No connection to licensed custodian — wallet balance is mock |
| Disbursement processing | Submit button updates mock state — no actual money movement |
| Approval workflow engine | UI works, but no backend state machine or notification system |
| Audit trail | Mock data only — no immutable append-only log |
| CSV/PDF export | Buttons exist — no actual file generation |
| Bulk processing | CSV upload UI works — no backend queue or batch processing |
| Notifications | No push notifications, no email, no SMS |
| Search | Client-side only — no server-side search or indexing |

---

## 3. Gap Assessment by Feature

### 3.1 CRITICAL GAPS (No Foundation — Must Build Before Launch)

#### Gap C-1: Mobile Money Carrier API Integration

**Impact:** Core product function — without carrier APIs, no money moves. This is the entire value proposition.

**Current state:** Zero carrier integration. Fee calculation is client-side only.

**Required integrations:**

| Carrier | Market Share | API Type | Key Endpoints |
|---|---|---|---|
| Airtel Money | ~45% | REST API (Airtel Africa OpenAPI) | B2C disbursement, transaction status, balance query |
| MTN MoMo | ~35% | REST API (MTN MOMO API) | Disbursement, transaction status, account validation |
| Zamtel Kwacha | ~20% | REST/SOAP (Zamtel API) | B2C transfer, transaction status, recipient validation |

**Architecture required:**
```
DisbursePro Backend -> Carrier Abstraction Layer -> {Airtel API, MTN API, Zamtel API}
                    -> Webhook receivers for async confirmations
                    -> Retry/failover logic (carrier-specific timeout handling)
                    -> Transaction reference mapping (internal ref -> carrier ref)
                    -> Carrier health monitoring (success rates, latency)
```

**Key challenges:**
- Each carrier has different API standards, authentication methods, and webhook formats
- Zamtel API is historically less reliable (85% success rate vs. 98%+ for Airtel/MTN)
- Carrier sandbox environments may not reflect production behavior
- Need idempotency keys to prevent double-disbursement on network timeout/retry
- Carrier rate limits and daily caps must be respected

**Effort:** 4-5 weeks (1.5 weeks per carrier + abstraction layer + testing)

#### Gap C-2: Custodian Wallet API Integration

**Impact:** Regulatory requirement — DisbursePro cannot hold funds. Must connect to a BOZ-licensed custodian.

**Current state:** Wallet balance is mock data (ZMW 1,245,000). No custodian relationship exists.

**Required:**
- Identify and contract with a BOZ-licensed custodian (e.g., Stanbic Bank Zambia, Atlas Mara, ZANACO)
- API integration for: balance queries, hold/release operations, debit confirmations
- Real-time or near-real-time balance synchronization
- Reconciliation engine to match platform ledger with custodian records

**Hold-on-approval pattern (critical):**
```
Submit disbursement -> API call: place hold on custodian wallet (gross amount)
Approve -> API call: convert hold to debit, initiate carrier disbursement
Reject -> API call: release hold
Fail -> API call: release hold
```

**Effort:** 3-4 weeks (custodian onboarding is the bottleneck — may take 4-8 weeks for commercial agreement)

#### Gap C-3: Authentication & Authorization (Keycloak)

**Impact:** Security blocker — cannot go to production with mock authentication. Company code scoping, RBAC with 5 roles, JWT session management are all P0 requirements.

**Current state:** Login page exists with form fields. No actual authentication, no JWT, no role enforcement, no session management.

**Required:**
- Keycloak deployment (or equivalent OAuth2/OIDC provider)
- Company code scoping — all data access scoped to authenticated company
- 5 roles: platform_operator, company_admin, finance_user, approver, auditor
- JWT access tokens (15-min expiry) + refresh tokens (30-day expiry)
- Single active session per user
- Account lockout after 5 failed attempts
- Password policy enforcement (8+ chars, uppercase, lowercase, digit, special)
- Auth event audit logging (login, failure, password change, session timeout)

**Effort:** 2-3 weeks

#### Gap C-4: Disbursement Processing Engine

**Impact:** Without a backend processing engine, the entire disbursement lifecycle is non-functional.

**Current state:** The 3-step disbursement wizard works in the UI but only updates mock state.

**Required:**
- State machine for disbursement lifecycle: draft -> pending_approval -> approved -> processing -> completed/failed
- Idempotent processing with unique references (format: `{TYPE}-{COST_CENTRE}-{DATE}-{SEQ}`)
- Hold-on-submit, release-on-reject/fail, debit-on-complete pattern
- Carrier API dispatch based on employee's carrier assignment
- Async confirmation handling (webhook receivers for carrier callbacks)
- Retry logic for transient carrier failures (exponential backoff, max 3 retries)
- Dead letter queue for permanently failed disbursements
- Real-time status updates to connected clients

**Effort:** 3-4 weeks

### 3.2 HIGH GAPS (Significant Build Required)

#### Gap H-1: Approval Workflow Engine

**Impact:** Core compliance requirement — separation of duties between initiator and approver. Currently UI-only.

**Current state:** Approval queue page shows mock pending/approved/rejected tabs. Approve/reject buttons update local state.

**Required:**
- Backend workflow engine with state transitions and role-based permissions
- Initiator cannot approve their own disbursements (server-side enforcement)
- Batch approval — approve/reject entire batch or individual items
- Approval triggers: wallet hold placement (submit), carrier dispatch (approve), hold release (reject)
- Notification triggers: push/email to approver on new pending, to initiator on approve/reject
- Approval SLA tracking — time from submission to decision
- Escalation rules (Phase 2) — auto-escalate after N hours

**Effort:** 2-3 weeks

#### Gap H-2: Bulk Processing Queue

**Impact:** Key differentiator — companies disburse to 50+ drivers in a single morning. Bulk upload is P0.

**Current state:** CSV upload UI with drag-drop, template download, and validation preview. No backend processing.

**Required:**
- Job queue (BullMQ or similar) for batch processing
- Batch validation: per-row validation against same rules as single disbursement
- Batch fee summary calculation (total net, carrier fees by carrier, platform fees, gross)
- Batch submission as single approval unit with batch reference (BATCH-YYYYMMDD-NNN)
- Sequential carrier dispatch for approved batch items
- Real-time progress tracking (12/50 completed, 1 failed, 37 processing)
- Partial approval support — approve some, reject some
- Failed item retry
- Batch completion notification

**Effort:** 2-3 weeks

#### Gap H-3: Fee Schedule Administration

**Impact:** Platform operator must be able to adjust carrier rates, platform fee, and levy without code deployments.

**Current state:** Fee rates are hardcoded constants in `fee-config.ts`. The Platform Settings page shows fee configuration UI but it does not persist.

**Required:**
- Database-stored fee schedules with effective dates
- Admin API for CRUD on fee schedules
- Historical fee preservation — disbursements retain the fee rates at time of creation
- Fee schedule change audit logging
- Automatic propagation to client-side fee calculator (API endpoint for current rates)

**Effort:** 1-2 weeks

#### Gap H-4: Immutable Audit Trail

**Impact:** BOZ regulatory requirement — 7-year retention of all financial records. Complete audit trail for every disbursement, wallet movement, and admin action.

**Current state:** Audit log page shows mock data with 8 fields (action, category, user, role, details, severity, timestamp, IP).

**Required:**
- Append-only audit log table (no UPDATE, no DELETE — ever)
- Every state-changing action logged: disbursement lifecycle, wallet credits/debits/holds, user management, settings changes, login events
- Fields: timestamp, userId, companyId, action, category, before/after values, severity, IP address, user agent
- Server-side enforcement (middleware/interceptors)
- 7-year retention policy
- Tamper detection (hash chaining or similar)
- Export to CSV for compliance reviews

**Effort:** 2 weeks

### 3.3 MEDIUM GAPS (Partial Foundation or Lower Priority MVP)

#### Gap M-1: Real-Time Notifications

**Impact:** Approvers need push notifications for pending disbursements. Initiators need confirmation of approve/reject. Finance directors need low-balance alerts.

**Current state:** No notification infrastructure.

**Required:**
- Push notifications (FCM for web, APNs for Phase 2 mobile app)
- Email notifications via transactional email provider (SendGrid, Mailgun, or Africa's Talking)
- SMS notifications for critical events via Africa's Talking or Zamtel Bulk SMS
- Notification types: new pending approval, approval/rejection, disbursement completion/failure, low wallet balance, daily digest
- User preference management (which channels, which events)

**Effort:** 2 weeks

#### Gap M-2: PDF and CSV Report Export

**Impact:** Finance directors need exportable reports for board presentations and BOZ compliance reviews.

**Current state:** Export buttons exist in the UI. No actual file generation.

**Required:**
- CSV export: filtered transaction list with all columns, ISO 8601 dates, 2-decimal amounts
- PDF export: company letterhead, transaction tables, summary statistics, digital signature placeholder
- Async generation for large exports (>1,000 rows) with download notification
- Export file naming convention: `{company}_transactions_{start}_{end}.csv`
- Maximum 10,000 rows per CSV export

**Effort:** 1-2 weeks

#### Gap M-3: Employee CSV Validation (Server-Side)

**Impact:** Bulk employee upload is a core workflow. Client-side validation exists but server-side validation is needed for data integrity.

**Current state:** CSV upload UI with client-side validation (phone format, NRC format, carrier matching).

**Required:**
- Server-side validation of all CSV rows against same rules
- Phone number uniqueness check within company
- NRC format validation (XXXXXX/XX/X)
- Carrier-phone prefix matching (Airtel: 97X/96X, MTN: 96X/76X, Zamtel: 95X/55X) with soft warning for ported numbers
- Cost centre existence check against company configuration
- Error CSV export with appended error column
- Commit-only-valid-rows with user confirmation

**Effort:** 1 week

#### Gap M-4: API Rate Limiting and Security Hardening

**Impact:** Production security requirement — prevent abuse, DDoS, and brute-force attacks.

**Current state:** No backend exists, so no rate limiting.

**Required:**
- Rate limiting: 60 requests/minute per user (configurable)
- CORS whitelisting
- CSRF protection
- Input validation and sanitization on all API endpoints
- SQL injection prevention (parameterized queries)
- Request/response logging (excluding sensitive fields)
- API key management for carrier and custodian integrations
- TLS 1.3 enforcement

**Effort:** 1-2 weeks

### 3.4 LOW GAPS (Phase 2 / Nice-to-Have)

#### Gap L-1: Corporate Cards

**Current state:** Phase 2 preview page exists (`/cards`) with mockup.
**Required:** BaaS partner integration (Marqeta, Stripe Issuing, or Paymentology for Southern Africa). Virtual and physical card issuing, spend controls, real-time notifications.
**Effort:** 6-8 weeks
**Budget:** Part of Full Build

#### Gap L-2: Multi-Currency Forex

**Current state:** Phase 2 preview page exists (`/forex`) with conversion preview.
**Required:** FX rate feeds (BOZ reference rates), multi-currency wallet support, cross-border disbursement to SADC countries.
**Effort:** 3-4 weeks
**Budget:** Part of Full Build

#### Gap L-3: Employee Mobile App

**Current state:** Phase 2 preview page exists (`/mobile-app`) with phone mockup.
**Required:** Flutter app for iOS + Android — view disbursement history, balance, expense claims, push notifications.
**Effort:** 6-8 weeks
**Budget:** Part of Full Build

#### Gap L-4: Self-Service Deposits

**Current state:** Phase 2 preview page exists (`/deposits`) with deposit flow preview.
**Required:** C2B mobile money collection, bank transfer auto-reconciliation, standing orders.
**Effort:** 3-4 weeks
**Budget:** Part of Full Build

#### Gap L-5: ERP Integrations

**Current state:** Phase 2 preview page exists (`/integrations`) with grid of ERP logos.
**Required:** Sage, QuickBooks, Xero, Pastel (Sage Pastel) connectors. REST webhook API for custom ERPs.
**Effort:** 4-6 weeks
**Budget:** Part of Full Build

---

## 4. Apache Fineract Assessment

### 4.1 Is Fineract Needed?

**Short answer: No, not for the MVP. Possibly useful for Phase 2 GL reconciliation.**

DisbursePro is NOT a bank. It does not offer savings accounts, loans, interest calculations, or deposit products. Fineract's core strengths — double-entry GL, loan engine, savings engine, multi-currency — are not required for a disbursement orchestration platform.

### 4.2 Where Fineract Could Help

| Use Case | Fineract Feature | Verdict |
|---|---|---|
| Company wallet ledger | Savings account per company | Overkill — a simple balance table with audit trail suffices |
| Fee tracking | GL journal entries for fee income | Useful if the custodian wants Fineract-compatible reporting |
| Reconciliation | Fineract GL vs. custodian records | Useful for Phase 2 automated reconciliation |
| Multi-currency | Multi-currency savings products | Only relevant in Phase 2 (forex feature) |
| Regulatory reporting | Fineract reporting module | Useful if BOZ requires standardized core banking reports |

### 4.3 Recommendation

**MVP:** Skip Fineract. Build a lightweight wallet ledger in PostgreSQL with append-only transactions and double-entry principles. This gives 90% of the value at 10% of the complexity.

**Full Build:** Re-evaluate if the custodian partner requires Fineract-compatible GL reporting or if multi-currency support demands a proven double-entry engine. If so, Fineract can serve as the accounting backbone behind the DisbursePro API layer.

### 4.4 Architecture Without Fineract

```
DisbursePro React Frontend
        |
        v
DisbursePro API (NestJS)
        |
   +---------+---------+---------+
   |         |         |         |
   v         v         v         v
Keycloak  PostgreSQL  BullMQ   Redis
(Auth)    (Data +     (Jobs)   (Cache +
          Audit Log)           Sessions)
   |
   +---> Carrier APIs (Airtel, MTN, Zamtel)
   +---> Custodian API (Wallet operations)
   +---> Notification Services (FCM, Email, SMS)
```

---

## 5. Technology Recommendations

### 5.1 Backend Stack

| Component | Technology | Rationale |
|---|---|---|
| **API Server** | NestJS (TypeScript) | Same language as frontend (TypeScript), excellent for structured enterprise APIs, built-in DI, guards, interceptors, pipes. Team can share types between frontend and backend. |
| **Database** | PostgreSQL 16 | Proven for financial data, ACID compliance, partitioned tables for transactions, jsonb for flexible metadata, excellent Zambian hosting options. |
| **Job Queue** | BullMQ (Redis-backed) | Batch disbursement processing, retry logic, dead letter queues, real-time progress tracking. Lightweight alternative to Kafka for MVP scale. |
| **Cache** | Redis 7 | Session store, rate limiting counters, carrier health status, wallet balance cache (30-second TTL). |
| **Auth** | Keycloak 24 | OAuth2/OIDC, company realm scoping, 5 roles via realm roles, JWT with custom claims (companyId, role), account lockout, password policy. |
| **ORM** | Prisma or TypeORM | Type-safe database access matching the existing TypeScript interfaces. |
| **Validation** | Zod | Runtime validation matching TypeScript types. Share schemas between frontend and backend. |

### 5.2 Infrastructure

| Component | Technology | Purpose |
|---|---|---|
| **Cloud** | AWS (af-south-1 Cape Town) or Azure South Africa | Data residency compliance — Southern Africa region |
| **Container** | Docker + ECS Fargate (or EKS for Full Build) | Stateless API containers behind load balancer |
| **CI/CD** | GitHub Actions | Build, test, deploy pipeline with staging and production environments |
| **Monitoring** | Grafana Cloud + Sentry | Metrics, alerting, error tracking. Carrier health dashboards. |
| **Secrets** | AWS Secrets Manager | Carrier API keys, custodian credentials, Keycloak secrets |
| **CDN** | CloudFront | React app static assets |
| **WAF** | AWS WAF | DDoS protection, rate limiting at edge |
| **Logging** | CloudWatch + structured JSON logs | Centralized logging with carrier transaction correlation |

### 5.3 Event Architecture (Full Build)

For the MVP, BullMQ handles all async processing. For the Full Build at scale (100+ companies, 10,000 disbursements/day), introduce Kafka:

| Event | Producer | Consumer(s) |
|---|---|---|
| `disbursement.submitted` | API Server | Approval Engine, Wallet Service (hold) |
| `disbursement.approved` | Approval Engine | Carrier Dispatcher, Notification Service |
| `disbursement.completed` | Carrier Dispatcher | Wallet Service (debit), Notification Service, Audit Logger |
| `disbursement.failed` | Carrier Dispatcher | Wallet Service (release), Notification Service, Retry Queue |
| `wallet.credited` | Platform API | Company Dashboard (WebSocket), Audit Logger |

### 5.4 Why NOT Kafka for MVP

Kafka adds operational complexity (ZooKeeper/KRaft, topic management, consumer groups) that is not justified at MVP scale (5 companies, 5,000 disbursements/month). BullMQ provides the same job queue semantics with Redis as the only dependency. Graduate to Kafka when transaction volume exceeds 50,000/month.

---

## 6. MVP Scope — 12 Weeks, USD 15,000

### 6.1 MVP Definition

The MVP is a "company-side tool" — an accountant's platform for managing structured mobile money disbursements with approval workflows. Employees are passive recipients who receive funds on their existing mobile money wallets.

**In scope:**
- Authentication with Keycloak (company code + email/phone + password, 5 roles, JWT)
- Employee registry (CRUD, CSV bulk upload with validation)
- Single disbursement (3-step wizard with real-time fee calculation)
- Bulk disbursement (CSV upload, batch validation, batch fee summary)
- Approval workflows (pending queue, approve/reject with comments, batch approval)
- Wallet management (balance display, hold-on-submit, release-on-reject)
- Transaction history with CSV export
- Platform operator dashboard (company management, wallet crediting, revenue tracking)
- Carrier integration (Airtel Money + MTN MoMo — two of three carriers)
- Audit trail (immutable, append-only)
- Reports (spend by purpose, employee, period, cost centre)

**Out of scope for MVP:**
- Zamtel Kwacha integration (add in Sprint 4 or Full Build)
- PDF export
- Push notifications (email only for MVP)
- MFA
- Company self-registration (platform operator onboards companies manually)
- IP restrictions
- Approval delegation and auto-approval
- Employee mobile app
- Corporate cards, forex, deposits, ERP integrations

### 6.2 Sprint Plan

#### Sprint 1: Foundation (Weeks 1-4) — USD 5,000

| Week | Deliverable | Details |
|---|---|---|
| 1 | Project scaffolding | NestJS project, PostgreSQL schema (Prisma), Docker Compose, CI/CD pipeline |
| 1-2 | Keycloak deployment + auth integration | Company realm, 5 roles, JWT middleware, login/logout API, password policy |
| 2 | Database schema | Companies, employees, disbursements, wallet_transactions, audit_log, fee_schedules tables |
| 2-3 | Employee API | CRUD endpoints, CSV bulk upload with server-side validation, search/filter/pagination |
| 3-4 | Wallet ledger | Balance tracking, hold/release/debit operations, transaction log, platform operator crediting |
| 4 | Fee engine (server-side) | Port `fee-config.ts` to backend, database-stored fee schedules, fee calculation API |
| 4 | Audit trail middleware | Append-only audit log, automatic logging of all state changes via NestJS interceptors |
| 4 | Frontend integration | Connect React app to live APIs, replace mock data imports with API calls, auth flow |

#### Sprint 2: Core Disbursement (Weeks 5-8) — USD 5,000

| Week | Deliverable | Details |
|---|---|---|
| 5-6 | Carrier abstraction layer | Unified interface for Airtel Money + MTN MoMo APIs (B2C disbursement, status query, balance check) |
| 5-6 | Carrier sandbox integration | Register developer accounts, implement auth flows, test B2C disbursements in sandbox |
| 6-7 | Disbursement processing engine | State machine (draft -> pending -> approved -> processing -> completed/failed), idempotency, reference generation |
| 7 | Approval workflow engine | Backend state transitions, role-based permissions (initiator != approver), batch approval/reject |
| 7-8 | Hold-on-approval pattern | Wallet hold on submit, release on reject/fail, debit on complete — integrated with custodian API |
| 8 | Bulk processing queue | BullMQ job queue for batch disbursements, sequential carrier dispatch, progress tracking |
| 8 | Email notifications | Transactional email for: pending approval, approved/rejected, completed/failed, low balance |

#### Sprint 3: Production Readiness (Weeks 9-12) — USD 5,000

| Week | Deliverable | Details |
|---|---|---|
| 9 | Carrier production integration | Airtel Money + MTN MoMo production credentials, end-to-end testing with real carrier APIs |
| 9-10 | Reports and CSV export | Server-side report generation (spend by purpose/employee/period/cost centre), CSV export with filtering |
| 10 | Platform operator features | Company management API, wallet crediting, revenue tracking, fee schedule admin, carrier status |
| 10-11 | Security hardening | Rate limiting, CORS, CSRF, input validation, SQL injection prevention, TLS 1.3, API key rotation |
| 11 | Integration testing | End-to-end test suite: create company -> add employees -> disburse -> approve -> carrier confirmation |
| 11-12 | Staging deployment | AWS af-south-1 (Cape Town), Docker + ECS Fargate, RDS PostgreSQL, ElastiCache Redis, Keycloak on ECS |
| 12 | UAT + bug fixes | User acceptance testing with client, bug fixes, performance tuning, load testing (k6) |
| 12 | Production deployment | Blue-green deployment, monitoring setup (Grafana + Sentry), runbook documentation |

---

## 7. Full Build Scope — USD 95,000, 6 Months

The Full Build adds corporate cards, self-service deposits, employee mobile app, multi-currency forex, ERP integrations, and scales the platform to 100+ companies.

### 7.1 Phase Breakdown

| Phase | Scope | Duration | Cost |
|---|---|---|---|
| Phase 1 (MVP) | Core disbursement + 2 carriers + auth + wallet | 12 weeks | USD 15,000 |
| Phase 2 | Zamtel integration + MFA + push notifications + PDF export | 2 weeks | USD 5,000 |
| Phase 3 | Corporate cards (BaaS integration) | 4 weeks | USD 15,000 |
| Phase 4 | Employee mobile app (Flutter) | 6 weeks | USD 15,000 |
| Phase 5 | Self-service deposits + forex + multi-currency | 4 weeks | USD 12,000 |
| Phase 6 | ERP integrations (Sage, QuickBooks, Xero, Pastel) | 4 weeks | USD 12,000 |
| Phase 7 | Scale + compliance + advanced features | 4 weeks | USD 10,000 |
| Phase 8 | QA, pen testing, compliance documentation | 2 weeks | USD 6,000 |
| Contingency | Scope changes, carrier delays, BaaS onboarding | — | USD 5,000 |
| **TOTAL** | | **~26 weeks** | **USD 95,000** |

Note: Phases 4 and 5 overlap (separate team tracks), so calendar time is approximately 24 weeks (6 months).

### 7.2 Phase 3-8 Detail

**Phase 3: Corporate Cards (USD 15,000)**
- BaaS partner evaluation and selection (Paymentology for Southern Africa, or Marqeta/Stripe)
- Virtual card issuing API integration
- Physical card ordering and fulfillment
- Spend controls: per-card limits, MCC restrictions, geographic restrictions
- Card transaction processing via webhooks
- Card management: freeze/unfreeze, PIN, replacement
- Card transaction reconciliation with wallet ledger

**Phase 4: Employee Mobile App (USD 15,000)**
- Flutter project setup with Riverpod state management
- Authentication (Keycloak PKCE flow)
- Disbursement history view (received funds, amounts, purposes, dates)
- Push notifications (FCM + APNs) for incoming disbursements
- Expense claim submission with receipt photo capture
- Profile management (phone number, carrier preference)
- Offline-first with local SQLite (Drift) and background sync

**Phase 5: Self-Service Deposits + Forex (USD 12,000)**
- C2B mobile money collection (Airtel, MTN, Zamtel) for wallet top-up
- Bank transfer auto-reconciliation using unique reference codes
- Standing order configuration for recurring bank transfers
- Multi-currency wallet support (ZMW, USD, ZAR, BWP, MWK)
- FX rate feeds from BOZ reference rates
- Cross-border disbursement to SADC countries

**Phase 6: ERP Integrations (USD 12,000)**
- Sage two-way sync (employee master data import, disbursement journal export)
- QuickBooks integration (journal entries, QB classes mapped to cost centres)
- Xero API integration (transaction export, bank feed reconciliation)
- Pastel (Sage Pastel) export for payroll and expense reporting
- Custom REST API with webhook notifications for proprietary ERPs

**Phase 7: Scale + Advanced Features (USD 10,000)**
- Kafka event streaming (replace BullMQ at scale)
- WebSocket real-time updates (wallet balance, disbursement status)
- Approval delegation and escalation rules
- Threshold-based auto-approval
- Company self-registration with platform operator review
- MFA via SMS OTP for high-value disbursements
- IP restriction configuration
- Advanced reporting: scheduled reports, budget vs. actual comparison

**Phase 8: QA + Compliance (USD 6,000)**
- Third-party penetration testing
- Load testing (k6/Gatling) — 10,000 disbursements/day target
- BOZ compliance documentation
- SOC2 evidence collection
- Data residency audit
- Disaster recovery testing (RTO < 1 hour, RPO < 15 minutes)
- User documentation and training materials

---

## 8. Budget Breakdown — Sprint by Sprint

### 8.1 MVP Budget (USD 15,000)

| Sprint | Weeks | Focus | Backend | Frontend | Infra | Cost |
|---|---|---|---|---|---|---|
| Sprint 1 | 1-4 | Foundation | NestJS + Keycloak + DB + Employee API + Wallet + Audit | Auth flow, API integration, replace mocks | Docker, CI/CD, dev environment | USD 5,000 |
| Sprint 2 | 5-8 | Core Disbursement | Carrier APIs + Processing Engine + Approvals + Bulk Queue | Disbursement flow, approval flow, bulk upload | Carrier sandbox accounts | USD 5,000 |
| Sprint 3 | 9-12 | Production | Carrier production + Reports + Platform admin + Security | Reports, CSV export, platform operator | AWS deployment, monitoring | USD 5,000 |

### 8.2 Full Build Budget (USD 95,000)

| Phase | Scope | Duration | Cost | Running Total |
|---|---|---|---|---|
| MVP (Sprints 1-3) | Core disbursement platform | 12 weeks | USD 15,000 | USD 15,000 |
| Phase 2 | Zamtel + MFA + push + PDF | 2 weeks | USD 5,000 | USD 20,000 |
| Phase 3 | Corporate cards | 4 weeks | USD 15,000 | USD 35,000 |
| Phase 4 | Employee mobile app | 6 weeks | USD 15,000 | USD 50,000 |
| Phase 5 | Deposits + forex | 4 weeks | USD 12,000 | USD 62,000 |
| Phase 6 | ERP integrations | 4 weeks | USD 12,000 | USD 74,000 |
| Phase 7 | Scale + advanced | 4 weeks | USD 10,000 | USD 84,000 |
| Phase 8 | QA + compliance | 2 weeks | USD 6,000 | USD 90,000 |
| Contingency | Buffer | — | USD 5,000 | USD 95,000 |

### 8.3 Third-Party Cost Estimates (Client Responsibility)

| Service | Provider | Est. Monthly Cost | Notes |
|---|---|---|---|
| Cloud infrastructure | AWS af-south-1 | USD 300-800/mo | ECS + RDS + ElastiCache + S3 |
| Keycloak hosting | Self-hosted on ECS | Included in infra | Or use Auth0 at USD 200-500/mo |
| Carrier API fees | Airtel/MTN/Zamtel | Variable | Per-transaction fees passed to end user |
| Custodian fees | Stanbic/ZANACO/Atlas Mara | Variable | Wallet custody + API access fees |
| Email (transactional) | SendGrid / Africa's Talking | USD 20-100/mo | Per-email pricing |
| SMS notifications | Africa's Talking | USD 50-200/mo | Per-SMS pricing (Zambian rates) |
| Monitoring | Grafana Cloud + Sentry | USD 50-150/mo | Metrics + error tracking |
| Domain + SSL | Various | USD 20/mo | Already covered if existing |
| BaaS partner (Phase 3+) | Paymentology / Marqeta | Variable | Per-card + per-transaction fees |

---

## 9. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-1 | **Custodian onboarding delay** — BOZ-licensed custodian commercial agreement takes longer than expected | HIGH | CRITICAL | Begin custodian conversations in Week 1. Identify 3 potential partners (Stanbic, ZANACO, Atlas Mara). Use mock custodian API for Sprint 1-2 development. Target signed agreement by Week 6. |
| R-2 | **Carrier API instability** — Zamtel historically unreliable (85% success rate); Airtel/MTN sandbox may not reflect production | HIGH | HIGH | Build carrier health monitoring from Day 1. Implement automatic failover to SMS notification when API is degraded. Configure retry logic with exponential backoff. Test in sandbox extensively before production. |
| R-3 | **Carrier sandbox access delay** — Developer account approval for Airtel Africa and MTN MOMO APIs can take 2-4 weeks | MEDIUM | HIGH | Apply for sandbox access in Week 1 (before Sprint 2 starts). Use mock carrier responses for initial development. Engage carrier developer relations contacts early. |
| R-4 | **BOZ regulatory requirements** — Bank of Zambia may impose unexpected compliance requirements on the platform | MEDIUM | HIGH | Engage regulatory counsel early. Custody model (platform does NOT hold funds) reduces regulatory burden. Document compliance posture in Week 1. Build audit trail to BOZ standards from Day 1. |
| R-5 | **Data residency compliance** — Financial data must remain in Southern Africa | LOW | HIGH | Deploy to AWS af-south-1 (Cape Town) from Day 1. No data replication outside Southern Africa. Document data residency architecture for BOZ review. |
| R-6 | **Double-disbursement on carrier timeout** — Network timeout during carrier API call could result in sending money twice | MEDIUM | CRITICAL | Implement idempotency keys on every carrier API call. Check transaction status before retrying. Use unique reference numbers that carriers can deduplicate. Store carrier response or timeout in audit log before any retry. |
| R-7 | **Wallet balance drift** — Platform ledger diverges from custodian actual balance over time | MEDIUM | HIGH | Implement daily reconciliation job (automated in Phase 2, manual in MVP). Alert platform operator on any variance > ZMW 100. Log every wallet mutation with before/after balance. |
| R-8 | **Scope creep from RFP process** — Client requests additional features during competitive RFP evaluation | HIGH | MEDIUM | Fixed-scope MVP contract with change request process. Phase 2+ features clearly documented as out-of-scope. Weekly scope review with client during sprints. |
| R-9 | **Key person dependency** — Single developer builds entire backend | MEDIUM | MEDIUM | Document all architecture decisions. Use standard patterns (NestJS guards, Prisma schema, BullMQ queues). Maintain comprehensive README and deployment runbooks. Code review process even with single developer. |
| R-10 | **BaaS partner selection (Phase 3)** — Corporate card issuing in Southern Africa has limited BaaS options | MEDIUM | MEDIUM | Begin BaaS discovery during Phase 2. Evaluate Paymentology (strong Southern Africa presence), Marqeta, and Stripe Issuing. Phase 3 does not start until BaaS partner is confirmed. |

---

## 10. Competitive Advantages

### 10.1 Working Prototype

The 28-page React prototype is a significant competitive advantage in the RFP process:

- **Tangible demonstration** — client can click through every workflow (login, disburse, approve, report) today
- **Complete UI coverage** — all 28 pages are built, styled, and responsive
- **Realistic data** — Zambian companies, employees, carriers, and ZMW amounts (not lorem ipsum)
- **Phase 2 visibility** — five "Coming Soon" pages show the full product roadmap without overpromising
- **Design system maturity** — Lagoon is a polished, production-quality design system (glassmorphic headers, coral CTAs, turquoise accents)

### 10.2 Fee Transparency

DisbursePro provides unprecedented fee visibility for Zambian enterprises:

- **Real-time fee calculation** — before submitting a disbursement, the user sees exactly: carrier fee (rate + amount), platform fee (rate + amount), levy, and gross amount
- **Per-transaction breakdown** — every transaction record includes the complete fee breakdown
- **Carrier comparison** — reports show total fees paid by carrier, enabling companies to negotiate rates or shift employees to lower-cost carriers
- **Intent-based pricing** — withdrawal (2.5%) vs. purchase (0.5%) intent gives companies a lever to reduce costs by encouraging direct mobile money payments over cash withdrawals

### 10.3 Multi-Carrier Support

No existing Zambian platform orchestrates disbursements across all three carriers:

- **Airtel Money** — ~45% market share, most reliable API
- **MTN MoMo** — ~35% market share, growing rapidly
- **Zamtel Kwacha** — ~20% market share, government-owned

Companies with 100+ employees inevitably have workers on all three networks. DisbursePro routes each disbursement to the correct carrier automatically based on the employee's registered carrier.

### 10.4 Custody Model

The "platform does NOT hold funds" architecture is a regulatory and commercial advantage:

- **Lower regulatory burden** — no need for a payment service provider license or electronic money issuer license
- **Faster time to market** — no BOZ licensing process (which can take 6-12 months)
- **Client trust** — enterprise clients prefer their funds held by a licensed bank, not a startup
- **Risk reduction** — platform has no exposure to custody risk, fraud, or misappropriation claims

### 10.5 Enterprise-Grade Audit Trail

For publicly traded companies and BOZ-regulated industries, the audit trail is a differentiator:

- Every disbursement tracked: who initiated, who approved, when, how much, which carrier, what fee, success/failure
- Every wallet movement logged: credits, debits, holds, releases — with running balance
- Every admin action recorded: user management, settings changes, fee schedule updates, limit adjustments
- 7-year retention per BOZ requirements
- CSV export for compliance reviews and external auditors

---

## 11. Deliverables & Next Steps

### 11.1 MVP Deliverables (12 Weeks)

| # | Deliverable | Format |
|---|---|---|
| 1 | DisbursePro Web Application | React 19 SPA connected to live backend APIs |
| 2 | DisbursePro Backend API | NestJS REST API with Swagger documentation |
| 3 | Database Schema | PostgreSQL with Prisma migrations |
| 4 | Keycloak Configuration | 5 roles, company realm scoping, JWT integration |
| 5 | Carrier Integration | Airtel Money + MTN MoMo B2C disbursement APIs |
| 6 | Custodian Integration | Wallet balance query, hold/release/debit operations |
| 7 | Deployment | AWS af-south-1 (Cape Town), Docker + ECS Fargate |
| 8 | CI/CD Pipeline | GitHub Actions: build, test, deploy to staging and production |
| 9 | Monitoring | Grafana dashboards (API latency, carrier health, error rates) + Sentry |
| 10 | Documentation | API docs (Swagger), architecture diagram, deployment runbook, user guide |
| 11 | Source Code | Full repository transferred to client at MVP completion |

### 11.2 Recommended Next Steps

| # | Action | Timeline | Owner |
|---|---|---|---|
| 1 | **Custodian partner outreach** — Contact Stanbic, ZANACO, Atlas Mara for wallet custody API access | Immediate (Week 0) | Client + DisbursePro |
| 2 | **Carrier developer registration** — Apply for Airtel Africa and MTN MoMo sandbox accounts | Immediate (Week 0) | DisbursePro |
| 3 | **Regulatory counsel** — Confirm custody model compliance with BOZ and identify any licensing requirements | Week 1-2 | Client |
| 4 | **MVP contract signing** — Fixed-scope USD 15,000 engagement for 12-week MVP | Week 0 | Client + DisbursePro |
| 5 | **Sprint 1 kickoff** — NestJS scaffolding, Keycloak deployment, PostgreSQL schema, employee API | Week 1 | DisbursePro |
| 6 | **Weekly demo cadence** — Friday demo of sprint progress to client stakeholders | Ongoing | DisbursePro |
| 7 | **Pilot company selection** — Identify 1-2 companies (e.g., Copperbelt Transport) for UAT in Week 11-12 | Week 6 | Client |
| 8 | **BaaS discovery (Phase 3 prep)** — Begin evaluating Paymentology, Marqeta, Stripe Issuing during MVP | Week 8 | DisbursePro |

### 11.3 Decision Log (Pending Client Input)

| # | Decision | Options | Recommendation | Status |
|---|---|---|---|---|
| D-1 | Custodian partner | Stanbic, ZANACO, Atlas Mara, or other | Stanbic (strongest API, pan-African presence) | Pending |
| D-2 | Cloud provider | AWS af-south-1, Azure South Africa, GCP | AWS af-south-1 (most mature Southern Africa region) | Pending |
| D-3 | Zamtel inclusion in MVP | Include Zamtel in Sprint 3, or defer to Phase 2 | Defer — Zamtel API unreliability adds risk to MVP timeline | Pending |
| D-4 | BaaS partner for cards | Paymentology, Marqeta, Stripe Issuing | Paymentology (Southern Africa specialization) | Phase 3 |
| D-5 | Employee app platform | Flutter, React Native, PWA | Flutter (best cross-platform, offline-first) | Phase 4 |

---

## Appendix A: Functional Requirement Coverage Matrix

| Requirement Group | Total FRs | MVP (P0) | MVP (P1) | Phase 2+ (P2) | Prototype Coverage |
|---|---|---|---|---|---|
| FR-100: Auth & Authorization | 8 | 5 | 1 | 2 | UI exists for login, registration |
| FR-200: Employee Management | 10 | 7 | 2 | 1 | Full UI for registry, add, detail, bulk upload |
| FR-300: Single Disbursement | 10 | 9 | 1 | 0 | Full 3-step wizard with fee calculation |
| FR-400: Bulk Disbursement | 7 | 5 | 1 | 1 | CSV upload UI with validation preview |
| FR-500: Approval Workflows | 9 | 5 | 1 | 3 | Approval queue with tabs, detail view |
| FR-600: Wallet & Custody | 8 | 4 | 2 | 2 | Dashboard wallet card, balance display |
| FR-700: Transactions & Reporting | 12 | 5 | 5 | 2 | Transaction list, detail, reports page |
| FR-800: Platform Operator | 10 | 5 | 4 | 1 | Full platform operator dashboard |
| **TOTAL** | **74** | **45** | **17** | **12** | **28 pages covering all modules** |

## Appendix B: Data Model Summary

The existing TypeScript types in `src/data/types.ts` map directly to the required PostgreSQL schema:

| TypeScript Interface | PostgreSQL Table | Key Fields | Relationships |
|---|---|---|---|
| `Company` | `companies` | id, name, registration_number, status, industry, city | Has many: employees, disbursements, wallet_transactions, users |
| `Employee` | `employees` | id, company_id, first_name, last_name, phone, nrc, carrier, cost_centre, status | Belongs to: company. Has many: disbursements |
| `Disbursement` | `disbursements` | id, company_id, employee_id, net_amount, carrier_fee, platform_fee, levy, gross_amount, purpose, intent, reference, status | Belongs to: company, employee. Has one: approval |
| `AuditEntry` | `audit_log` | id, action, category, user_id, details, severity, timestamp, ip_address | Append-only, no UPDATE/DELETE |
| `FeeBreakdown` | `fee_schedules` | id, carrier, intent, rate, effective_from | Time-series, latest wins |
| `PlatformStats` | Computed view | Aggregates across companies, disbursements, wallet_transactions | Materialized view or API computation |
| `CompanyStats` | Computed view | Aggregates within single company scope | Materialized view or API computation |

## Appendix C: Carrier API Reference

| Carrier | API Documentation | Auth Method | Sandbox Available | Production Requirements |
|---|---|---|---|---|
| Airtel Money | Airtel Africa OpenAPI Developer Portal | OAuth2 (client credentials) | Yes | Business registration, KYC, signed agreement |
| MTN MoMo | MTN MOMO Developer Portal | API key + subscription key | Yes (sandbox auto-provisioned) | Business registration, signed agreement, production credentials |
| Zamtel Kwacha | Direct partnership (no public developer portal) | API key | Limited | Direct commercial agreement with Zamtel |

---

*Document prepared for DisbursePro competitive RFP response. All cost estimates are fixed-price engagement terms. Source code transfer included at each phase completion.*
