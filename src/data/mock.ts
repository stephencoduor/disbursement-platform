import type { PlatformUser, PlatformStats, CompanyStats, AuditEntry } from "./types";

// Platform Operator
export const platformOperator: PlatformUser = {
  id: "PO-001",
  firstName: "Chanda",
  lastName: "Mutale",
  email: "chanda.mutale@disbursepro.com",
  phone: "+260971234567",
  role: "platform_operator",
};

// Current Company Admin (Copperbelt Transport)
export const currentUser: PlatformUser = {
  id: "USR-001",
  firstName: "Mwamba",
  lastName: "Kapumba",
  email: "mwamba.kapumba@copperbelt-transport.co.zm",
  phone: "+260972345678",
  role: "company_admin",
};

// Company users for Copperbelt Transport
export const companyUsers = [
  { ...currentUser },
  {
    id: "USR-002",
    companyId: "COMP-001",
    firstName: "Thandiwe",
    lastName: "Mulenga",
    email: "thandiwe.m@copperbelt-transport.co.zm",
    phone: "+260963456789",
    role: "finance_user" as const,
    status: "active" as const,
    createdAt: "2025-12-01",
  },
  {
    id: "USR-003",
    companyId: "COMP-001",
    firstName: "Joseph",
    lastName: "Banda",
    email: "joseph.b@copperbelt-transport.co.zm",
    phone: "+260954567890",
    role: "approver" as const,
    status: "active" as const,
    createdAt: "2025-12-01",
  },
  {
    id: "USR-004",
    companyId: "COMP-001",
    firstName: "Grace",
    lastName: "Phiri",
    email: "grace.p@copperbelt-transport.co.zm",
    phone: "+260975678901",
    role: "auditor" as const,
    status: "active" as const,
    createdAt: "2026-01-10",
  },
];

// Platform-wide stats
export const platformStats: PlatformStats = {
  totalCompanies: 6,
  activeCompanies: 5,
  totalVolume: 8_450_000,
  platformRevenue: 84_500,
  totalDisbursements: 12_845,
  activeEmployees: 1_995,
  pendingApprovals: 23,
  failedDisbursements: 7,
};

// Current company stats (Copperbelt Transport)
export const companyStats: CompanyStats = {
  walletBalance: 1_245_000,
  availableBalance: 1_180_000,
  pendingApprovals: 8,
  totalDisbursedThisMonth: 2_150_000,
  totalEmployees: 650,
  activeEmployees: 612,
  todayDisbursements: 34,
  todayVolume: 78_500,
};

// Notifications for company portal
export const notifications = [
  {
    id: "N-001",
    title: "Disbursement Approved",
    message: "Batch #DB-2026-0412 approved by Joseph Banda",
    time: "10 min ago",
    read: false,
    type: "success" as const,
  },
  {
    id: "N-002",
    title: "Failed Transaction",
    message: "Disbursement to Bwalya Mulenga failed - invalid mobile number",
    time: "25 min ago",
    read: false,
    type: "error" as const,
  },
  {
    id: "N-003",
    title: "Wallet Credited",
    message: "ZMW 500,000 credited to company wallet by Operations",
    time: "2 hours ago",
    read: true,
    type: "info" as const,
  },
  {
    id: "N-004",
    title: "Pending Approval",
    message: "5 disbursement requests awaiting your approval",
    time: "3 hours ago",
    read: true,
    type: "warning" as const,
  },
];

