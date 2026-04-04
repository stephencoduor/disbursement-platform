import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employees, carrierLabels } from "@/data/employees";
import { calculateFees, validateDisbursementAmount } from "@/data/fee-config";
import { purposeLabels } from "@/data/disbursements";
import { fmtZMW, fmtPhone } from "@/lib/format";
import type { MobileMoneyCarrier, DisbursementIntent } from "@/data/types";
import {
  Send,
  User,
  Phone,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const activeEmployees = employees.filter((e) => e.status === "active");

export default function SingleDisbursePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [intent, setIntent] = useState<DisbursementIntent>("withdrawal");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const employee = activeEmployees.find((e) => e.id === selectedEmployee);
  const netAmount = parseFloat(amount) || 0;
  const fees = employee
    ? calculateFees(netAmount, employee.carrier as MobileMoneyCarrier, intent)
    : null;
  const validation = employee && netAmount > 0
    ? validateDisbursementAmount(netAmount, employee.carrier as MobileMoneyCarrier)
    : { valid: true };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => navigate("/approvals"), 2000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Disbursement Submitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sent for approval. You'll be notified when it's processed.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => { setSubmitted(false); setStep(0); setSelectedEmployee(""); setAmount(""); }}>
            New Disbursement
          </Button>
          <Button variant="outline" onClick={() => navigate("/approvals")}>
            View Approvals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {["Select Employee", "Amount & Purpose", "Review & Submit"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-xs ${i <= step ? "font-medium" : "text-muted-foreground"}`}>
              {label}
            </span>
            {i < 2 && <div className={`h-0.5 w-8 ${i < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Select Employee */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Employee</CardTitle>
            <CardDescription>Choose the employee to disburse funds to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedEmployee} onValueChange={(val) => setSelectedEmployee(val ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Search or select employee..." />
              </SelectTrigger>
              <SelectContent>
                {activeEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} — {fmtPhone(emp.phone)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {employee && (
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{employee.firstName} {employee.lastName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{fmtPhone(employee.phone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{carrierLabels[employee.carrier]}</span>
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(1)}
              disabled={!selectedEmployee}
              className="w-full"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Amount & Purpose */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Amount & Purpose</CardTitle>
            <CardDescription>
              Disbursing to {employee?.firstName} {employee?.lastName} via {employee ? carrierLabels[employee.carrier] : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Net Amount (ZMW) *</Label>
              <Input
                type="number"
                placeholder="e.g. 1500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Disbursement Intent *</Label>
              <Select value={intent} onValueChange={(val) => setIntent((val ?? "withdrawal") as DisbursementIntent)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="withdrawal">Withdrawal (cash-out at agent)</SelectItem>
                  <SelectItem value="purchase">Purchase / Bill Payment</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {intent === "withdrawal"
                  ? "Higher carrier fee (~2.5%) — recipient will cash out"
                  : "Lower carrier fee (~0.5%) — recipient will make a purchase"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Purpose *</Label>
              <Select value={purpose} onValueChange={(val) => setPurpose(val ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(purposeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reference Code</Label>
              <Input
                placeholder="e.g. TRIP-NR-20260403-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="e.g. Ndola to Solwezi fuel allowance"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            {/* Fee breakdown */}
            {fees && netAmount > 0 && (
              <>
                <Separator />
                <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                  <h4 className="text-sm font-semibold">Fee Breakdown</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Net Amount</span>
                      <span>{fmtZMW(fees.netAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Carrier Fee ({employee ? carrierLabels[employee.carrier] : ""})
                      </span>
                      <span>{fmtZMW(fees.carrierFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (1%)</span>
                      <span>{fmtZMW(fees.platformFee)}</span>
                    </div>
                    {fees.levy > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Levy</span>
                        <span>{fmtZMW(fees.levy)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Gross Amount (Wallet Debit)</span>
                      <span className="text-primary">{fmtZMW(fees.grossAmount)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Limit validation warning */}
            {!validation.valid && netAmount > 0 && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <p className="text-xs text-destructive font-medium">
                    {validation.error}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!amount || !purpose || netAmount <= 0 || !validation.valid}
                className="flex-1"
              >
                Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review & Submit */}
      {step === 2 && fees && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Review & Submit</CardTitle>
            <CardDescription>Review the disbursement details before submitting for approval</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Employee</span>
                <span className="font-medium">{employee?.firstName} {employee?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span>{employee ? fmtPhone(employee.phone) : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Carrier</span>
                <span>{employee ? carrierLabels[employee.carrier] : ""}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intent</span>
                <span className="capitalize">{intent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Purpose</span>
                <span className="capitalize">{purpose.replace("_", " ")}</span>
              </div>
              {reference && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-mono text-xs">{reference}</span>
                </div>
              )}
              {notes && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Notes</span>
                  <span className="text-right max-w-[200px]">{notes}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="rounded-lg bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Net Amount</span>
                <span>{fmtZMW(fees.netAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Carrier Fee</span>
                <span>{fmtZMW(fees.carrierFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform Fee</span>
                <span>{fmtZMW(fees.platformFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Debit</span>
                <span className="text-primary">{fmtZMW(fees.grossAmount)}</span>
              </div>
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                <p className="text-xs text-warning-foreground">
                  This will be sent to an approver before processing. {fmtZMW(fees.grossAmount)} will be held from the company wallet.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Submit for Approval
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
