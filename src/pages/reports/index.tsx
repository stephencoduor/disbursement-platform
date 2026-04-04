import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { spendByPurpose, monthlyTrend, carrierBreakdown, companyStats } from "@/data/mock";
import { disbursements } from "@/data/disbursements";
import { employees } from "@/data/employees";
import { fmtZMW, fmtCompact } from "@/lib/format";
import { Download, FileSpreadsheet } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Spend by employee (top 5)
const employeeSpend = employees
  .map((e) => ({
    name: `${e.firstName} ${e.lastName.charAt(0)}.`,
    total: e.totalDisbursed,
  }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 8);

// Spend by cost centre
const costCentreSpend = Object.entries(
  disbursements.reduce<Record<string, number>>((acc, d) => {
    acc[d.costCentre] = (acc[d.costCentre] ?? 0) + d.netAmount;
    return acc;
  }, {})
).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Disbursement Reports</h2>
          <p className="text-sm text-muted-foreground">
            Copperbelt Transport Services Ltd &middot; April 2026
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Disbursed</p>
            <p className="text-2xl font-bold">{fmtZMW(companyStats.totalDisbursedThisMonth)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold">{disbursements.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg per Transaction</p>
            <p className="text-2xl font-bold">
              {fmtZMW(disbursements.reduce((s, d) => s + d.netAmount, 0) / disbursements.length)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Employees</p>
            <p className="text-2xl font-bold">{companyStats.activeEmployees}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spend by purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Purpose</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={spendByPurpose}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {spendByPurpose.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => fmtZMW(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "#64748B" }} />
                <YAxis className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip formatter={(value) => fmtZMW(Number(value))} contentStyle={{ borderRadius: "8px" }} />
                <Line type="monotone" dataKey="volume" stroke="#0B3B3C" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By employee */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Employees by Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={employeeSpend} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => fmtCompact(v)} />
                <YAxis type="category" dataKey="name" className="text-xs" tick={{ fill: "#64748B" }} width={100} />
                <Tooltip formatter={(value) => fmtZMW(Number(value))} contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="total" fill="#2EC4B6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* By cost centre */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by Cost Centre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={costCentreSpend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "#64748B" }} />
                <YAxis className="text-xs" tick={{ fill: "#64748B" }} tickFormatter={(v) => fmtCompact(v)} />
                <Tooltip formatter={(value) => fmtZMW(Number(value))} contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="total" fill="#2EC4B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Carrier breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Carrier Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {carrierBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-3 rounded-lg border p-4">
                <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                </div>
                <p className="text-lg font-bold">{c.value}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
