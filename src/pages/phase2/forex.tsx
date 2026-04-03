import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRightLeft, AlertTriangle } from "lucide-react";

export default function ForexPreviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Coming in Phase 2 — Q4 2026</p>
            <p className="text-xs text-muted-foreground">
              Multi-currency support with real-time forex conversion. Spreads captured as platform revenue.
              Transaction caps to avoid regulatory reporting triggers.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg space-y-4 opacity-50">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Currency Conversion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex gap-2">
                <Input defaultValue="1000" disabled className="flex-1" />
                <Badge className="self-center px-3 py-2">ZMW</Badge>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex gap-2">
                <Input defaultValue="38.46" disabled className="flex-1" />
                <Badge className="self-center px-3 py-2">USD</Badge>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span>1 USD = 26.00 ZMW</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Spread</span>
                <span>1.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Cap</span>
                <span>USD 1,000</span>
              </div>
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                <p className="text-xs text-warning-foreground">
                  Hard cap of USD 1,000 equivalent per transaction to avoid additional regulatory reporting requirements.
                </p>
              </div>
            </div>

            <Button disabled className="w-full">Convert & Disburse</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Supported Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { code: "ZMW", name: "Zambian Kwacha", status: "Active" },
                { code: "USD", name: "US Dollar", status: "Phase 2" },
                { code: "ZAR", name: "South African Rand", status: "Phase 2" },
                { code: "KES", name: "Kenyan Shilling", status: "Planned" },
                { code: "TZS", name: "Tanzanian Shilling", status: "Planned" },
              ].map((c) => (
                <div key={c.code} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <span className="text-sm font-bold">{c.code}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{c.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {c.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
