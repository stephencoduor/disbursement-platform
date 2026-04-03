import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Plug, ExternalLink, Code } from "lucide-react";

const integrations = [
  { name: "Sage", category: "Accounting", status: "Planned", desc: "Business accounting and financial management" },
  { name: "QuickBooks", category: "Accounting", status: "Planned", desc: "Small business accounting software" },
  { name: "Xero", category: "Accounting", status: "Planned", desc: "Cloud-based accounting platform" },
  { name: "Pastel", category: "Accounting", status: "Planned", desc: "South African accounting software" },
  { name: "Zoho Books", category: "Accounting", status: "Planned", desc: "Online accounting software" },
  { name: "SAP Business One", category: "ERP", status: "Enterprise", desc: "Enterprise resource planning" },
  { name: "ZRA Smart Invoice", category: "Tax", status: "Planned", desc: "Zambia Revenue Authority e-invoicing" },
  { name: "Custom API", category: "Developer", status: "Enterprise", desc: "RESTful API for custom integrations" },
];

const statusStyles: Record<string, string> = {
  Planned: "bg-muted text-muted-foreground",
  Enterprise: "bg-gold/10 text-gold-foreground",
};

export default function IntegrationsPreviewPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Coming in Phase 2 — Q4 2026</p>
            <p className="text-xs text-muted-foreground">
              API-first integrations with accounting systems, ERP platforms, and tax compliance tools.
              Enterprise tier includes custom API access and dedicated integration support.
            </p>
          </div>
        </div>
      </div>

      <div className="opacity-50">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.map((int) => (
            <Card key={int.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {int.category === "Developer" ? (
                      <Code className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Plug className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Badge className={statusStyles[int.status] ?? ""} variant="outline">
                    {int.status}
                  </Badge>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{int.name}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{int.desc}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{int.category}</p>
                <Button variant="outline" size="sm" className="mt-3 w-full" disabled>
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Connect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* API Documentation preview */}
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="text-base">
            <Code className="mr-2 inline h-4 w-4" />
            API Documentation
          </CardTitle>
          <CardDescription>
            Enterprise-grade documentation for third-party integrators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "OpenAPI/Swagger specification",
              "Webhook event specifications",
              "Data model and schema documentation",
              "Authentication and rate limiting guides",
              "Code samples (Python, Node.js, Java)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
