import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { costCentres, departments } from "@/data/employees";
import { ArrowLeft, Save } from "lucide-react";

export default function EmployeeNewPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/employees");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/employees")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Add Employee</h2>
          <p className="text-sm text-muted-foreground">
            Register a new employee or driver for disbursements
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employee Details</CardTitle>
            <CardDescription>
              Only name and mobile phone are required for MVP. The phone number is used as the mobile money destination.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" placeholder="e.g. Bwalya" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" placeholder="e.g. Mulenga" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Phone Number *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  +260
                </span>
                <Input id="phone" type="tel" placeholder="97 134 5678" className="pl-14" required />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be used as the mobile money destination for disbursements
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Mobile Money Carrier *</Label>
              <Select>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="airtel_money">Airtel Money (+260 97X)</SelectItem>
                  <SelectItem value="mtn_momo">MTN MoMo (+260 96X)</SelectItem>
                  <SelectItem value="zamtel_kwacha">Zamtel Kwacha (+260 95X)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nrc">NRC Number</Label>
              <Input id="nrc" placeholder="e.g. 123456/78/1" />
              <p className="text-xs text-muted-foreground">
                National Registration Card number (optional for MVP)
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="costCentre">Cost Centre</Label>
                <Select>
                  <SelectTrigger id="costCentre">
                    <SelectValue placeholder="Select cost centre" />
                  </SelectTrigger>
                  <SelectContent>
                    {costCentres.map((cc) => (
                      <SelectItem key={cc} value={cc}>{cc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Employee
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/employees")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
