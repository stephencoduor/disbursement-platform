import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { platformStats } from "@/data/mock";
import { companies } from "@/data/companies";
import { monthlyRevenue } from "@/data/companies";
import { fmtZMW, fmtCompact } from "@/lib/format";
import {
  Building2,
  TrendingUp,
  Banknote,
  Users,
  AlertTriangle,
  ArrowLeftRight,
  Clock,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const carrierData = [
  { name: "Airtel Money", value: 45, color: "#0B3B3C" },
  { name: "MTN MoMo", value: 35, color: "#2EC4B6" },
  { name: "Zamtel Kwacha", value: 20, color: "#1A5C5E" },
];

const recentActivity = [
  { id: 1, action: "Wallet credited", company: "Copperbelt Transport", amount: 500000, time: "2 hours ago" },
  { id: 2, action: "New company registered", company: "Solwezi Farms Ltd", amount: 0, time: "5 hours ago" },
  { id: 3, action: "Company suspended", company: "Kitwe Construction", amount: 0, time: "1 day ago" },
  { id: 4, action: "Wallet credited", company: "Zambezi Logistics", amount: 300000, time: "1 day ago" },
  { id: 5, action: "Wallet credited", company: "Livingstone Tourism", amount: 200000, time: "2 days ago" },
];

export default function PlatformDashboardPage() {
  const activeCompanyCount = companies.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Companies</p>
              <p className="text-2xl font-bold">{activeCompanyCount}</p>
              <p className="text-xs text-muted-foreground">of {platformStats.totalCompanies} total</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
              <Banknote className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{fmtCompact(platformStats.totalVolume)}</p>
              <p className="text-xs text-success">+8.3% this month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Revenue</p>
              <p className="text-2xl font-bold">{fmtZMW(platformStats.platformRevenue)}</p>
              <p className="text-xs text-success">+12.1% vs last month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10">
              <Users className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Employees</p>
              <p className="text-2xl font-bold">{platformStats.activeEmployees.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">across all companies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-center gap-3 p-4">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            <div>
              <p className="text-lg font-bold">{platformStats.totalDisbursements.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Disbursements</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-lg font-bold">{platformStats.pendingApprovals}</p>
              <p className="text-xs text-muted-foreground">Pending Approvals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-lg font-bold">{platformStats.failedDisbursements}</p>
              <p className="text-xs text-muted-foreground">Failed This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gold">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-gold" />
            <div>
              <p className="text-lg font-bold">1</p>
              <p className="text-xs text-muted-foreground">Suspended Company</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Volume & Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Volume & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748B" }} />
                <YAxis className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip
                  formatter={(value) => fmtZMW(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
                <Bar dataKey="volume" fill="#0B3B3C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748B" }} />
                <YAxis className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => fmtZMW(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2EC4B6"
                  strokeWidth={2.5}
                  dot={{ fill: "#2EC4B6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Carrier breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Carrier Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={carrierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {carrierData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {carrierData.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                  <span className="font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.company}</p>
                  </div>
                  <div className="text-right">
                    {item.amount > 0 ? (
                      <Badge variant="outline" className="text-xs text-success">
                        +{fmtZMW(item.amount)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Action
                      </Badge>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
