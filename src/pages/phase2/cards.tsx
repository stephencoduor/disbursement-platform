import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Lock, Settings, Eye } from "lucide-react";

export default function CardsPreviewPage() {
  return (
    <div className="space-y-6">
      {/* Coming soon banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Coming in Phase 2 — Q3 2026</p>
            <p className="text-xs text-muted-foreground">
              Corporate cards with real-time balance management, merchant-level spend tracking, and automated validation.
            </p>
          </div>
        </div>
      </div>

      {/* Preview header */}
      <div className="flex items-center justify-between opacity-50">
        <h2 className="text-lg font-bold">Corporate Cards</h2>
        <Button disabled>
          <Plus className="mr-2 h-4 w-4" />
          Issue New Card
        </Button>
      </div>

      {/* Mock cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 opacity-50">
        {[
          { name: "Bwalya Mulenga", last4: "4521", balance: 2500, type: "Virtual" },
          { name: "Kondwani Phiri", last4: "8934", balance: 1800, type: "Physical" },
          { name: "Mutinta Moonga", last4: "2267", balance: 3200, type: "Virtual" },
        ].map((card) => (
          <Card key={card.last4}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <CreditCard className="h-8 w-8 text-primary" />
                <Badge variant="outline" className="text-xs">{card.type}</Badge>
              </div>
              <p className="mt-4 font-mono text-lg tracking-wider">
                **** **** **** {card.last4}
              </p>
              <p className="mt-2 text-sm font-medium">{card.name}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className="text-sm font-bold">ZMW {card.balance.toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" disabled>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" disabled>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
