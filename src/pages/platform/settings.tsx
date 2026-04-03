import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { platformLimits, networkLimits } from "@/data/fee-config";
import { fmtZMW } from "@/lib/format";
import { Shield, Banknote, Wifi, AlertTriangle } from "lucide-react";

export default function PlatformSettingsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="limits">
        <TabsList>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="fees">Fee Configuration</TabsTrigger>
          <TabsTrigger value="carriers">Carrier Status</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Limits */}
        <TabsContent value="limits" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Shield className="mr-2 inline h-4 w-4" />
                Three-Tier Limit Hierarchy
              </CardTitle>
              <CardDescription>
                The lowest applicable limit always wins. Network &gt; Platform &gt; Company.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Network limits */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                  Network Limits (Set by Carriers)
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  {Object.entries(networkLimits).map(([carrier, limit]) => (
                    <div key={carrier} className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground capitalize">
                        {carrier.replace("_", " ")}
                      </p>
                      <p className="text-lg font-bold">{fmtZMW(limit)}</p>
                      <p className="text-xs text-muted-foreground">per transaction</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Platform limits */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
                  Platform Limits (Configurable)
                </h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Per Transaction</Label>
                    <Input defaultValue={platformLimits.perTransaction.toString()} />
                    <p className="text-xs text-muted-foreground">ZMW</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Per Employee</Label>
                    <Input defaultValue={platformLimits.dailyPerEmployee.toString()} />
                    <p className="text-xs text-muted-foreground">ZMW</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Daily Per Company</Label>
                    <Input defaultValue={platformLimits.dailyPerCompany.toString()} />
                    <p className="text-xs text-muted-foreground">ZMW</p>
                  </div>
                </div>
              </div>

              <Button>Save Limit Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees */}
        <TabsContent value="fees" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Banknote className="mr-2 inline h-4 w-4" />
                Platform Fee Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Fee Rate</Label>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="1.0" className="w-24" />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Fee</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">ZMW</span>
                    <Input defaultValue="2.00" className="w-24" />
                  </div>
                </div>
              </div>

              <Separator />

              <h4 className="text-sm font-semibold text-muted-foreground">
                Carrier Fee Rates (Read-only)
              </h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { carrier: "Airtel Money", withdrawal: "2.5%", purchase: "0.5%" },
                  { carrier: "MTN MoMo", withdrawal: "2.5%", purchase: "0.5%" },
                  { carrier: "Zamtel Kwacha", withdrawal: "2.5%", purchase: "0.5%" },
                ].map((c) => (
                  <div key={c.carrier} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{c.carrier}</p>
                    <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
                      <span>Withdrawal: {c.withdrawal}</span>
                      <span>Purchase: {c.purchase}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button>Update Fee Schedule</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carriers */}
        <TabsContent value="carriers" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Wifi className="mr-2 inline h-4 w-4" />
                Carrier Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Airtel Money", status: "connected", uptime: "99.8%", lastCheck: "2 min ago" },
                { name: "MTN MoMo", status: "connected", uptime: "99.5%", lastCheck: "3 min ago" },
                { name: "Zamtel Kwacha", status: "degraded", uptime: "97.2%", lastCheck: "1 min ago" },
              ].map((carrier) => (
                <div
                  key={carrier.name}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{carrier.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Last checked: {carrier.lastCheck}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{carrier.uptime}</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <Badge
                      className={
                        carrier.status === "connected"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning-foreground"
                      }
                    >
                      {carrier.status === "connected" ? "Connected" : "Degraded"}
                    </Badge>
                  </div>
                </div>
              ))}

              <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                  <p className="text-xs text-warning-foreground">
                    Zamtel Kwacha is experiencing intermittent delays. Average response time: 4.2s (normally 1.5s).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General */}
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Send SMS to recipients on successful disbursement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-retry Failed Disbursements</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically retry failed mobile money transactions
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Temporarily disable all disbursement processing
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
