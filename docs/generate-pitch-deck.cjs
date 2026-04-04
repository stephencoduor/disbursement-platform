const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Qsoftwares Ltd";
pres.title = "DisbursePro - Enterprise Disbursement Platform";

const GREEN = "2D6A4F";
const GOLD = "E9B949";
const DARK = "1A1A1A";
const WHITE = "FFFFFF";
const LIGHT_GREEN = "E8F5E9";
const MED_GRAY = "666666";
const LIGHT_BG = "FAFAF5";

const ssDir = "D:/disbursement-platform/screenshots";

function darkSlide() {
  const s = pres.addSlide();
  s.background = { fill: GREEN };
  return s;
}

function lightSlide(title) {
  const s = pres.addSlide();
  s.background = { fill: WHITE };
  // Top bar
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: GREEN } });
  // Title
  if (title) {
    s.addText(title, {
      x: 0.6, y: 0.3, w: 8.8, h: 0.55,
      fontSize: 28, fontFace: "Arial Black", color: GREEN, bold: true, margin: 0,
    });
  }
  return s;
}

function screenshotSlide(title, subtitle, imgFile) {
  const s = lightSlide(title);
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.6, y: 0.85, w: 8.8, h: 0.4,
      fontSize: 13, fontFace: "Arial", color: MED_GRAY, margin: 0,
    });
  }
  const imgPath = path.join(ssDir, imgFile);
  if (fs.existsSync(imgPath)) {
    s.addImage({
      path: imgPath,
      x: 0.6, y: 1.4, w: 8.8, h: 3.95,
      sizing: { type: "contain", w: 8.8, h: 3.95 },
    });
  }
  return s;
}

// ── SLIDE 1: Title ──
{
  const s = darkSlide();
  // Decorative circles
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 4, h: 4, fill: { color: WHITE, transparency: 95 } });
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 3.5, h: 3.5, fill: { color: WHITE, transparency: 95 } });

  s.addText("TECHNICAL PROPOSAL", {
    x: 0.8, y: 0.8, w: 8, h: 0.4,
    fontSize: 12, fontFace: "Arial", color: GOLD, charSpacing: 6, margin: 0,
  });
  s.addText("DisbursePro", {
    x: 0.8, y: 1.4, w: 8, h: 0.9,
    fontSize: 44, fontFace: "Arial Black", color: WHITE, bold: true, margin: 0,
  });
  s.addText("Enterprise Disbursement Platform", {
    x: 0.8, y: 2.3, w: 8, h: 0.5,
    fontSize: 22, fontFace: "Arial", color: WHITE, margin: 0,
  });
  // Gold line
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 3.0, w: 2, h: 0.04, fill: { color: GOLD } });

  s.addText("Control, visibility, and orchestration\nfor enterprise money movement", {
    x: 0.8, y: 3.3, w: 6, h: 0.7,
    fontSize: 14, fontFace: "Arial", color: WHITE, italic: true, transparency: 30, margin: 0,
  });

  s.addText([
    { text: "Qsoftwares Ltd", options: { bold: true, fontSize: 14, color: GOLD } },
    { text: "  |  Digital Financial Solutions  |  April 2026", options: { fontSize: 12, color: WHITE } },
  ], { x: 0.8, y: 4.7, w: 8, h: 0.4, margin: 0 });
}

