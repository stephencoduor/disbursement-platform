import { Outlet, useLocation, useNavigate } from "react-router-dom";
import PlatformSidebar from "./platform-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { platformOperator } from "@/data/mock";
import { Search, User, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/platform": "Platform Dashboard",
  "/platform/companies": "Companies",
  "/platform/revenue": "Revenue & Fees",
  "/platform/settings": "Platform Settings",
};

export default function PlatformLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith("/platform/companies/")
      ? "Company Detail"
      : "Platform");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:block">
        <PlatformSidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full w-64">
            <PlatformSidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-4 text-white hover:bg-sidebar-accent"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-4 bg-[#E8F4F8]/80 backdrop-blur-md border-b border-[#E8F4F8] px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <h1 className="text-lg font-semibold">{pageTitle}</h1>

          <div className="ml-auto hidden items-center md:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies, transactions..."
                className="w-72 pl-9"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="h-9 gap-2 px-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {platformOperator.firstName[0]}
                      {platformOperator.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:inline-block">
                    Operator
                  </span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/platform/settings")}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/platform/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/login")}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
