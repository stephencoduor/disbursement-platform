import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employees, carrierLabels } from "@/data/employees";
import { disbursements } from "@/data/disbursements";
import { fmtZMW, fmtPhone, fmtDate, fmtDateTime } from "@/lib/format";
import { ArrowLeft, Phone, MapPin, CreditCard, Send, User, Hash } from "lucide-react";

const statusColors: Record<string, string> = {
  completed: "text-success",
  pending_approval: "text-warning-foreground",
  failed: "text-destructive",
  rejected: "text-destructive",
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = employees.find((e) => e.id === id) ?? employees[0];

  const empDisbursements = disbursements.filter(
    (d) => d.employeeId === employee.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              {employee.firstName} {employee.lastName}
            </h2>
            <Badge
              className={
                employee.status === "active"
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }
            >
              {employee.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{employee.department} &middot; {employee.costCentre}</p>
        </div>
        <Button onClick={() => navigate("/disburse")}>
          <Send className="mr-2 h-4 w-4" />
          Disburse
        </Button>
      </div>

      {/* Profile info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Phone className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{fmtPhone(employee.phone)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <CreditCard className="h-5 w-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">Carrier</p>
              <p className="text-sm font-medium">{carrierLabels[employee.carrier]}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <MapPin className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Cost Centre</p>
              <p className="text-sm font-medium">{employee.costCentre}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Hash className="h-5 w-5 text-chart-4" />
            <div>
              <p className="text-xs text-muted-foreground">NRC</p>
              <p className="text-sm font-medium">{employee.nrc}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Disbursed</p>
            <p className="text-2xl font-bold">{fmtZMW(employee.totalDisbursed)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Last Disbursement</p>
            <p className="text-2xl font-bold">{fmtDate(employee.lastDisbursement)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="text-2xl font-bold">{fmtDate(employee.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Disbursement history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disbursement History</CardTitle>
        </CardHeader>
        <CardContent>
          {empDisbursements.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <User className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground">No disbursements yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead className="text-right">Net Amount</TableHead>
                  <TableHead className="text-right">Gross</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empDisbursements.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono text-xs">{d.id}</TableCell>
                    <TableCell className="text-xs">{fmtDateTime(d.createdAt)}</TableCell>
                    <TableCell className="capitalize">{d.purpose.replace("_", " ")}</TableCell>
                    <TableCell className="text-right font-medium">{fmtZMW(d.netAmount)}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{fmtZMW(d.grossAmount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusColors[d.status] ?? ""}>
                        {d.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
