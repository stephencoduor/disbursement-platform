import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import { useWalletBalance, useTopUpHistory, useTopUpViaVirtualAccount, useTopUpViaCard, useTopUpViaNfs } from "@/hooks/use-wallet-topup";
import { fmtZMW } from "@/lib/format";

type TopUpChannel = "mobile" | "card" | "nfs" | null;

export default function DepositsPage() {
  const [selectedChannel, setSelectedChannel] = useState<TopUpChannel>(null);
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const { data: balance } = useWalletBalance(1);
  const { data: history } = useTopUpHistory(1);
  const topUpVA = useTopUpViaVirtualAccount();
  const topUpCard = useTopUpViaCard();
  const topUpNfs = useTopUpViaNfs();

  const parsedAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const isLoading = topUpVA.loading || topUpCard.loading || topUpNfs.loading;

  const handleTopUp = async () => {
    if (parsedAmount <= 0) return;
    try {
      if (selectedChannel === "mobile") {
        const result = await topUpVA.mutate({ employerId: 1, amount: parsedAmount, reference: `TOPUP-${Date.now()}` });
        setSuccessMsg(`Virtual account ${(result as { virtualAccountNumber: string }).virtualAccountNumber} created. Deposit ${fmtZMW(parsedAmount)} at any Zanaco branch.`);
      } else if (selectedChannel === "card") {
        await topUpCard.mutate({ employerId: 1, amount: parsedAmount, cardToken: "tok_demo_visa_4242" });
        setSuccessMsg(`Card payment of ${fmtZMW(parsedAmount)} submitted. Settlement in T+1.`);
      } else if (selectedChannel === "nfs") {
        await topUpNfs.mutate({ employerId: 1, amount: parsedAmount, sourceBankCode: "01", sourceAccountNumber: "0012345678" });
        setSuccessMsg(`NFS transfer of ${fmtZMW(parsedAmount)} submitted. Settlement: same day before 15:00 CAT.`);
      }
    } catch {
      // Demo fallback
      setSuccessMsg(`Top-up of ${fmtZMW(parsedAmount)} submitted via ${selectedChannel === "mobile" ? "mobile money" : selectedChannel === "card" ? "card" : "bank transfer"}. Processing...`);
    }
    setSuccess(true);
  };

  const handleReset = () => {
    setSelectedChannel(null);
    setAmount("");
    setSuccess(false);
    setSuccessMsg("");
  };

  const channels = [
    { key: "mobile" as TopUpChannel, title: "Mobile Money", desc: "Airtel, MTN, or Zamtel", icon: Smartphone, color: "bg-success/10 text-success" },
    { key: "card" as TopUpChannel, title: "Card Payment", desc: "Visa or Mastercard (2.9% fee)", icon: CreditCard, color: "bg-gold/10 text-gold-foreground" },
    { key: "nfs" as TopUpChannel, title: "Bank Transfer", desc: "NFS interbank (ZMW 15 fee)", icon: Building2, color: "bg-primary/10 text-primary" },
  ];

  return (
    <div className="space-y-6">
      {/* Balance summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Available Balance</p>
              <p className="text-lg font-bold">{fmtZMW(balance?.availableBalance ?? 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ArrowUpRight className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Deposits</p>
              <p className="text-lg font-bold">{fmtZMW(balance?.pendingDeposits ?? 0)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Loader2 className="h-5 w-5 text-chart-4" />
            <div>
              <p className="text-xs text-muted-foreground">Pending Disbursements</p>
              <p className="text-lg font-bold">{fmtZMW(balance?.pendingDisbursements ?? 0)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {success ? (
        <Card>
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-lg font-bold mb-2">Top-Up Submitted</h3>
            <p className="text-sm text-muted-foreground mb-4">{successMsg}</p>
            <Button onClick={handleReset}>Fund Again</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div>
            <h2 className="text-lg font-bold">Fund Your Wallet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose a method to top up your company wallet
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {channels.map((method) => (
              <Card
                key={method.key}
                className={`cursor-pointer transition-all ${selectedChannel === method.key ? "ring-2 ring-primary" : "hover:border-primary/30"}`}
                onClick={() => setSelectedChannel(method.key)}
              >
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${method.color}`}>
                    <method.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold">{method.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{method.desc}</p>
                  {selectedChannel === method.key && (
                    <Badge className="mt-2 bg-primary/10 text-primary">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedChannel && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Amount (ZMW)</Label>
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.,]/g, ""))}
                    className="text-2xl h-14 font-bold text-center"
                  />
                </div>
                {selectedChannel === "card" && parsedAmount > 0 && (
                  <p className="text-xs text-muted-foreground">Card fee: {fmtZMW(parsedAmount * 0.029)} (2.9%)</p>
                )}
                {selectedChannel === "nfs" && parsedAmount > 0 && (
                  <p className="text-xs text-muted-foreground">NFS fee: ZMW 15.00 (fixed)</p>
                )}
                <Separator />
                <Button className="w-full h-12" onClick={handleTopUp} disabled={parsedAmount <= 0 || isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Fund Wallet — {parsedAmount > 0 ? fmtZMW(parsedAmount) : "Enter amount"}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Top-up history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Top-Ups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(history ?? []).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{entry.channel.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{fmtZMW(entry.amount)}</TableCell>
                  <TableCell>
                    <Badge className={entry.status === "COMPLETED" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
