import { Lock, Wallet, Send, Receipt, Bell } from "lucide-react";

export default function MobileAppPreviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Coming in Phase 2 — Q4 2026</p>
            <p className="text-xs text-muted-foreground">
              Mobile app for employees to view balances, request funds, and upload receipts.
              In Phase 1, employees receive funds via mobile money only — no app access.
            </p>
          </div>
        </div>
      </div>

      {/* Phone mockup */}
      <div className="flex justify-center">
        <div className="w-72 rounded-3xl border-4 border-foreground/10 bg-card p-4 shadow-lg opacity-60">
          {/* Status bar */}
          <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="h-2 w-4 rounded-sm bg-muted-foreground/30" />
              <div className="h-2 w-4 rounded-sm bg-muted-foreground/30" />
            </div>
          </div>

          {/* App header */}
          <div className="mb-6 text-center">
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <p className="text-sm font-bold">Bwalya Mulenga</p>
          </div>

          {/* Balance card */}
          <div className="mb-4 rounded-xl bg-gradient-to-br from-primary to-primary/80 p-4 text-primary-foreground">
            <p className="text-xs text-primary-foreground/60">Available Balance</p>
            <p className="text-xl font-bold">ZMW 1,500.00</p>
            <p className="text-xs text-primary-foreground/60">Last received: Apr 3, 2026</p>
          </div>

          {/* Quick actions */}
          <div className="mb-4 grid grid-cols-4 gap-2">
            {[
              { icon: Send, label: "Request" },
              { icon: Wallet, label: "Balance" },
              { icon: Receipt, label: "Receipts" },
              { icon: Bell, label: "Alerts" },
            ].map((a) => (
              <div key={a.label} className="flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <a.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-[9px] text-muted-foreground">{a.label}</span>
              </div>
            ))}
          </div>

          {/* Recent */}
          <p className="mb-2 text-xs font-semibold">Recent</p>
          <div className="space-y-2">
            {[
              { desc: "Fuel allowance", amount: "+1,500", time: "Today" },
              { desc: "Meal allowance", amount: "+800", time: "Yesterday" },
              { desc: "Trip advance", amount: "+2,000", time: "Mar 30" },
            ].map((t) => (
              <div key={t.desc} className="flex items-center justify-between rounded-lg border p-2">
                <div>
                  <p className="text-xs font-medium">{t.desc}</p>
                  <p className="text-[10px] text-muted-foreground">{t.time}</p>
                </div>
                <span className="text-xs font-medium text-success">{t.amount}</span>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
