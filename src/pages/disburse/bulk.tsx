import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmtZMW } from "@/lib/format";
import {
  Upload,
  Download,
  Send,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const sampleBatch = [
  { employee: "Bwalya Mulenga", phone: "+260 97 134 5678", amount: 1500, purpose: "Fuel", carrier: "Airtel", carrierFee: 37.5, platformFee: 15, gross: 1552.5 },
  { employee: "Chilufya Banda", phone: "+260 96 245 6789", amount: 800, purpose: "Meals", carrier: "MTN", carrierFee: 4, platformFee: 8, gross: 812 },
  { employee: "Kondwani Phiri", phone: "+260 96 234 5678", amount: 2000, purpose: "Fuel", carrier: "MTN", carrierFee: 50, platformFee: 20, gross: 2070 },
  { employee: "Mutinta Moonga", phone: "+260 95 345 6789", amount: 3000, purpose: "Trip Allowance", carrier: "Zamtel", carrierFee: 75, platformFee: 30, gross: 3105 },
  { employee: "Nakamba Tembo", phone: "+260 97 456 7890", amount: 500, purpose: "Meals", carrier: "Airtel", carrierFee: 2.5, platformFee: 5, gross: 507.5 },
];

export default function BulkDisbursePage() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalNet = sampleBatch.reduce((s, r) => s + r.amount, 0);
  const totalGross = sampleBatch.reduce((s, r) => s + r.gross, 0);
  const totalFees = totalGross - totalNet;

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Batch Submitted for Approval</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {sampleBatch.length} disbursements totalling {fmtZMW(totalGross)} sent for review.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => { setSubmitted(false); setUploaded(false); }}>New Batch</Button>
          <Button variant="outline" onClick={() => navigate("/approvals")}>View Approvals</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!uploaded ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bulk Disbursement</CardTitle>
            <CardDescription>
              Upload a CSV to disburse to multiple employees at once (payroll-style batch processing)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => setUploaded(true)}
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Upload Disbursement CSV</p>
                <p className="text-xs text-muted-foreground">
                  Columns: employeeId, amount, purpose, intent, reference, notes
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Download Batch Template</p>
                  <p className="text-xs text-muted-foreground">Pre-formatted CSV template</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Recipients</p>
                <p className="text-2xl font-bold">{sampleBatch.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Net</p>
                <p className="text-2xl font-bold">{fmtZMW(totalNet)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold">{fmtZMW(totalFees)}</p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Gross Debit</p>
                <p className="text-2xl font-bold text-primary">{fmtZMW(totalGross)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Batch table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Batch Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                    <TableHead className="text-right">Gross</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleBatch.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{row.employee}</p>
                          <p className="text-xs text-muted-foreground">{row.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{row.carrier}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{row.purpose}</TableCell>
                      <TableCell className="text-right">{fmtZMW(row.amount)}</TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {fmtZMW(row.carrierFee + row.platformFee)}
                      </TableCell>
                      <TableCell className="text-right font-medium">{fmtZMW(row.gross)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  <p className="text-xs text-warning-foreground">
                    {fmtZMW(totalGross)} will be held from the company wallet pending approval.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button variant="cta" onClick={() => setSubmitted(true)}>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Batch for Approval
                </Button>
                <Button variant="outline" onClick={() => setUploaded(false)}>
                  Upload Different File
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
