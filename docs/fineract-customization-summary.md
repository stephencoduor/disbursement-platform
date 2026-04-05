# DisbursePro — Fineract Customization Summary

**Document owner:** Qsoftwares Ltd — DisbursePro Engineering
**Base:** Apache Fineract 1.x (project version `0.1.0-SNAPSHOT`)
**Repo path:** `D:\disbursement-platform\fineract\` (committed on `master`)
**Last updated:** 2026-04-05

This document captures **exactly** what was stripped from upstream Apache Fineract, what was kept, and what was added on top for DisbursePro — a mobile-money disbursement platform for Zambia (ZMW) that companies use to pay employees, contractors, and vendors via Airtel Money, MTN MoMo, and Zamtel Kwacha.

---

## 1. High-level delta

| Dimension | Count |
|---|---|
| Upstream Gradle modules | ~35 |
| Modules removed | **6** |
| Modules kept (reorganized) | ~29 |
| Custom DisbursePro Gradle modules added | **4** |
| Custom Java source files added | 15 (~1,669 LOC) |
| Liquibase changesets added | 1 (`0224_dispro_seed_data.xml`) |
| Docker Compose files added | 1 (`docker-compose-dispro.yml`) |
| Spring profiles added | 1 (`application-dispro.properties`) |

> ⚠️ **Important:** No packages were removed from `fineract-provider/src/main/java/org/apache/fineract/portfolio/` — all core banking domain code is intact. Stripping happened at the **Gradle module** level only. DisbursePro inherits the same stripped baseline as NeoBank (modulo the custom modules).

---

## 2. Modules removed from upstream

These Gradle sub-projects were deleted from the repository and removed from `settings.gradle`. They are auxiliary testing, client-SDK, or reference-frontend artifacts with no impact on the banking engine.

| Removed module | Reason |
|---|---|
| `fineract-client-feign` | Alternative OpenFeign-based Java client SDK. DisbursePro uses the React frontend directly against REST, no Feign client needed. |
| `fineract-e2e-tests-core` | Upstream end-to-end test harness. Out of scope for the prototype. |
| `fineract-e2e-tests-runner` | Companion runner for the above. |
| `fineract-progressive-loan-embeddable-schedule-generator` | Experimental loan-schedule calculator. Not relevant for a disbursement platform (no lending). |
| `twofactor-tests` | Integration tests for 2FA. DisbursePro uses approver-role SMS OTP via external provider. |
| `oauth2-tests` | Integration tests for OAuth2 flows. Basic Auth used for prototype. |

Also removed (non-module reference artifacts):

| Removed directory | Reason |
|---|---|
| `docs/` | Upstream Fineract documentation, replaced by this repo's `docs/` folder |
| `fineract-react/` | Upstream React reference app. DisbursePro has its own React frontend at `D:\disbursement-platform\src\` |
| `web-app/` | Upstream Angular web application — not used |
| `neobank-app/` | Reference prototype that was forked into a separate repo |

### 2.1 Modules evaluated for removal but **kept** (deeply coupled)

These 5 modules were restored from upstream after compile failures. DisbursePro does not expose their REST endpoints to the React UI, so they are effectively dormant — but they remain on the classpath to avoid weeks of untangling work.

| Kept module | Disbursepro impact |
|---|---|
| `fineract-investor` | Not exposed — investor-product flow not used for disbursements |
| `fineract-progressive-loan` | **Never used** — DisbursePro has no lending product |
| `fineract-working-capital-loan` | **Never used** — DisbursePro has no lending product |
| `fineract-loan-origination` | **Never used** — DisbursePro has no loan intake |
| `fineract-mix` | Not used — custom DisbursePro reports come from `custom/dispro/` modules |

> 📝 **Note for v2:** DisbursePro is a pure-disbursement platform — no lending, no savings products for end-users (only a custodial company wallet). In a follow-up release these 5 modules should be fully removed once someone has time to strip the `fineract-provider` cross-references.

---

## 3. Modules kept (29 total)

Same as NeoBank — DisbursePro inherits the identical stripped baseline. See NeoBank's `docs/fineract-customization-summary.md` section 3 for the full list. Summary:

- **Core infrastructure:** `fineract-core`, `fineract-security`, `fineract-validation`, `fineract-cob`, command-processing modules, `fineract-doc`
- **Domain:** `fineract-loan`, `fineract-savings`, `fineract-accounting` (only `savings` + `accounting` actively used — savings backs the custodial company wallet)
- **Extended lending:** `fineract-progressive-loan`, `fineract-investor`, `fineract-working-capital-loan`, `fineract-loan-origination`, `fineract-mix` — kept but dormant
- **Application:** `fineract-provider`, `fineract-war`, `fineract-client`
- **Tests:** `integration-tests`

**Runtime disable:** DisbursePro's `application-dispro.properties` sets `fineract.job.loan-cob-enabled=false` to prevent the loan close-of-business batch from running (nothing to close — no loans).

---

## 4. Custom DisbursePro modules added

All 4 modules live under `custom/dispro/{category}/{module-name}/` and are auto-discovered by Fineract's `settings.gradle` dynamic loader.

### 4.1 Module matrix

| Module | Gradle path | REST base path | Java files | LOC (approx) |
|---|---|---|---|---|
| **disbursement** | `:custom:dispro:disbursement:dispro-disbursement` | `/v1/dispro/disbursements` | 3 | ~420 |
| **mobilemoney** | `:custom:dispro:mobilemoney:dispro-mobilemoney` | `/v1/dispro/mobilemoney` | 4 | ~450 |
| **approval** | `:custom:dispro:approval:dispro-approval` | `/v1/dispro/approvals` | 2 | ~380 |
| **wallet** | `:custom:dispro:wallet:dispro-wallet` | `/v1/dispro/wallet` | 2 | ~420 |

### 4.2 `disbursement` — Core disbursement engine

**Purpose:** the heart of DisbursePro. Handles single and bulk disbursement creation, fee calculation, and status tracking. This is the module that differentiates DisbursePro from a generic banking backend.

**Endpoints:**
- `POST /v1/dispro/disbursements/single` — create single disbursement (employee, amount, carrier, purpose)
- `POST /v1/dispro/disbursements/bulk` — create bulk disbursement from CSV/batch
- `GET /v1/dispro/disbursements/{id}` — get disbursement details
- `GET /v1/dispro/disbursements/` — list with filters (status, date range, carrier, purpose)
- `GET /v1/dispro/disbursements/{id}/fees` — fee breakdown (net, carrier, platform, levy, gross)
- `PUT /v1/dispro/disbursements/{id}/cancel` — cancel pending disbursement

**Supported purpose categories:**
`salary`, `travel_allowance`, `fuel`, `per_diem`, `field_expenses`, `operational`, `vendor`, `medical`, `training`, `other`

**Status lifecycle:**
`pending_approval` → `approved` → `processing` → `completed` (or `failed`, `cancelled`)

**FeeCalculationService rules** (defaults — overridable via `c_configuration`):
- **Platform fee:** 1% of net amount (100 bps)
- **Carrier fees:**
  - Airtel: withdrawal 2.5% / purchase 0.5%
  - MTN MoMo: withdrawal 2.0% / purchase 0.4%
  - Zamtel Kwacha: withdrawal 1.5% / purchase 0.3%
- **Government levy:** ZMW 0.50 on amounts above ZMW 5,000

### 4.3 `mobilemoney` — Carrier integration layer

**Purpose:** abstract the three Zambian mobile money carriers behind a single interface. Each carrier has its own service class with OAuth, B2C disburse, callback handling, and balance/status endpoints.

**Endpoints:**
- `POST /v1/dispro/mobilemoney/send` — send money to phone number (auto-detects carrier from prefix)
- `POST /v1/dispro/mobilemoney/callback/{carrier}` — carrier callback webhook (Airtel/MTN/Zamtel)
- `GET /v1/dispro/mobilemoney/balance` — company wallet balance at each carrier
- `GET /v1/dispro/mobilemoney/status/{transactionId}` — transaction status

**Service classes (one per carrier):**
- `AirtelMoneyService` — Airtel Money Zambia B2C API (auth token, disburse, callback, balance, status)
- `MtnMomoService` — MTN MoMo Zambia API (API key/secret, disburse, callback, balance, status)
- `ZamtelKwachaService` — Zamtel Kwacha API (send money, status check)

### 4.4 `approval` — Multi-tier approval workflow

**Purpose:** enforce the 3-tier approval rules required by company finance teams to prevent fraud on large disbursements.

**Endpoints:**
- `GET /v1/dispro/approvals/` — list pending approvals for current approver
- `PUT /v1/dispro/approvals/{id}/approve` — approve a disbursement
- `PUT /v1/dispro/approvals/{id}/reject` — reject with reason
- `GET /v1/dispro/approvals/history` — approval history (audit trail)
- `GET /v1/dispro/approvals/stats` — counts (pending, approved, rejected, auto-approved)

**Thresholds** (from `c_configuration`, overridable at runtime):
| Amount range | Required approvers |
|---|---|
| ≤ ZMW 5,000 | **0** (auto-approved) |
| ZMW 5,001 – 50,000 | **1** (single approver) |
| > ZMW 50,000 | **2** (dual approval — e.g. finance manager + CFO) |

### 4.5 `wallet` — Custodial company wallet

**Purpose:** track the pre-funded company wallet that feeds disbursements. DisbursePro is **custodial** — companies top up once, then disburse over time until the wallet is drained.

**Endpoints:**
- `GET /v1/dispro/wallet/balance` — current wallet balance
- `POST /v1/dispro/wallet/topup` — record a top-up (from bank wire or direct mobile-money load)
- `GET /v1/dispro/wallet/transactions` — wallet transaction history
- `GET /v1/dispro/wallet/daily-limit` — remaining ZMW for today
- `GET /v1/dispro/wallet/monthly-summary` — monthly spend summary

**Default limits** (from `c_configuration`):
- **Daily cap:** ZMW 500,000
- **Monthly cap:** ZMW 10,000,000

These map onto Fineract savings-account holds — a DisbursePro company is represented as a Fineract client with a `wallet` savings product where the balance is the custodial float.

---

## 5. Configuration changes

### 5.1 `application-dispro.properties` (Spring profile)

Activated via `SPRING_PROFILES_ACTIVE=dispro`. Overrides:

| Property | Value | Why |
|---|---|---|
| `application.title` | `DisbursePro Disbursement Platform` | Branding |
| `fineract.tenant.timezone` | `Africa/Lusaka` | Zambia timezone (UTC+2, no DST) |
| `fineract.tenant.description` | `DisbursePro - Zambia Mobile Money Disbursements` | — |
| `fineract.security.cors.allowed-origin-patterns` | `http://localhost:5173,http://localhost:5174,https://dispro.fineract.us,https://*.disbursepro.co.zm` | Allow Vite dev + deployed subdomain |
| `fineract.security.2fa.enabled` | `false` | External SMS OTP for approvers |
| `fineract.job.loan-cob-enabled` | `false` | No loans → disable loan close-of-business batch |
| `fineract.content.filesystem.root-folder` | `/tmp/dispro-content` | Avoid collision with NeoBank |

