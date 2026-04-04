import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtPhone, fmtDateTime } from "@/lib/format";
import { ArrowLeft, CheckCircle2, XCircle, User, Phone, CreditCard, MapPin } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<string, string> = {
  pending_approval: "bg-warning/10 text-warning-foreground",
  completed: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
  failed: "bg-destructive/10 text-destructive",
};

export default function ApprovalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const disbursement = disbursements.find((d) => d.id === id) ?? disbursements[3]; // default to pending one

  const [actionTaken, setActionTaken] = useState<"approved" | "rejected" | null>(null);
  const isPending = disbursement.status === "pending_approval" && !actionTaken;

  const handleAction = (action: "approved" | "rejected") => {
    setActionTaken(action);
    setTimeout(() => navigate("/approvals"), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Action toast */}
      {actionTaken && (
        <div className={`rounded-lg px-4 py-3 text-sm ${
          actionTaken === "approved"
            ? "border border-success/30 bg-success/10 text-success"
            : "border border-destructive/30 bg-destructive/10 text-destructive"
        }`}>
          {actionTaken === "approved"
            ? `Disbursement ${disbursement.id} approved. Processing payment to ${disbursement.employeeName}...`
            : `Disbursement ${disbursement.id} rejected. The initiator will be notified.`
          }
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/approvals")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{disbursement.id}</h2>
            <Badge className={statusStyles[disbursement.status] ?? ""}>
              {disbursement.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Initiated by {disbursement.initiatedBy} &middot; {fmtDateTime(disbursement.createdAt)}
          </p>
        </div>
      </div>

      {/* Recipient */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recipient</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{disbursement.employeeName}</span>
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

      {/* Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Disbursement Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
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
            <div className="rounded-lg bg-muted p-3 text-xs">{disbursement.notes}</div>
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

      {/* Approval actions */}
      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approval Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Comment (optional)</Label>
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="cta"
                onClick={() => handleAction("approved")}
                className="flex-1"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("rejected")}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing comment */}
      {disbursement.approverComment && (
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground">Approver Comment</p>
            <p className="mt-1 text-sm">{disbursement.approverComment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
