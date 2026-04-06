import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtPhone, fmtDateTime } from "@/lib/format";
import { ArrowLeft, CheckCircle2, XCircle, User, Phone, CreditCard, MapPin, Shield, Loader2, KeyRound } from "lucide-react";
import { useState } from "react";
import { useApprovalPolicy, useHardenApproval, useVerifyTotp } from "@/hooks/use-approval";

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
  const [totpCode, setTotpCode] = useState("");
  const disbursement = disbursements.find((d) => d.id === id) ?? disbursements[3]; // default to pending one

  // API hooks — approval policy and 2FA hardening
  const { data: policy } = useApprovalPolicy(disbursement.id);
  const { mutate: hardenApproval, loading: hardening } = useHardenApproval();
  const { mutate: verifyTotp, loading: verifyingTotp } = useVerifyTotp();

  const [actionTaken, setActionTaken] = useState<"approved" | "rejected" | null>(null);
  const isPending = disbursement.status === "pending_approval" && !actionTaken;
  const totpRequired = policy?.totpRequired ?? false;

  const handleAction = async (action: "approved" | "rejected") => {
    // If TOTP required, verify code first
    if (totpRequired && action === "approved" && totpCode) {
      const result = await verifyTotp({ code: totpCode });
      if (!result?.valid) return; // TOTP failed — don't proceed
    }

    // Submit hardened approval to backend
    try {
      await hardenApproval({
        batchId: disbursement.id,
        action: action === "approved" ? "APPROVE" : "REJECT",
        totpCode: totpCode || undefined,
        comment,
      });
    } catch {
      console.info("[DisbursePro] Backend unavailable, using local approval");
    }

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
            <CardTitle className="text-base flex items-center gap-2">
              Approval Decision
              {policy && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Shield className="h-3 w-3" />
                  Tier {policy.tier} — {policy.currentApprovers}/{policy.requiredApprovers} approvers
                </Badge>
              )}
            </CardTitle>
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

            {/* TOTP field — shown when policy requires 2FA */}
            {totpRequired && (
              <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
                  <KeyRound className="h-4 w-4" />
                  Second-factor authentication required
                </div>
                <p className="text-xs text-muted-foreground">
                  This disbursement exceeds ZMW {(policy?.thresholdZmw ?? 0).toLocaleString()} — enter your TOTP code to approve.
                </p>
                <Input
                  placeholder="Enter 6-digit TOTP code"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  maxLength={6}
                  className="font-mono text-center text-lg tracking-widest"
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => handleAction("approved")}
                className="flex-1 bg-success hover:bg-success/90"
                disabled={hardening || (totpRequired && totpCode.length < 6)}
              >
                {hardening ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {hardening ? "Processing..." : "Approve"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleAction("rejected")}
                className="flex-1"
                disabled={hardening}
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
