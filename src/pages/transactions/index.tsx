import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtDateTime } from "@/lib/format";
import { Search, Download, FileSpreadsheet, Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending_approval: "bg-warning/10 text-warning-foreground",
  failed: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
  processing: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
};

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [purposeFilter, setPurposeFilter] = useState("all");

  const filtered = disbursements.filter((d) => {
    const matchSearch =
      d.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchPurpose = purposeFilter === "all" || d.purpose === purposeFilter;
    return matchSearch && matchStatus && matchPurpose;
  });

  const totalVolume = filtered.reduce((s, d) => s + d.netAmount, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Transaction History</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {filtered.length} transactions &middot; Volume: {fmtZMW(totalVolume)}
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
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={purposeFilter} onValueChange={(val) => setPurposeFilter(val ?? "all")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Purposes</SelectItem>
                {Object.entries(purposeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow
                    key={d.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/transactions/${d.id}`)}
                  >
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="font-medium">{d.employeeName}</TableCell>
                    <TableCell className="text-sm">{purposeLabels[d.purpose]}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {carrierLabels[d.carrier]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{fmtZMW(d.netAmount)}</TableCell>
                    <TableCell className="text-right font-medium">{fmtZMW(d.grossAmount)}</TableCell>
                    <TableCell>
                      <Badge className={statusStyles[d.status]}>
                        {d.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {fmtDateTime(d.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); navigate(`/transactions/${d.id}`); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
