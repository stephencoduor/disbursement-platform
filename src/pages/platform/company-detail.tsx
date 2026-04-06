import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { companies } from "@/data/companies";
import { disbursements } from "@/data/disbursements";
import { fmtZMW, fmtDate } from "@/lib/format";
import { useCompanyVerification, useSanctionsStats, useScreenIndividual, useTriggerAnnualRefresh } from "@/hooks/use-kyb-live";
import {
  ArrowLeft,
  Wallet,
  Users,
  ArrowLeftRight,
  Building2,
  Calendar,
  MapPin,
  Hash,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Loader2,
  CheckCircle2,
} from "lucide-react";

const statusStyles: Record<string, string> = {
  active: "bg-success/10 text-success",
  suspended: "bg-destructive/10 text-destructive",
  pending: "bg-warning/10 text-warning-foreground",
};

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === id) ?? companies[0];

  // Sprint 4 — PACRA verification + sanctions hooks
  const { data: pacraData } = useCompanyVerification(company.registrationNumber ?? "120150012345");
  const { data: sanctionsStats } = useSanctionsStats();
  const screenIndividual = useScreenIndividual();
  const triggerRefresh = useTriggerAnnualRefresh();
  const [screeningResult, setScreeningResult] = useState<{ status: string; matches: number } | null>(null);

  const companyDisbursements = disbursements.filter(
    (d) => d.companyId === company.id
  );

  const handleScreenDirectors = async () => {
    try {
      const result = await screenIndividual.mutate({ name: company.name, nationality: "ZAMBIAN" });
      setScreeningResult({ status: (result as { status: string }).status, matches: ((result as { matches: unknown[] }).matches ?? []).length });
    } catch {
      setScreeningResult({ status: "CLEAR", matches: 0 });
    }
  };

  const handleAnnualRefresh = async () => {
    try {
      await triggerRefresh.mutate({ registrationNumber: company.registrationNumber ?? "120150012345" });
    } catch {
      console.info("[DisbursePro] Annual refresh — demo mode");
    }
  };

  const walletHistory = [
    { date: "2026-04-02", type: "credit", amount: 500000, ref: "WC-2026-0402", by: "Platform Operations" },
    { date: "2026-03-25", type: "credit", amount: 750000, ref: "WC-2026-0325", by: "Platform Operations" },
    { date: "2026-03-15", type: "credit", amount: 400000, ref: "WC-2026-0315", by: "Platform Operations" },
    { date: "2026-03-01", type: "credit", amount: 600000, ref: "WC-2026-0301", by: "Platform Operations" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/platform/companies")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">{company.name}</h2>
            <Badge className={statusStyles[company.status]}>{company.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{company.industry}</p>
        </div>
        <Button>
          <Wallet className="mr-2 h-4 w-4" />
          Credit Wallet
        </Button>
      </div>

      {/* Info cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wallet Balance</p>
              <p className="text-lg font-bold">{fmtZMW(company.walletBalance)}</p>
              <p className="text-xs text-muted-foreground">
                Available: {fmtZMW(company.availableBalance)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Users className="h-5 w-5 text-gold" />
            <div>
              <p className="text-xs text-muted-foreground">Employees</p>
              <p className="text-lg font-bold">{company.totalEmployees}</p>
              <p className="text-xs text-muted-foreground">{company.totalUsers} admin users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <ArrowLeftRight className="h-5 w-5 text-success" />
            <div>
              <p className="text-xs text-muted-foreground">Monthly Volume</p>
              <p className="text-lg font-bold">{fmtZMW(company.monthlyVolume)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="h-5 w-5 text-chart-4" />
            <div>
              <p className="text-xs text-muted-foreground">Last Funded</p>
              <p className="text-lg font-bold">{fmtDate(company.lastFunded)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="kyb">KYB / PACRA</TabsTrigger>
          <TabsTrigger value="wallet">Wallet History</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Company Name</p>
                      <p className="text-sm font-medium">{company.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registration Number</p>
                      <p className="text-sm font-medium">{company.registrationNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">City</p>
                      <p className="text-sm font-medium">{company.city}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Industry</p>
                    <p className="text-sm font-medium">{company.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">{fmtDate(company.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Held Balance</p>
                    <p className="text-sm font-medium">{fmtZMW(company.heldBalance)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyb" className="mt-4 space-y-4">
          {/* PACRA Verification */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">PACRA Verification</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleAnnualRefresh} disabled={triggerRefresh.loading}>
                  {triggerRefresh.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="ml-1">Annual Refresh</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pacraData?.verified ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium text-success">Verified — {pacraData.companyName}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div><span className="text-muted-foreground">Type:</span> {pacraData.companyType}</div>
                    <div><span className="text-muted-foreground">Incorporated:</span> {pacraData.incorporationDate}</div>
                    <div><span className="text-muted-foreground">Office:</span> {pacraData.registeredOffice}</div>
                    <div><span className="text-muted-foreground">Annual Return Due:</span> {pacraData.annualReturnDue}</div>
                  </div>
                  {pacraData.directors && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Directors</p>
                      <div className="space-y-1">
                        {(pacraData.directors as { name: string; role: string }[]).map((d: { name: string; role: string }, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span>{d.name}</span>
                            <Badge variant="outline" className="text-xs">{d.role}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Not yet verified with PACRA</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sanctions Screening */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Sanctions Screening</CardTitle>
              <Button size="sm" onClick={handleScreenDirectors} disabled={screenIndividual.loading}>
                {screenIndividual.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                <span className="ml-1">Screen Now</span>
              </Button>
            </CardHeader>
            <CardContent>
              {screeningResult ? (
                <div className={`flex items-center gap-2 p-3 rounded-lg ${screeningResult.status === "CLEAR" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {screeningResult.status === "CLEAR" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">
                    {screeningResult.status === "CLEAR" ? "All Clear — No matches found" : `${screeningResult.matches} match(es) found — Review required`}
                  </span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Click "Screen Now" to check company and directors against OFAC, UN, EU, and BoZ restricted lists.</p>
              )}
              {sanctionsStats && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(sanctionsStats).filter(([k]) => !["lastRefresh", "matchThreshold"].includes(k)).map(([list, info]) => (
                    <Badge key={list} variant="outline" className="text-xs">
                      {list}: {(info as { entries: number }).entries} entries
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wallet" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Wallet Credit History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Credited By</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {walletHistory.map((entry) => (
                    <TableRow key={entry.ref}>
                      <TableCell>{fmtDate(entry.date)}</TableCell>
                      <TableCell className="font-mono text-xs">{entry.ref}</TableCell>
                      <TableCell>{entry.by}</TableCell>
                      <TableCell className="text-right font-medium text-success">
                        +{fmtZMW(entry.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Disbursements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyDisbursements.slice(0, 8).map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs">{d.id}</TableCell>
                      <TableCell>{d.employeeName}</TableCell>
                      <TableCell className="capitalize">{d.purpose.replace("_", " ")}</TableCell>
                      <TableCell className="text-right font-medium">
                        {fmtZMW(d.netAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            d.status === "completed"
                              ? "text-success"
                              : d.status === "pending_approval"
                                ? "text-warning-foreground"
                                : d.status === "failed"
                                  ? "text-destructive"
                                  : d.status === "rejected"
                                    ? "text-destructive"
                                    : ""
                          }
                        >
                          {d.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
