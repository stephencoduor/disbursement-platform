import { Outlet } from "react-router-dom";
import { Banknote, Shield, Users, Zap } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 lg:flex lg:w-[480px] xl:w-[520px]">
        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute right-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold">
            <Banknote className="h-5 w-5 text-gold-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            DisbursePro
          </span>
        </div>

        {/* Tagline + features */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Enterprise disbursement,
              <br />
              simplified.
            </h2>
            <p className="mt-3 text-base text-white/70">
              Control, visibility, and orchestration for enterprise money
              movement across Zambia.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Users className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Employee Disbursements
                </p>
                <p className="text-xs text-white/50">
                  Disburse to hundreds of employees instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Zap className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Mobile Money Integration
                </p>
                <p className="text-xs text-white/50">
                  Airtel Money, MTN MoMo, Zamtel Kwacha
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <Shield className="h-4 w-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Full Audit Trails
                </p>
                <p className="text-xs text-white/50">
                  Approval workflows with complete accountability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-xs text-white/40">
          Licensed custodial model regulated by the Bank of Zambia.
        </p>
      </div>

      {/* Right content area */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Banknote className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">DisbursePro</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