// ── SLIDE 2: The Problem ──
{
  const s = lightSlide("The Problem");
  const problems = [
    { icon: "!", title: "Manual Processes", desc: "Petty cash, informal transfers, physical handoffs to field workers" },
    { icon: "$", title: "No Accountability", desc: "Missing receipts, untracked expenses, no audit trail" },
    { icon: "?", title: "Zero Visibility", desc: "Finance teams cannot track how company funds are being used" },
    { icon: "X", title: "High Risk", desc: "Cash theft, fraud, disputes with no evidence trail" },
  ];
  problems.forEach((p, i) => {
    const y = 1.15 + i * 1.05;
    // Icon circle
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: y, w: 0.55, h: 0.55, fill: { color: i < 2 ? GREEN : GOLD } });
    s.addText(p.icon, { x: 0.8, y: y, w: 0.55, h: 0.55, fontSize: 16, fontFace: "Arial", color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(p.title, { x: 1.6, y: y - 0.02, w: 7.5, h: 0.3, fontSize: 16, fontFace: "Arial", color: DARK, bold: true, margin: 0 });
    s.addText(p.desc, { x: 1.6, y: y + 0.28, w: 7.5, h: 0.3, fontSize: 12, fontFace: "Arial", color: MED_GRAY, margin: 0 });
  });
  // Bottom callout
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.65, w: 8.8, h: 0.6, fill: { color: LIGHT_GREEN }, rectRadius: 0.08 });
  s.addText("A field worker needs fuel money. The company has no structured way to get it to them.", {
    x: 0.8, y: 4.65, w: 8.4, h: 0.6, fontSize: 12, fontFace: "Arial", color: GREEN, italic: true, valign: "middle", margin: 0,
  });
}

// ── SLIDE 3: Our Solution ──
{
  const s = lightSlide("Our Solution");
  s.addText("DisbursePro", {
    x: 0.6, y: 1.0, w: 9, h: 0.6,
    fontSize: 32, fontFace: "Arial Black", color: GOLD, margin: 0,
  });
  s.addText("A structured platform where companies load funds, set disbursement rules\nand approval workflows, and disburse to employees through mobile money.", {
    x: 0.6, y: 1.65, w: 8.8, h: 0.7,
    fontSize: 14, fontFace: "Arial", color: DARK, margin: 0,
  });

  const features = [
    { title: "Approval Workflows", desc: "Initiator submits, Approver reviews" },
    { title: "Full Audit Trails", desc: "Every action timestamped and tracked" },
    { title: "Real-time Reporting", desc: "Spend by purpose, employee, period" },
    { title: "Mobile Money", desc: "Airtel, MTN MoMo, Zamtel Kwacha" },
  ];
  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.6;
    const y = 2.7 + row * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.06, h: 0.8, fill: { color: GREEN } });
    s.addText(f.title, { x: x + 0.25, y: y, w: 4, h: 0.35, fontSize: 14, fontFace: "Arial", color: DARK, bold: true, margin: 0 });
    s.addText(f.desc, { x: x + 0.25, y: y + 0.35, w: 4, h: 0.3, fontSize: 11, fontFace: "Arial", color: MED_GRAY, margin: 0 });
  });
}

// ── SLIDE 4: How It Works ──
{
  const s = lightSlide("How It Works");
  const steps = [
    { num: "1", title: "Load Wallet", desc: "Company funds credited\nby Operations" },
    { num: "2", title: "Initiate & Approve", desc: "Finance submits,\nApprover reviews fees" },
    { num: "3", title: "Disburse", desc: "Employee receives via\nmobile money instantly" },
  ];
  steps.forEach((st, i) => {
    const x = 0.6 + i * 3.2;
    s.addShape(pres.shapes.OVAL, { x: x + 0.6, y: 1.1, w: 0.7, h: 0.7, fill: { color: GREEN } });
    s.addText(st.num, { x: x + 0.6, y: 1.1, w: 0.7, h: 0.7, fontSize: 22, fontFace: "Arial", color: WHITE, bold: true, align: "center", valign: "middle", margin: 0 });
    s.addText(st.title, { x: x, y: 1.95, w: 2.5, h: 0.35, fontSize: 15, fontFace: "Arial", color: DARK, bold: true, align: "center", margin: 0 });
    s.addText(st.desc, { x: x, y: 2.3, w: 2.5, h: 0.55, fontSize: 11, fontFace: "Arial", color: MED_GRAY, align: "center", margin: 0 });
    if (i < 2) {
      s.addShape(pres.shapes.LINE, { x: x + 2.55, y: 1.45, w: 0.6, h: 0, line: { color: GOLD, width: 2 } });
    }
  });
  // Screenshot
  const imgPath = path.join(ssDir, "13-disburse-single.png");
  if (fs.existsSync(imgPath)) {
    s.addImage({ path: imgPath, x: 1.5, y: 3.1, w: 7, h: 2.3, sizing: { type: "contain", w: 7, h: 2.3 } });
  }
}