### 5.2 `docker-compose-dispro.yml`

Self-contained stack designed to **coexist with NeoBank** on the same host — all ports offset to avoid conflict.

| Service | NeoBank port | DisbursePro port |
|---|---|---|
| Fineract HTTPS | 8443 | **8444** |
| Fineract HTTP | 8080 | **8081** |
| PostgreSQL | 5432 | **5433** |

- **`dispro-db`** — PostgreSQL 16, volume `dispro-pgdata`, init script `01-init-dispro.sh`
- **`dispro-fineract`** — Fineract bootable image with `-Duser.timezone=Africa/Lusaka`
- **Network:** `dispro-net` (isolated)

### 5.3 Liquibase seed data (`0224_dispro_seed_data.xml`)

Runs once on first boot of a fresh tenant DB.

**Change sets:**
1. **`dispro-seed-1-office`** — updates Head Office (id=1) to `DisbursePro Zambia - Lusaka HQ`, external_id `DP-ZM-HQ`
2. **`dispro-seed-2-zmw-currency`** — inserts `ZMW` (Zambian Kwacha, symbol `K`) into `m_organisation_currency` if not present
3. **`dispro-seed-3-configurations`** — inserts **20 rows** into `c_configuration`:

**Platform identity (4):**
| Name | Value |
|---|---|
| `dispro-platform-name` | `DisbursePro` |
| `dispro-default-currency` | `ZMW` |
| `dispro-country-code` | `ZM` |
| `dispro-phone-country-prefix` | `+260` |

