import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { companyStats, weeklyData, spendByPurpose } from "@/data/mock";
import { disbursements } from "@/data/disbursements";
import { fmtZMW } from "@/lib/format";
import {
  Send,
  Layers,
  Users,
  CheckCircle2,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  Clock,
  Fuel,
  Utensils,
  Wrench,
  Banknote,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const purposeIcons: Record<string, React.ElementType> = {
  fuel: Fuel,
  trip_allowance: TrendingUp,
  meals: Utensils,
  repairs: Wrench,
  advances: Banknote,
  supplies: Package,
};

const statusColors: Record<string, string> = {
  completed: "text-success",
  pending_approval: "text-warning-foreground",
  failed: "text-destructive",
  rejected: "text-destructive",
  processing: "text-chart-4",
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const recentDisbursements = disbursements.slice(0, 6);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">{greeting()}, Mwamba</h2>
          <p className="text-sm text-muted-foreground">
            Copperbelt Transport Services Ltd
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/disburse")}>
            <Send className="mr-2 h-4 w-4" />
            Disburse
          </Button>
          <Button variant="outline" onClick={() => navigate("/disburse/bulk")}>
            <Layers className="mr-2 h-4 w-4" />
            Bulk Disburse
          </Button>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-primary-foreground/70">Company Wallet Balance</p>
              <p className="mt-1 text-3xl font-bold">{fmtZMW(companyStats.walletBalance)}</p>
              <p className="mt-1 text-sm text-primary-foreground/60">
                Available: {fmtZMW(companyStats.availableBalance)}
              </p>
            </div>
            <div className="flex gap-6 text-center">
              <div>
                <p className="text-2xl font-bold">{companyStats.todayDisbursements}</p>
                <p className="text-xs text-primary-foreground/60">Today</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{fmtZMW(companyStats.todayVolume)}</p>
                <p className="text-xs text-primary-foreground/60">Today Volume</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-4"
          onClick={() => navigate("/disburse")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Send className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xs font-medium">Single Disburse</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-4"
          onClick={() => navigate("/disburse/bulk")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
            <Layers className="h-5 w-5 text-gold" />
          </div>
          <span className="text-xs font-medium">Bulk Disburse</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto flex-col gap-2 p-4"
          onClick={() => navigate("/employees")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
            <Users className="h-5 w-5 text-success" />
          </div>
          <span className="text-xs font-medium">Employees</span>
        </Button>
        <Button
          variant="outline"
          className="relative h-auto flex-col gap-2 p-4"
          onClick={() => navigate("/approvals")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
            <CheckCircle2 className="h-5 w-5 text-chart-4" />
          </div>
          <span className="text-xs font-medium">Approvals</span>
          {companyStats.pendingApprovals > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full bg-destructive text-[10px] text-white">
              {companyStats.pendingApprovals}
            </Badge>
          )}
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Month Disbursed</p>
              <p className="text-lg font-bold">{fmtZMW(companyStats.totalDisbursedThisMonth)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">Active Employees</p>
              <p className="text-lg font-bold">{companyStats.activeEmployees}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Approvals</p>
              <p className="text-lg font-bold">{companyStats.pendingApprovals}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ArrowLeftRight className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Total Employees</p>
              <p className="text-lg font-bold">{companyStats.totalEmployees}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts + Recent */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Weekly Disbursement Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" tick={{ fill: "#64748B" }} />
                <YAxis className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => fmtZMW(Number(value))} contentStyle={{ borderRadius: "8px", border: "1px solid #CBD5E1" }} />
                <Bar dataKey="disbursed" fill="#0B3B3C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend by purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={spendByPurpose}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  stroke="none"
                >
                  {spendByPurpose.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => fmtZMW(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {spendByPurpose.slice(0, 5).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{fmtZMW(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent disbursements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Disbursements</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/transactions")}>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentDisbursements.map((d) => {
              const Icon = purposeIcons[d.purpose] ?? Banknote;
              return (
                <div
                  key={d.id}
                  className="flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{d.employeeName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {d.purpose.replace("_", " ")} &middot; {d.costCentre}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{fmtZMW(d.netAmount)}</p>
                    <p className={`text-xs capitalize ${statusColors[d.status]}`}>
                      {d.status.replace("_", " ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