// ── SLIDE 5: Company Dashboard ──
screenshotSlide("Company Dashboard", "Wallet balance, quick actions, spend analytics, and recent disbursements at a glance", "08-company-dashboard.png");

// ── SLIDE 6: Employee Registry ──
screenshotSlide("Employee Registry", "Manage 650+ employees with bulk CSV upload, carrier linking, and cost centre assignment", "09-employees.png");

// ── SLIDE 7: Disbursement with Fee Calculation ──
screenshotSlide("Disbursement with Fee Calculation", "Real-time fee breakdown: Net Amount + Carrier Fee + Platform Fee = Gross Amount", "15-disburse-review.png");

// ── SLIDE 8: Approval Workflows ──
screenshotSlide("Approval Workflows", "Initiator submits for review. Approver sees full fee transparency before approving or rejecting.", "16-approvals.png");

// ── SLIDE 9: Platform Operator Dashboard ──
screenshotSlide("Platform Operator Dashboard", "System-wide visibility across all companies: KPIs, volume, revenue, carrier distribution", "03-platform-dashboard.png");

// ── SLIDE 10: Reports & Analytics ──
screenshotSlide("Reports & Analytics", "Spend by purpose, employee, period, and cost centre with CSV/PDF export", "20-reports.png");

// ── SLIDE 11: Dark Mode ──
screenshotSlide("Full Dark Mode Support", "Complete dark theme for reduced eye strain and professional appearance", "30-company-dashboard-dark.png");

// ── SLIDE 12: Phase 2 Vision ──
{
  const s = lightSlide("Phase 2 Vision");
  s.addText("Features visible in the MVP interface, activated in the full build", {
    x: 0.6, y: 0.85, w: 8.8, h: 0.3,
    fontSize: 12, fontFace: "Arial", color: MED_GRAY, italic: true, margin: 0,
  });
  const items = [
    { title: "Corporate Cards", desc: "Prepaid cards with merchant tracking" },
    { title: "Self-service Deposits", desc: "Mobile money & card top-up" },
    { title: "Employee App", desc: "Balance view, fund requests, receipts" },
    { title: "Multi-currency", desc: "USD/ZMW forex with caps" },
    { title: "ERP Integrations", desc: "Sage, QuickBooks, Xero, Pastel" },
  ];
  items.forEach((item, i) => {
    const y = 1.35 + i * 0.45;
    s.addShape(pres.shapes.OVAL, { x: 0.8, y: y + 0.05, w: 0.28, h: 0.28, fill: { color: GOLD } });
    s.addText(item.title, { x: 1.3, y: y, w: 2.5, h: 0.35, fontSize: 13, fontFace: "Arial", color: DARK, bold: true, margin: 0 });
    s.addText(item.desc, { x: 3.8, y: y, w: 2, h: 0.35, fontSize: 11, fontFace: "Arial", color: MED_GRAY, margin: 0 });
  });
  const imgPath = path.join(ssDir, "26-phase2-mobile-app.png");
  if (fs.existsSync(imgPath)) {
    s.addImage({ path: imgPath, x: 5.8, y: 1.2, w: 3.8, h: 2.5, sizing: { type: "contain", w: 3.8, h: 2.5 } });
  }
  // Bottom note
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.65, w: 8.8, h: 0.6, fill: { color: LIGHT_GREEN }, rectRadius: 0.08 });
  s.addText("Phase 2 features are visible but inactive in the MVP \u2014 users see the full product vision from day one.", {
    x: 0.8, y: 4.65, w: 8.4, h: 0.6, fontSize: 11, fontFace: "Arial", color: GREEN, italic: true, valign: "middle", margin: 0,
  });
}