**Fees — all in basis points (8):**
| Name | Value | Meaning |
|---|---|---|
| `dispro-platform-fee-bps` | `100` | 1% DisbursePro platform fee |
| `dispro-fee-airtel-withdrawal-bps` | `250` | 2.50% |
| `dispro-fee-airtel-purchase-bps` | `50` | 0.50% |
| `dispro-fee-mtn-withdrawal-bps` | `200` | 2.00% |
| `dispro-fee-mtn-purchase-bps` | `40` | 0.40% |
| `dispro-fee-zamtel-withdrawal-bps` | `150` | 1.50% |
| `dispro-fee-zamtel-purchase-bps` | `30` | 0.30% |
| `dispro-levy-threshold-zmw` | `5000` | Levy kicks in above this amount |
| `dispro-levy-amount-cents` | `50` | ZMW 0.50 levy |

**Approval thresholds (2):**
| Name | Value |
|---|---|
| `dispro-approval-auto-max-zmw` | `5000` |
| `dispro-approval-single-max-zmw` | `50000` |

**Wallet limits (2):**
| Name | Value |
|---|---|
| `dispro-wallet-daily-limit-zmw` | `500000` |
| `dispro-wallet-monthly-limit-zmw` | `10000000` |

**Carrier enable flags (3):**
`dispro-airtel-enabled`, `dispro-mtn-enabled`, `dispro-zamtel-enabled` — all `1` (true)

