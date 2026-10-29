import {
  ArrowUpRight,
  BellRing,
  CreditCard,
  Layers3,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import LoginForm from "../components/LoginForm";

export default function LoginView() {
  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
      {/* LEFT PANEL */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#0f172a] px-12 py-10 text-white lg:flex xl:px-20">
        {/* Background gradients */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[450px] w-[450px] rounded-full bg-violet-600/20 blur-[110px]" />

        {/* BRAND */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/20">
            <Layers3 className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              SMS
            </h1>
            <p className="text-xs text-slate-400">
              Subscription & Credit Card Tracker
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-xs font-medium text-indigo-200">
            <Wallet className="h-4 w-4" />
            Smarter subscription management
          </div>

          <h2 className="text-5xl font-semibold leading-[1.15] tracking-tight xl:text-6xl">
            Take control of your
            <span className="mt-2 block text-indigo-400">
              subscriptions.
            </span>
          </h2>

          <p className="mt-7 max-w-md text-base leading-8 text-slate-400">
            Track recurring expenses, monitor credit card
            spending, and stay ahead of upcoming payments.
            Everything in one simple dashboard.
          </p>

          {/* FEATURES */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <CreditCard className="h-5 w-5 text-indigo-400" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Credit card monitoring
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Track card charges, balances, and payments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <BellRing className="h-5 w-5 text-indigo-400" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Subscription reminders
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Keep track of upcoming bills and renewals.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Organized financial overview
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  View recurring costs and payment activity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} SMS
          </span>

          <span className="flex items-center gap-1">
            Your finances, organized
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:px-16">
        {/* MOBILE BRAND */}
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Layers3 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              SMS
            </h1>
            <p className="text-xs text-slate-500">
              Subscription & Credit Card Tracker
            </p>
          </div>
        </div>

        {/* LOGIN */}
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-[420px]">
            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                Your financial dashboard
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to manage your subscriptions,
                credit cards, and upcoming payments.
              </p>
            </div>

            <LoginForm />

            <div className="mt-9 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Secure account authentication
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Subflow. All rights reserved.
        </div>
      </section>
    </main>
  );
}