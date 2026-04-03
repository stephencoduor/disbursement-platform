import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtPhone, fmtDateTime } from "@/lib/format";
import { ArrowLeft, User, Phone, CreditCard, MapPin, FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending_approval: "bg-warning/10 text-warning-foreground",
  failed: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
  processing: "bg-chart-4/10 text-chart-4",
  draft: "bg-muted text-muted-foreground",
};

export default function DisburseReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const disbursement = disbursements.find((d) => d.id === id) ?? disbursements[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Disbursement {disbursement.id}</h2>
            <Badge className={statusColors[disbursement.status]}>
              {disbursement.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{fmtDateTime(disbursement.createdAt)}</p>
        </div>
      </div>

      {/* Recipient info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recipient Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{disbursement.employeeName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{fmtPhone(disbursement.employeePhone)}</span>
          </div>
          <div className="flex items-center gap-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{carrierLabels[disbursement.carrier]}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{disbursement.costCentre}</span>
          </div>
        </CardContent>
      </Card>

      {/* Disbursement details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disbursement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Purpose</span>
            <span>{purposeLabels[disbursement.purpose]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Intent</span>
            <span className="capitalize">{disbursement.intent}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reference</span>
            <span className="font-mono text-xs">{disbursement.reference}</span>
          </div>
          {disbursement.notes && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Notes</span>
              <span className="text-right max-w-[250px]">{disbursement.notes}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground">Net Amount</span>
            <span>{fmtZMW(disbursement.netAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Carrier Fee</span>
            <span>{fmtZMW(disbursement.carrierFee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Platform Fee</span>
            <span>{fmtZMW(disbursement.platformFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Gross Amount</span>
            <span className="text-primary">{fmtZMW(disbursement.grossAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Approval chain */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Approval Chain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Initiated By</span>
            <span>{disbursement.initiatedBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Approved By</span>
            <span>{disbursement.approvedBy ?? "Pending"}</span>
          </div>
          {disbursement.approverComment && (
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium">Approver Comment</span>
              </div>
              <p className="text-xs text-muted-foreground">{disbursement.approverComment}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
