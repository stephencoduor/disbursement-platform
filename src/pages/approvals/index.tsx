import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { disbursements, purposeLabels } from "@/data/disbursements";
import { carrierLabels } from "@/data/employees";
import { fmtZMW, fmtDateTime } from "@/lib/format";
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending_approval: "bg-warning/10 text-warning-foreground",
  approved: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
  rejected: "bg-destructive/10 text-destructive",
};

export default function ApprovalsPage() {
  const navigate = useNavigate();
  const pending = disbursements.filter((d) => d.status === "pending_approval");
  const approved = disbursements.filter((d) => d.status === "completed" || d.status === "approved");
  const rejected = disbursements.filter((d) => d.status === "rejected");

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-warning">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-warning" />
            <div>
              <p className="text-lg font-bold">{pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="text-lg font-bold">{approved.length}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="flex items-center gap-3 p-4">
            <XCircle className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-lg font-bold">{rejected.length}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>

        {(["pending", "approved", "rejected"] as const).map((tab) => {
          const items = tab === "pending" ? pending : tab === "approved" ? approved : rejected;
          return (
            <TabsContent key={tab} value={tab} className="mt-4">
              <Card>
                <CardContent className="p-0">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center py-12 text-center">
                      <CheckCircle2 className="h-10 w-10 text-muted-foreground/30" />
                      <p className="mt-2 text-sm text-muted-foreground">No {tab} disbursements</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {items.map((d) => (
                        <div
                          key={d.id}
                          className="flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
                          onClick={() => navigate(`/approvals/${d.id}`)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{d.employeeName}</p>
                              <Badge className={statusStyles[d.status] ?? ""} variant="outline">
                                {d.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {purposeLabels[d.purpose]} &middot; {carrierLabels[d.carrier]} &middot; {d.costCentre}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Initiated by {d.initiatedBy} &middot; {fmtDateTime(d.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{fmtZMW(d.netAmount)}</p>
                            <p className="text-xs text-muted-foreground">
                              Gross: {fmtZMW(d.grossAmount)}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
