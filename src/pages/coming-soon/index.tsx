import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Globe,
  Plug,
  BarChart3,
  Lock,
} from "lucide-react";

const features = [
  {
    title: "Corporate Cards",
    description: "Issue prepaid cards to employees with real-time balance management and merchant-level spend tracking.",
    icon: CreditCard,
    eta: "Q3 2026",
    path: "/cards",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Self-service Deposits",
    description: "Allow companies to top up wallets directly via mobile money, card payments, or bank transfer.",
    icon: Wallet,
    eta: "Q3 2026",
    path: "/deposits",
    color: "bg-gold/10 text-gold-foreground",
  },
  {
    title: "Employee Mobile App",
    description: "A mobile app for employees to view balances, request funds, and upload receipts on the go.",
    icon: Smartphone,
    eta: "Q4 2026",
    path: "/mobile-app",
    color: "bg-success/10 text-success",
  },
  {
    title: "Multi-Currency & Forex",
    description: "Support USD, ZAR, and other currencies with real-time forex conversion and transaction caps.",
    icon: Globe,
    eta: "Q4 2026",
    path: "/forex",
    color: "bg-chart-4/10 text-chart-4",
  },
  {
    title: "ERP Integrations",
    description: "Connect with Sage, QuickBooks, Xero, Pastel, and other accounting systems via API.",
    icon: Plug,
    eta: "Q4 2026",
    path: "/integrations",
    color: "bg-chart-5/10 text-chart-5",
  },
  {
    title: "Advanced Analytics",
    description: "Business intelligence dashboards with trend analysis, anomaly detection, and custom reports.",
    icon: BarChart3,
    eta: "Q1 2027",
    path: "/coming-soon",
    color: "bg-muted text-muted-foreground",
  },
];

export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Phase 2 Features</h2>
        <p className="text-sm text-muted-foreground">
          These features are planned for the full production build. Preview the interfaces below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => navigate(feature.path)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {feature.eta}
                  </Badge>
                </div>
              </div>
              <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
