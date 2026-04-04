import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Bell,
  Check,
  Trash2,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "success" | "error" | "warning" | "info";
  read: boolean;
  category: "disbursement" | "wallet" | "employee" | "system";
}

const allNotifications: Notification[] = [
  {
    id: "N-001",
    title: "Disbursement Approved",
    message: "Batch #DB-2026-0412 (12 transactions, ZMW 24,500) approved by Joseph Banda",
    time: "10 minutes ago",
    type: "success",
    read: false,
    category: "disbursement",
  },
  {
    id: "N-002",
    title: "Failed Transaction",
    message: "Disbursement to Nakamba Tembo failed — mobile money timeout. Transaction #DSB-0108 requires retry.",
    time: "25 minutes ago",
    type: "error",
    read: false,
    category: "disbursement",
  },
  {
    id: "N-003",
    title: "Wallet Credited",
    message: "ZMW 500,000 credited to company wallet by Platform Operations. Reference: WC-2026-0402",
    time: "2 hours ago",
    type: "info",
    read: false,
    category: "wallet",
  },
  {
    id: "N-004",
    title: "Pending Approvals",
    message: "5 disbursement requests are awaiting your approval. Total value: ZMW 12,460.",
    time: "3 hours ago",
    type: "warning",
    read: true,
    category: "disbursement",
  },
  {
    id: "N-005",
    title: "Bulk Upload Complete",
    message: "CSV import finished: 45 employees added, 3 duplicates skipped, 1 invalid phone number.",
    time: "5 hours ago",
    type: "success",
    read: true,
    category: "employee",
  },
  {
    id: "N-006",
    title: "Disbursement Rejected",
    message: "Disbursement #DSB-0089 to Lubinda Siame rejected by Joseph Banda — exceeds daily limit.",
    time: "6 hours ago",
    type: "error",
    read: true,
    category: "disbursement",
  },
  {
    id: "N-007",
    title: "Carrier Degraded",
    message: "Zamtel Kwacha is experiencing intermittent delays. Average response time: 4.2s (normally 1.5s).",
    time: "8 hours ago",
    type: "warning",
    read: true,
    category: "system",
  },
  {
    id: "N-008",
    title: "Monthly Statement Ready",
    message: "Your March 2026 fee statement is ready for download. Total platform fees: ZMW 24,000.",
    time: "1 day ago",
    type: "info",
    read: true,
    category: "wallet",
  },
  {
    id: "N-009",
    title: "Disbursement Completed",
    message: "All 34 disbursements for today have been processed successfully. Total: ZMW 78,500.",
    time: "1 day ago",
    type: "success",
    read: true,
    category: "disbursement",
  },
  {
    id: "N-010",
    title: "New User Added",
    message: "Grace Phiri has been added as Auditor by Mwamba Kapumba.",
    time: "3 days ago",
    type: "info",
    read: true,
    category: "employee",
  },
];

const typeIcons: Record<string, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const typeStyles: Record<string, string> = {
  success: "bg-success/10 text-success",
  error: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning-foreground",
  info: "bg-primary/10 text-primary",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.category === filter;
  });

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotif = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" onValueChange={(val) => setFilter(val ?? "all")}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="disbursement">Disbursements</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map((notif) => {
                    const Icon = typeIcons[notif.type];
                    return (
                      <div
                        key={notif.id}
                        className={`flex gap-4 px-6 py-4 transition-colors ${
                          !notif.read ? "bg-primary/3" : ""
                        }`}
                      >
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${typeStyles[notif.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="mt-1.5 flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{notif.time}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">
                              {notif.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-start gap-1">
                          {!notif.read && (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => markRead(notif.id)}
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => deleteNotif(notif.id)}
                            title="Delete"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
