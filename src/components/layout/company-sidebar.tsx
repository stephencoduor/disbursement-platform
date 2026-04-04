import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentUser, companyStats, notifications } from "@/data/mock";
import { fmtZMW } from "@/lib/format";
import {
  LayoutDashboard,
  Users,
  Send,
  Layers,
  CheckCircle2,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ScrollText,
  LogOut,
  Banknote,
  Bell,
  CreditCard,
  Wallet,
  Smartphone,
  Globe,
  Plug,
  Lock,
} from "lucide-react";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Employees", icon: Users, path: "/employees" },
  { label: "Disburse", icon: Send, path: "/disburse" },
  { label: "Bulk Disburse", icon: Layers, path: "/disburse/bulk" },
  { label: "Approvals", icon: CheckCircle2, path: "/approvals", showBadge: true },
  { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Audit Log", icon: ScrollText, path: "/audit-log" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const phase2Nav = [
  { label: "Corporate Cards", icon: CreditCard, path: "/cards" },
  { label: "Deposits", icon: Wallet, path: "/deposits" },
  { label: "Employee App", icon: Smartphone, path: "/mobile-app" },
  { label: "Multi-Currency", icon: Globe, path: "/forex" },
  { label: "Integrations", icon: Plug, path: "/integrations" },
];

const unreadCount = notifications.filter((n) => !n.read).length;

export default function CompanySidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary">
          <Banknote className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          DisbursePro
        </span>
      </div>

      {/* Wallet balance */}
      <div className="mx-3 rounded-lg bg-sidebar-accent/50 px-4 py-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
          Wallet Balance
        </p>
        <p className="mt-0.5 text-lg font-bold text-sidebar-primary">
          {fmtZMW(companyStats.walletBalance)}
        </p>
        <p className="text-[10px] text-sidebar-foreground/40">
          Available: {fmtZMW(companyStats.availableBalance)}
        </p>
      </div>

      <Separator className="mt-3 bg-sidebar-border" />

      {/* Main navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {mainNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-white border-l-[3px] border-[#2EC4B6]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive && "text-white"
                  )}
                />
                <span>{item.label}</span>
                {item.showBadge && companyStats.pendingApprovals > 0 && (
                  <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-sidebar-primary px-1.5 text-[10px] font-bold text-sidebar-primary-foreground">
                    {companyStats.pendingApprovals}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Phase 2 section */}
        <Separator className="!my-3 bg-sidebar-border" />
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/30">
          Coming Soon
        </p>
        {phase2Nav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/30 transition-colors hover:bg-sidebar-accent/20"
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span>{item.label}</span>
            <Lock className="ml-auto h-3 w-3" />
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Bottom section */}
      <div className="space-y-1 p-3">
        <button
          onClick={() => navigate("/notifications")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Badge className="ml-auto h-5 min-w-5 justify-center rounded-full bg-sidebar-primary px-1.5 text-[10px] font-bold text-sidebar-primary-foreground">
              {unreadCount}
            </Badge>
          )}
        </button>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8 border border-sidebar-border">
            <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-primary">
              {currentUser.firstName[0]}
              {currentUser.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-white">
              {currentUser.firstName} {currentUser.lastName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50">
              Company Admin
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-white"
            onClick={() => navigate("/login")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
