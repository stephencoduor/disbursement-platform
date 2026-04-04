# Product Requirements Document (PRD)

## DisbursePro — Enterprise Disbursement & Expense Management Platform

| Field | Detail |
|---|---|
| **Product** | DisbursePro — Enterprise Disbursement & Expense Management Platform |
| **Client** | Publicly traded technology company (competitive RFP) |
| **Version** | 1.0 |
| **Date** | 2026-04-04 |
| **MVP Budget** | USD 15,000 |
| **Full Build Budget** | USD 95,000 |
| **MVP Timeline** | 8 weeks |
| **Target Market** | Zambia (expanding to SADC region) |
| **Currency** | ZMW (Zambian Kwacha) |
| **Status** | Draft |

---

## Table of Contents

1. [Product Vision & Mission](#1-product-vision--mission)
2. [Target Users & Market](#2-target-users--market)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Phase 2 Features](#6-phase-2-features)
7. [Success Metrics](#7-success-metrics)
8. [Release Plan](#8-release-plan)
9. [Dependencies](#9-dependencies)
10. [Assumptions & Constraints](#10-assumptions--constraints)

---

## 1. Product Vision & Mission

### Vision

Become the trusted enterprise disbursement platform for Southern African companies that need to move money to field workers reliably, compliantly, and with full visibility — replacing cash envelopes and informal M-Money transfers with structured, auditable disbursement workflows.

### Mission

Build a control, visibility, and orchestration layer for enterprise money movement in emerging markets. Licensed custodians hold funds; DisbursePro manages workflows, approvals, fee calculations, and audit trails. We connect the accountant's spreadsheet to the driver's mobile money wallet — securely, instantly, and at scale.

Think "Soldo/Pleo for emerging markets" — but instead of corporate cards (Phase 2), the MVP delivers structured mobile money disbursements with multi-level approval workflows.

### Strategic Goals

| # | Goal | Measure |
|---|---|---|
| G-1 | Digitize enterprise disbursements for Zambian companies | 100+ companies onboarded within 12 months of launch |
| G-2 | Reduce time-to-disburse from hours to seconds | Median disbursement time < 30 seconds from approval |
| G-3 | Provide full audit trail and compliance for every kwacha moved | 100% of disbursements tracked with initiator, approver, carrier, and fee breakdown |
| G-4 | Maintain BOZ regulatory compliance | Zero critical compliance findings in audits |
| G-5 | Generate sustainable platform revenue via fee model | Platform fee income covers operational costs by month 6 |

### Problem Statement

In Zambia and Southern Africa today:

- **Transport, logistics, mining, and agriculture companies** employ 100 to 1,000+ field workers (drivers, miners, farm hands) who need daily or weekly cash disbursements for fuel, trip allowances, repairs, meals, and salary advances.
- **Current process is manual**: A finance officer withdraws cash, puts it in envelopes, or sends ad-hoc mobile money transfers with no structured approval, no cost centre tracking, and no audit trail.
- **Mobile money penetration is ~67%** in Zambia (Airtel Money, MTN MoMo, Zamtel Kwacha), but enterprises lack tools to disburse at scale through these channels.
- **Reconciliation is painful**: Finance directors spend hours matching disbursements to purpose codes, cost centres, and employee records.
- **Fraud and leakage** occur when there is no approval workflow — a single finance officer can send money to anyone without oversight.
- **No fee visibility**: Companies do not know what they pay in carrier fees vs. platform fees vs. levies per transaction.

DisbursePro solves these problems by providing a structured disbursement platform that sits between the company's wallet (held by a licensed custodian) and the mobile money networks — with multi-level approvals, real-time fee calculation, cost centre tracking, and complete audit trails.

### Custody Model

DisbursePro does NOT hold customer funds. All customer funds sit in wallets managed by a Bank of Zambia (BOZ) licensed custodian. The platform connects via API to:
- Query wallet balances (available, held, total)
- Initiate disbursements through mobile money carriers
- Receive completion/failure confirmations
- Apply hold-on-approval and release-on-completion patterns

This custodial separation is a regulatory requirement under BOZ guidelines and a core architectural principle.

---

## 2. Target Users & Market

### Market Context — Zambia

| Factor | Detail |
|---|---|
| **Population** | ~20 million |
| **Mobile money penetration** | ~67% of adults (ZICTA 2025) |
| **Primary carriers** | Airtel Money, MTN MoMo, Zamtel Kwacha |
| **Regulator** | Bank of Zambia (BOZ) |
| **Currency** | ZMW (Zambian Kwacha) |
| **Key regulations** | National Payment Systems Act, AML/CFT Directives, Electronic Money Guidelines |
| **Enterprise mobile money gap** | No structured B2E (business-to-employee) disbursement platforms exist in market |

### Target Industries

| Industry | Use Case | Company Size | Example |
|---|---|---|---|
| **Transport & Logistics** | Fuel allowances, trip allowances, repairs, tolls | 100-1,000 drivers | Copperbelt Transport (650 drivers) |
| **Mining & Supplies** | Field worker payments, equipment purchases, advances | 50-500 workers | Kafue Mining Supplies (95 workers) |
| **Agriculture & Food** | Seasonal worker payments, farm input purchases, harvester wages | 100-500 workers | Lusaka Fresh Foods (180 employees) |
| **Tourism & Hospitality** | Staff allowances, seasonal workforce payments | 50-300 staff | Livingstone Tourism Group (210 employees) |
| **Construction** | Site worker payments, materials procurement, daily wages | 100-500 workers | Kitwe Construction (340 workers) |

### Competitive Landscape — Reference Platforms

| Platform | Geography | What We Learn |
|---|---|---|
| **Soldo** | UK/EU | Expense management with corporate cards and pre-set budgets; approval workflows; analytics by cost centre |
| **Routable** | US | B2B payment orchestration; multi-level approvals; bulk payment processing |
| **Tipalti** | Global | Mass payment automation; multi-currency; compliance built-in; ERP integrations |
| **Ramp** | US | Corporate card + expense management; real-time spend visibility; automated receipt matching |

**DisbursePro differentiator**: These platforms focus on card-based expense management in developed markets. DisbursePro targets mobile-money-first emerging markets where the workforce is distributed, largely unbanked, and paid in cash or ad-hoc transfers. No comparable product exists in the Zambian market.

---

## 3. User Personas

### Persona 1: Mwamba Kapumba — Finance Director (Company Admin)

| Attribute | Detail |
|---|---|
| **Age** | 48 |
| **Location** | Ndola, Copperbelt Province |
| **Company** | Copperbelt Transport Services Ltd |
| **Role** | Finance Director / Company Admin |
| **Employees Under Management** | 650 drivers across 5 cost centres |
| **Monthly Disbursement Volume** | ZMW 2,400,000 |
| **Phone** | Samsung Galaxy S24 |
| **Tech Savviness** | High |

**Goals:**
- Full visibility into where company money goes — by cost centre, by purpose, by driver
- Ensure every disbursement over ZMW 1,000 is approved by a fleet manager before funds leave the wallet
- Generate monthly reports for the board showing spend by category
- Control company-wide disbursement limits and ensure no single employee exceeds daily caps
- Manage the company wallet balance and know exactly how much is available vs. held for pending approvals

**Frustrations:**
- Currently relies on Thandiwe (Finance Officer) to track disbursements in Excel — errors and duplicates are common
- No way to enforce approval workflows — drivers sometimes get paid twice for the same trip
- Cash disbursements to drivers have no audit trail; reconciliation takes 2 days each month
- Cannot see real-time wallet balance; has to call the bank to check available funds
- Fee structures from mobile money carriers are opaque — doesn't know what percentage goes to carrier fees vs. actual disbursement

**Scenario:**
Mwamba logs into DisbursePro and sees the dashboard: ZMW 1,180,000 available (ZMW 65,000 held for 3 pending approvals). He checks the weekly spend chart — Northern Route is 15% over budget. He drills into the cost centre report and sees Bwalya Mulenga has received ZMW 45,000 this month, mostly fuel. He adjusts the per-employee daily limit for Northern Route from ZMW 3,000 to ZMW 2,500 in Settings. He then reviews the pending approvals queue and sees Joseph Banda has already approved 2 of 3 — the third (a ZMW 6,000 salary advance) was correctly rejected as it exceeded the daily limit.

---

### Persona 2: Joseph Banda — Fleet Manager (Approver)

| Attribute | Detail |
|---|---|
| **Age** | 38 |
| **Location** | Ndola, Copperbelt Province |
| **Company** | Copperbelt Transport Services Ltd |
| **Role** | Fleet Manager / Approver |
| **Routes Managed** | Northern Route, Southern Route |
| **Drivers Under Management** | 180 drivers |
| **Phone** | Samsung Galaxy A54 |
| **Tech Savviness** | Medium |

**Goals:**
- Quickly approve legitimate fuel and trip allowance requests so drivers are not delayed
- Reject suspicious or duplicate requests with clear comments
- See which drivers have pending requests and their disbursement history
- Approve from his phone while on the road visiting depots

**Frustrations:**
- Currently gets WhatsApp messages from Thandiwe asking "Can you approve ZMW 2,500 for Kalaba's fuel?" — no structured format, easy to miss
- No visibility into whether a driver already received a disbursement today
- Cannot see the total he has approved this week vs. budget
- Sometimes approves a request and later finds out the driver already got cash from the depot manager

**Scenario:**
Joseph receives a push notification: "3 disbursements pending your approval (ZMW 9,500 total)." He opens DisbursePro on his phone, sees the approval queue. The first is ZMW 1,500 fuel for Bwalya (Northern Route, Ndola-Solwezi) — he taps Approve. The second is ZMW 2,500 fuel for Kalaba (Southern Route, Livingstone) — approved. The third is a ZMW 6,000 salary advance for Lubinda — he sees Lubinda already received ZMW 4,500 this week and the daily limit is ZMW 5,000. He taps Reject with comment: "Exceeds daily limit. Please split into two disbursements." Total time: 90 seconds.

---

### Persona 3: Thandiwe Mulenga — Finance Officer (Initiator)

| Attribute | Detail |
|---|---|
| **Age** | 29 |
| **Location** | Ndola, Copperbelt Province |
| **Company** | Copperbelt Transport Services Ltd |
| **Role** | Finance Officer / Initiator (finance_user) |
| **Phone** | iPhone 14 |
| **Tech Savviness** | High |

**Goals:**
- Quickly initiate disbursements for drivers heading out on routes each morning
- Process bulk disbursements (e.g., 50 drivers' weekly fuel allowances) via CSV upload
- See the exact fee breakdown before submitting — carrier fee, platform fee, levy, gross amount
- Track the status of each disbursement from initiation through approval to completion
- Export monthly transaction reports for the finance director and external auditors

**Frustrations:**
- Currently manages disbursements in Excel, manually sending M-Money to each driver via her personal phone
- Makes errors when sending to 50+ drivers in a morning — wrong amounts, wrong numbers
- Cannot see cumulative spend until she reconciles at month-end
- No way to distinguish between withdrawal intent (driver gets cash) and purchase intent (driver pays a vendor directly)
- Fee calculations are inconsistent — sometimes Airtel charges more than MTN for the same amount

**Scenario:**
Monday morning at 06:30. Thandiwe has 12 drivers departing for routes. She opens DisbursePro, goes to Disburse > Single, selects Bwalya Mulenga from the employee dropdown. She enters ZMW 1,500, selects purpose "Fuel", intent "Withdrawal", cost centre "Northern Route", and adds a note "Ndola to Solwezi fuel allowance." The system calculates: carrier fee ZMW 37.50 (Airtel Money, 2.5% withdrawal), platform fee ZMW 15.00 (1%), levy ZMW 0, gross ZMW 1,552.50. She submits — it goes to Joseph Banda for approval. She repeats for the next 11 drivers, then switches to Disburse > Bulk to upload a CSV for the remaining 38 drivers' weekly meal allowances.

---

### Persona 4: Chanda Mutale — Platform Operator

| Attribute | Detail |
|---|---|
| **Age** | 35 |
| **Location** | Lusaka |
| **Role** | Platform Operator (DisbursePro staff) |
| **Phone** | MacBook Pro + iPhone 15 |
| **Tech Savviness** | Very High |

**Goals:**
- Onboard new companies and credit their wallets after receiving bank transfers
- Monitor platform-wide KPIs: total volume, revenue, active companies, carrier distribution
- Configure and adjust fee schedules, platform limits, and carrier integration status
- Investigate failed disbursements and resolve carrier-side issues
- Track platform revenue (1% of every disbursement, minimum ZMW 2)

**Frustrations:**
- In the early days, manually reconciling bank transfers to company wallet credits
- Carrier API downtimes (especially Zamtel) cause failed disbursements and support tickets
- Needs visibility into which companies are growing vs. churning
- Fee schedule changes need to be applied without disrupting active companies

**Scenario:**
Chanda logs into the Platform Operator dashboard and sees: 6 companies active, ZMW 8.45M monthly volume, ZMW 84,500 platform revenue this month. She notices Kitwe Construction is suspended — their wallet is at ZMW 45,000 but fully held (ZMW 0 available) due to a compliance flag. She checks the carrier status panel: Airtel Money and MTN MoMo are green (operational), Zamtel Kwacha is yellow (degraded — 85% success rate). She opens the Companies tab, selects Zambezi Logistics, and credits their wallet with ZMW 500,000 after confirming a bank transfer receipt. She then navigates to Revenue and sees the by-company breakdown: Copperbelt Transport generated ZMW 24,000 in platform fees (3,420 transactions), while Kafue Mining generated ZMW 6,500 (980 transactions).

---

### Persona 5: Bwalya Mulenga — Driver / Employee (Recipient)

| Attribute | Detail |
|---|---|
| **Age** | 32 |
| **Location** | Ndola, Copperbelt Province |
| **Employer** | Copperbelt Transport Services Ltd |
| **Role** | Long-haul truck driver (Northern Route) |
| **Phone** | Tecno Spark 20 |
| **Carrier** | Airtel Money |
| **NRC** | 123456/78/1 |
| **Tech Savviness** | Low-Medium |

**Goals:**
- Receive fuel and trip allowances quickly before departing on route
- Get mobile money notifications confirming the amount received
- Know how much was deducted in fees (carrier vs. platform)
- Have a record of all disbursements received in case of disputes

**Frustrations:**
- Sometimes waits 2+ hours for the finance office to process his fuel allowance
- Occasionally receives the wrong amount and has no way to verify the intended amount vs. fees deducted
- Cash disbursements have no receipt — if he loses the money, there is no proof he received it
- Does not understand why Airtel charges 2.5% on withdrawals but only 0.5% on purchases

**Scenario:**
Bwalya arrives at the Ndola depot at 06:00 for his Solwezi route. By 06:45, he receives an Airtel Money notification: "You have received ZMW 1,500.00 from Copperbelt Transport. Ref: TRIP-NR-20260403-001." He checks his Airtel Money balance — ZMW 2,340. He drives to the fuel station, purchases ZMW 1,400 of diesel using Airtel Money (purchase intent — lower fee), and departs for Solwezi. Bwalya does not interact with DisbursePro directly — he is a passive recipient who receives funds via his existing mobile money wallet.

**Note:** In Phase 2, Bwalya will have a DisbursePro Employee App (Flutter) where he can view his disbursement history, current balance, and submit expense claims. In the MVP, employees are passive recipients.

---

## 4. Functional Requirements

### FR-100: Authentication & Authorization

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-101 | Company Code Login | P0 | Yes | Users log in with company code + email/phone (+260) + password. Company code scopes all data access to the correct company. Format: 6-character alphanumeric (e.g., "CPTRAN" for Copperbelt Transport). Platform operators log in without a company code and access the `/platform/*` routes. |
| FR-102 | Multi-Factor Authentication (MFA) | P1 | No | Optional MFA via SMS OTP to registered phone number (+260 9XX). OTP: 6-digit, 5-minute expiry, max 3 retries. Required for: high-value disbursements (> ZMW 2,000), settings changes, user management. SMS provider: Zamtel Bulk SMS or Africa's Talking. |
| FR-103 | Role-Based Access Control (RBAC) | P0 | Yes | Five roles with distinct permissions: **platform_operator** (system-wide access to `/platform/*`, company management, wallet crediting, fee configuration), **company_admin** (company-wide access, user management, limit configuration, all company routes), **finance_user** (initiate disbursements, manage employees, view transactions), **approver** (approve/reject disbursements, view approval queue), **auditor** (read-only access to transactions, reports, and audit log). |
| FR-104 | Session Management | P0 | Yes | JWT access tokens (15-minute expiry) + refresh tokens (30-day expiry). Automatic session timeout after 10 minutes of inactivity. Single active session per user (new login invalidates previous session). Session includes: userId, companyId, role, permissions. |
| FR-105 | Password Policy | P0 | Yes | Minimum 8 characters, at least one uppercase, one lowercase, one digit, one special character. Password hashed with bcrypt (cost factor 12). Account lockout after 5 failed attempts (30-minute lock). Password reset via email link + SMS OTP to registered phone. |
| FR-106 | Company Registration | P1 | No | 4-step self-service registration: (1) company details — name, registration number (PACRA format), industry, city; (2) admin user — name, email, phone, password; (3) document upload — certificate of incorporation, tax clearance (ZRA); (4) review and submit. Registration creates company in "pending" status; platform operator reviews and activates. |
| FR-107 | IP Restriction | P2 | No | Company admin can configure allowed IP ranges for company users. Login attempts from non-whitelisted IPs are blocked with audit log entry. Platform operator IP restrictions configured at system level. |
| FR-108 | Audit Logging for Auth Events | P0 | Yes | Every authentication event logged: login success, login failure, password change, session timeout, MFA challenge. Log includes: userId, timestamp, IP address, user agent, action, result. Logs retained for 7 years per BOZ requirements. |

### FR-200: Employee Management

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-201 | Employee Registry | P0 | Yes | Maintain a registry of all company employees eligible for disbursements. Employee record includes: first name, last name, phone number (+260 format), NRC (National Registration Card) number (format: XXXXXX/XX/X), mobile money carrier (Airtel Money, MTN MoMo, or Zamtel Kwacha), cost centre assignment, department, and status (active/inactive/suspended). |
| FR-202 | Add Employee | P0 | Yes | Finance user or company admin adds employees one at a time. Required fields: first name, last name, phone (+260 with validation), NRC number (with format validation), carrier selection, cost centre, department. System validates phone number uniqueness within the company. System validates NRC format (6 digits, slash, 2 digits, slash, 1 digit). |
| FR-203 | Edit Employee | P0 | Yes | Update employee details: phone number, carrier, cost centre, department, status. Phone number and carrier changes trigger re-validation. NRC number is immutable after creation (requires company admin override to change). All edits logged in audit trail with before/after values. |
| FR-204 | Deactivate / Suspend Employee | P0 | Yes | Company admin or finance user can deactivate an employee. Deactivated employees cannot receive disbursements. Suspended employees are flagged for review (e.g., compliance concern). Deactivation does not delete the employee record — maintains audit history. Reactivation requires company admin approval. |
| FR-205 | Bulk Employee Upload (CSV) | P0 | Yes | Upload a CSV file to add multiple employees at once. Template CSV downloadable from the platform with headers: firstName, lastName, phone, nrc, carrier, costCentre, department. Validation rules applied per row: phone format (+260 9XX XXXXXXX), NRC format, carrier must be one of (airtel_money, mtn_momo, zamtel_kwacha), cost centre must exist in company's configured list. Upload preview shows: total rows, valid rows, error rows with specific error messages per row. User confirms before committing valid rows. Failed rows exportable as CSV with error column appended. |
| FR-206 | Employee Search & Filter | P0 | Yes | Search employees by name, phone number, NRC, or employee ID. Filter by: carrier (Airtel/MTN/Zamtel), cost centre, department, status (active/inactive/suspended). Pagination: 20 employees per page with total count. Sort by: name (A-Z, Z-A), total disbursed (high-low), last disbursement date. |
| FR-207 | Employee Profile & History | P1 | Yes | Employee detail page showing: full profile, disbursement history (paginated, filterable by date/purpose/status), total amount disbursed (all time, this month, this week), carrier and cost centre. Quick-action button to initiate a new disbursement for this employee. |
| FR-208 | Cost Centre Management | P1 | Yes | Company admin defines cost centres in Settings (e.g., "Northern Route", "Southern Route", "City Fleet", "Long Haul", "Maintenance"). Each employee is assigned to exactly one cost centre. Cost centres are used for: disbursement tracking, budget reporting, spend analytics. Cost centres can be created, renamed, or archived (not deleted — maintains history). |
| FR-209 | Employee Data Export | P1 | No | Export employee registry to CSV with all fields. Filtered export (e.g., only active employees on Airtel Money in Northern Route). Export includes: total disbursed, last disbursement date, and status. |
| FR-210 | Carrier Assignment Validation | P0 | Yes | When assigning a carrier to an employee, validate that the phone number prefix matches the carrier: Airtel Money (+260 97X, +260 96X), MTN MoMo (+260 96X, +260 76X), Zamtel Kwacha (+260 95X, +260 55X). Display warning (not hard block) if prefix does not match — some employees have ported numbers. |

### FR-300: Single Disbursement

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-301 | 3-Step Disbursement Flow | P0 | Yes | Initiating a disbursement follows a 3-step wizard: **Step 1 — Select Employee**: searchable dropdown of active employees showing name, phone, carrier, cost centre. **Step 2 — Amount & Details**: enter net amount (ZMW), select purpose (fuel, trip_allowance, repairs, meals, advances, salary, supplies, other), select intent (withdrawal or purchase), optional notes, auto-populated cost centre from employee record (overridable). **Step 3 — Review & Submit**: full breakdown showing net amount, carrier fee, platform fee, levy, gross amount deducted from wallet. Submit button sends to approval queue. |
| FR-302 | Real-Time Fee Calculation | P0 | Yes | Fees calculated in real-time as the user enters the net amount: **Carrier fee** — varies by carrier and intent. Withdrawal rate: 2.5% (all carriers). Purchase rate: 0.5% (all carriers). **Platform fee** — 1% of net amount, minimum ZMW 2. **Levy** — 0% (placeholder for future government levies). **Gross amount** = net amount + carrier fee + platform fee + levy. Fee breakdown displayed clearly on Step 2 and Step 3 of the disbursement flow. All calculations use pure functions (see `fee-config.ts`). |
| FR-303 | Intent Types | P0 | Yes | Two disbursement intents that affect fee calculation: **Withdrawal** — employee receives cash from a mobile money agent. Carrier fee: 2.5%. Use cases: fuel (driver pays cash at fuel station), trip allowance, salary advance. **Purchase** — employee pays a vendor directly via mobile money. Carrier fee: 0.5%. Use cases: repairs (pay mechanic directly), supplies, meals at restaurants accepting mobile money. Intent selection is mandatory and affects the gross amount calculation. |
| FR-304 | Purpose Codes | P0 | Yes | Mandatory purpose code for every disbursement. Standard codes: fuel, trip_allowance, repairs, meals, advances, salary, supplies, other. "Other" requires a mandatory note explaining the purpose. Purpose codes drive: reporting (spend by purpose), budget tracking, audit compliance. Company admin can request custom purpose codes (Phase 2). |
| FR-305 | Disbursement Reference | P0 | Yes | System auto-generates a unique reference for each disbursement. Format: `{TYPE}-{COST_CENTRE_CODE}-{DATE}-{SEQUENCE}`. Examples: TRIP-NR-20260403-001, WRK-MT-20260403-001, ADV-NR-20260403-001. Reference is included in the mobile money notification to the employee and used for reconciliation. |
| FR-306 | Amount Validation | P0 | Yes | Validate disbursement amount against 3-tier limit hierarchy (lowest limit wins): **Tier 1 — Network limits** (per carrier): Airtel Money ZMW 10,000, MTN MoMo ZMW 10,000, Zamtel Kwacha ZMW 10,000 per transaction. **Tier 2 — Platform limits**: ZMW 5,000 per transaction, ZMW 8,000 per employee per day, ZMW 500,000 per company per day. **Tier 3 — Company limits** (configured by company admin): per-transaction, per-employee-daily, per-company-daily. Validation error messages specify which limit is breached. |
| FR-307 | Wallet Balance Check | P0 | Yes | Before submitting a disbursement, validate that the company wallet has sufficient available balance (not total balance — excludes held funds). If insufficient: display clear error "Insufficient wallet balance. Available: ZMW X, Required: ZMW Y (gross amount including fees)." Disbursement cannot proceed without sufficient available balance. |
| FR-308 | Hold on Submission | P0 | Yes | When a disbursement is submitted for approval, the gross amount is immediately placed on hold in the company wallet. Available balance decreases by the gross amount. Held balance increases by the gross amount. This prevents over-commitment when multiple disbursements are pending approval simultaneously. Hold is released if: (a) disbursement is rejected, (b) disbursement fails after approval, or (c) disbursement is completed (hold converts to actual deduction). |
| FR-309 | Duplicate Detection | P1 | Yes | Warn the initiator if a disbursement to the same employee, for the same purpose, within the same cost centre, has been submitted in the last 4 hours. Warning is advisory (soft block) — initiator can proceed with confirmation. Duplicate detection helps prevent double-payments, especially during busy morning dispatch periods. |
| FR-310 | Disbursement Notes | P0 | Yes | Optional free-text notes field (max 200 characters) on each disbursement. Examples: "Ndola to Solwezi fuel allowance", "Brake pads and oil for truck ZM-CB-4521". Notes are visible to the approver and included in the audit trail and exported reports. |

### FR-400: Bulk Disbursement

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-401 | Bulk CSV Upload | P0 | Yes | Upload a CSV file to initiate multiple disbursements at once. CSV template downloadable from the platform. Required columns: employeeId (or phone number), netAmount, purpose, intent, notes (optional). System resolves employee records from employeeId or phone number. Drag-and-drop upload zone with file type validation (CSV only, max 5 MB). |
| FR-402 | Batch Validation | P0 | Yes | Every row in the CSV is validated against the same rules as single disbursements: employee must be active, amount must pass 3-tier limit validation, purpose and intent must be valid codes, phone/employeeId must resolve to a registered employee. Validation results displayed in a preview table: valid rows (green), error rows (red) with specific error messages. User can remove individual error rows or fix and re-upload. |
| FR-403 | Batch Fee Summary | P0 | Yes | After validation, display a batch summary: total number of disbursements, total net amount, total carrier fees (broken down by carrier), total platform fees, total levies, total gross amount. Per-carrier breakdown: X disbursements via Airtel (ZMW Y), X via MTN (ZMW Y), X via Zamtel (ZMW Y). Company wallet available balance shown alongside total gross for instant affordability check. |
| FR-404 | Batch Submission | P0 | Yes | Submit entire batch for approval as a single unit. All disbursements in the batch receive the same batch reference (e.g., BATCH-20260403-001). Approver sees the batch as a single approval item with summary and the ability to drill into individual disbursements. Batch hold: total gross amount is placed on hold in the company wallet upon submission. |
| FR-405 | Batch Approval | P0 | Yes | Approver can: (a) approve the entire batch, (b) reject the entire batch, (c) approve/reject individual items within the batch (partial approval). Partial approval: approved items proceed to processing; rejected items release their held amounts. Approver comment applies to entire batch or per-item. |
| FR-406 | Batch Processing | P1 | Yes | Approved batch items are processed sequentially via the relevant carrier API. Each item transitions independently: processing -> completed or processing -> failed. Real-time progress indicator: "12/50 completed, 1 failed, 37 processing." Failed items can be retried individually. Batch completion notification sent when all items have a terminal status. |
| FR-407 | Bulk Upload History | P1 | No | List of previous bulk uploads with: upload date, file name, row count, total amount, status (fully completed, partially completed, failed). Drill into any batch to see per-item status. Re-download original CSV with status column appended. |

### FR-500: Approval Workflows

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-501 | Two-Level Approval Flow | P0 | Yes | Default workflow: **Initiator** (finance_user) submits -> **Approver** (approver role) approves/rejects. Initiator cannot approve their own disbursements (separation of duties). Disbursement status flow: draft -> pending_approval -> approved -> processing -> completed/failed. Rejected disbursements: pending_approval -> rejected. |
| FR-502 | Approval Queue | P0 | Yes | Dedicated Approvals page with three tabs: **Pending** (disbursements awaiting approval, sorted by submission time, newest first), **Approved** (disbursements approved by this user, last 30 days), **Rejected** (disbursements rejected by this user, last 30 days). Each item shows: employee name, amount, purpose, intent, cost centre, fee breakdown, submission timestamp, initiator name. |
| FR-503 | Approve Action | P0 | Yes | Approver taps/clicks "Approve" on a pending disbursement. Optional comment field (e.g., "Approved — regular weekly fuel"). Upon approval: status changes to "approved", system initiates carrier API call, held amount is retained until completion. Approval timestamp and approver identity recorded. Push notification sent to initiator. |
| FR-504 | Reject Action | P0 | Yes | Approver taps/clicks "Reject" on a pending disbursement. Mandatory comment explaining rejection reason (e.g., "Exceeds daily limit. Please split into two disbursements."). Upon rejection: status changes to "rejected", held amount is released back to available balance. Rejection timestamp, approver identity, and comment recorded. Push notification sent to initiator with rejection reason. |
| FR-505 | Approval Detail View | P0 | Yes | Drill into any pending disbursement to see: full employee profile, disbursement details (amount, purpose, intent, notes), fee breakdown (carrier fee, platform fee, levy, gross amount), employee's recent disbursement history (last 5), daily/weekly cumulative for this employee. This context helps the approver make an informed decision. |
| FR-506 | Approval Notifications | P1 | Yes | Push notification to approver when new disbursement(s) are pending. Email notification if disbursement is pending > 1 hour (configurable). Daily digest email: "You have X disbursements pending approval totaling ZMW Y." |
| FR-507 | Approval Delegation | P2 | No | Approver can delegate approval authority to another user for a specified date range (e.g., during leave). Delegated approver appears in audit trail with "delegated by" attribution. Company admin can override delegation. |
| FR-508 | Threshold-Based Auto-Approval | P2 | No | Company admin can configure auto-approval rules: disbursements below ZMW X for purpose Y are automatically approved without human review. Example: all meal allowances under ZMW 200 auto-approved. Auto-approved items are logged with "system" as approver. Configurable per cost centre. |
| FR-509 | Escalation Rules | P2 | No | If a disbursement is pending approval for more than N hours (configurable, default 4), escalate to company admin. Escalation notification sent to admin with link to approval queue. SLA tracking: percentage of disbursements approved within target time. |

### FR-600: Wallet & Custody Management

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-601 | Company Wallet Display | P0 | Yes | Dashboard prominently displays company wallet: **Total Balance** (ZMW — total funds in custodian account), **Available Balance** (total minus held), **Held Balance** (funds reserved for pending approvals). Wallet balance is the primary navigation element — always visible in the sidebar (CompanyLayout). Real-time or near-real-time balance updates (polling every 30 seconds in MVP, WebSocket in Phase 2). |
| FR-602 | Hold-on-Approval Pattern | P0 | Yes | When a disbursement is submitted for approval: gross amount (net + all fees) is moved from available to held. When approved and completed: held amount is deducted (converts to actual spend). When rejected: held amount is released back to available. When failed after approval: held amount is released back to available. This pattern ensures that the available balance always reflects the true amount that can be disbursed, preventing over-commitment. |
| FR-603 | 3-Tier Limit Hierarchy | P0 | Yes | Three tiers of transaction limits, enforced in order (lowest wins): **Network limits** (per carrier, per transaction — set by Airtel/MTN/Zamtel, not configurable by platform or company). **Platform limits** (per transaction: ZMW 5,000, per employee per day: ZMW 8,000, per company per day: ZMW 500,000 — configurable by platform operator). **Company limits** (per transaction, per employee per day, per company per day — configurable by company admin, must be <= platform limits). Validation checks all three tiers and returns the most restrictive limit breached. |
| FR-604 | Platform Operator Wallet Crediting | P0 | Yes | Platform operator can credit a company's wallet after confirming receipt of a bank transfer. Credit action: select company, enter amount (ZMW), enter bank transfer reference, optional notes. Upon credit: company's total balance and available balance increase by the credited amount. Credit event logged in audit trail: operator, company, amount, bank reference, timestamp. Wallet credit history visible on company detail page (platform operator view). |
| FR-605 | Wallet Transaction History | P1 | Yes | Company wallet history showing all balance movements: credits (from platform operator), debits (completed disbursements), holds (pending approvals), releases (rejected/failed disbursements). Each entry shows: date, type, amount, running balance, reference, related disbursement ID. Filterable by date range and transaction type. |
| FR-606 | Low Balance Alert | P1 | No | Company admin receives notification when available balance falls below a configurable threshold (default: ZMW 50,000). Alert sent via push notification and email. Alert includes: current available balance, held amount, suggested top-up amount based on recent daily average spend. |
| FR-607 | Wallet Reconciliation | P2 | No | Daily automated reconciliation between DisbursePro wallet ledger and custodian's records. Discrepancies flagged for platform operator review. Reconciliation report: starting balance, credits, debits, expected closing balance, actual custodian balance, variance. |
| FR-608 | Multi-Wallet Support | P2 | No | Company can have multiple wallets for different purposes (e.g., "Fuel Wallet", "Allowances Wallet", "Emergency Fund"). Each wallet has its own balance, limits, and authorized users. Disbursements are charged to the appropriate wallet based on purpose code mapping. |

### FR-700: Transactions & Reporting

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-701 | Transaction History | P0 | Yes | Full list of all company disbursements with columns: date, reference, employee name, amount (net), fees (carrier + platform + levy), gross amount, purpose, intent, carrier, cost centre, status, initiator, approver. Default sort: newest first. Filterable by: date range, status (completed/pending/failed/rejected), purpose, carrier, cost centre, employee, amount range. Paginated: 25 per page. |
| FR-702 | Transaction Detail | P0 | Yes | Drill into any transaction to see: full disbursement details, complete fee breakdown (carrier fee with rate %, platform fee with rate %, levy), status timeline (created -> pending_approval -> approved -> processing -> completed, with timestamps and actors at each stage), employee profile snapshot, approver comment (if any), carrier transaction reference (from mobile money API response). |
| FR-703 | CSV Export | P0 | Yes | Export filtered transaction list to CSV. All columns included. Date format: ISO 8601. Amount format: decimal with 2 places. Export file name: `{company_name}_transactions_{start_date}_to_{end_date}.csv`. Maximum export: 10,000 rows per file. Larger exports processed asynchronously with download notification. |
| FR-704 | PDF Export | P1 | No | Export transaction list or individual transaction detail to PDF. Company letterhead, reference number, and digital signature placeholder. Suitable for submission to auditors and BOZ compliance reviews. PDF includes: company name, PACRA registration number, date range, transaction count, total amounts, and per-transaction detail table. |
| FR-705 | Spend by Purpose Report | P0 | Yes | Donut/pie chart showing disbursement volume by purpose code: fuel (X%), trip allowance (Y%), repairs (Z%), meals, advances, salary, supplies, other. Filterable by date range and cost centre. Drill into any segment to see underlying transactions. |
| FR-706 | Spend by Employee Report | P1 | Yes | Bar chart or table showing top employees by disbursement volume. Columns: employee name, carrier, cost centre, total disbursed, number of disbursements, average disbursement amount. Filterable by date range, cost centre, and carrier. Helps identify outliers and potential misuse. |
| FR-707 | Spend by Period Report | P1 | Yes | Line chart showing disbursement volume over time (daily, weekly, monthly). Compare current period vs. previous period. Trend analysis: is spend increasing or decreasing? Filterable by cost centre and purpose. |
| FR-708 | Spend by Cost Centre Report | P0 | Yes | Bar chart showing disbursement volume by cost centre (e.g., Northern Route ZMW 450K, Southern Route ZMW 380K, City Fleet ZMW 290K). Drill into any cost centre to see per-employee and per-purpose breakdowns. Budget vs. actual comparison (Phase 2 — requires budget configuration). |
| FR-709 | Carrier Distribution Report | P1 | Yes | Pie chart showing disbursement volume by carrier: Airtel Money (X%), MTN MoMo (Y%), Zamtel Kwacha (Z%). Fee analysis: total carrier fees paid by carrier, average fee rate by carrier. Helps finance director negotiate carrier rates or shift employees to lower-cost carriers. |
| FR-710 | Failed Disbursement Report | P1 | Yes | List of failed disbursements with failure reason (carrier timeout, insufficient recipient wallet, network error, etc.). Retry action for retriable failures. Aggregate: failure rate by carrier (identify unreliable carriers). SLA tracking: percentage of disbursements completed successfully. |
| FR-711 | Receipt Upload | P2 | No | Employee or finance user can upload a receipt image (JPEG/PNG, max 5 MB) against a completed disbursement. Receipt stored and linked to the transaction for audit purposes. OCR extraction of receipt details (Phase 2+). |
| FR-712 | Scheduled Reports | P2 | No | Company admin configures automated report delivery: daily summary (email at 18:00 CAT), weekly summary (Monday 08:00 CAT), monthly summary (1st of month). Reports delivered as PDF attachments to configured email addresses. |

### FR-800: Platform Operator Management

| ID | Requirement | Priority | MVP | Description |
|---|---|---|---|---|
| FR-801 | Platform Dashboard | P0 | Yes | System-wide KPIs displayed on `/platform` route: total companies (active/suspended/pending), total disbursement volume (ZMW, this month and all-time), platform revenue (this month — calculated as sum of all platform fees collected), total active employees across all companies, pending approvals system-wide, failed disbursements (last 24 hours), carrier distribution (pie chart). Volume and revenue trend charts (monthly, last 6 months). |
| FR-802 | Company Management | P0 | Yes | Table of all companies with columns: name, registration number, status (active/suspended/pending), wallet balance, available balance, total employees, monthly volume, last funded date, city, industry. Actions: view detail, credit wallet, suspend/unsuspend, edit company details. Search by company name or registration number. Filter by status and industry. |
| FR-803 | Company Detail View | P0 | Yes | Drill into any company: company profile (name, registration, industry, city, created date), wallet details (balance, available, held, last funded), wallet history (credits, debits, holds, releases), user list (company users with roles), recent transactions (last 20), and per-company analytics (volume trend, carrier distribution, top employees). |
| FR-804 | Wallet Crediting | P0 | Yes | Platform operator credits a company's wallet. Fields: company (dropdown), amount (ZMW), bank transfer reference (mandatory), notes (optional). Confirmation step showing: company name, current balance, credit amount, new balance after credit. Credit is immediate upon confirmation. Audit trail: operator name, company, amount, bank reference, timestamp, IP address. |
| FR-805 | Revenue Tracking | P1 | Yes | Platform revenue page (`/platform/revenue`): total platform fee income (this month, last month, all-time), revenue by company (table: company name, fee income, transaction count, average fee per transaction), monthly revenue trend chart, carrier pass-through breakdown (how much went to Airtel vs. MTN vs. Zamtel in carrier fees — this is not platform revenue but useful for carrier relationship management). Revenue is calculated as: sum of all `platformFee` values across all completed disbursements. |
| FR-806 | Fee Schedule Configuration | P1 | Yes | Platform operator configures: **Carrier fee rates** (per carrier, per intent — e.g., Airtel withdrawal 2.5%, Airtel purchase 0.5%). **Platform fee** (rate: 1%, minimum: ZMW 2). **Levy rate** (0% — placeholder for future). Fee schedule changes take effect immediately for new disbursements. Historical disbursements retain the fee rates applied at time of creation. Fee schedule change logged in audit trail. |
| FR-807 | Platform Limit Configuration | P1 | Yes | Platform operator configures platform-wide limits: per-transaction maximum, per-employee-daily maximum, per-company-daily maximum. Current defaults: ZMW 5,000 / ZMW 8,000 / ZMW 500,000. Platform limits must be <= network limits (ZMW 10,000 per carrier). Limit changes take effect immediately. Companies cannot set their own limits above platform limits. |
| FR-808 | Carrier Status Management | P1 | Yes | Dashboard showing carrier integration status: **Airtel Money** (status: operational/degraded/down, success rate %, last API response time), **MTN MoMo** (same), **Zamtel Kwacha** (same). Platform operator can manually flag a carrier as "degraded" or "down" — this displays a warning banner to company users initiating disbursements via that carrier. Carrier status history log. |
| FR-809 | Company Onboarding Review | P1 | No | Queue of pending company registrations. Platform operator reviews: company details, uploaded documents (certificate of incorporation, tax clearance), admin user details. Approve or reject with comment. Approval activates the company and sends welcome email to admin. Rejection sends email with reason and option to re-apply. |
| FR-810 | Platform Audit Log | P0 | Yes | Comprehensive audit log of all platform operator actions: wallet credits, company status changes, fee schedule changes, limit changes, carrier status changes. Each entry: timestamp, operator name, action category, action details, severity (info/warning/critical), IP address. Filterable by date range, category, severity, and operator. Exportable to CSV. |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|---|---|
| API response time (p50) | < 200 ms |
| API response time (p95) | < 500 ms |
| API response time (p99) | < 2 seconds |
| Disbursement end-to-end (approval to carrier confirmation) | < 30 seconds |
| Fee calculation (client-side) | < 50 ms |
| Dashboard page load | < 2 seconds on 3G connection |
| CSV export generation (1,000 rows) | < 5 seconds |
| CSV export generation (10,000 rows) | < 30 seconds |
| Bulk upload validation (500 rows) | < 10 seconds |
| Concurrent users supported | 100 simultaneous |
| Daily disbursement capacity | 10,000 disbursements per day |

### 5.2 Security

| Requirement | Detail |
|---|---|
| Encryption at rest | AES-256 for database, file storage, and backups |
| Encryption in transit | TLS 1.3 (minimum TLS 1.2) for all API communication |
| Authentication | JWT with short-lived access tokens (15 min) + refresh tokens (30 days) |
| Password storage | bcrypt with cost factor 12 |
| API security | Rate limiting (60 req/min per user), CORS whitelisting, CSRF protection |
| Audit trail | Immutable append-only log for all state-changing actions |
| Data classification | PII (employee NRC, phone): encrypted + access-logged. Financial (wallet, transactions): encrypted + immutable audit trail |
| Penetration testing | Annual third-party pen test minimum; automated OWASP scanning in CI/CD |
| Key management | Cloud KMS for encryption keys; automatic rotation every 90 days |
| IP restrictions | Platform operator and company admin configurable IP whitelists |
| Session security | Single active session per user; session invalidation on role change |

### 5.3 Availability

| Metric | Target |
|---|---|
| Uptime SLA | 99.9% (< 8.76 hours downtime per year) |
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 15 minutes |
| Maintenance window | Sundays 02:00-04:00 CAT (with zero-downtime deployment goal) |
| Database failover | Automatic failover with < 30 second switchover |
| Backup frequency | Hourly incremental, daily full, weekly offsite |

### 5.4 Scalability

| Dimension | Target |
|---|---|
| Companies | 100+ active companies |
| Employees | 50,000+ employee records |
| Transactions | 10,000 disbursements per day, 300,000 per month |
| Data retention | 7 years transactional data (BOZ requirement) |
| Horizontal scaling | Stateless application tier behind load balancer |
| Database | PostgreSQL with read replicas; partitioned transaction tables by month |
| File storage | S3-compatible object storage for CSV uploads, receipts, documents |

### 5.5 Compliance & Data Residency

| Requirement | Detail |
|---|---|
| Regulatory authority | Bank of Zambia (BOZ) |
| Custody model | Platform does NOT hold funds; licensed custodian holds all customer funds |
| AML/CFT | Compliance with BOZ Anti-Money Laundering Directives; suspicious transaction reporting |
| Data residency | All financial data stored within Southern Africa (South Africa data centre minimum) |
| Record retention | 7 years for financial records, 5 years for KYC/identity documents (BOZ Prudential Guidelines) |
| Data protection | Compliance with Zambia Data Protection Act (2021); consent management, data minimization |
| Audit requirements | Full audit trail for every disbursement, every wallet movement, every admin action |
| Tax compliance | Integration with ZRA (Zambia Revenue Authority) reporting requirements |
| PACRA compliance | Company registration validation against PACRA (Patents and Companies Registration Agency) records |

### 5.6 Accessibility & Internationalization

| Requirement | Detail |
|---|---|
| Language | English (primary); Bemba and Nyanja (Phase 2) |
| Currency formatting | ZMW with thousands separator and 2 decimal places (e.g., ZMW 1,245,000.00) |
| Phone number format | +260 with carrier-appropriate prefix validation |
| Date format | ISO 8601 for data exchange; DD/MM/YYYY for UI display (Zambian convention) |
| Time zone | CAT (Central Africa Time, UTC+2) |
| Responsive design | Desktop-first (accountant's tool), fully responsive for tablet and mobile approval workflows |
| Minimum browser | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |

---

## 6. Phase 2 Features

The following features are visible in the platform as "Coming Soon" preview cards but are not functional in the MVP. They represent the roadmap for the Full Build engagement.

### 6.1 Corporate Cards

| Feature | Description |
|---|---|
| Virtual cards | Issue virtual Visa/Mastercard cards to employees for online purchases. Card linked to employee's disbursement wallet. |
| Physical cards | Order physical NFC-enabled cards for fuel station payments and in-store purchases. Card personalization with employee name and company branding. |
| Spend controls | Per-card limits, MCC (Merchant Category Code) restrictions, geographic restrictions. |
| Real-time notifications | Push notification on every card transaction (approved or declined). |
| Card management | Freeze/unfreeze, PIN management, replacement. |
| **BaaS partner required** | Integration with Marqeta, Stripe Issuing, or regional BaaS provider (e.g., Paymentology for Southern Africa). |

### 6.2 Self-Service Deposits

| Feature | Description |
|---|---|
| Bank transfer | Company initiates bank transfer to custodian's designated account; platform auto-reconciles and credits wallet. |
| Mobile money top-up | Company admin tops up wallet via Airtel Money, MTN MoMo, or Zamtel Kwacha (C2B collection). |
| Standing order | Set up recurring bank transfer from company bank account to custodian for automatic weekly/monthly wallet top-up. |
| Instant reconciliation | Real-time matching of incoming bank transfers to company wallets using unique reference codes. |

### 6.3 Employee Mobile App

| Feature | Description |
|---|---|
| Platform | Flutter (iOS + Android) |
| View balance | Employee sees total disbursements received (today, this week, this month). |
| Transaction history | List of all received disbursements with details (amount, purpose, reference, date). |
| Expense claims | Employee submits expense claims with receipt photos for reimbursement. |
| Push notifications | Real-time notification when a disbursement is sent. |
| Profile management | Update phone number, carrier preference. |

### 6.4 Multi-Currency Forex

| Feature | Description |
|---|---|
| Supported currencies | ZMW (primary), USD, ZAR, BWP, MWK |
| FX conversion | Company can hold balances in multiple currencies. Conversion at mid-market rate + 0.5% margin. |
| Cross-border disbursements | Disburse to employees in neighboring countries (Malawi, Botswana, Zimbabwe, Mozambique). |
| Rate sourcing | Real-time FX rates from Bank of Zambia reference rates + market feeds. |

### 6.5 ERP Integrations

| Integration | Description |
|---|---|
| **Sage** | Two-way sync: import employee master data, export disbursement journals. |
| **QuickBooks** | Export disbursement transactions as journal entries. Map cost centres to QB classes. |
| **Xero** | API integration for transaction export and bank feed reconciliation. |
| **Pastel (Sage Pastel)** | Popular in Southern Africa; export disbursement data for payroll and expense reporting. |
| **Custom API** | REST API for companies with proprietary ERP systems. Webhook notifications for real-time event streaming. |

---

## 7. Success Metrics (KPIs)

### 7.1 Operational Efficiency

| KPI | Target (3 months) | Target (12 months) |
|---|---|---|
| Time to disburse (approval to carrier confirmation) | < 30 seconds | < 15 seconds |
| Approval turnaround (submission to approval/rejection) | < 4 hours | < 1 hour |
| Disbursement success rate | > 95% | > 99% |
| Carrier API uptime (Airtel, MTN, Zamtel) | > 98% | > 99.5% |
| Failed disbursement resolution time | < 2 hours | < 30 minutes |

### 7.2 Adoption & Growth

| KPI | Target (3 months) | Target (12 months) |
|---|---|---|
| Companies onboarded | 5 | 100+ |
| Total employees registered | 2,000 | 50,000 |
| Employee coverage (% receiving digital disbursements) | > 80% | > 95% |
| Monthly disbursement volume | ZMW 5M | ZMW 100M |
| Monthly disbursement count | 5,000 | 100,000 |
| Daily active company users (finance + approvers) | 15 | 300 |

### 7.3 Financial Performance

| KPI | Target (3 months) | Target (12 months) |
|---|---|---|
| Platform fee revenue (monthly) | ZMW 50,000 | ZMW 1,000,000 |
| Average platform fee per transaction | ZMW 10 | ZMW 10 |
| Revenue per company per month | ZMW 10,000 | ZMW 10,000 |
| Gross margin (platform fee - infrastructure cost) | > 60% | > 75% |
| Customer acquisition cost (per company) | < ZMW 5,000 | < ZMW 2,000 |

### 7.4 Platform Reliability

| KPI | Target |
|---|---|
| Platform uptime | 99.9% |
| API response time (p95) | < 500 ms |
| Carrier integration uptime | > 98% per carrier |
| Data integrity (reconciliation variance) | 0% |
| Audit trail completeness | 100% of state changes logged |
| Security incidents | 0 critical breaches |

### 7.5 User Satisfaction

| KPI | Target |
|---|---|
| Finance user NPS | > 50 |
| Approver task completion rate | > 95% of approvals within 4 hours |
| Support ticket volume | < 5 per company per month |
| Feature adoption (bulk upload) | > 40% of disbursements via bulk within 6 months |
| Training time for new finance user | < 30 minutes |

---

## 8. Release Plan

### Release 1: MVP — Weeks 1-8 (USD 15,000)

**Theme**: Core disbursement workflows for a single company with 3 mobile money carriers

| Feature | Module | Priority |
|---|---|---|
| Company code + email/phone login | FR-100 | P0 |
| RBAC (5 roles: operator, admin, finance, approver, auditor) | FR-100 | P0 |
| Session management (JWT) | FR-100 | P0 |
| Password policy and account lockout | FR-100 | P0 |
| Employee registry (CRUD) | FR-200 | P0 |
| Bulk employee CSV upload with validation | FR-200 | P0 |
| Employee search, filter, pagination | FR-200 | P0 |
| Cost centre management | FR-200 | P1 |
| 3-step single disbursement flow | FR-300 | P0 |
| Real-time fee calculation (carrier + platform + levy) | FR-300 | P0 |
| Intent types (withdrawal/purchase) | FR-300 | P0 |
| Purpose codes (8 standard codes) | FR-300 | P0 |
| Amount validation (3-tier limits) | FR-300 | P0 |
| Wallet balance check + hold on submission | FR-300 | P0 |
| Bulk CSV disbursement upload | FR-400 | P0 |
| Batch validation and fee summary | FR-400 | P0 |
| Batch approval (full batch or per-item) | FR-400 | P0 |
| Two-level approval workflow (initiator -> approver) | FR-500 | P0 |
| Approval queue (pending/approved/rejected tabs) | FR-500 | P0 |
| Approve/reject with comments | FR-500 | P0 |
| Company wallet display (balance/available/held) | FR-600 | P0 |
| Hold-on-approval / release-on-reject pattern | FR-600 | P0 |
| 3-tier limit enforcement | FR-600 | P0 |
| Platform operator wallet crediting | FR-600 | P0 |
| Transaction history with filters and search | FR-700 | P0 |
| Transaction detail with fee breakdown and status timeline | FR-700 | P0 |
| CSV export | FR-700 | P0 |
| Spend by purpose and cost centre reports | FR-700 | P0 |
| Platform dashboard (KPIs, volume, revenue) | FR-800 | P0 |
| Company management table | FR-800 | P0 |
| Wallet crediting with bank reference | FR-800 | P0 |
| Platform audit log | FR-800 | P0 |

**Milestones:**
- Week 1-2: Authentication, RBAC, layouts, and routing complete
- Week 3-4: Employee management and single disbursement flow complete
- Week 5: Bulk disbursement, approval workflows, wallet management complete
- Week 6: Reporting, platform operator pages, carrier API integration (sandbox)
- Week 7: Integration testing, carrier API production credentials, UAT with pilot company
- Week 8: Bug fixes, performance optimization, MVP launch with Copperbelt Transport as pilot

**Deliverables:**
- Fully functional web application (React + TypeScript)
- 3 carrier integrations (Airtel Money, MTN MoMo, Zamtel Kwacha) — sandbox or production
- Platform operator and company admin portals
- Complete audit logging
- User documentation and admin guide
- Full source code handover (IP transfer)

---

### Release 2: Full Build — Months 3-6 (USD 95,000 total including MVP)

**Theme**: Multi-company platform with Phase 2 features, production carrier integrations, and scale

| Feature | Module |
|---|---|
| MFA (SMS OTP) | FR-100 |
| Self-service company registration | FR-100 |
| IP restriction configuration | FR-100 |
| Employee data export | FR-200 |
| Batch processing with real-time progress | FR-400 |
| Bulk upload history | FR-400 |
| Approval delegation | FR-500 |
| Threshold-based auto-approval | FR-500 |
| Escalation rules | FR-500 |
| Low balance alerts | FR-600 |
| Wallet reconciliation (automated) | FR-600 |
| Multi-wallet support | FR-600 |
| PDF export with company letterhead | FR-700 |
| Receipt upload (JPEG/PNG) | FR-700 |
| Scheduled reports (daily/weekly/monthly email) | FR-700 |
| Fee schedule configuration UI | FR-800 |
| Platform limit configuration UI | FR-800 |
| Carrier status management | FR-800 |
| Company onboarding review queue | FR-800 |
| **Phase 2: Corporate Cards** | New module |
| **Phase 2: Self-Service Deposits** | New module |
| **Phase 2: Employee Mobile App (Flutter)** | New module |
| **Phase 2: Multi-Currency Forex** | New module |
| **Phase 2: ERP Integrations (Sage, QuickBooks, Xero, Pastel)** | New module |

**Milestones:**
- Month 3: Multi-company support live, 5 companies onboarded
- Month 4: Phase 2 corporate cards pilot, employee mobile app beta
- Month 5: ERP integrations (Sage + QuickBooks), self-service deposits
- Month 6: Full production launch, 3-month post-launch support included

**Deliverables:**
- Production-grade multi-company platform
- Corporate card integration (BaaS partner TBD)
- Flutter mobile app (iOS + Android) for employees
- ERP integrations (Sage, QuickBooks, Xero, Pastel)
- Self-service deposit flows
- Multi-currency forex engine
- 3 months post-launch support and bug fixes
- Operational runbook and SRE documentation

---

## 9. Dependencies

### 9.1 External Partners

| Dependency | Options | Status | Risk |
|---|---|---|---|
| **Licensed Custodian** | BOZ-licensed bank or e-money issuer | In discussion | HIGH — regulatory requirement; no launch without custodian partnership |
| **Mobile Money APIs** | Airtel Money Zambia, MTN MoMo Zambia, Zamtel Kwacha | Sandbox evaluation | MEDIUM — API approval takes 2-4 weeks per carrier |
| **BaaS / Card Issuing** (Phase 2) | Paymentology, Marqeta, Stripe Issuing | Not started | HIGH — 8-12 week integration; Phase 2 dependency only |
| **SMS Gateway** | Zamtel Bulk SMS, Africa's Talking | Account evaluation | LOW — standard integration |
| **Cloud Provider** | AWS, Azure, or regional data centre (Liquid Telecom, Paratus) | Under evaluation | MEDIUM — data residency requirements may limit options |
| **ERP Vendors** (Phase 2) | Sage, QuickBooks, Xero, Pastel | Not started | MEDIUM — API documentation varies in quality |

### 9.2 Regulatory

| Requirement | Authority | Status |
|---|---|---|
| Payment Service Provider registration | Bank of Zambia (BOZ) | Via custodian partner |
| AML/CFT compliance | Financial Intelligence Centre (FIC) Zambia | Framework under development |
| Data Protection registration | Data Protection Commissioner (Zambia Data Protection Act 2021) | Application pending |
| Business registration | PACRA (Patents and Companies Registration Agency) | Active |
| Tax compliance | ZRA (Zambia Revenue Authority) | TPIN active |

### 9.3 Technical

| Dependency | Detail | Risk |
|---|---|---|
| Carrier API reliability | Airtel/MTN/Zamtel APIs have varying uptime and documentation quality | MEDIUM — need fallback and retry logic |
| Carrier API rate limits | Unknown until sandbox testing — may limit bulk disbursement throughput | MEDIUM — may need queue-based processing |
| Phone number portability | Zambian numbers can be ported between carriers; prefix != carrier | LOW — validation is advisory, not blocking |
| Zamtel API maturity | Zamtel Kwacha API is less mature than Airtel/MTN | MEDIUM — may need custom integration work |

---

## 10. Assumptions & Constraints

### Assumptions

| # | Assumption |
|---|---|
| A-1 | A BOZ-licensed custodian partner will be secured before MVP launch |
| A-2 | All three mobile money carriers (Airtel, MTN, Zamtel) provide production API access within 4 weeks of application |
| A-3 | Target companies have finance staff capable of using a web application (Chrome browser, stable internet) |
| A-4 | Employees (recipients) already have active mobile money wallets with their assigned carrier |
| A-5 | The custodian partner provides a real-time or near-real-time API for balance queries and disbursement initiation |
| A-6 | Companies will fund their wallets via bank transfer (manual process in MVP; automated in Phase 2) |
| A-7 | The 1% platform fee (minimum ZMW 2) is commercially viable and acceptable to target companies |
| A-8 | English is sufficient for MVP; local language support (Bemba, Nyanja) is Phase 2 |
| A-9 | Mobile money carrier fee rates (2.5% withdrawal, 0.5% purchase) are stable and will not change significantly during MVP period |
| A-10 | DisbursePro is an "accountant's tool" — employees (recipients) do not need to interact with the platform in MVP |

### Constraints

| # | Constraint |
|---|---|
| C-1 | MVP budget: USD 15,000 (8 weeks) — must deliver core disbursement workflows within this envelope |
| C-2 | Custody model: platform MUST NOT hold customer funds — all funds managed by licensed custodian |
| C-3 | Data residency: all financial data must be stored within Southern Africa (BOZ requirement) |
| C-4 | No dark mode in MVP — Lagoon design system is light-only |
| C-5 | MVP is web-only (React) — no mobile app for employees until Phase 2 (Flutter) |
| C-6 | Single currency (ZMW) in MVP — multi-currency is Phase 2 |
| C-7 | Company wallet funding is manual (platform operator credits after bank transfer confirmation) — self-service deposits are Phase 2 |
| C-8 | No corporate cards in MVP — mobile money disbursements only; cards are Phase 2 |
| C-9 | Maximum 3 mobile money carriers in MVP (Airtel Money, MTN MoMo, Zamtel Kwacha) — no bank transfer disbursements |
| C-10 | IP transfer: full source code delivered to client at MVP completion |

---

## Appendix A: Data Model Reference

### Core Entities

| Entity | Key Fields | Source |
|---|---|---|
| **Company** | id, name, registrationNumber, status, walletBalance, availableBalance, heldBalance, totalUsers, totalEmployees, monthlyVolume, lastFunded, industry, city | `data/companies.ts` |
| **Employee** | id, companyId, firstName, lastName, phone, nrc, carrier, costCentre, department, status, totalDisbursed, lastDisbursement | `data/employees.ts` |
| **Disbursement** | id, companyId, employeeId, employeeName, employeePhone, carrier, netAmount, carrierFee, platformFee, levy, grossAmount, currency, purpose, intent, reference, costCentre, notes, status, initiatedBy, approvedBy, approverComment | `data/disbursements.ts` |
| **AuditEntry** | id, action, category, user, userRole, details, severity, timestamp, ipAddress | `data/types.ts` |
| **PlatformUser** | id, firstName, lastName, email, phone, role | `data/types.ts` |
| **CompanyUser** | id, companyId, firstName, lastName, email, phone, role, status | `data/types.ts` |

### Enumerations

| Type | Values |
|---|---|
| **MobileMoneyCarrier** | airtel_money, mtn_momo, zamtel_kwacha |
| **DisbursementPurpose** | fuel, trip_allowance, repairs, meals, advances, salary, supplies, other |
| **DisbursementIntent** | withdrawal, purchase |
| **DisbursementStatus** | draft, pending_approval, approved, rejected, processing, completed, failed |
| **UserRole** | platform_operator, company_admin, finance_user, approver, auditor |
| **CompanyStatus** | active, suspended, pending |
| **EmployeeStatus** | active, inactive, suspended |

### Fee Calculation Engine

| Component | Formula | Example (ZMW 1,500 withdrawal via Airtel) |
|---|---|---|
| **Carrier fee** | netAmount * carrierRate[carrier][intent] | 1,500 * 0.025 = ZMW 37.50 |
| **Platform fee** | max(netAmount * 0.01, 2.00) | max(1,500 * 0.01, 2) = ZMW 15.00 |
| **Levy** | netAmount * 0.00 (placeholder) | ZMW 0.00 |
| **Gross amount** | net + carrier + platform + levy | 1,500 + 37.50 + 15.00 + 0 = ZMW 1,552.50 |

### 3-Tier Limit Hierarchy

| Tier | Scope | Per Transaction | Per Employee/Day | Per Company/Day |
|---|---|---|---|---|
| **Network** (Carrier) | All carriers | ZMW 10,000 | N/A | N/A |
| **Platform** (DisbursePro) | All companies | ZMW 5,000 | ZMW 8,000 | ZMW 500,000 |
| **Company** (Admin-configured) | Per company | Configurable (<= platform) | Configurable (<= platform) | Configurable (<= platform) |

---

## Appendix B: Mock Data Reference

All mock data uses realistic Zambian context. This data is used in the prototype and referenced throughout this PRD.

### Companies (6)

| ID | Name | Industry | City | Employees | Monthly Volume |
|---|---|---|---|---|---|
| COMP-001 | Copperbelt Transport Services Ltd | Transport & Logistics | Ndola | 650 | ZMW 2,400,000 |
| COMP-002 | Lusaka Fresh Foods Ltd | Agriculture & Food | Lusaka | 180 | ZMW 890,000 |
| COMP-003 | Zambezi Logistics Ltd | Transport & Logistics | Livingstone | 420 | ZMW 1,800,000 |
| COMP-004 | Kafue Mining Supplies Ltd | Mining & Supplies | Kafue | 95 | ZMW 650,000 |
| COMP-005 | Livingstone Tourism Group | Tourism & Hospitality | Livingstone | 210 | ZMW 1,200,000 |
| COMP-006 | Kitwe Construction Ltd | Construction | Kitwe | 340 | ZMW 0 (suspended) |

### Key Personnel

| Name | Role | Company |
|---|---|---|
| Mwamba Kapumba | Finance Director / Company Admin | Copperbelt Transport |
| Joseph Banda | Fleet Manager / Approver | Copperbelt Transport |
| Thandiwe Mulenga | Finance Officer / Initiator | Copperbelt Transport |
| Chanda Mutale | Platform Operator | DisbursePro (platform) |

### Cost Centres (Copperbelt Transport)

Northern Route, Southern Route, City Fleet, Long Haul, Maintenance

### Mobile Money Carriers

| Carrier | Code | Withdrawal Rate | Purchase Rate | Network Limit |
|---|---|---|---|---|
| Airtel Money | airtel_money | 2.5% | 0.5% | ZMW 10,000 |
| MTN MoMo | mtn_momo | 2.5% | 0.5% | ZMW 10,000 |
| Zamtel Kwacha | zamtel_kwacha | 2.5% | 0.5% | ZMW 10,000 |

---

*Document version 1.0 — Generated 2026-04-04*
*DisbursePro — Enterprise Disbursement & Expense Management Platform*
