# DisbursePro — Feature Proposal & Strategic Roadmap

**Document owner:** Qsoftwares Ltd — DisbursePro Product
**Audience:** DisbursePro client stakeholders, engineering, compliance, go-to-market
**Version:** 1.0
**Date:** 2026-04-05
**Status:** Draft for client review

---

## 1. Executive Summary

DisbursePro is positioned at the intersection of three structural tailwinds in Zambia and the broader SADC corridor: (1) mobile-money account penetration has crossed **58%** of adults and financial inclusion jumped from **49% in 2021 to 73% in 2024** (FinScope / World Bank Findex 2025), (2) the Bank of Zambia (BoZ) is actively modernising the regulatory perimeter with the **National Payment System Bill 2025** and the enforcement of the **Data Protection Act No. 3 of 2021** beginning March 2025, and (3) large Zambian employers — from the **Big Four copper mines** (First Quantum Kansanshi & Sentinel, Barrick Lumwana, Mopani, KCM) that collectively employ over 60,000 direct workers plus tens of thousands of contractors, to NGOs running **2,000+ beneficiary cash-transfer programmes**, to agritech outgrower schemes touching **1M+ smallholder farmers** via FISP — are still paying people through a fragmented mix of bank files, cash pickups, and manual mobile-money top-ups.

The current DisbursePro React prototype (28 pages) covers table-stakes bulk disbursement: CSV upload, approval workflow, wallet, carrier reports. To compete and win in a market where **Flutterwave received a Zambian PSP licence in early 2025**, where **Zoona's Tilt Platform**, **Broadpay**, **Pearl Systems**, **Kazang** and **Mobile Payment Solutions (MPS)** already aggregate mobile-money bulk payouts, and where global payroll players like **Workpay, Deel, Niural and Earnipay** are pushing into Southern Africa, we need a sharper thesis than "Fineract + CSV upload."

**Our thesis in five bullets:**

1. **Win the compliance moat first.** BoZ PSP licensing, NAPSA/NHIMA/ZRA electronic filing, and the Data Protection Act create a regulatory tax that kills generic pan-African tools. A purpose-built Zambian engine with built-in PAYE, NAPSA Schedule 1, NHIMA and ZRA TPIN reconciliation is a durable differentiator.
2. **Own the mining + NGO + agritech triangle.** These three verticals dominate formal disbursement volume in Zambia and all share one painful workflow: paying thousands of non-banked field workers on irregular cycles. Templated workflows for each vertical beat a horizontal CSV tool.
3. **Earn loyalty through the recipient, not just the payer.** A lightweight recipient app (USSD + PWA + WhatsApp) that gives beneficiaries statements, tax certificates, and optional Earned Wage Access turns DisbursePro from a B2B tool into a two-sided network — and makes the payer's switching cost much higher.
4. **Monetise with a hybrid pricing model.** Pure 1% per-transaction is a race to the bottom against Flutterwave's 3.5% mobile-money capped fees. A tiered SaaS subscription (ZMW 2,500–25,000/month) + 0.5–1% per-transaction + value-add modules (EWA, tax filing, FX) yields 3-4x the LTV.
5. **Design the regional expansion from day one.** SADC-RTGS / TCIB, USD wallet rails, and multi-currency ledger built into the Fineract custodial wallet now will unlock Malawi, Zimbabwe, Mozambique and DRC corridors in 2027 without a rewrite.

This document proposes **26 new features** organised by priority, with a 6-quarter roadmap, three pricing scenarios, and a top-5 risk register.

---

## 2. Market Landscape

### 2.1 Zambian mobile-money reality (2025–2026)

| Metric | Value | Source |
|---|---|---|
| Adults with mobile-money account | ~58.5% | GSMA / voxdev 2024 |
| Financial inclusion (any formal) | 73% (2024) vs 49% (2021) | FinScope 2024 |
| Registered mobile-money agents | >100,000 | Bank of Zambia |
| Airtel Zambia subscriber share | ~48% | Mordor Intelligence 2025 |
| MTN Zambia subscriber share | ~35% | Mordor Intelligence 2025 |
| Zamtel subscriber share | ~17% | Mordor Intelligence 2025 |
| Target NFI rate by 2028 | 85% | BoZ National Financial Inclusion Strategy II |

Airtel Money is the volume leader, MTN MoMo dominates urban corporate corridors (Lusaka, Ndola, Kitwe), and Zamtel Kwacha is the cheapest carrier but has the thinnest agent network outside Copperbelt and Lusaka Province. All three are interconnected via the **National Financial Switch (NFS)** operated by ZECHL since 2018, which also bridges bank accounts to wallets — a critical rail for DisbursePro wallet top-ups.

### 2.2 Competitor feature matrix

| Capability | DisbursePro (today) | Flutterwave (Send/Transfers) | Broadpay ZM | Pearl Systems (MPS) | Zoona Tilt | Workpay (KE) | Kazang |
|---|---|---|---|---|---|---|---|
| BoZ PSP licence | Planned | Yes (2025) | Yes | Yes (aggregator) | Yes | No (via partner) | Yes |
| Bulk CSV disbursement | Yes | Yes | Yes | Yes | Yes | Yes | Partial |
| Multi-carrier (Airtel/MTN/Zamtel) | Yes | Yes | Yes | Yes | Yes | Via Flutterwave | Partial |
| Approval workflow + tiers | Yes | Limited | No | No | Basic | Yes | No |
| Dual approval / segregation of duties | Yes | No | No | No | No | Yes | No |
| PAYE / NAPSA / NHIMA auto-calc | **No** | No | No | No | No | Kenya only | No |
| ZRA e-filing integration | **No** | No | No | No | No | No | No |
| Earned Wage Access | **No** | No | No | No | No | Roadmap | No |
| Recipient mobile/USSD app | **No** | Send app (sender only) | No | No | SMS only | Employee PWA | No |
| Cross-border SADC | **No** | Yes | Limited | No | No | Via Flutterwave | No |
| AI fraud detection | **No** | Yes | No | No | No | Basic | No |
| Mining-vertical workflows | **No** | No | No | No | No | No | No |
| NGO beneficiary management | **No** | No | No | No | Partial | No | No |
| Agritech outgrower workflows | **No** | No | No | Partial (FISP) | No | No | No |
| Fineract-based open core | **Yes** | No | No | No | No | No | No |

DisbursePro's green-field opportunity is the right-hand column: **no incumbent** combines statutory Zambian payroll compliance, vertical templates, EWA, and a recipient-side experience on a single open-core platform.

### 2.3 Regulatory perimeter

