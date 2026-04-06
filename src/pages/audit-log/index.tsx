import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auditLog } from "@/data/mock";
import { fmtDateTime } from "@/lib/format";
import { Search, Download, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuditEvents, useVerifyChain } from "@/hooks/use-audit";

const severityStyles: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning-foreground",
  critical: "bg-destructive/10 text-destructive",
};

const categoryStyles: Record<string, string> = {
  disbursement: "bg-gold/10 text-gold-foreground",
  employee: "bg-success/10 text-success",
  wallet: "bg-chart-4/10 text-chart-4",
  user: "bg-chart-5/10 text-chart-5",
  settings: "bg-muted text-muted-foreground",
  auth: "bg-primary/10 text-primary",
};

const roleLabels: Record<string, string> = {
  company_admin: "Admin",
  finance_user: "Finance",
  approver: "Approver",
  auditor: "Auditor",
  platform_operator: "System",
};

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  // API hooks — hash-chained audit trail from backend
  const { data: apiEvents, error: eventsError } = useAuditEvents();
  const { mutate: verifyChain, data: chainResult, loading: verifying } = useVerifyChain();

  // Merge API events into display (overlay on local mock data)
  const hashChainEvents = useMemo(() => {
    if (!apiEvents) return [];
    return apiEvents.map((evt) => ({
      id: evt.id,
      hash: evt.hash.slice(0, 12) + "...",
      entityType: evt.entityType,
      action: evt.action,
      user: evt.userName,
      ip: evt.ipAddress,
      timestamp: evt.createdAt,
    }));
  }, [apiEvents]);

  const filtered = auditLog.filter((entry) => {
    const matchSearch =
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.user.toLowerCase().includes(search.toLowerCase()) ||
      entry.details.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || entry.category === categoryFilter;
    const matchSeverity = severityFilter === "all" || entry.severity === severityFilter;
    return matchSearch && matchCategory && matchSeverity;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Audit Log</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => verifyChain()}
                disabled={verifying}
              >
                {verifying ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="mr-2 h-4 w-4" />
                )}
                {verifying ? "Verifying..." : "Verify Chain"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          {/* Chain verification result */}
          {chainResult && (
            <div className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
              chainResult.valid
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}>
              {chainResult.valid ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {chainResult.valid
                ? `Hash chain verified: ${chainResult.verifiedEvents}/${chainResult.totalEvents} events intact`
                : `Chain broken at event #${chainResult.firstBrokenIndex} (${chainResult.firstBrokenEventId})`
              }
            </div>
          )}
          {eventsError && (
            <div className="mt-2 text-xs text-amber-600">
              Backend unavailable — showing local audit data only
            </div>
          )}
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search actions, users, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val ?? "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="disbursement">Disbursement</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="settings">Settings</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={(val) => setSeverityFilter(val ?? "all")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {fmtDateTime(entry.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium text-sm">{entry.action}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{entry.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {roleLabels[entry.userRole] ?? entry.userRole}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={categoryStyles[entry.category] ?? ""} variant="outline">
                        {entry.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={severityStyles[entry.severity]}>
                        {entry.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                      {entry.details}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Showing {filtered.length} of {auditLog.length} entries
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
