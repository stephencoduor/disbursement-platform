import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { revenueByCompany, monthlyRevenue } from "@/data/companies";
import { platformStats } from "@/data/mock";
import { fmtZMW, fmtCompact } from "@/lib/format";
import { TrendingUp, Banknote, Percent, ArrowLeftRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function RevenuePage() {
  const totalCarrierFees = platformStats.totalVolume * 0.02; // ~2% avg
  const totalPlatformFees = platformStats.platformRevenue;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform Revenue</p>
              <p className="text-2xl font-bold">{fmtZMW(totalPlatformFees)}</p>
              <p className="text-xs text-success">This month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
              <Banknote className="h-6 w-6 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carrier Fees</p>
              <p className="text-2xl font-bold">{fmtZMW(totalCarrierFees)}</p>
              <p className="text-xs text-muted-foreground">Pass-through</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Percent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effective Rate</p>
              <p className="text-2xl font-bold">1.0%</p>
              <p className="text-xs text-muted-foreground">Platform fee rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chart-4/10">
              <ArrowLeftRight className="h-6 w-6 text-chart-4" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{fmtCompact(platformStats.totalVolume)}</p>
              <p className="text-xs text-success">+8.3% MoM</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "oklch(0.50 0.01 250)" }} />
                <YAxis className="text-xs" tick={{ fill: "oklch(0.50 0.01 250)" }} tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => fmtZMW(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid oklch(0.90 0.01 90)" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.45 0.1 160)"
                  fill="oklch(0.45 0.1 160 / 0.15)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Company</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={revenueByCompany.filter((r) => r.revenue > 0)}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" className="text-xs" tick={{ fill: "oklch(0.50 0.01 250)" }} tickFormatter={(v) => `K${(v / 1000).toFixed(0)}k`} />
                <YAxis
                  type="category"
                  dataKey="company"
                  className="text-xs"
                  tick={{ fill: "oklch(0.50 0.01 250)" }}
                  width={130}
                />
                <Tooltip
                  formatter={(value) => fmtZMW(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid oklch(0.90 0.01 90)" }}
                />
                <Bar dataKey="revenue" fill="oklch(0.78 0.14 80)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue Breakdown by Company</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Transactions</TableHead>
                <TableHead className="text-right">Platform Revenue</TableHead>
                <TableHead className="text-right">Avg Fee / Txn</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueByCompany.map((row) => (
                <TableRow key={row.company}>
                  <TableCell className="font-medium">{row.company}</TableCell>
                  <TableCell className="text-right">
                    {row.transactions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {fmtZMW(row.revenue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.transactions > 0
                      ? fmtZMW(row.revenue / row.transactions)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        row.revenue > 0 ? "text-success" : "text-muted-foreground"
                      }
                    >
                      {row.revenue > 0 ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