- **National Payment Systems Act** (Act No. 1 of 2007, successor bill N.A.B. 32 of 2025 tabled October 2025). Requires BoZ designation and licensing for any PSP, money-transfer operator, or payment aggregator.
- **NPS Directive on Electronic Money Issuance 2018 (updated 2023).** Sets capital, float-safeguarding, and e-money float custody rules. DisbursePro's custodial wallet must be 100% segregated and reconciled daily.
- **NPS Directives on ATM, POS, Internet and Mobile Payments 2019.** Governs UX, dispute resolution SLAs (48 hours), and reporting.
- **NPS Money Transfer Services Directives 2021.** Cross-border reporting thresholds.
- **Data Protection Act No. 3 of 2021 (enforcement from March 2025).** Sensitive personal data must generally be stored **inside Zambia**; cross-border transfer requires data-subject consent or Commissioner approval. Data controllers and processors must register with the Office of the Data Protection Commissioner.
- **Banking and Financial Services Act No. 7 of 2017.** Applies when DisbursePro's wallet behaviour looks like deposit-taking — currently ringfenced by the custodial model.
- **Income Tax Act + ZRA Practice Notes 2025.** PAYE bands: 0% up to ZMW 61,200/year, 20% to 85,200, 30% to 110,400, 37% above. Returns due by the 10th of following month via ZRA TaxOnline.
- **NAPSA Act.** 10% of gross (5% employer + 5% employee), monthly ceiling ZMW 8,541 → max contribution ZMW 1,708.20 per employee as of January 2025.
- **NHIMA.** 1% of gross, split 0.5/0.5 employer/employee.
- **Skills Development Levy (SDL).** 0.5% employer-only.

**Effective employer load** on a Zambian formal salary is roughly 6% (NAPSA 5% + NHIMA 0.5% + SDL 0.5%) on top of gross, which DisbursePro must calculate, withhold, remit, and file. Any tool that forces HR to re-enter those numbers into a separate ZRA / NAPSA portal loses the stickiness contest.

---

## 3. Zambian Context Deep-Dive

### 3.1 Why Zambia, and why now

Zambia is one of the few African economies where (a) a single regulator (BoZ) has a coherent, relatively modern payments framework, (b) mobile-money penetration has broken through the 50% psychological ceiling, and (c) three dominant verticals with large, non-bank-dependent workforces are actively digitising. At the same time, the Kwacha has been volatile (ZMW/USD traded between 18 and 28 during 2024–2025) which has made cross-border payroll painful and opened space for a provider with transparent FX and ZMW-denominated settlement discipline.

### 3.2 Three anchor verticals

**Mining & Copperbelt contractors.** The Big Four — First Quantum (Kansanshi, Sentinel, Enterprise), Barrick Lumwana, Mopani Copper Mines, and Konkola Copper Mines — directly employ ~60,000 workers and indirectly support an ecosystem of 150,000+ contract workers through labour brokers, haulage firms (e.g., SGR Logistics, Africa Freight Services), catering, and security companies. Union coverage (MUZ, NUMAW) creates strict payroll-timing SLAs. Contractor payroll is the messy layer: weekly/fortnightly cycles, per-diem for site visits, hardship allowances for underground shifts, and a constant churn as projects ramp up and down. This is DisbursePro's highest-ARPU segment.

**NGO & humanitarian cash programmes.** World Vision Zambia runs 39 large-scale programmes across 29 districts. UNICEF, WFP (which partnered with MTN Zambia and Citibank for refugee cash assistance via the NFS gateway), Oxfam, CARE, GiveDirectly, and dozens of USAID implementing partners collectively disburse humanitarian and social cash transfers to hundreds of thousands of beneficiaries per year. Typical pain: multi-currency donor funding (USD/EUR), beneficiary deduplication across projects, audit-grade reporting to donors, and paying in remote districts (Western, Luapula, Muchinga) where Zamtel is often the only coverage.

**Agritech & outgrower schemes.** Zambia is a significant cotton and tobacco exporter, and maize remains the staple. The government's **FISP e-voucher programme** reached approximately 740,000 farmers across 74 districts in 2024–2025 and is targeting **1M+ farmers in 2025–2026**. Private outgrower schemes (Zambeef, NWK Agri-Services, Alliance Ginneries, Cargill Zambia) push seasonal input credit and then reconcile harvest payments — a workflow that is essentially a bulk disbursement with deductions. Apollo Agriculture is extending AI-driven credit scoring into Zambia, creating complementary demand for digital payout rails.

### 3.3 The informal-worker payment pain (why this is a real problem, not a pitch)

Every Zambian CFO and HR manager we have spoken to tells some version of the same story. Payroll day begins at 04:00. The payroll clerk downloads the approved register from Excel or Odoo, re-keys it into three separate bank and telco portals (one for the salaried staff paid via Zanaco, one for Airtel Money casuals, one for MTN contractors), and then spends the afternoon on the phone chasing "I didn't get my money" complaints from workers whose numbers were mistyped, ported, or deactivated. Cash envelopes are still used for the most remote sites — and cash means armoured transport, shrinkage, and physical risk.

For mining contractors specifically, the pain compounds because the workforce is transient. A labour broker may hire 400 people for a three-month civils contract, most of them paid weekly, half of them without NRCs that match their mobile-money registration names, and all of them expecting same-day settlement. A single late-payment incident becomes a union matter within 24 hours. MUZ and NUMAW have both made on-time electronic payment a recurring collective-bargaining demand since 2022.

NGOs have their own version. Donors (USAID, FCDO, ECHO, SIDA) demand photographic and GPS proof of delivery, beneficiary signatures, and exception reports within 72 hours of a disbursement. The current patchwork of MTN Bulk Pay + Excel + ODK data capture generates audit findings in every programme review. When a World Food Programme–Citibank–MTN pilot ran in Mantapala refugee settlement in 2022–2023, the key lesson was that the interoperability rail existed but the programme-management layer (reconciliation, donor reporting, beneficiary traceability) did not. That gap is DisbursePro's opening.

Agritech outgrowers fight a different battle: seasonal cash-flow mismatches. A cotton farmer receives inputs in October and gets paid for harvest in June. Between those two moments, the aggregator needs to track input-credit balances per farmer, deductions, yield-quality adjustments, and split payments (some to the farmer, some to the cooperative, some to the input supplier). Today this happens in Excel on a laptop in a ginnery in Chipata.

### 3.4 Opportunity sizing (rough, for client discussion)

| Segment | Addressable employers/orgs | Avg beneficiaries each | Annual volume (ZMW) | DisbursePro take at 1% |
|---|---|---|---|---|
| Mining prime + contractors | ~120 | 500–5,000 | ZMW 18–24B | ZMW 180–240M |
| NGO cash transfers | ~400 | 200–5,000 | ZMW 4–6B | ZMW 40–60M |
| Agritech outgrowers | ~60 | 1,000–50,000 | ZMW 8–12B | ZMW 80–120M |
| SMEs / logistics / retail | ~3,000 | 10–200 | ZMW 3–5B | ZMW 30–50M |
| Government social cash (long-term) | ~1 central + 116 councils | — | ZMW 10B+ | unknown |
| **Total (ex-govt)** | **~3,580** | | **ZMW 33–47B** | **ZMW 330–470M** |

Even at a conservative 10% market share three years in, DisbursePro would generate **ZMW 33–47M (~USD 1.5–2.1M) in annual net take-rate revenue**, before subscription and value-added modules.

---

## 4. Feature Proposals