// ── SLIDE 13: Technical Architecture ──
{
  const s = lightSlide("Technical Architecture");
  const techItems = [
    { title: "React 19 + TypeScript", desc: "Modern, type-safe frontend with Tailwind CSS" },
    { title: "API-First Design", desc: "RESTful APIs with OpenAPI docs + Webhooks" },
    { title: "Multi-Tenant SaaS", desc: "Tenant isolation, scalable to 1,000+ clients" },
    { title: "PostgreSQL Ledger", desc: "Double-entry style wallet management" },
    { title: "Cloud Hosted", desc: "AWS or Azure with Docker/Kubernetes" },
    { title: "Event-Driven Audit", desc: "Immutable audit logging for compliance" },
  ];
  techItems.forEach((t, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.6 + col * 4.7;
    const y = 1.1 + row * 1.35;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 4.4, h: 1.05, fill: { color: LIGHT_BG }, rectRadius: 0.08 });
    s.addText(t.title, { x: x + 0.2, y: y + 0.12, w: 4, h: 0.35, fontSize: 14, fontFace: "Arial", color: GREEN, bold: true, margin: 0 });
    s.addText(t.desc, { x: x + 0.2, y: y + 0.5, w: 4, h: 0.35, fontSize: 11, fontFace: "Arial", color: MED_GRAY, margin: 0 });
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.65, w: 8.8, h: 0.6, fill: { color: LIGHT_GREEN }, rectRadius: 0.08 });
  s.addText("License-free. No vendor lock-in. Full IP transfer. Your team operates independently.", {
    x: 0.8, y: 4.65, w: 8.4, h: 0.6, fontSize: 12, fontFace: "Arial", color: GREEN, italic: true, valign: "middle", margin: 0,
  });
}

// ── SLIDE 14: Timeline & Pricing ──
{
  const s = lightSlide("Timeline & Pricing");
  // MVP
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.1, w: 4.2, h: 2.6, fill: { color: WHITE }, line: { color: GREEN, width: 2 }, rectRadius: 0.1 });
  s.addText("PHASE 1 \u2014 MVP", { x: 0.6, y: 1.2, w: 4.2, h: 0.35, fontSize: 11, fontFace: "Arial", color: GREEN, bold: true, align: "center", margin: 0 });
  s.addText("$15,000", { x: 0.6, y: 1.6, w: 4.2, h: 0.6, fontSize: 36, fontFace: "Arial Black", color: GREEN, bold: true, align: "center", margin: 0 });
  s.addText("8 Weeks", { x: 0.6, y: 2.2, w: 4.2, h: 0.35, fontSize: 16, fontFace: "Arial", color: GOLD, bold: true, align: "center", margin: 0 });
  s.addText([
    { text: "Working prototype already built", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "Mobile money payout integration", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "Full approval workflows & audit", options: { bullet: true, breakLine: true, fontSize: 11 } },
    { text: "2\u201320 enterprise pilot clients", options: { bullet: true, fontSize: 11 } },
  ], { x: 1.0, y: 2.7, w: 3.5, h: 1.0, fontFace: "Arial", color: DARK });

  // Full Build
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.2, y: 1.1, w: 4.2, h: 2.6, fill: { color: GREEN }, rectRadius: 0.1 });
  s.addText("FULL BUILD", { x: 5.2, y: 1.2, w: 4.2, h: 0.35, fontSize: 11, fontFace: "Arial", color: GOLD, bold: true, align: "center", margin: 0 });
  s.addText("$95,000", { x: 5.2, y: 1.6, w: 4.2, h: 0.6, fontSize: 36, fontFace: "Arial Black", color: WHITE, bold: true, align: "center", margin: 0 });
  s.addText("12\u201314 Weeks Post-MVP", { x: 5.2, y: 2.2, w: 4.2, h: 0.35, fontSize: 16, fontFace: "Arial", color: GOLD, bold: true, align: "center", margin: 0 });
  s.addText([
    { text: "Cards, deposits, employee app", options: { bullet: true, breakLine: true, fontSize: 11, color: WHITE } },
    { text: "Multi-currency forex", options: { bullet: true, breakLine: true, fontSize: 11, color: WHITE } },
    { text: "ERP integrations", options: { bullet: true, breakLine: true, fontSize: 11, color: WHITE } },
    { text: "3-month post-deploy support", options: { bullet: true, fontSize: 11, color: WHITE } },
  ], { x: 5.6, y: 2.7, w: 3.5, h: 1.0, fontFace: "Arial", color: WHITE });

  // Bottom
  s.addText("Full IP transfer  |  License-free  |  No vendor lock-in  |  Enterprise documentation", {
    x: 0.6, y: 4.1, w: 8.8, h: 0.4, fontSize: 12, fontFace: "Arial", color: MED_GRAY, align: "center", margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 4.65, w: 8.8, h: 0.6, fill: { color: LIGHT_GREEN }, rectRadius: 0.08 });
  s.addText("Pricing within your stated ranges: MVP $10K\u2013$20K | Full Build $80K\u2013$150K", {
    x: 0.8, y: 4.65, w: 8.4, h: 0.6, fontSize: 12, fontFace: "Arial", color: GREEN, bold: true, valign: "middle", align: "center", margin: 0,
  });
}

