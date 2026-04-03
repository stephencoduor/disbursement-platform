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
import { employees, carrierLabels, costCentres } from "@/data/employees";
import { fmtZMW, fmtPhone } from "@/lib/format";
import { Search, Plus, Upload, Users, UserCheck, UserX } from "lucide-react";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  suspended: "bg-destructive/10 text-destructive",
};

const carrierStyles: Record<string, string> = {
  airtel_money: "bg-chart-5/10 text-chart-5",
  mtn_momo: "bg-gold/10 text-gold-foreground",
  zamtel_kwacha: "bg-success/10 text-success",
};

const PAGE_SIZE = 8;

export default function EmployeesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [carrierFilter, setCarrierFilter] = useState("all");
  const [costCentreFilter, setCostCentreFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = employees.filter((e) => {
    const matchSearch =
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    const matchCarrier = carrierFilter === "all" || e.carrier === carrierFilter;
    const matchCostCentre = costCentreFilter === "all" || e.costCentre === costCentreFilter;
    return matchSearch && matchCarrier && matchCostCentre;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount = employees.filter((e) => e.status === "active").length;
  const inactiveCount = employees.filter((e) => e.status === "inactive").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Employees</p>
              <p className="text-lg font-bold">{employees.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <UserCheck className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <UserX className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Inactive</p>
              <p className="text-lg font-bold">{inactiveCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registry */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Employee Registry</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate("/employees/bulk-upload")}>
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
              <Button size="sm" onClick={() => navigate("/employees/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
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
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={carrierFilter} onValueChange={(val) => { setCarrierFilter(val ?? "all"); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Carriers</SelectItem>
                <SelectItem value="airtel_money">Airtel Money</SelectItem>
                <SelectItem value="mtn_momo">MTN MoMo</SelectItem>
                <SelectItem value="zamtel_kwacha">Zamtel Kwacha</SelectItem>
              </SelectContent>
            </Select>
            <Select value={costCentreFilter} onValueChange={(val) => { setCostCentreFilter(val ?? "all"); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Cost Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cost Centres</SelectItem>
                {costCentres.map((cc) => (
                  <SelectItem key={cc} value={cc}>{cc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Carrier</TableHead>
                  <TableHead>Cost Centre</TableHead>
                  <TableHead className="text-right">Total Disbursed</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((emp) => (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <TableCell className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {fmtPhone(emp.phone)}
                    </TableCell>
                    <TableCell>
                      <Badge className={carrierStyles[emp.carrier]} variant="outline">
                        {carrierLabels[emp.carrier]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{emp.costCentre}</TableCell>
                    <TableCell className="text-right font-medium">
                      {fmtZMW(emp.totalDisbursed)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[emp.status]}>
                        {emp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