The 26 features below are grouped by priority. Each carries a user story, business value, competitive gap, technical approach (aligned with the existing Fineract + 4 custom modules architecture at `D:\disbursement-platform\fineract\custom\dispro\`), dependencies, T-shirt effort, and regulatory notes.

---

### Priority P0 — Must-have for production launch (Q2–Q4 2026)

These are the features DisbursePro cannot launch commercially without. They close credibility gaps against Broadpay, Pearl Systems, and Flutterwave.

---

#### P0-1. BoZ-compliant PSP Operating Model & Licensing Pack
**Tagline:** *Pass the regulator before you pass the invoice.*

- **User story:** As the DisbursePro CEO, I need documented BoZ licensing readiness (capital, float safeguarding, AML/CFT programme, board-level risk committee) so we can operate as a designated PSP without enforcement risk.
- **Business value:** Unblocks every enterprise sale. Mining and NGO procurement will not sign with an unlicensed counterparty; BoZ designation is the price of entry.
- **Competitive context:** Broadpay, Pearl Systems, Kazang, Zoona, Flutterwave Zambia all hold designation. DisbursePro currently does not.
- **Technical approach:** Not a code feature but an enabling workstream: legal entity structuring, capital injection (BoZ minimum for PSPs is tiered — confirm with BoZ, historically ZMW 1–5M float capital), designate a Compliance Officer, implement the FATF 40 Recommendations-aligned AML programme, daily float reconciliation in `fineract-savings`, segregated trust account at a designated commercial bank (Zanaco, Stanbic Zambia, or Absa Zambia).
- **Dependencies:** Legal counsel, audit firm, BoZ pre-application engagement.
- **Effort:** XL (6–9 months, parallel to eng work)
- **Regulatory:** NPS Act; NPS Directive on Electronic Money Issuance 2023; AML/CFT Act No. 14 of 2001 (as amended).

---

#### P0-2. Integrated ZRA PAYE + NAPSA + NHIMA Statutory Engine
**Tagline:** *One disbursement run, all statutory deductions calculated, filed, and receipted.*

- **User story:** As an HR manager at a Copperbelt contractor, I want DisbursePro to automatically compute PAYE, NAPSA (capped at ZMW 1,708.20/employee/month), NHIMA 1%, and SDL 0.5% for each payroll line, produce the ZRA and NAPSA Schedule 1 files, and remit to the statutory accounts on my behalf — so I never touch TaxOnline or the NAPSA portal again.
- **Business value:** This is the single highest-retention feature in the roadmap. It turns DisbursePro from an adjacent tool HR uses monthly into the system-of-record HR cannot leave. Workpay's Kenyan entrenchment is built on exactly this dynamic.
- **Competitive context:** No Zambian disbursement competitor has this. Workpay does it for Kenya. This is our clearest moat.
- **Technical approach:** New custom module `custom/dispro/dispro-statutory/` containing: (a) `StatutoryCalculatorService` implementing ZRA 2025 bands + NAPSA ceiling + NHIMA + SDL, (b) `StatutoryFilingAdapter` producing the ZRA TPIN-based PAYE return file and the NAPSA Schedule 1 CSV, (c) a new React page set `pages/payroll/statutory/*` (calculator, preview, file generator, filing history). Store statutory rates in a Liquibase seed so bands can be patched annually without a deploy.
- **Dependencies:** Valid ZRA TPIN per employer, NAPSA SSN per employee, NHIMA number per employee; optional ZRA TaxOnline API (manual upload fallback if unavailable).
- **Effort:** L
- **Regulatory:** ZRA Income Tax Act; NAPSA Act; NHIMA Act; Employment Code Act No. 3 of 2019.

---

#### P0-3. KYB Onboarding with UBO & Registrar Integration
**Tagline:** *Verify a Zambian employer in 15 minutes, not 15 days.*

- **User story:** As a DisbursePro onboarding officer, I want to verify a new company's certificate of incorporation, directors, and ultimate beneficial owners against PACRA (Patents and Companies Registration Agency) and sanctions lists so we meet BoZ AML expectations without a two-week manual review.
- **Business value:** Reduces sales-to-revenue time from ~14 days to same-day. Every day saved compounds.
- **Competitive context:** Mozambique's central bank now requires 12-month KYB refresh for payment institutions — a regional trend Zambia is expected to follow. VoveID, Smile ID, and Youverse are building Africa KYB APIs; DisbursePro should integrate, not rebuild.
- **Technical approach:** Extend existing `pages/onboarding/*` flow with: PACRA certificate OCR, director ID capture, UBO declaration form, automated screening against OFAC/UN/EU sanctions, World-Check risk score, annual auto-refresh cron in `fineract-cob`. Persist in new `m_dispro_kyb_profile` table.
- **Dependencies:** PACRA data access (scraping or licensed partner), Smile ID or VoveID API, OFAC list feed.
- **Effort:** M
- **Regulatory:** AML/CFT Act; FATF R.10 (CDD) and R.22 (DNFBPs); Data Protection Act (consent to process director PII).

---

#### P0-4. Recipient USSD & WhatsApp Notifications (Bemba / Nyanja / English)
**Tagline:** *The worker knows their money arrived before the approver closes their laptop.*

- **User story:** As a field worker in Solwezi receiving a per-diem, I want an SMS or WhatsApp message in Bemba or Nyanja confirming the amount, the purpose, and a reference number I can quote to the Airtel agent, so I trust the payment and don't call my supervisor.
- **Business value:** Dramatically reduces payer support load (currently ~15% of HR time on "did I get paid?" calls) and increases beneficiary trust, which is the #1 blocker to digital cash transfer adoption in Zambian NGO programmes per CGAP.
- **Competitive context:** Zoona Tilt sends SMS notifications but no local-language or WhatsApp variant. Flutterwave Send is payer-side only.
- **Technical approach:** Message templating service with language packs (English, Bemba, Nyanja, Tonga, Lozi), channel router (SMS via Africa's Talking or Infobip, WhatsApp Business API via 360dialog), delivery receipts stored against each disbursement line. New React page `pages/settings/notifications-templates.tsx` for admins.
- **Dependencies:** WhatsApp BSP contract, localisation resources.
- **Effort:** M
- **Regulatory:** Data Protection Act (lawful basis + minimisation), Electronic Communications Act (sender ID registration with ZICTA).

---

#### P0-5. Approval Workflow Hardening: Maker-Checker, Dual Approval > ZMW 50K, SMS OTP + TOTP
**Tagline:** *Segregation of duties that passes a Big Four audit.*

- **User story:** As the CFO of an NGO disbursing ZMW 3M in monthly beneficiary stipends, I want two different approvers (country director + finance lead) to sign off any batch above ZMW 50,000, with SMS OTP on the first approval and authenticator-app TOTP on the second, and a hard block on self-approval.
- **Business value:** Meets donor audit requirements (USAID, EU, FCDO) and reduces internal fraud risk — the #1 board concern.
- **Competitive context:** Existing DisbursePro prototype has approval tiers but only SMS OTP. Workpay and Deel both enforce TOTP on high-value approvals.
- **Technical approach:** Extend `custom/dispro/dispro-approval/` with a `SecondFactorPolicy` (SMS + TOTP), prevent `maker == checker` at the service layer, add audit-log entries for every approval event, configurable per-company tier thresholds (default 5K/50K/dual). TOTP via `java-totp` library; QR enrolment in settings.
- **Dependencies:** SMS OTP provider (already integrated), TOTP library.
- **Effort:** M
- **Regulatory:** NPS Directives 2019 (segregation of duties); internal control standards under the Companies Act 2017.

---

#### P0-6. Float Safeguarding & Daily Reconciliation Dashboard
**Tagline:** *Every ngwee of customer money, segregated and reconciled before breakfast.*

- **User story:** As the DisbursePro Finance Controller, I want a daily automated reconciliation between our BoZ-designated trust account balance, the `fineract-savings` ledger, and the sum of all company wallet balances, with a red-flag alarm if the delta exceeds ZMW 1,000.
- **Business value:** Table-stakes for BoZ licensing and absolutely essential for insurance underwriting.
- **Competitive context:** All licensed PSPs must do this; most do it in Excel. DisbursePro will productise it.
- **Technical approach:** Batch job in `fineract-cob` that pulls the trust-account statement via Zanaco or Stanbic API (or MT940 file drop), matches against the ledger, writes a `m_dispro_daily_recon` row, emails exceptions. Admin dashboard page `pages/admin/reconciliation.tsx`.
- **Dependencies:** Bank API access, trust account at designated bank.
- **Effort:** M
- **Regulatory:** NPS Directive on Electronic Money Issuance 2023 (float safeguarding); IFRS 9 for the trust liability.

---

#### P0-7. Public REST API + Webhooks for Disbursement Lifecycle
**Tagline:** *Let customers fire-and-forget from their HRIS.*

- **User story:** As the IT lead at Zambeef, I want to POST a payroll batch from our SAP SuccessFactors HRIS directly to DisbursePro's API and receive a webhook on each line's success/failure, so payroll day is fully automated.
- **Business value:** Unlocks the >500-employee segment where CSV upload stops scaling. API integrations carry 3x the retention of UI-only usage.
- **Competitive context:** Flutterwave's Transfers API is the gold standard. Workpay publishes an API. DisbursePro has none publicly documented.
- **Technical approach:** Expose `/api/v1/disbursements`, `/api/v1/batches`, `/api/v1/wallet` via Fineract's existing Spring MVC layer with API-key auth and HMAC-signed webhooks. OpenAPI 3.1 spec autogenerated; sandbox environment with test carrier stubs.
- **Dependencies:** Developer portal (Stoplight, Readme, or custom).
- **Effort:** L
- **Regulatory:** Data Protection Act (processor agreements for integrating customers).

---

#### P0-8. Carrier Failover & Least-Cost Routing
**Tagline:** *When Airtel is down, we route via MTN — automatically.*

- **User story:** As a payroll clerk at a mining contractor, I want batches to complete even when one carrier is throttling or down, by routing each recipient to their preferred MSISDN but falling back to an alternate number if the first fails twice.
- **Business value:** Reliability is THE differentiator in mobile-money disbursement — a single failed payroll run can lose an enterprise customer.
- **Competitive context:** Pearl Systems and Zoona Tilt both claim multi-carrier resilience; DisbursePro's current prototype only has per-line explicit carrier selection.
- **Technical approach:** Extend `custom/dispro/dispro-mobilemoney/` with a `CarrierRouter` that holds per-carrier health scores (success rate, latency rolling window), per-recipient carrier preferences, and retry/failover rules. Integrate health signals from the 4 existing carrier adapters.
- **Dependencies:** Multiple MSISDNs captured during beneficiary onboarding; the existing 4-module carrier abstraction.
- **Effort:** M
- **Regulatory:** None specific; avoid breaching carrier-level terms of service.

---

#### P0-9. Company Wallet Top-up via Bank Transfer, Direct Debit & Card
**Tagline:** *Fund your wallet in five minutes, not five working days.*

- **User story:** As a Finance Manager at an NGO, I want to top up our DisbursePro wallet by initiating a push payment from our Stanbic business account and see the funds credited within minutes, not wait T+2 for manual reconciliation.
- **Business value:** Cash-flow friction is the #1 churn trigger in custodial B2B disbursement. Faster top-up = more runs = more fees.
- **Competitive context:** Flutterwave and Paystack both auto-credit via virtual account numbers. Zambian competitors still rely on proof-of-payment uploads.
- **Technical approach:** Issue each company a **virtual account number** at a partner bank (Zanaco is the likely partner given its NFS dominance); push notifications from the bank trigger an automated credit to the `fineract-savings` wallet. Also support card top-ups via DPO Group or Cellulant for smaller SMEs.
- **Dependencies:** Bank virtual-account API; card acquirer.
- **Effort:** M
- **Regulatory:** NPS Directives; float safeguarding applies immediately on credit.

---

### Priority P1 — Differentiators (Q1–Q3 2027)

These features convert DisbursePro from "yet another disbursement tool" into the default choice for Zambian HR/Finance teams.

---

#### P1-1. Earned Wage Access (EWA) — "Salary Yabwino"
**Tagline:** *Workers draw a fraction of what they've already earned, any day of the month.*

- **User story:** As a mine contractor labourer on a monthly cycle, I want to draw up to 40% of my accrued earnings at any point before payday to cover school fees or hospital visits, without a payday loan from a kaloba lender at 30%/month.
- **Business value:** EWA is the fastest-growing payroll feature in Africa — Earnipay raised $4M in 2022 on this single thesis, and ILO's 2025 global study shows 80% of formal-sector income earners prefer it over fixed monthly cycles. For DisbursePro it creates a brand-loyalty moat at the recipient level and a premium SaaS charge at the employer level.
- **Competitive context:** No live Zambian EWA product. Earnipay, Niural, and Tapcheck operate elsewhere. First-mover advantage.
- **Technical approach:** New module `custom/dispro/dispro-ewa/` containing accrual calculator (days worked × daily rate), advance ledger (short-term receivable against the employer, NOT a loan to the employee — keeps us out of the microlending licence regime), repayment automation on payday. UI: new `pages/ewa/*` with employer enrolment, employee request, risk limits. Funding model: employer pre-funds via wallet, DisbursePro charges a 1% access fee capped at ZMW 50.
- **Dependencies:** Employer attendance/timesheet feed (manual or HRIS), AML monitoring for unusual draw patterns.
- **Effort:** L
- **Regulatory:** Employment Code Act (wages in arrears) — structure as employer advance, not a loan, to avoid Credit Provider licensing under BFSA.

---

#### P1-2. Recipient Progressive Web App & USSD Self-Service
**Tagline:** *Statements, tax certificates, and P60s in the palm of every beneficiary.*

- **User story:** As a field officer for an NGO running a cash-transfer programme in Western Province, I want my beneficiaries to dial *384# to check their last 5 payments, see the purpose, and download a PDF payment history for ZRA, without needing a smartphone.
- **Business value:** Solves the #1 audit finding in humanitarian cash programmes (traceability) and provides tax receipts that formalise informal workers.
- **Competitive context:** Nobody offers this in Zambia. GiveDirectly uses SMS only.
- **Technical approach:** (a) USSD gateway integration (Africa's Talking or via carriers directly) with a menu tree: balance, last 5, request statement, help; (b) lightweight PWA at `my.disbursepro.zm` with phone+OTP login, transaction list, PDF export. Shares the `custom/dispro/dispro-disbursement/` backend.
- **Dependencies:** USSD short code (ZICTA allocation), PWA hosting.
- **Effort:** L
- **Regulatory:** ZICTA short-code allocation; Data Protection Act (recipient consent captured at first login).

---

#### P1-3. Mining Vertical Template — Shift Allowances, Hardship Pay, Union Deductions
**Tagline:** *From copper face to Airtel wallet in one click.*

- **User story:** As a payroll admin at a Kansanshi contractor, I want a pre-built template that handles underground-shift allowances (ZMW 75/day), weekend overtime at 1.5x, MUZ/NUMAW union dues (1% of gross), and housing allowance — all wired into the statutory engine.
- **Business value:** Mining is our highest-ARPU segment; vertical templates collapse implementation time from 4 weeks to 3 days.
- **Competitive context:** No competitor has vertical templates. Everyone ships a blank CSV.
- **Technical approach:** Configurable pay-element library (`m_dispro_pay_element`) with element types (earning, deduction, statutory, union), formula expressions, and a vertical template JSON bundle. New UI `pages/templates/mining.tsx`.
- **Dependencies:** Partnership with 1–2 design partners (e.g., a Kansanshi contractor + a Lumwana contractor) to validate rules.
- **Effort:** M
- **Regulatory:** Mines and Minerals Development Act; Collective Bargaining Agreements (MUZ/NUMAW).

---

#### P1-4. NGO Vertical Template — Beneficiary Registry, Donor Reporting, Multi-Currency Budgets
**Tagline:** *Every disbursement tagged to a donor, a project, and an indicator.*

- **User story:** As a World Vision Zambia finance lead managing a USAID-funded cash transfer, I want each payment to carry a project code, donor code, activity code, and GPS metadata, so my quarterly donor report is one export away.
- **Business value:** Opens the NGO segment and turns DisbursePro into a grant-compliant tool.
- **Competitive context:** WFP's current flow requires Excel reconciliation between MTN, Citibank, and the programme MIS. Painful.
- **Technical approach:** Extend disbursement line schema with `donor_code`, `project_code`, `activity_code`, `indicator_code`, optional `latitude/longitude`. Multi-currency budget holder (USD/EUR budget, ZMW payout) with daily FX lock via BoZ mid-rate. Donor export pack (PDF + Excel) in `pages/reports/donor.tsx`.
- **Dependencies:** FX data feed (BoZ daily rates), beneficiary dedup across projects.
- **Effort:** L
- **Regulatory:** NPS Money Transfer Services Directives 2021 for any cross-border inflow component.

---

#### P1-5. Agritech Outgrower Template — Input Credit Netting & Harvest Payments
**Tagline:** *Pay the farmer net of seed and fertiliser, automatically.*

- **User story:** As a buying agent at Alliance Ginneries, I want to pay 12,000 cotton farmers for a season's harvest, automatically deducting their input credit (seed, fertiliser, agrochemicals) and producing both ZMW payouts and statement receipts the farmer can check via USSD.
- **Business value:** Plugs directly into the ZMW 8–12B annual outgrower payment flow.
- **Competitive context:** MPS (Mobile Payment Solutions) has a partial solution for FISP; no private-sector product is fully baked.
- **Technical approach:** Input-credit ledger per farmer, netting engine during batch creation, integration with cooperative/aggregator data (CSV or API), field-agent mobile app for capture.
- **Dependencies:** Outgrower cooperative data, farmer registry (national ID or NRC).
- **Effort:** L
- **Regulatory:** Agricultural Credits Act; Data Protection Act.

---

#### P1-6. AI-Driven Fraud & Anomaly Detection
**Tagline:** *Catch the ghost worker before he catches the bus.*

- **User story:** As a DisbursePro risk analyst, I want the system to automatically flag batches containing suspicious patterns — duplicate MSISDNs across employers, round-number amounts clustering at tier-threshold minus 1 kwacha, recipients whose bank details changed within 48 hours of a batch, beneficiaries receiving from 3+ unrelated employers — before I release the batch.
- **Business value:** Mirrors the U.S. Treasury's ML-based fraud prevention (USD 4B recovered in FY24). Concretely reduces loss events and is a huge trust signal in sales conversations.
- **Competitive context:** Flutterwave has basic velocity rules. Nobody in Zambia is doing true ML-based anomaly detection on bulk disbursements.
- **Technical approach:** Start with deterministic rules (velocity, Benford, MSISDN overlap, threshold-avoidance), then train an unsupervised isolation-forest model on the first 6 months of production data. Serve via a `RiskScoringService` called synchronously during batch submission. Explainable flags shown in the approver inbox.
- **Dependencies:** Production transaction data; MLOps tooling (MLflow or SageMaker).
- **Effort:** L
- **Regulatory:** Data Protection Act (automated decision-making Article 25 — human-in-the-loop retained).

---

#### P1-6b. Split Payments & Multi-Leg Disbursements
**Tagline:** *One instruction, three destinations: the worker, the union, and NAPSA.*

- **User story:** As a mining contractor payroll admin, I want a single gross payroll line for each worker to automatically split into net salary (to Airtel Money), union dues (to MUZ account), NAPSA employee share (to NAPSA collection account), and NHIMA share — all from one approval, reconciled back to one gross figure.
- **Business value:** Eliminates the reconciliation gap between gross pay and net payout, which is where most payroll disputes originate.
- **Competitive context:** No Zambian competitor automates the split. Workpay does in Kenya.
- **Technical approach:** Disbursement line gains child "leg" rows, each with its own destination (wallet, bank, statutory account) and status; approval occurs at the parent level; reporting aggregates at either level.
- **Dependencies:** Destination account registry per employer.
- **Effort:** M
- **Regulatory:** Income Tax Act, NAPSA Act (employer remittance obligations).

---

#### P1-7. Scheduled & Recurring Disbursements (Payroll Calendar)
**Tagline:** *Set monthly payroll once. Forget about it.*

- **User story:** As an HR manager, I want to schedule the 25th-of-the-month salary run (with holiday roll-forward) and the 10th-of-month statutory filings, so I literally approve and move on.
- **Business value:** Sticky automation; aligned with the PAYE/NAPSA 10th-of-month deadline.
- **Competitive context:** Workpay and Deel have this; Zambian players do not.
- **Technical approach:** Extend `dispro-disbursement` with a scheduler using Quartz (already in Fineract), holiday calendar table, pre-run dry-run validator.
- **Dependencies:** Public holiday feed for Zambia.
- **Effort:** S

---

#### P1-8. Deep HRIS Integrations (Odoo, Zoho People, SAP SuccessFactors, BambooHR)
**Tagline:** *No more CSVs. Ever.*

- **User story:** As the CIO of a 2,000-employee company, I want DisbursePro to pull the approved payroll register directly from Odoo HR via API every month, reconcile against our GL, and push back payment status.
- **Business value:** Removes the last manual step and makes DisbursePro part of the IT stack.
- **Competitive context:** Deel and Niural have this globally; nobody does it in ZMW.
- **Technical approach:** Pre-built connectors for 4 target HRIS (Odoo is dominant in Zambian SMEs), mapping configurator UI, scheduled sync cron.
- **Dependencies:** HRIS partner credentials.
- **Effort:** L

---

#### P1-9. Virtual Cards for Travel Allowances & Per-Diem
**Tagline:** *Issue a single-use Visa to the mine engineer flying to Kitwe.*

- **User story:** As a travel coordinator, I want to issue a virtual USD or ZMW card with a set limit, expiry, and merchant-category restrictions, so the employee can pay for hotel and car hire without a cash advance.
- **Business value:** Expands the "travel_allowance" purpose category into a high-margin fee line.
- **Competitive context:** Flutterwave and Cleva have virtual cards elsewhere; no local Zambian B2B equivalent.
- **Technical approach:** BaaS partner — Union54 (if revived), Nium, or a local partner with Visa sponsorship; thin wrapper module `custom/dispro/dispro-cards/`.
- **Dependencies:** BaaS partnership, PCI-DSS scope isolation.
- **Effort:** XL
- **Regulatory:** BoZ card-scheme rules; PCI-DSS compliance (if storing PAN).

---

#### P1-10. Advanced Analytics, BI Exports & Custom Dashboards
**Tagline:** *Slice spend by department, cost centre, carrier, purpose — live.*

- **User story:** As a CFO, I want a self-service BI view where I can drag "department" × "purpose" × "carrier" across a monthly time axis and export to PDF for the board pack.
- **Business value:** Monthly board reporting is a natural usage loop; drives feature retention.
- **Competitive context:** Incumbents give static PDFs.
- **Technical approach:** Embedded Metabase or Apache Superset pointed at a read-replica of the Fineract DB; role-based row-level security; scheduled emails.
- **Dependencies:** Read replica, BI tool license.
- **Effort:** M

---

#### P1-11. Bulk Beneficiary Import with Smart Cleanup & Deduplication
**Tagline:** *Your CSV is dirty. We'll clean it.*

- **User story:** As an onboarding admin, when I upload 5,000 beneficiaries I want the system to normalise MSISDNs (+260 prefix), detect duplicates by NRC number, validate carrier assignment via HLR lookup, and flag rows that need attention.
- **Business value:** Removes the single biggest activation friction.
- **Competitive context:** Current prototype lacks HLR lookup and NRC deduplication.
- **Technical approach:** HLR lookup via carrier APIs or HLR aggregator (Infobip, Twilio Lookup), NRC format validator, phonetic name matching for duplicates.
- **Dependencies:** HLR provider.
- **Effort:** M
- **Regulatory:** Data Protection Act (NRC is sensitive PII; must justify processing).

---

### Priority P2 — Regional expansion & AI plays (Q4 2027 – 2028)

---

#### P2-1. SADC Cross-Border Disbursement via TCIB
**Tagline:** *Pay a Zimbabwean expatriate engineer in Mopani from your Lusaka wallet, in 30 seconds.*

- **User story:** As a CFO of a mining prime contractor employing SADC nationals, I want to send ZMW-funded payments to Zimbabwean, Malawian, and Mozambican mobile wallets and bank accounts without touching a correspondent bank.
- **Business value:** Opens expatriate payroll (high ARPU, loyal) and regional expansion.
- **Competitive context:** Flutterwave has this corridor-by-corridor. SADC-RTGS (formerly SIRESS) and the new SADC TCIB scheme make it viable.
- **Technical approach:** Connect to TCIB (Transactions Cleared on an Immediate Basis) via BankservAfrica as a participating PSP. FX engine with BoZ interbank rate + spread. New multi-currency ledger in `fineract-savings`.
- **Dependencies:** TCIB participation (via partner bank), FX liquidity partner.
- **Effort:** XL
- **Regulatory:** BoZ cross-border reporting; SARB sponsoring bank rules; recipient-country licences or partnerships.

---

#### P2-2. USD & EUR Multi-Currency Wallet
**Tagline:** *Donors fund in USD, payouts happen in ZMW, the FX spread is yours to see.*

- **User story:** As an NGO finance officer, I want to hold a USD sub-wallet alongside my ZMW wallet, convert tranches at the BoZ rate + a transparent spread, and see the FX gain/loss on every report.
- **Business value:** Essential for NGO and expat-payroll segments.
- **Competitive context:** Cleva (Nigeria) and Kuda Business offer USD sub-accounts; nothing equivalent in ZM.
- **Technical approach:** Multi-currency savings product; FX rate table updated from BoZ; spread config; auto-conversion triggers.
- **Dependencies:** USD nostro account at Stanbic/Zanaco, FX liquidity.
- **Effort:** L
- **Regulatory:** BoZ Exchange Control; AML enhanced due diligence on FX flows.

---

#### P2-3. AI Copilot for HR — "Ask DisbursePro"
**Tagline:** *"How much NAPSA did we pay last quarter, split by department?" — in natural language.*

- **User story:** As an HR manager without SQL skills, I want to ask "show me the top 20 highest-paid contractors this quarter" or "draft a payment narrative for the Q3 field allowance batch" and get an accurate answer pulled from my own data.
- **Business value:** Differentiation at the executive demo. Table-stakes in 2 years.
- **Competitive context:** Deel AI, Rippled, Ramp, and Brex have AI copilots. No African payroll tool does yet.
- **Technical approach:** RAG over the company's own transaction and beneficiary data; tool-use LLM (Claude / GPT-4 class) with read-only SQL tool; strict tenant isolation; prompt guardrails against PII leakage.
- **Dependencies:** LLM API; data-residency-compliant inference (on-prem or regional hosting may be required post-2025 enforcement).
- **Effort:** L
- **Regulatory:** Data Protection Act — cross-border transfer to LLM vendor needs consent or local inference.

---

#### P2-4. Embedded Credit — Invoice Factoring for Employers & Merchant Advances
**Tagline:** *Unlock tomorrow's receivables to pay today's payroll.*

- **User story:** As the CFO of a haulage company waiting 60 days for a mining invoice, I want to pledge that invoice and draw 70% in my DisbursePro wallet immediately to run payroll.
- **Business value:** High-margin financial product; leverages DisbursePro's cash-flow visibility.
- **Competitive context:** Duplo (Nigeria), Kashat (Egypt). Nothing local.
- **Technical approach:** Partner with a Zambian credit provider (or obtain a Credit Provider licence), build an underwriting score using wallet history, integrate with the wallet as a credit line.
- **Dependencies:** Credit Provider licence or partner; capital from a funder.
- **Effort:** XL
- **Regulatory:** BFSA 2017 Credit Provider licensing.

---

#### P2-5. Government & Council Social Cash Transfer Module
**Tagline:** *Run the SCT programme from a browser — 116 councils, one platform.*

- **User story:** As a Ministry of Community Development officer, I want to disburse the Social Cash Transfer (SCT) stipend to hundreds of thousands of elderly and vulnerable beneficiaries monthly, with biometric receipt confirmation and donor-grade auditability.
- **Business value:** Multi-year public-sector contract; defensible moat via local compliance and vernacular support.
- **Competitive context:** Currently run on a patchwork of ministry IT and MTN. Ripe for consolidation.
- **Technical approach:** Tenant-isolated deployment, biometric API (ZICTA or Smile ID fingerprint), offline-capable field-officer tablet app.
- **Dependencies:** Public-sector sales cycle; biometric integration.
- **Effort:** XL
- **Regulatory:** Public Procurement Act; Data Protection Act (children and vulnerable groups).

---

### Compliance & Infrastructure track (runs across all phases)

---

#### C-1. Zambian Data Residency & Regional Hosting
**Tagline:** *Personal data stays on Zambian soil.*

- **Why:** Data Protection Act Section 70 restricts cross-border transfers of sensitive personal data without consent or Commissioner approval; enforcement began March 2025.
- **What:** Primary production infrastructure hosted in-country (Infratel Zambia, Paratus Zambia, or Liquid Intelligent Technologies Zambia data centres). DR/backup can be in South Africa under standard contractual clauses.
- **Effort:** L (initial) + ongoing.

---

#### C-2. ISO 27001 + SOC 2 Type II Certification Track
**Tagline:** *Enterprise procurement teams tick the box.*

- **Why:** Required by USAID implementing partners, global NGOs, and mining majors with group-level cyber standards.
- **What:** 12-month track starting with gap assessment, ISMS implementation, Stage 1/Stage 2 audits.
- **Effort:** XL.

---

#### C-3. Comprehensive Audit Log & Immutable Event Store
**Tagline:** *Every click, every approval, every penny — forever.*

- **Why:** BoZ inspection, donor audits, internal fraud investigations.
- **What:** Extend existing audit log with cryptographic chaining (hash of previous event), WORM storage, 7-year retention (per Income Tax Act).
- **Effort:** M.

---

#### C-4. Disaster Recovery & Business Continuity Runbook
**Tagline:** *RPO 15 minutes, RTO 4 hours.*

- **Why:** BoZ Directives 2019 require documented BCP for PSPs.
- **What:** Warm standby DB in secondary DC, quarterly failover drills, documented runbooks, tested comms plan.
- **Effort:** L.

---

#### C-5. FATF Travel Rule Compliance for Cross-Border Flows
**Tagline:** *Originator and beneficiary info on every wire.*

- **Why:** Applies the moment P2-1 (SADC cross-border) goes live.
- **What:** Extend the disbursement line schema with originator+beneficiary full name, address, ID, purpose codes (BoZ-specified); screen against sanctions.
- **Effort:** M.

---

## 5. Roadmap Timeline

| Quarter | Theme | Must-ship features |
|---|---|---|
| **Q2 2026** | Licensing + core hardening | P0-1 (BoZ prep), P0-5 (approval hardening), P0-6 (float recon), C-1 (data residency), C-3 (audit log) |
| **Q3 2026** | Statutory moat + KYB | P0-2 (ZRA/NAPSA/NHIMA), P0-3 (KYB), P0-4 (recipient notifications) |
| **Q4 2026** | Production readiness & launch | P0-7 (API + webhooks), P0-8 (carrier failover), P0-9 (wallet top-up), C-4 (DR) → **commercial GA** |
| **Q1 2027** | Retention layer | P1-7 (scheduling), P1-10 (analytics), P1-11 (bulk import cleanup) |
| **Q2 2027** | Vertical templates | P1-3 (mining), P1-4 (NGO), P1-5 (agritech) |
| **Q3 2027** | Recipient network effects | P1-1 (EWA), P1-2 (USSD/PWA), P1-6 (AI fraud), P1-8 (HRIS) |
| **Q4 2027** | Regional + premium | P1-9 (virtual cards), P2-1 (SADC TCIB), P2-2 (USD wallet), C-5 (travel rule) |
| **Q1-Q2 2028** | Intelligence + credit | P2-3 (AI copilot), P2-4 (embedded credit), ISO 27001/SOC 2 audit (C-2) |
| **Q3-Q4 2028** | Public sector + scale | P2-5 (government SCT), regional expansion execution |

---

## 6. Pricing & Revenue Model Options

### Scenario A — Pure per-transaction (current prototype model)

- 1% platform fee + carrier pass-through + ZMW 0.50 levy above ZMW 5K.
- Simple, low friction, but race-to-the-bottom vs Flutterwave.
- **Illustrative P&L (Year 2, 200 active employers, avg ZMW 2M/month each):**
  - GMV: ZMW 4.8B / year
  - Net take (1%): ZMW 48M
  - Carrier COGS (~1.8% avg passthrough): absorbed
  - Gross margin: ~40% = ZMW 19M
  - **Annual revenue: ZMW 48M**

### Scenario B — SaaS subscription + small per-txn

| Tier | Monthly fee (ZMW) | Included employees | Per-txn fee | Target segment |
|---|---|---|---|---|
| Starter | 2,500 | up to 50 | 0.5% | SMEs, logistics |
| Growth | 8,500 | up to 300 | 0.4% | Mid-market, NGOs |
| Enterprise | 25,000 | up to 2,000 | 0.3% | Mining contractors |
| Custom | Contact | unlimited | negotiated | Mining primes, govt |

- **Illustrative P&L (Year 2, 200 employers):** 140 Starter + 45 Growth + 15 Enterprise → ZMW (140×2.5K + 45×8.5K + 15×25K) × 12 = **ZMW 13.1M subscription** + ZMW 19M per-txn = **ZMW 32M total**.
- Lower total revenue, higher predictability, better investor metrics (ARR ratio).

### Scenario C — Hybrid with value-add modules (recommended)

- Base subscription as Scenario B.
- Per-transaction fee reduced to 0.3–0.5%.
- **Value-add modules priced separately:**
  - Statutory filing (P0-2): +ZMW 1,000/month per 100 employees
  - EWA (P1-1): 1% access fee shared with employer
  - HRIS connector (P1-8): ZMW 5,000/month
  - USD wallet (P2-2): 1.5% FX spread
  - AI fraud & copilot: ZMW 3,000/month
- **Illustrative P&L (Year 2):** Base ZMW 32M + ~40% value-add attach → **ZMW 45–55M**.
- Closest to Workpay and Deel blueprints; **highest ceiling** and best retention.

**Recommendation:** Launch Scenario A through Q4 2026 for simplicity, migrate to Scenario C from Q1 2027 as P1 features ship.

---

## 7. Top 5 Risks & Mitigations

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **BoZ licensing delay** — designation takes 9–18 months; without it we cannot operate commercially. | High | Critical | Engage BoZ pre-application in Q2 2026; run a parallel compliance workstream; consider launching under a licensed partner's umbrella as an interim (e.g., Pearl Systems aggregator model). |
| 2 | **Flutterwave incumbency** — Flutterwave got its Zambian licence in early 2025 and has capital, developer network, and cross-border rails already. | High | High | Compete on Zambian-specific depth (statutory engine, verticals, recipient experience) rather than horizontal breadth; lock 2–3 mining design partners early; prioritise features Flutterwave will not build. |
| 3 | **Data Protection Act enforcement** — cross-border PII transfer (e.g., to an LLM vendor or offshore DC) triggers fines and reputational damage. | Medium | High | Data residency in-country from day 1 (C-1); DPIA on every new feature; appoint registered DPO; use regional LLM inference or masked prompts. |
| 4 | **Carrier dependency** — if one carrier (esp. MTN) changes commercial terms or pulls API access, margins collapse. | Medium | High | Carrier failover (P0-8); multi-carrier beneficiary data; diversify volume across all three; maintain board-level carrier relationships. |
| 5 | **FX volatility** — Kwacha swings (ZMW 18–28 vs USD in 2024–25) hit the USD-funded NGO segment and any cross-border corridor. | High | Medium | Transparent FX spread; daily BoZ rate lock; offer USD sub-wallet so donors can control conversion timing (P2-2). |

---

## 8. Open Questions for the Client

1. **Licensing path:** Are we pursuing a direct BoZ PSP designation, or launching under a licensed partner's umbrella for the first 12 months? This choice drives capital requirements and 2026 timelines.
2. **Trust-account partner bank:** Zanaco (deepest NFS integration), Stanbic Zambia (best API), or Absa Zambia (best SADC corridors)? We need this decided before P0-6.
3. **Design partners:** Can the client commit to sourcing 2 mining contractors, 2 NGOs, and 1 agritech outgrower as paid design partners for Q3 2026?
4. **Data residency partner:** Infratel, Paratus, Liquid, or a hyperscaler region (AWS af-south-1 with appropriate exceptions)? Cost and latency differ materially.
5. **Brand & language scope:** How many local languages at launch? English + Bemba + Nyanja is our recommendation; adding Tonga/Lozi/Lunda is +2 months.
6. **EWA funding model:** Is the client comfortable with employer-prefunded EWA (our recommendation, keeps us out of lending regulation) versus a third-party credit line model?
7. **Pricing:** Do we commit to Scenario C (hybrid) from day one, or soft-launch on Scenario A to reduce friction in 2026 sales?
8. **Regional expansion sequence:** After Zambia, is the priority Malawi (similar regulator profile), Zimbabwe (largest diaspora corridor), DRC (Copperbelt contiguity), or Mozambique (2025 KYB alignment already in place)?
9. **Government SCT ambition:** Is the public sector a 2028 target or an opportunistic play? It affects hiring of public-sector salespeople in 2027.
10. **Exit thesis:** Building for an acquisition by a pan-African PSP (Flutterwave, Onafriq, Cellulant), a bank (Stanbic, Zanaco, Absa), or an IPO on LuSE? The answer shapes our metric optimisation.

---

## 9. Sources & References

1. Mordor Intelligence — *Zambia Telecom MNO Market Size, Share & 2030 Growth Trends Report* (2025). https://www.mordorintelligence.com/industry-reports/zambia-telecom-mno-market
2. GSMA — *State of the Industry Report on Mobile Money 2025*. https://www.gsma.com/sotir/
3. voxdev — *Mobile money in Zambia: Opportunities, challenges & current policy debates*. https://voxdev.org/topic/finance/mobile-money-zambia-opportunities-challenges-current-policy-debates
4. Bank of Zambia — *National Payment Systems Act & Directives*. https://www.boz.zm/directives.htm
5. ZambiaLII — *N.A.B. 32 of 2025 — National Payment System Bill 2025*. https://zambialii.org/akn/zm/doc/bill/2025-10-29/the-national-payment-system-bill-no-32-of-2025/
6. Bank of Zambia — *NPS Directive on Electronic Money Issuance 2023*. https://www.boz.zm/Directive202307ElectronicMoneyIssuance2023.pdf
7. Afriwise — *Regulation of Fintech in Zambia – A Legal Guide*. https://www.afriwise.com/blog/regulation-of-fintech-in-zambia---a-legal-guide
8. UNCDF — *The Tilt Payment Platform Makes Bulk Payments Seamless For More Zambians*. https://www.uncdf.org/article/5479/
9. Pearl Systems — *Mobile Money Aggregation & Bulk Payments*. https://syspearl.com/mobile-money-aggregation/
10. Mobile Payment Solutions Zambia. https://mps.co.zm/
11. ZECHL — *National Financial Switch*. https://www.zechl.co.zm/national-financial-switch/
12. AfricaNenda — *SIIPS 2023 Case Study: Zambia National Financial Switch*. https://www.africanenda.org/uploads/files/SIIPS2023_CaseStudy_Zambia.pdf
13. World Bank — *Zambia's Copper Opportunity: Can the Workforce Keep Up?* (September 2025). https://www.worldbank.org/en/news/feature/2025/09/10/zambia-s-copper-opportunity-can-the-workforce-keep-up
14. Mining for Zambia — *Four Big Mines Dominate Zambia's Copper Production*. https://miningforzambia.com/a-concentrated-mining-sector/
15. Workforce Africa — *Zambia Payroll Compliance: 2025 Updates, PAYE And NAPSA*. https://workforceafrica.com/zambia-payroll-compliance-employer-guide/
16. M&J Consultants Zambia — *ZRA PAYE Tax Bands for 2025*. https://mjconsultants.co.zm/zra-paye-tax-bands-for-2025-updated-rates-and-how-they-affect-your-salary-2/
17. Playroll — *How to Run Payroll in Zambia: Employment Taxes & Setup*. https://www.playroll.com/payroll/zambia
18. World Vision International — *Cash Transfer Programme Zambia*. https://www.wvi.org/zambia
19. World Food Programme — *Digital payment solution allows refugees in Zambia to receive cash into mobile wallets*. https://www.wfp.org/news/digital-payment-solution-allows-refugees-zambia-receive-cash-directly-their-bank-accounts-or
20. CGAP — *Cash Transfers and Mobile Money: Making it Work*. https://www.cgap.org/blog/cash-transfers-and-mobile-money-making-it-work
21. Mercy Corps AgriFin — *Building Zambia's First Digital Financial Services Platform for Smallholder Farmers*. https://mercycorpsagrifin.org/building-zambias-first-digital-financial-services-platform-for-smallholder-farmers/
22. GSMA Mobile for Development — *AI-driven smallholder farmer lending: Apollo Agriculture*. https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/agritech/
23. ILO — *Earned Wage Access: A global study on benefits and risks* (April 2025). https://www.ilo.org/sites/default/files/2025-04/Earned%20wage%20access.pdf
24. Afridigest — *Earned wage access, explained: The on-demand economy meets fintech & HR tech*. https://afridigest.com/primer-earned-wage-access/
25. TechCrunch — *Earnipay raises $4M to help employees in Nigeria get faster access to their salaries*. https://techcrunch.com/2022/02/17/earnipay-raises-4m/
26. SA Reserve Bank — *SADC-RTGS Regional Settlement Services*. https://www.resbank.co.za/en/home/what-we-do/payments-and-settlements/SADC-RTGS
27. Technext — *Cross-border payments in Southern Africa: Costs, delays, and challenges* (November 2025). https://technext24.com/2025/11/28/cross-border-payments-in-southern-africa/
28. U.S. Treasury — *Enhanced Fraud Detection Processes, Including Machine Learning AI, Prevented and Recovered Over $4 Billion in FY 2024*. https://home.treasury.gov/news/press-releases/jy2650
29. IBM — *AI Fraud Detection in Banking*. https://www.ibm.com/think/topics/ai-fraud-detection-in-banking
30. Parliament of Zambia — *Data Protection Act No. 3 of 2021*. https://www.parliament.gov.zm/sites/default/files/documents/acts/Act%20No.%203%20The%20Data%20Protection%20Act%202021_0.pdf
31. NADPA-RAPDP — *Zambia: Enforcement of the Data Protection Act No. 3 of 2021 Begins in March 2025*. https://www.nadpa-rapdp.org/en/node/220
32. VoveID — *KYB Compliance in Zambia: 2025 Guide*. https://blog.voveid.com/kyb-compliance-in-zambia-2025-guide-for-fintechs-and-regulated-businesses/
33. Flutterwave Blog — *How Flutterwave Enabled Workpay's 200%+ Increase in Payment Volume*. https://flutterwave.com/us/blog/empowering-growth-how-flutterwave-enabled-workpays-200-increase-in-payment-volume
34. TechCabal — *How Flutterwave is powering the future of cross-border payments* (October 2025). https://techcabal.com/2025/10/16/flutterwave-cross-border-payments-in-africa/
35. Paystack — *Transactions pricing*. https://paystack.com/pricing

---

*End of document.*
