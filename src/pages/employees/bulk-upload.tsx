import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

const samplePreview = [
  { firstName: "Chisomo", lastName: "Nyirenda", phone: "+260971234567", carrier: "airtel_money", costCentre: "Northern Route", valid: true },
  { firstName: "Mwiza", lastName: "Tembo", phone: "+260962345678", carrier: "mtn_momo", costCentre: "Southern Route", valid: true },
  { firstName: "Kaluba", lastName: "Mwansa", phone: "+260953456789", carrier: "zamtel_kwacha", costCentre: "City Fleet", valid: true },
  { firstName: "Bupe", lastName: "Chilekwa", phone: "+260971111", carrier: "airtel_money", costCentre: "Long Haul", valid: false },
  { firstName: "Monde", lastName: "Simutowe", phone: "+260964567890", carrier: "mtn_momo", costCentre: "Maintenance", valid: true },
];

export default function BulkUploadPage() {
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);

  const validCount = samplePreview.filter((r) => r.valid).length;
  const invalidCount = samplePreview.filter((r) => !r.valid).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Bulk Upload Employees</h2>
          <p className="text-sm text-muted-foreground">
            Import multiple employees via CSV file
          </p>
        </div>
      </div>

      {!uploaded ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload CSV File</CardTitle>
            <CardDescription>
              Upload a CSV with columns: firstName, lastName, phone, carrier, costCentre.
              Critical for companies with 650+ employees.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drop zone */}
            <div
              className="flex cursor-pointer flex-col items-center gap-4 rounded-lg border-2 border-dashed border-border p-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
              onClick={() => setUploaded(true)}
            >
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  CSV files only, max 10MB
                </p>
              </div>
            </div>

            {/* Template download */}
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Download CSV Template</p>
                  <p className="text-xs text-muted-foreground">
                    Pre-formatted with required columns
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Template
              </Button>
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-foreground" />
                <div className="text-xs text-warning-foreground">
                  <p className="font-medium">CSV Format Requirements:</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    <li>Phone numbers must include country code (+260)</li>
                    <li>Carrier must be: airtel_money, mtn_momo, or zamtel_kwacha</li>
                    <li>Duplicate phone numbers will be skipped</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Upload summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Rows</p>
                  <p className="text-lg font-bold">{samplePreview.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Valid</p>
                  <p className="text-lg font-bold text-success">{validCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <XCircle className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">Errors</p>
                  <p className="text-lg font-bold text-destructive">{invalidCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Cost Centre</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samplePreview.map((row, i) => (
                    <TableRow key={i} className={!row.valid ? "bg-destructive/5" : ""}>
                      <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">{row.firstName} {row.lastName}</TableCell>
                      <TableCell className="font-mono text-xs">{row.phone}</TableCell>
                      <TableCell className="text-xs capitalize">{row.carrier.replace("_", " ")}</TableCell>
                      <TableCell className="text-sm">{row.costCentre}</TableCell>
                      <TableCell>
                        {row.valid ? (
                          <Badge className="bg-success/10 text-success">Valid</Badge>
                        ) : (
                          <Badge className="bg-destructive/10 text-destructive">Invalid phone</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex gap-3">
                <Button onClick={() => navigate("/employees")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Import {validCount} Employees
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
