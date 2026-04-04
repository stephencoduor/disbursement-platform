const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, LevelFormat, TableOfContents,
  ExternalHyperlink,
} = require("docx");

const GREEN = "2D6A4F";
const GOLD = "E9B949";
const LIGHT_GREEN = "E8F5E9";
const LIGHT_GOLD = "FFF8E1";
const GRAY = "F5F5F5";
const DARK = "1A1A1A";
const MED_GRAY = "666666";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };
const TABLE_WIDTH = 9360;

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 32, font: "Arial", color: GREEN })],
    spacing: { before: 360, after: 200 },
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: DARK })],
    spacing: { before: 240, after: 120 },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK, ...opts.run })],
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({ text: label, bold: true, size: 22, font: "Arial", color: DARK }),
      new TextRun({ text, size: 22, font: "Arial", color: MED_GRAY }),
    ],
  });
}

function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })],
  });
}

function numberItem(text, ref = "numbers") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial", color: DARK })],
  });
}

function makeRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((text, i) => {
      const widths = cells.length === 2 ? [5000, 4360] : cells.length === 3 ? [3200, 3080, 3080] : [2340, 2340, 2340, 2340];
      return new TableCell({
        borders,
        width: { size: widths[i], type: WidthType.DXA },
        margins: cellMargins,
        shading: isHeader ? { fill: GREEN, type: ShadingType.CLEAR } : undefined,
        children: [new Paragraph({
          children: [new TextRun({
            text,
            bold: isHeader,
            size: 20,
            font: "Arial",
            color: isHeader ? "FFFFFF" : DARK,
          })],
        })],
      });
    }),
  });
}

function makeTable2Col(rows, headerRow) {
  return new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [5000, 4360],
    rows: [makeRow(headerRow, true), ...rows.map(r => makeRow(r))],
  });
}

function makeTable3Col(rows, headerRow) {
  return new Table({
    width: { size: TABLE_WIDTH, type: WidthType.DXA },
    columnWidths: [3200, 3080, 3080],
    rows: [makeRow(headerRow, true), ...rows.map(r => makeRow(r))],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 80 }, children: [] });
}

