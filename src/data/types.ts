export type Currency = "ZMW";

export type MobileMoneyCarrier = "airtel_money" | "mtn_momo" | "zamtel_kwacha";

export type DisbursementPurpose =
  | "fuel"
  | "trip_allowance"
  | "repairs"
  | "meals"
  | "advances"
  | "salary"
  | "supplies"
  | "other";

export type DisbursementIntent = "withdrawal" | "purchase";

export type DisbursementStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "processing"
  | "completed"
  | "failed";

export type UserRole =
  | "platform_operator"
  | "company_admin"
  | "finance_user"
  | "approver"
  | "auditor";

export type CompanyStatus = "active" | "suspended" | "pending";

export type EmployeeStatus = "active" | "inactive" | "suspended";

export interface PlatformUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
}

export interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  status: CompanyStatus;
  walletBalance: number;
  availableBalance: number;
  heldBalance: number;
  totalUsers: number;
  totalEmployees: number;
  monthlyVolume: number;
  lastFunded: string;
  createdAt: string;
  industry: string;
  city: string;
}

export interface CompanyUser {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Employee {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  phone: string;
  nrc: string;
  carrier: MobileMoneyCarrier;
  costCentre: string;
  department: string;
  status: EmployeeStatus;
  totalDisbursed: number;
  lastDisbursement: string;
  createdAt: string;
}

export interface Disbursement {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  employeePhone: string;
  carrier: MobileMoneyCarrier;
  netAmount: number;
  carrierFee: number;
  platformFee: number;
  levy: number;
  grossAmount: number;
  currency: Currency;
  purpose: DisbursementPurpose;
  intent: DisbursementIntent;
  reference: string;
  costCentre: string;
  notes: string;
  status: DisbursementStatus;
  initiatedBy: string;
  approvedBy: string | null;
  approverComment: string | null;
  createdAt: string;
  approvedAt: string | null;
  completedAt: string | null;
}

export interface AuditEntry {
  id: string;
  action: string;
  category: string;
  user: string;
  userRole: UserRole;
  details: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  ipAddress: string;
}

export interface FeeBreakdown {
  netAmount: number;
  carrierFee: number;
  platformFee: number;
  levy: number;
  grossAmount: number;
}

export interface PlatformStats {
  totalCompanies: number;
  activeCompanies: number;
  totalVolume: number;
  platformRevenue: number;
  totalDisbursements: number;
  activeEmployees: number;
  pendingApprovals: number;
  failedDisbursements: number;
}

export interface CompanyStats {
  walletBalance: number;
  availableBalance: number;
  pendingApprovals: number;
  totalDisbursedThisMonth: number;
  totalEmployees: number;
  activeEmployees: number;
  todayDisbursements: number;
  todayVolume: number;
}
