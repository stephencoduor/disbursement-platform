import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Phone, Building2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("email");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your DisbursePro account
        </p>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          Welcome back, Mwamba! Redirecting to dashboard...
        </div>
      )}

      {/* Login method toggle */}
      <div className="flex gap-2">
        <Button
          variant={loginMethod === "email" ? "default" : "outline"}
          size="sm"
          onClick={() => setLoginMethod("email")}
          className="flex-1"
        >
          Email
        </Button>
        <Button
          variant={loginMethod === "phone" ? "default" : "outline"}
          size="sm"
          onClick={() => setLoginMethod("phone")}
          className="flex-1"
        >
          <Phone className="mr-1.5 h-3.5 w-3.5" />
          Phone
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Code */}
        <div className="space-y-2">
          <Label htmlFor="company-code">Company Code</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="company-code"
              placeholder="e.g. COPPERBELT"
              defaultValue="COPPERBELT"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your company's unique identifier
          </p>
        </div>

        {/* Email or Phone */}
        {loginMethod === "email" ? (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.co.zm"
              defaultValue="mwamba.kapumba@copperbelt-transport.co.zm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                +260
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="97 234 5678"
                defaultValue="97 234 5678"
                className="pl-14"
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button
              type="button"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              defaultValue="password123"
              className="pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <Separator />

      {/* Quick access */}
      <div className="space-y-3">
        <p className="text-center text-xs text-muted-foreground">
          Quick access for demo
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-xs"
          >
            Company Portal
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/platform")}
            className="text-xs"
          >
            Platform Admin
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New company?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
