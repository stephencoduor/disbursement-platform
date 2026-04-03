import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtPhone, fmtDateTime } from "@/lib/format";
import {
  ArrowLeft,
  User,
  Phone,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
  Upload,
} from "lucide-react";

const statusTimeline = {
  completed: [
    { label: "Initiated", icon: Send, done: true },
    { label: "Approved", icon: CheckCircle2, done: true },
    { label: "Processing", icon: Clock, done: true },
    { label: "Completed", icon: CheckCircle2, done: true },
  ],
  pending_approval: [
    { label: "Initiated", icon: Send, done: true },
    { label: "Pending Approval", icon: Clock, done: false },
    { label: "Processing", icon: Clock, done: false },
    { label: "Completed", icon: CheckCircle2, done: false },
  ],
  failed: [
    { label: "Initiated", icon: Send, done: true },
    { label: "Approved", icon: CheckCircle2, done: true },
    { label: "Failed", icon: XCircle, done: true },
  ],
  rejected: [
    { label: "Initiated", icon: Send, done: true },
    { label: "Rejected", icon: XCircle, done: true },
  ],
};

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending_approval: "bg-warning/10 text-warning-foreground",
  failed: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
};

export default function TransactionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = disbursements.find((d) => d.id === id) ?? disbursements[0];

  const timeline =
    statusTimeline[d.status as keyof typeof statusTimeline] ?? statusTimeline.completed;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/transactions")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{d.id}</h2>
            <Badge className={statusStyles[d.status] ?? ""}>
              {d.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{fmtDateTime(d.createdAt)}</p>
        </div>
      </div>

      {/* Status timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {timeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step.done
                      ? step.label.includes("Failed") || step.label.includes("Rejected")
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-4 w-4" />
                </div>
                <span className={`text-xs ${step.done ? "font-medium" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
                {i < timeline.length - 1 && (
                  <div className={`h-0.5 w-6 ${step.done ? "bg-success" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recipient */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recipient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{d.employeeName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{fmtPhone(d.employeePhone)}</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{carrierLabels[d.carrier]}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{d.costCentre}</span>
          </div>
        </CardContent>
      </Card>

      {/* Fee breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span>{purposeLabels[d.purpose]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intent</span>
            <span className="capitalize">{d.intent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono text-xs">{d.reference}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Net Amount</span>
            <span>{fmtZMW(d.netAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Carrier Fee ({carrierLabels[d.carrier]})</span>
            <span>{fmtZMW(d.carrierFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span>{fmtZMW(d.platformFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Gross Amount</span>
            <span className="text-primary">{fmtZMW(d.grossAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Receipt upload zone */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receipt / Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-border p-8">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Upload receipt to close the accounting loop
            </p>
            <Button variant="outline" size="sm">
              Upload Receipt
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
