import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
import { currentUser, companyUsers } from "@/data/mock";
import { costCentres } from "@/data/employees";
import { platformLimits } from "@/data/fee-config";
import { Save, Plus, Shield, Users, MapPin, GitBranch } from "lucide-react";

const roleLabels: Record<string, string> = {
  company_admin: "Admin",
  finance_user: "Finance",
  approver: "Approver",
  auditor: "Auditor",
  platform_operator: "Operator",
};

const roleStyles: Record<string, string> = {
  company_admin: "bg-primary/10 text-primary",
  finance_user: "bg-gold/10 text-gold-foreground",
  approver: "bg-success/10 text-success",
  auditor: "bg-chart-4/10 text-chart-4",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="limits">Disbursement Limits</TabsTrigger>
          <TabsTrigger value="costcentres">Cost Centres</TabsTrigger>
          <TabsTrigger value="workflows">Approval Workflows</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Company Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input defaultValue="Copperbelt Transport Services Ltd" />
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input defaultValue="ZM-2019-CT-4521" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input defaultValue="Transport & Logistics" />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input defaultValue="Ndola" />
                </div>
              </div>
              <Separator />
              <h4 className="text-sm font-semibold">Your Profile</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={`${currentUser.firstName} ${currentUser.lastName}`} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={currentUser.email} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={currentUser.phone} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue="Company Admin" disabled />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users & Roles */}
        <TabsContent value="users" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    <Users className="mr-2 inline h-4 w-4" />
                    Company Users
                  </CardTitle>
                  <CardDescription>Manage users and their role-based access</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{u.email}</TableCell>
                      <TableCell>
                        <Badge className={roleStyles[u.role] ?? ""}>
                          {roleLabels[u.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-success/10 text-success">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Limits */}
        <TabsContent value="limits" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <Shield className="mr-2 inline h-4 w-4" />
                Company Disbursement Limits
              </CardTitle>
              <CardDescription>
                These limits apply within your company. Platform and network limits may also apply.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Per Transaction Limit (ZMW)</Label>
                  <Input defaultValue={platformLimits.perTransaction.toString()} />
                </div>
                <div className="space-y-2">
                  <Label>Daily Per Employee (ZMW)</Label>
                  <Input defaultValue={platformLimits.dailyPerEmployee.toString()} />
                </div>
                <div className="space-y-2">
                  <Label>Daily Company Limit (ZMW)</Label>
                  <Input defaultValue={platformLimits.dailyPerCompany.toString()} />
                </div>
              </div>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Update Limits
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Centres */}
        <TabsContent value="costcentres" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  <MapPin className="mr-2 inline h-4 w-4" />
                  Cost Centres
                </CardTitle>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Cost Centre
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {costCentres.map((cc) => (
                  <div key={cc} className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <span className="text-sm font-medium">{cc}</span>
                    <Badge variant="outline" className="text-xs">Active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows */}
        <TabsContent value="workflows" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                <GitBranch className="mr-2 inline h-4 w-4" />
                Approval Workflows
              </CardTitle>
              <CardDescription>
                Configure how disbursements are routed for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Default Workflow</p>
                    <p className="text-xs text-muted-foreground">
                      All disbursements require single approver sign-off
                    </p>
                  </div>
                  <Badge className="bg-success/10 text-success">Active</Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-0.5">Finance User initiates</span>
                  <span>→</span>
                  <span className="rounded bg-muted px-2 py-0.5">Approver reviews</span>
                  <span>→</span>
                  <span className="rounded bg-muted px-2 py-0.5">Disbursement processed</span>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Require approval for all amounts</p>
                  <p className="text-xs text-muted-foreground">
                    Even small disbursements need sign-off
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Auto-approve threshold (ZMW)</Label>
                <div className="flex items-center gap-2">
                  <Input defaultValue="0" className="w-32" disabled />
                  <span className="text-xs text-muted-foreground">
                    Set to 0 = all require approval
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