// Audit log entries
export const auditLog: AuditEntry[] = [
  {
    id: "AUD-001",
    action: "Disbursement Initiated",
    category: "disbursement",
    user: "Thandiwe Mulenga",
    userRole: "finance_user",
    details: "Single disbursement ZMW 1,500 to Bwalya Mulenga (Fuel - Northern Route)",
    severity: "info",
    timestamp: "2026-04-03T10:30:00Z",
    ipAddress: "41.72.100.15",
  },
  {
    id: "AUD-002",
    action: "Disbursement Approved",
    category: "disbursement",
    user: "Joseph Banda",
    userRole: "approver",
    details: "Approved batch #DB-2026-0412 (12 transactions, ZMW 24,500)",
    severity: "info",
    timestamp: "2026-04-03T10:15:00Z",
    ipAddress: "41.72.100.22",
  },
  {
    id: "AUD-003",
    action: "Employee Added",
    category: "employee",
    user: "Mwamba Kapumba",
    userRole: "company_admin",
    details: "Added Kondwani Phiri (+260 96 234 5678, MTN MoMo)",
    severity: "info",
    timestamp: "2026-04-03T09:45:00Z",
    ipAddress: "41.72.100.15",
  },
  {
    id: "AUD-004",
    action: "Disbursement Rejected",
    category: "disbursement",
    user: "Joseph Banda",
    userRole: "approver",
    details: "Rejected disbursement #DSB-0089 - Exceeds daily limit for employee",
    severity: "warning",
    timestamp: "2026-04-03T09:30:00Z",
    ipAddress: "41.72.100.22",
  },
  {
    id: "AUD-005",
    action: "Bulk Upload",
    category: "employee",
    user: "Thandiwe Mulenga",
    userRole: "finance_user",
    details: "CSV bulk upload: 45 employees added, 3 duplicates skipped",
    severity: "info",
    timestamp: "2026-04-02T16:00:00Z",
    ipAddress: "41.72.100.18",
  },
  {
    id: "AUD-006",
    action: "Wallet Credited",
    category: "wallet",
    user: "Platform Operations",
    userRole: "platform_operator",
    details: "ZMW 500,000 credited to Copperbelt Transport wallet (Ref: WC-2026-0402)",
    severity: "info",
    timestamp: "2026-04-02T14:30:00Z",
    ipAddress: "10.0.1.5",
  },
  {
    id: "AUD-007",
    action: "Failed Disbursement",
    category: "disbursement",
    user: "System",
    userRole: "platform_operator",
    details: "Mobile money timeout for disbursement #DSB-0085 to Nakamba Tembo",
    severity: "critical",
    timestamp: "2026-04-02T11:20:00Z",
    ipAddress: "10.0.1.5",
  },
  {
    id: "AUD-008",
    action: "User Role Changed",
    category: "user",
    user: "Mwamba Kapumba",
    userRole: "company_admin",
    details: "Changed Grace Phiri role from finance_user to auditor",
    severity: "warning",
    timestamp: "2026-04-01T15:00:00Z",
    ipAddress: "41.72.100.15",
  },
  {
    id: "AUD-009",
    action: "Limit Updated",
    category: "settings",
    user: "Mwamba Kapumba",
    userRole: "company_admin",
    details: "Updated daily disbursement limit from ZMW 5,000 to ZMW 8,000",
    severity: "warning",
    timestamp: "2026-04-01T10:00:00Z",
    ipAddress: "41.72.100.15",
  },
  {
    id: "AUD-010",
    action: "Login",
    category: "auth",
    user: "Mwamba Kapumba",
    userRole: "company_admin",
    details: "Successful login from Lusaka, Zambia",
    severity: "info",
    timestamp: "2026-04-03T08:00:00Z",
    ipAddress: "41.72.100.15",
  },
];

// Weekly chart data (disbursement volume)
export const weeklyData = [
  { day: "Mon", disbursed: 145000, count: 42 },
  { day: "Tue", disbursed: 210000, count: 58 },
  { day: "Wed", disbursed: 185000, count: 51 },
  { day: "Thu", disbursed: 320000, count: 89 },
  { day: "Fri", disbursed: 275000, count: 76 },
  { day: "Sat", disbursed: 45000, count: 12 },
  { day: "Sun", disbursed: 15000, count: 4 },
];

// Spend by purpose
export const spendByPurpose = [
  { name: "Fuel", value: 850000, color: "var(--chart-1)" },
  { name: "Trip Allowance", value: 420000, color: "var(--chart-2)" },
  { name: "Meals", value: 180000, color: "var(--chart-3)" },
  { name: "Repairs", value: 310000, color: "var(--chart-4)" },
  { name: "Advances", value: 250000, color: "var(--chart-5)" },
  { name: "Other", value: 140000, color: "var(--muted-foreground)" },
];

// Monthly volume trend
export const monthlyTrend = [
  { month: "Oct", volume: 1800000 },
  { month: "Nov", volume: 1950000 },
  { month: "Dec", volume: 1600000 },
  { month: "Jan", volume: 2100000 },
  { month: "Feb", volume: 2350000 },
  { month: "Mar", volume: 2400000 },
];

// Carrier breakdown
export const carrierBreakdown = [
  { name: "Airtel Money", value: 45, color: "var(--chart-1)" },
  { name: "MTN MoMo", value: 35, color: "var(--chart-2)" },
  { name: "Zamtel Kwacha", value: 20, color: "var(--chart-3)" },
];
