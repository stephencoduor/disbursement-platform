import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { platformOperator } from "@/data/mock";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Settings,
  LogOut,
  Banknote,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/platform" },
  { label: "Companies", icon: Building2, path: "/platform/companies" },
  { label: "Revenue & Fees", icon: TrendingUp, path: "/platform/revenue" },
  { label: "Settings", icon: Settings, path: "/platform/settings" },
];

export default function PlatformSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo + Platform badge */}
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary">
          <Banknote className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white">
          DisbursePro
        </span>
        <Badge className="ml-1 rounded-md bg-sidebar-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-primary">
          Platform
        </Badge>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/platform"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Bottom: operator info */}
      <div className="p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <Avatar className="h-8 w-8 border border-sidebar-border">
            <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-primary">
              {platformOperator.firstName[0]}
              {platformOperator.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium text-white">
              {platformOperator.firstName} {platformOperator.lastName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/50">
              Platform Operator
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
