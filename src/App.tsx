import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Layouts
const AuthLayout = lazy(() => import("@/components/layout/auth-layout"));
const PlatformLayout = lazy(() => import("@/components/layout/platform-layout"));
const CompanyLayout = lazy(() => import("@/components/layout/company-layout"));

// Auth pages
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

// Platform Operator pages
const PlatformDashboardPage = lazy(() => import("@/pages/platform/index"));
const CompaniesPage = lazy(() => import("@/pages/platform/companies"));
const CompanyDetailPage = lazy(() => import("@/pages/platform/company-detail"));
const RevenuePage = lazy(() => import("@/pages/platform/revenue"));
const PlatformSettingsPage = lazy(() => import("@/pages/platform/settings"));

// Company Portal pages
const DashboardPage = lazy(() => import("@/pages/dashboard/index"));
const EmployeesPage = lazy(() => import("@/pages/employees/index"));
const EmployeeNewPage = lazy(() => import("@/pages/employees/new"));
const EmployeeDetailPage = lazy(() => import("@/pages/employees/detail"));
const BulkUploadPage = lazy(() => import("@/pages/employees/bulk-upload"));
const SingleDisbursePage = lazy(() => import("@/pages/disburse/single"));
const BulkDisbursePage = lazy(() => import("@/pages/disburse/bulk"));
const DisburseReviewPage = lazy(() => import("@/pages/disburse/review"));
const ApprovalsPage = lazy(() => import("@/pages/approvals/index"));
const ApprovalDetailPage = lazy(() => import("@/pages/approvals/detail"));
const TransactionsPage = lazy(() => import("@/pages/transactions/index"));
const TransactionDetailPage = lazy(() => import("@/pages/transactions/detail"));
const ReportsPage = lazy(() => import("@/pages/reports/index"));
const SettingsPage = lazy(() => import("@/pages/settings/index"));
const AuditLogPage = lazy(() => import("@/pages/audit-log/index"));
const ComingSoonPage = lazy(() => import("@/pages/coming-soon/index"));

// Phase 2 preview pages
const CardsPreviewPage = lazy(() => import("@/pages/phase2/cards"));
const DepositsPreviewPage = lazy(() => import("@/pages/phase2/deposits"));
const MobileAppPreviewPage = lazy(() => import("@/pages/phase2/mobile-app"));
const ForexPreviewPage = lazy(() => import("@/pages/phase2/forex"));
const IntegrationsPreviewPage = lazy(() => import("@/pages/phase2/integrations"));

function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Platform Operator routes */}
          <Route element={<PlatformLayout />}>
            <Route path="/platform" element={<PlatformDashboardPage />} />
            <Route path="/platform/companies" element={<CompaniesPage />} />
            <Route path="/platform/companies/:id" element={<CompanyDetailPage />} />
            <Route path="/platform/revenue" element={<RevenuePage />} />
            <Route path="/platform/settings" element={<PlatformSettingsPage />} />
          </Route>

          {/* Company Portal routes */}
          <Route element={<CompanyLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/new" element={<EmployeeNewPage />} />
            <Route path="/employees/bulk-upload" element={<BulkUploadPage />} />
            <Route path="/employees/:id" element={<EmployeeDetailPage />} />
            <Route path="/disburse" element={<SingleDisbursePage />} />
            <Route path="/disburse/bulk" element={<BulkDisbursePage />} />
            <Route path="/disburse/review/:id" element={<DisburseReviewPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/approvals/:id" element={<ApprovalDetailPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/coming-soon" element={<ComingSoonPage />} />
            {/* Phase 2 preview routes */}
            <Route path="/cards" element={<CardsPreviewPage />} />
            <Route path="/deposits" element={<DepositsPreviewPage />} />
            <Route path="/mobile-app" element={<MobileAppPreviewPage />} />
            <Route path="/forex" element={<ForexPreviewPage />} />
            <Route path="/integrations" element={<IntegrationsPreviewPage />} />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
