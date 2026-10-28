
"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  ReceiptText,
  Wallet,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { DashboardPeriod } from "../services/dashboard.service";
import { useDashboard } from "../hooks/useDashboard";

// ==========================================
// TYPES
// ==========================================

type BillingStatus =
  | "SCHEDULED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

type Billing = {
  id: number;
  name: string;
  category: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: BillingStatus;
  card: string;
};

type CardInfo = {
  id: number;
  bank: string;
  network: string;
  lastFour: string;
  creditLimit: number;
  outstanding: number;
  status?: string;
};

type MonthlyData = {
  month: string;
  billed: number;
  paid: number;
};

type CategoryData = {
  name: string;
  value: number;
};

// ==========================================
// CONSTANTS
// ==========================================

const CHART_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#94a3b8",
];

// ==========================================
// FORMATTERS
// ==========================================

const peso = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);

const shortPeso = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({
  status,
}: {
  status: BillingStatus;
}) {
  const styles: Record<BillingStatus, string> = {
    PAID: "bg-emerald-50 text-emerald-700",
    SCHEDULED: "bg-blue-50 text-blue-700",
    PARTIALLY_PAID: "bg-amber-50 text-amber-700",
    OVERDUE: "bg-red-50 text-red-700",
    CANCELLED: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F8F9FB] p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className={`rounded-xl p-2.5 ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>

      <p className="mt-2 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

// ==========================================
// MAIN DASHBOARD
// ==========================================

export default function DashboardSubscriptionView() {
  // ========================================
  // STATES
  // ========================================

  const [period, setPeriod] =
    useState<DashboardPeriod>("month");

  const [billingFilter, setBillingFilter] =
    useState<"ALL" | BillingStatus>("ALL");

  // ========================================
  // REACT QUERY
  // ========================================

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDashboard(period);

  // ========================================
  // API DATA
  // ========================================

  const billings: Billing[] =
    data?.recentBillings ?? [];

  const cards: CardInfo[] =
    data?.cards ?? [];

  const monthlyData: MonthlyData[] =
    data?.monthlyData ?? [];

  const categoryData: CategoryData[] =
    data?.categoryData ?? [];

  // ========================================
  // SUMMARY
  // ========================================

  const summary = {
    totalBilled:
      data?.summary.totalBilled ?? 0,

    totalPaid:
      data?.summary.totalPaid ?? 0,

    outstanding:
      data?.summary.outstanding ?? 0,

    overdue:
      data?.summary.overdue ?? 0,

    totalCreditLimit:
      data?.creditSummary.totalCreditLimit ?? 0,

    totalCardOutstanding:
      data?.creditSummary.totalCardOutstanding ?? 0,

    availableCredit:
      data?.creditSummary.availableCredit ?? 0,
  };

  // ========================================
  // FILTERED BILLINGS
  // ========================================

  const filteredBillings = useMemo(() => {
    if (billingFilter === "ALL") {
      return billings;
    }

    return billings.filter(
      (bill) => bill.status === billingFilter
    );
  }, [billings, billingFilter]);

  // ========================================
  // LOADING STATE
  // ========================================

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        <p className="text-sm text-slate-500">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (isError && !data) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-4">
        <CircleAlert className="h-10 w-10 text-red-500" />

        <p className="text-sm text-red-600">
          Failed to load dashboard data.
        </p>

        <button
          onClick={() => refetch()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ========================================
  // DASHBOARD UI
  // ========================================

  return (
    <div className="w-full min-w-0 space-y-6 p-2">
      <div className="mx-auto space-y-6">
        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex gap-3">
   <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCE2EC] bg-[#E4E9FA]">
          <LayoutDashboard
            size={20}
            strokeWidth={1.7}
        className="text-[#303C87]"
          />
        </div>
          <div>
           <h1 className="text-[22px] font-semibold tracking-tight text-[#26342F]">
              Dashboard
            </h1>

           <p className="mt-1 text-[13px] leading-relaxed text-[#8A958C]">
              Monitor subscriptions, billings, and credit cards.
            </p>
          </div>

          </div>
         

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
              <CalendarClock className="h-4 w-4" />

              <span>
                {new Date().toLocaleDateString("en-PH", {
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Manila",
                })}
              </span>
            </div>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target.value as DashboardPeriod
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
            >
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            {isFetching && (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
            )}
          </div>
        </div>

        {/* =====================================
            SUMMARY CARDS
        ===================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Billings"
            value={peso(summary.totalBilled)}
            description="Amount of recorded billings"
            icon={ReceiptText}
            iconClass="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            title="Total Paid"
            value={peso(summary.totalPaid)}
            description="Payments recorded against billings"
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />

          <SummaryCard
            title="Outstanding Bills"
            value={peso(summary.outstanding)}
            description="Remaining unpaid subscription balances"
            icon={Wallet}
            iconClass="bg-amber-50 text-amber-600"
          />

          <SummaryCard
            title="Overdue Bills"
            value={peso(summary.overdue)}
            description="Past-due unpaid subscription balances"
            icon={CircleAlert}
            iconClass="bg-red-50 text-red-600"
          />
        </div>

        {/* =====================================
            CHARTS
        ===================================== */}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* BILLING CHART */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-slate-900">
                Billing & Payment Overview
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Monthly comparison of billed and paid amounts
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={shortPeso}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) =>
                      peso(Number(value))
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="billed"
                    name="Billed"
                    fill="#6366f1"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={32}
                  />

                  <Bar
                    dataKey="paid"
                    name="Paid"
                    fill="#10b981"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CATEGORY CHART */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              Spending by Category
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Subscription expense distribution
            </p>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          CHART_COLORS[
                            index % CHART_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      peso(Number(value))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          CHART_COLORS[
                            index % CHART_COLORS.length
                          ],
                      }}
                    />

                    <span className="text-slate-600">
                      {item.name}
                    </span>
                  </div>

                  <span className="font-semibold text-slate-900">
                    {peso(item.value)}
                  </span>
                </div>
              ))}

              {categoryData.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  No category data available.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =====================================
            CREDIT CARD OVERVIEW
        ===================================== */}

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Credit Card Overview
            </h2>

            <p className="text-sm text-slate-500">
              Credit limits and outstanding balances
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SummaryCard
              title="Total Credit Limit"
              value={peso(summary.totalCreditLimit)}
              description={`${cards.length} registered credit cards`}
              icon={CreditCard}
              iconClass="bg-blue-50 text-blue-600"
            />

            <SummaryCard
              title="Card Outstanding"
              value={peso(summary.totalCardOutstanding)}
              description="Total card balance used"
              icon={ArrowUpRight}
              iconClass="bg-orange-50 text-orange-600"
            />

            <SummaryCard
              title="Available Credit"
              value={peso(summary.availableCredit)}
              description="Credit limit minus outstanding balance"
              icon={Wallet}
              iconClass="bg-emerald-50 text-emerald-600"
            />
          </div>

          {/* CREDIT CARD LIST */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cards.map((card) => {
              const utilization =
                card.creditLimit > 0
                  ? (card.outstanding / card.creditLimit) * 100
                  : 0;

              return (
                <div
                  key={card.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {card.bank}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {card.network} •••• {card.lastFour}
                      </p>
                    </div>

                    <CreditCard className="h-5 w-5 text-slate-400" />
                  </div>

                  <div className="mt-5 flex justify-between text-sm">
                    <span className="text-slate-500">
                      Credit Utilization
                    </span>

                    <span className="font-semibold text-slate-900">
                      {utilization.toFixed(1)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        utilization >= 80
                          ? "bg-red-500"
                          : utilization >= 50
                            ? "bg-amber-500"
                            : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          Math.max(utilization, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between text-xs">
                    <div>
                      <p className="text-slate-500">
                        Outstanding
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {peso(card.outstanding)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-slate-500">
                        Credit Limit
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {peso(card.creditLimit)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {cards.length === 0 && (
              <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                No credit cards registered.
              </div>
            )}
          </div>
        </div>

        {/* =====================================
            RECENT SUBSCRIPTION BILLINGS
        ===================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Recent Subscription Billings
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Monitor billing status and payments
              </p>
            </div>

            <select
              value={billingFilter}
              onChange={(event) =>
                setBillingFilter(
                  event.target.value as "ALL" | BillingStatus
                )
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="PAID">Paid</option>
              <option value="PARTIALLY_PAID">
                Partially Paid
              </option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* TABLE CONTENT */}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">
                    Subscription
                  </th>

                  <th className="px-5 py-4">
                    Due Date
                  </th>

                  <th className="px-5 py-4">
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Paid
                  </th>

                  <th className="px-5 py-4">
                    Outstanding
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBillings.map((bill) => (
                  <tr
                    key={bill.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {bill.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {bill.card}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(bill.dueDate)}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {peso(bill.amount)}
                    </td>

                    <td className="px-5 py-4 text-emerald-600">
                      {peso(bill.paidAmount)}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {peso(
                        Math.max(
                          0,
                          bill.amount - bill.paidAmount
                        )
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={bill.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBillings.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No billings found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