All 20 configs are readable/writable via `GET /configurations` REST API, so finance teams can tune fees, limits, and thresholds without a rebuild.

---

## 6. Build & verification

### 6.1 Compile
```bash
cd D:\disbursement-platform\fineract
./gradlew compileJava
```
**Result:** BUILD SUCCESSFUL — 109 tasks (all 4 custom modules compile cleanly)

### 6.2 Bootable JAR
```bash
./gradlew :fineract-provider:bootJar -x test
```
**Result:** `fineract-provider/build/libs/fineract-provider-0.1.0-SNAPSHOT.jar` (221 MB)

### 6.3 Runtime (requires Docker Desktop)
```bash
docker compose -f docker-compose-dispro.yml up
# then
curl -k https://localhost:8444/fineract-provider/actuator/health
```

---

## 7. Package name convention

All DisbursePro custom code lives under:
```
com.qsoftwares.dispro.{module}.{layer}
```

| Layer | Purpose |
|---|---|
| `api` | JAX-RS REST resources (`jakarta.ws.rs.*`) |
| `service` | Business logic, integration stubs, fee calculators, carrier clients |
| `starter` | Spring Boot auto-configuration classes |

**Note:** Fineract uses **JAX-RS (Jersey)**, not Spring MVC. Do not use `@RestController` or `@RequestMapping` in custom modules.

---

## 8. DisbursePro vs NeoBank — backend comparison

| Aspect | NeoBank | DisbursePro |
|---|---|---|
| Country / currency | Kenya / KES | Zambia / ZMW |
| Timezone | Africa/Nairobi | Africa/Lusaka |
| Phone prefix | +254 | +260 |
| Subdomain | neo.fineract.us | dispro.fineract.us |
| Docker ports | 8443/8080/5432 | 8444/8081/5433 |
| Custom modules | 5 (mobilemoney, kyc, card, merchant, notification) | 4 (disbursement, mobilemoney, approval, wallet) |
| Seed configs | 8 | 20 |
| Product focus | Consumer digital bank (accounts, cards, loans, savings) | B2B2C disbursement engine (bulk payments to employees) |
| Mobile money carriers | M-Pesa, Airtel Money Kenya | Airtel Money ZM, MTN MoMo ZM, Zamtel Kwacha |
| Lending | Yes (via `fineract-loan` + roadmap) | **No** — loan COB disabled |
| KYC | Yes (Smile ID Kenya) | Lightweight — just employee ID per company |
| Card issuing | Yes (BaaS partner required) | **No** — no end-user cards |

---

## 9. References

- **Tech spec** — `docs/TECH-SPEC.md`
- **Gap analysis** — `docs/gap-analysis.md`
- **API contracts** — `docs/api-contracts.md`
- **Database schema** — `docs/database-schema.md`
- **Upstream Fineract:** https://github.com/apache/fineract
- **This repo on GitHub:** https://github.com/stephencoduor/disbursement-platform