function greenBox(text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: GREEN, space: 8 } },
    indent: { left: 200 },
    children: [new TextRun({ text, size: 22, font: "Arial", italics: true, color: GREEN })],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: GREEN },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets6", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets7", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets8", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [
    // ── COVER PAGE ──
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        spacer(), spacer(), spacer(), spacer(), spacer(), spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "TECHNICAL PROPOSAL", size: 24, font: "Arial", color: MED_GRAY, characterSpacing: 200 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GREEN, space: 12 } },
          children: [new TextRun({ text: "Enterprise Disbursement Platform", size: 52, bold: true, font: "Arial", color: GREEN })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 80 },
          children: [new TextRun({ text: "DisbursePro", size: 36, font: "Arial", color: GOLD })],
        }),
        spacer(), spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Prepared by", size: 20, font: "Arial", color: MED_GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Qsoftwares Ltd", size: 32, bold: true, font: "Arial", color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: "Digital Financial Solutions", size: 22, font: "Arial", color: MED_GRAY })],
        }),
        spacer(), spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "April 2026", size: 24, font: "Arial", color: MED_GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 60 },
          children: [new TextRun({ text: "Version 1.0 | Confidential", size: 18, font: "Arial", color: MED_GRAY })],
        }),
      ],
    },

    // ── TABLE OF CONTENTS ──
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GREEN, space: 4 } },
            children: [new TextRun({ text: "DisbursePro Technical Proposal | Qsoftwares Ltd", size: 16, font: "Arial", color: MED_GRAY })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: "Qsoftwares Ltd | Confidential | Page ", size: 16, font: "Arial", color: MED_GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Arial", color: MED_GRAY }),
            ],
          })],
        }),
      },
      children: [
        new Paragraph({
          spacing: { after: 300 },
          children: [new TextRun({ text: "Table of Contents", size: 36, bold: true, font: "Arial", color: GREEN })],
        }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 1. EXECUTIVE SUMMARY ──
        heading1("1. Executive Summary"),
        para("Qsoftwares Ltd is pleased to submit this proposal in response to your request for the development of an Enterprise Disbursement Platform. We understand you are seeking a robust, scalable platform that enables enterprises to load funds, manage employee registries, set approval workflows, and disburse payments through multiple channels."),
        spacer(),
        greenBox("We are not building a bank. We are building a control, visibility, and orchestration layer for enterprise money movement."),
        spacer(),
        para("Our team has already built a working 28-page prototype of the platform, demonstrating our deep understanding of the requirements and our ability to deliver. The prototype features a complete company portal with employee registry, multi-step disbursement flows with real-time fee calculation, approval workflows, transaction management, and audit logging."),
        para("We have extensive experience building fintech solutions for emerging markets across East and Southern Africa, with proven integrations to mobile money networks including M-Pesa, Airtel Money, MTN MoMo, and more."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 2. COMPANY PROFILE ──
        heading1("2. Company Profile & Relevant Experience"),
        heading2("2.1 About Qsoftwares Ltd"),
        para("Qsoftwares Ltd is a digital financial solutions company specializing in fintech platforms for emerging markets. We design, build, and deliver production-grade financial technology systems with a focus on the unique requirements of African markets."),
        spacer(),
        makeTable2Col([
          ["Specialization", "Fintech solutions for emerging markets"],
          ["Markets", "Kenya, Zambia, East & Southern Africa"],
          ["Core Competencies", "Multi-tenant SaaS, financial ledgers, payment integrations"],
          ["Payment Integrations", "M-Pesa, Airtel Money, MTN MoMo, Flutterwave, Paystack, Cellulant, Stripe"],
          ["Technology", "React, TypeScript, Node.js, Java/Spring Boot, PostgreSQL"],
        ], ["Area", "Details"]),
        spacer(),

        heading2("2.2 Relevant Project: NeoBank"),
        para("We recently completed a comprehensive digital banking prototype for the Kenyan market, demonstrating our capability to deliver enterprise-grade fintech interfaces:"),
        bulletItem("30 fully functional pages across consumer, merchant, and admin portals", "bullets2"),
        bulletItem("Apache Fineract core banking backend integration", "bullets2"),
        bulletItem("9 payment provider integrations (M-Pesa, Airtel, MTN, Flutterwave, Paystack, etc.)", "bullets2"),
        bulletItem("KYC/AML verification workflows", "bullets2"),
        bulletItem("Complete design system (Savanna) with dark mode support", "bullets2"),
        bulletItem("Real-time transaction monitoring and compliance dashboards", "bullets2"),
        spacer(),
        greenBox("The same proven design system and architectural patterns power the DisbursePro prototype, ensuring consistency, quality, and rapid delivery."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 3. UNDERSTANDING OF REQUIREMENTS ──
        heading1("3. Understanding of Requirements"),
        para("We have thoroughly reviewed the Product Specification (v2.3) and Reference Platforms document. Our understanding of the core requirements:"),
        spacer(),
        heading2("3.1 Core Concept"),
        para("The platform is an orchestration layer that manages the movement of funds FROM a custodial wallet TO various payout rails. It sends commands and instructions but does not hold or custody funds. This separation is permanent by design and required by local financial regulations."),
        spacer(),
        heading2("3.2 Key Requirements"),
        bulletItem("Multi-tenant SaaS architecture scalable to 1,000+ enterprise clients", "bullets3"),
        bulletItem("Platform Operations Account for system-level administration", "bullets3"),
        bulletItem("Company wallets with real-time balance tracking via custodian API", "bullets3"),
        bulletItem("Employee/driver registry with bulk CSV import (critical for 650+ employees)", "bullets3"),
        bulletItem("Single and bulk disbursement with configurable approval workflows", "bullets3"),
        bulletItem("Disbursement intent selection (withdrawal vs. purchase) for fee calculation", "bullets3"),
        bulletItem("Three-tier limit hierarchy: Network > Platform > Company", "bullets3"),
        bulletItem("Zambian mobile money integration (Airtel Money, MTN MoMo, Zamtel Kwacha)", "bullets3"),
        bulletItem("Comprehensive audit trails and structured record-keeping", "bullets3"),
        bulletItem("Role-based access: Admin, Finance, Approver, Auditor", "bullets3"),
        bulletItem("Phase 2 features visible but inactive in the MVP interface", "bullets3"),
        spacer(),
        heading2("3.3 Reference Platform Alignment"),
        para("We have studied all four reference platforms and our approach draws from the best elements of each:"),
        makeTable2Col([
          ["Soldo", "Wallet-based fund allocation, employee access controls, real-time visibility"],
          ["Routable", "Workflow-driven disbursement logic, approval chains, audit trails"],
          ["Tipalti", "Large-scale payout capability, compliance-ready records"],
          ["Ramp", "Real-time controls, policy enforcement, management dashboards"],
        ], ["Platform", "Patterns Applied"]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 4. TECHNICAL APPROACH ──
        heading1("4. Technical Approach"),
        heading2("4.1 Architecture Overview"),
        para("The platform follows an API-first, multi-tenant SaaS architecture with clear separation between the orchestration layer and external custody/payment systems."),
        spacer(),
        makeTable2Col([
          ["Frontend", "React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui"],
          ["Backend", "Node.js with NestJS (or Java/Spring Boot per preference)"],
          ["Database", "PostgreSQL with double-entry style ledgering"],
          ["API", "RESTful APIs with OpenAPI/Swagger documentation"],
          ["Authentication", "JWT + MFA for admin functions"],
          ["Events", "Event-driven architecture with webhook support"],
          ["Cloud", "AWS or Azure (containerized with Docker/Kubernetes)"],
          ["CI/CD", "GitHub Actions with automated testing"],
        ], ["Component", "Technology"]),
        spacer(),

        heading2("4.2 Key Technical Decisions"),
        boldPara("Multi-Tenant Isolation: ", "Each company operates in a logically isolated tenant with its own wallet, users, policies, and data. Shared infrastructure reduces cost while maintaining security boundaries."),
        spacer(),
        boldPara("Double-Entry Ledgering: ", "All wallet operations use double-entry accounting principles. Every debit has a corresponding credit, ensuring the ledger always balances and providing a complete audit trail."),
        spacer(),
        boldPara("Configurable Tariff Engine: ", "Fee calculation is modular and configurable per carrier, intent type, and company. New payment rails can be added without modifying core disbursement logic."),
        spacer(),
        boldPara("Event-Driven Audit: ", "Every action in the system generates an immutable audit event. Events are stored separately from operational data for compliance and forensic analysis."),
        spacer(),

        heading2("4.3 Prototype Evidence"),
        para("We have already built a working 28-page prototype demonstrating the complete user experience:"),
        makeTable3Col([
          ["Auth", "2 pages", "Login with company code, company registration"],
          ["Platform Operator", "5 pages", "Dashboard, companies, company detail, revenue, settings"],
          ["Company Portal", "16 pages", "Dashboard, employees, disbursements, approvals, transactions, reports, settings, audit log"],
          ["Phase 2 Previews", "5 pages", "Cards, deposits, mobile app, forex, integrations"],
        ], ["Section", "Pages", "Description"]),
        spacer(),
        greenBox("The prototype is fully functional, TypeScript-strict, and builds to production without errors. It can be reviewed immediately upon request."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 5. MVP SCOPE ──
        heading1("5. MVP Scope & Deliverables (Phase 1)"),
        para("The MVP is an accountant\u2019s tool, not a driver\u2019s tool. We are digitizing the company side of petty cash management. In Phase 1, employees do not access the platform directly."),
        spacer(),

        heading2("5.1 Company Admin Dashboard"),
        bulletItem("Company registration and profile management", "bullets4"),
        bulletItem("Multi-user access with role-based permissions (Admin, Finance, Approver, Auditor)", "bullets4"),
        bulletItem("Organization wallet with real-time balance display", "bullets4"),
        bulletItem("Deposit history (view only \u2014 Operations credits accounts)", "bullets4"),
        spacer(),

        heading2("5.2 Employee/Driver Registry"),
        bulletItem("Add/remove employees and drivers with mobile money account linking", "bullets4"),
        bulletItem("Bulk CSV upload capability (tested with 650+ employee datasets)", "bullets4"),
        bulletItem("Cost centre and department assignment", "bullets4"),
        bulletItem("Carrier selection: Airtel Money, MTN MoMo, Zamtel Kwacha", "bullets4"),
        spacer(),

        heading2("5.3 Disbursement Engine"),
        bulletItem("Single disbursement to individual recipient with employee selection", "bullets4"),
        bulletItem("Bulk disbursement (payroll-style batch processing via CSV)", "bullets4"),
        bulletItem("Disbursement intent selection (withdrawal vs. purchase) for fee calculation", "bullets4"),
        bulletItem("Real-time fee breakdown: net amount + carrier fee + platform fee + levy = gross", "bullets4"),
        bulletItem("Three-tier limit validation before processing", "bullets4"),
        bulletItem("Basic approval workflow (initiator \u2192 approver)", "bullets4"),
        spacer(),

        heading2("5.4 Reporting & Compliance"),
        bulletItem("Transaction statements with filterable history", "bullets4"),
        bulletItem("Fee statements (monthly summary of platform charges)", "bullets4"),
        bulletItem("Spend reports by category, employee, period, cost centre", "bullets4"),
        bulletItem("Complete audit trail on all actions", "bullets4"),
        bulletItem("CSV and PDF export capability", "bullets4"),
        spacer(),

        heading2("5.5 Platform Operator Functions"),
        bulletItem("Platform dashboard with system-wide KPIs", "bullets4"),
        bulletItem("Company management with wallet crediting", "bullets4"),
        bulletItem("Revenue and fee tracking per disbursement", "bullets4"),
        bulletItem("Carrier integration status monitoring", "bullets4"),
        bulletItem("Three-tier limit configuration", "bullets4"),
        spacer(),

        heading2("5.6 MVP Interface Philosophy"),
        para("Per your specification, the MVP interface presents the full product vision. Phase 2 features (corporate cards, self-service deposits, employee app, multi-currency, ERP integrations) are visible but inactive \u2014 users can see what the platform will become."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 6. FULL BUILD SCOPE ──
        heading1("6. Full Build Scope (Phase 2)"),
        heading2("6.1 Basic Tier Features"),
        bulletItem("Self-service deposits (mobile money, card top-up)", "bullets5"),
        bulletItem("Standard disbursement features across all payment rails", "bullets5"),
        bulletItem("Transaction and fee statements with export", "bullets5"),
        bulletItem("Standard approval workflows", "bullets5"),
        spacer(),

        heading2("6.2 Enterprise Tier Features"),
        bulletItem("API access for custom integrations (OpenAPI/Swagger documented)", "bullets5"),
        bulletItem("ERP integration support (Sage, QuickBooks, Xero, Pastel, Zoho)", "bullets5"),
        bulletItem("Tax system integration (Zambia Revenue Authority)", "bullets5"),
        bulletItem("Advanced business intelligence and analytics", "bullets5"),
        bulletItem("Custom approval workflows and policy configurations", "bullets5"),
        spacer(),

        heading2("6.3 Additional Phase 2 Deliverables"),
        bulletItem("Corporate card issuance with balance-to-card transfers and merchant-level tracking", "bullets5"),
        bulletItem("Employee/driver mobile app (fund requests, balance view, receipt upload)", "bullets5"),
        bulletItem("Multi-currency support with forex conversion and transaction caps", "bullets5"),
        bulletItem("Money transfer services integration (Mukuru, Western Union)", "bullets5"),
        bulletItem("White-label capability for large enterprise deployments", "bullets5"),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 7. TIMELINE ──
        heading1("7. Project Timeline"),
        heading2("7.1 Phase 1 \u2014 MVP (8 Weeks)"),
        para("We have a significant head start with our working prototype. The 8-week timeline accounts for backend development, mobile money integration, testing, and deployment."),
        spacer(),
        makeTable2Col([
          ["Weeks 1\u20132", "Backend architecture, database schema, authentication, custodian API integration"],
          ["Weeks 3\u20134", "Disbursement engine, fee calculation, approval workflows, mobile money integration"],
          ["Weeks 5\u20136", "Employee registry, bulk upload, reporting, audit logging"],
          ["Weeks 7\u20138", "Integration testing, UAT with pilot clients, deployment, documentation"],
        ], ["Period", "Deliverables"]),
        spacer(),

        heading2("7.2 Phase 2 \u2014 Full Build (12\u201314 Weeks Post-MVP)"),
        makeTable2Col([
          ["Weeks 1\u20134", "Self-service deposits, corporate card infrastructure, employee mobile app"],
          ["Weeks 5\u20138", "Multi-currency forex, ERP integrations, advanced analytics"],
          ["Weeks 9\u201312", "White-label capability, load testing, security audit, production deployment"],
          ["Weeks 13\u201314", "Documentation finalization, handover preparation, training"],
        ], ["Period", "Deliverables"]),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 8. PRICING ──
        heading1("8. Pricing"),
        para("All prices are in US Dollars (USD). Pricing includes full IP transfer, documentation, and handover."),
        spacer(),
        new Table({
          width: { size: TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: [5000, 4360],
          rows: [
            makeRow(["Component", "Price (USD)"], true),
            new TableRow({
              children: [
                new TableCell({ borders, width: { size: 5000, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: "Phase 1 \u2014 MVP", bold: true, size: 22, font: "Arial" })] })] }),
                new TableCell({ borders, width: { size: 4360, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "$15,000", bold: true, size: 24, font: "Arial", color: GREEN })] })] }),
              ],
            }),
            makeRow(["Phase 2 \u2014 Full Build (includes MVP)", ""]),
            new TableRow({
              children: [
                new TableCell({ borders, width: { size: 5000, type: WidthType.DXA }, margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: "Full Build (Phase 1 + Phase 2)", bold: true, size: 22, font: "Arial" })] })] }),
                new TableCell({ borders, width: { size: 4360, type: WidthType.DXA }, margins: cellMargins,
                  shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                  children: [new Paragraph({ children: [new TextRun({ text: "$95,000", bold: true, size: 24, font: "Arial", color: GREEN })] })] }),
              ],
            }),
            makeRow(["Post-Deployment Support (3 months)", "Included"]),
            makeRow(["IP Transfer & Documentation", "Included"]),
          ],
        }),
        spacer(),
        heading2("8.1 What\u2019s Included"),
        bulletItem("Complete source code with full IP transfer at MVP completion", "bullets6"),
        bulletItem("License-free solution \u2014 no ongoing fees for frameworks or components", "bullets6"),
        bulletItem("Enterprise-grade documentation (API docs, deployment guides, architecture)", "bullets6"),
        bulletItem("3-month post-deployment support and monitoring period", "bullets6"),
        bulletItem("Knowledge transfer sessions with your internal development team", "bullets6"),
        spacer(),
        heading2("8.2 Payment Terms"),
        para("MVP: Fixed price upon delivery. Full Build: Milestone-based payments aligned with significant, tangible deliverables following MVP approval."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 9. TEAM & HANDOVER ──
        heading1("9. Team & Handover"),
        heading2("9.1 IP Transfer"),
        para("All source code, documentation, and work product transfers to your organization at MVP completion regardless of whether Phase 2 proceeds. This is understood and accepted as non-negotiable."),
        spacer(),
        heading2("9.2 Documentation Deliverables"),
        bulletItem("Complete API documentation (OpenAPI/Swagger)", "bullets7"),
        bulletItem("Webhook event specifications", "bullets7"),
        bulletItem("Data model and schema documentation", "bullets7"),
        bulletItem("Deployment and infrastructure guides", "bullets7"),
        bulletItem("Code architecture and module documentation", "bullets7"),
        bulletItem("Integration guides for third-party developers", "bullets7"),
        spacer(),
        heading2("9.3 Collaboration Model"),
        para("We welcome your internal development team\u2019s involvement during development for localization, business logic validation, and testing. Our handover process is designed to enable fully independent operation by your team."),
        spacer(),
        heading2("9.4 Post-Deployment Support"),
        para("The 3-month support period covers system monitoring, bug fixes, and stabilization. Upon expiry, no further obligations apply \u2014 your team operates independently with full documentation."),
        new Paragraph({ children: [new PageBreak()] }),

        // ── 10. WHY QSOFTWARES ──
        heading1("10. Why Qsoftwares Ltd"),
        spacer(),
        new Table({
          width: { size: TABLE_WIDTH, type: WidthType.DXA },
          columnWidths: [3000, 6360],
          rows: [
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins, shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Working Prototype", bold: true, size: 20, font: "Arial", color: GREEN })] })] }),
              new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "28-page prototype already built and functional. We don\u2019t just promise \u2014 we demonstrate. Review the prototype immediately.", size: 20, font: "Arial" })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins, shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Proven Fintech Experience", bold: true, size: 20, font: "Arial", color: GREEN })] })] }),
              new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "NeoBank prototype (30 pages), 9 payment gateway integrations, Apache Fineract core banking experience. Deep understanding of African payment rails.", size: 20, font: "Arial" })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins, shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Zambian Market Knowledge", bold: true, size: 20, font: "Arial", color: GREEN })] })] }),
              new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Understanding of Zambian mobile money networks (Airtel, MTN, Zamtel), local business practices, and Bank of Zambia regulatory requirements.", size: 20, font: "Arial" })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins, shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Clean Handover", bold: true, size: 20, font: "Arial", color: GREEN })] })] }),
              new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "Full IP transfer, license-free codebase, enterprise-grade documentation. No vendor lock-in, no ongoing fees. You build, you hand over, we understand.", size: 20, font: "Arial" })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: cellMargins, shading: { fill: LIGHT_GREEN, type: ShadingType.CLEAR },
                children: [new Paragraph({ children: [new TextRun({ text: "Competitive Value", bold: true, size: 20, font: "Arial", color: GREEN })] })] }),
              new TableCell({ borders, width: { size: 6360, type: WidthType.DXA }, margins: cellMargins,
                children: [new Paragraph({ children: [new TextRun({ text: "MVP at $15,000 (within your $10K\u2013$20K range). Full build at $95,000 (within your $80K\u2013$150K range). Proportionate value for cost with demonstrated delivery capability.", size: 20, font: "Arial" })] })] }),
            ]}),
          ],
        }),
        spacer(), spacer(),
        greenBox("We look forward to the opportunity to demonstrate our prototype and discuss how we can deliver a world-class disbursement platform purpose-built for the Zambian market."),
        spacer(), spacer(),

        // Contact
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 2, color: GREEN, space: 8 } },
          spacing: { before: 200 },
          children: [new TextRun({ text: "Contact", bold: true, size: 24, font: "Arial", color: GREEN })],
        }),
        boldPara("Company: ", "Qsoftwares Ltd"),
        boldPara("Website: ", "qsoftwares.com"),
        boldPara("Specialization: ", "Digital Financial Solutions for Emerging Markets"),
        spacer(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [new TextRun({ text: "\u2014 End of Proposal \u2014", size: 20, font: "Arial", color: MED_GRAY })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("D:/disbursement-platform/docs/DisbursePro-Technical-Proposal.docx", buffer);
  console.log("Proposal generated successfully");
});