// ── SLIDE 15: Why Qsoftwares ──
{
  const s = lightSlide("Why Qsoftwares Ltd");
  const reasons = [
    { title: "Working Prototype", desc: "28 pages already built and functional. We demonstrate, not just promise.", color: GREEN },
    { title: "Proven Fintech Experience", desc: "NeoBank (30 pages), 9 payment integrations, Apache Fineract experience.", color: GREEN },
    { title: "Zambian Market Knowledge", desc: "Airtel Money, MTN MoMo, Zamtel Kwacha. Bank of Zambia regulations.", color: GOLD },
    { title: "Clean Handover", desc: "Full IP transfer. License-free. Enterprise docs. No vendor lock-in.", color: GOLD },
  ];
  reasons.forEach((r, i) => {
    const y = 1.1 + i * 1.05;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: y, w: 0.08, h: 0.8, fill: { color: r.color } });
    s.addText(r.title, { x: 0.95, y: y, w: 8.5, h: 0.35, fontSize: 16, fontFace: "Arial", color: DARK, bold: true, margin: 0 });
    s.addText(r.desc, { x: 0.95, y: y + 0.38, w: 8.5, h: 0.3, fontSize: 12, fontFace: "Arial", color: MED_GRAY, margin: 0 });
  });
}

// ── SLIDE 16: Thank You ──
{
  const s = darkSlide();
  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 4, h: 4, fill: { color: WHITE, transparency: 95 } });
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 3.5, h: 3.5, fill: { color: WHITE, transparency: 95 } });

  s.addText("Thank You", {
    x: 0.8, y: 1.2, w: 8, h: 0.9,
    fontSize: 44, fontFace: "Arial Black", color: WHITE, bold: true, margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.3, w: 2, h: 0.04, fill: { color: GOLD } });
  s.addText("Ready to demonstrate the prototype.", {
    x: 0.8, y: 2.6, w: 8, h: 0.5,
    fontSize: 18, fontFace: "Arial", color: WHITE, italic: true, margin: 0,
  });
  s.addText([
    { text: "Qsoftwares Ltd\n", options: { bold: true, fontSize: 16, color: GOLD } },
    { text: "Digital Financial Solutions\n\n", options: { fontSize: 13, color: WHITE } },
    { text: "qsoftwares.com", options: { fontSize: 12, color: WHITE } },
  ], { x: 0.8, y: 3.5, w: 8, h: 1.2, margin: 0 });
}

pres.writeFile({ fileName: "D:/disbursement-platform/docs/DisbursePro-Pitch-Deck.pptx" })
  .then(() => console.log("Pitch deck generated successfully"))
  .catch(err => console.error("Error:", err));
