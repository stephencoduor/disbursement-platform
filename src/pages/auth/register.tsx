import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Phone, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

const steps = [
  { label: "Business Info", icon: Building2 },
  { label: "Admin Contact", icon: User },
  { label: "Carrier", icon: Phone },
  { label: "Confirm", icon: CheckCircle2 },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Register Company</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set up your enterprise disbursement account
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                i + 1
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm font-medium">{steps[step].label}</p>

      {/* Step 1: Business Info */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="e.g. Copperbelt Transport Services Ltd" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-number">Registration Number</Label>
            <Input id="reg-number" placeholder="e.g. ZM-2019-CT-4521" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transport">Transport & Logistics</SelectItem>
                <SelectItem value="agriculture">Agriculture & Food</SelectItem>
                <SelectItem value="mining">Mining & Supplies</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="tourism">Tourism & Hospitality</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lusaka">Lusaka</SelectItem>
                <SelectItem value="ndola">Ndola</SelectItem>
                <SelectItem value="kitwe">Kitwe</SelectItem>
                <SelectItem value="livingstone">Livingstone</SelectItem>
                <SelectItem value="kabwe">Kabwe</SelectItem>
                <SelectItem value="chipata">Chipata</SelectItem>
                <SelectItem value="kasama">Kasama</SelectItem>
                <SelectItem value="kafue">Kafue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Step 2: Admin Contact */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input id="first-name" placeholder="Mwamba" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last Name</Label>
              <Input id="last-name" placeholder="Kapumba" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Email Address</Label>
            <Input id="admin-email" type="email" placeholder="admin@company.co.zm" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-phone">Phone Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                +260
              </span>
              <Input id="admin-phone" type="tel" placeholder="97 234 5678" className="pl-14" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role-title">Role / Title</Label>
            <Input id="role-title" placeholder="e.g. Finance Director" />
          </div>
        </div>
      )}

      {/* Step 3: Carrier Selection */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select the primary mobile money carriers your employees use. You can add more later.
          </p>
          <div className="space-y-3">
            {[
              { id: "airtel", name: "Airtel Money", prefix: "+260 97X" },
              { id: "mtn", name: "MTN MoMo", prefix: "+260 96X" },
              { id: "zamtel", name: "Zamtel Kwacha", prefix: "+260 95X" },
            ].map((carrier) => (
              <label
                key={carrier.id}
                className="flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
              >
                <input type="checkbox" className="h-4 w-4 rounded border-border text-primary" defaultChecked />
                <div className="flex-1">
                  <p className="text-sm font-medium">{carrier.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Prefix: {carrier.prefix}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Active in Zambia
                </Badge>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Carrier fees: ~2.5% for withdrawals, ~0.5% for purchases
          </p>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-3 p-4">
              <h3 className="text-sm font-semibold">Registration Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">Copperbelt Transport Services Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration</span>
                  <span className="font-medium">ZM-2019-CT-4521</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">Transport & Logistics</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Admin</span>
                  <span className="font-medium">Mwamba Kapumba</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carriers</span>
                  <span className="font-medium">Airtel, MTN, Zamtel</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-warning/30 bg-warning/10 px-4 py-3">
            <p className="text-xs text-warning-foreground">
              Your account will be reviewed by Operations before activation.
              You'll receive an email when your company wallet is ready.
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)} className="flex-1">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={() => navigate("/login")}
            className="flex-1"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Submit Registration
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
