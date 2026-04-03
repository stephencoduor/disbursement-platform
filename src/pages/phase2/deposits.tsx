import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Smartphone, CreditCard, Building2 } from "lucide-react";

export default function DepositsPreviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Coming in Phase 2 — Q3 2026</p>
            <p className="text-xs text-muted-foreground">
              Self-service deposit options including mobile money top-up, card payments, and bank transfers.
            </p>
          </div>
        </div>
      </div>

      <div className="opacity-50">
        <h2 className="text-lg font-bold">Fund Your Wallet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a method to top up your company wallet
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 opacity-50">
        {[
          { title: "Mobile Money", desc: "Airtel, MTN, or Zamtel", icon: Smartphone, color: "bg-success/10 text-success" },
          { title: "Card Payment", desc: "Visa or Mastercard", icon: CreditCard, color: "bg-gold/10 text-gold-foreground" },
          { title: "Bank Transfer", desc: "Direct bank deposit", icon: Building2, color: "bg-primary/10 text-primary" },
        ].map((method) => (
          <Card key={method.title} className="cursor-not-allowed">
            <CardContent className="flex flex-col items-center p-8 text-center">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${method.color}`}>
                <method.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-sm font-semibold">{method.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{method.desc}</p>
              <Button disabled className="mt-4" size="sm">
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
