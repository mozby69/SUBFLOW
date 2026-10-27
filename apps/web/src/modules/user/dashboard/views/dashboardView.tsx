
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CreditCard,
  DollarSign,
  ReceiptText,
  Repeat2,
  Wallet,
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

// Replace these demo records with your API response.
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
};

const demoBillings: Billing[] = [
  {
    id: 1,
    name: "Netflix Premium",
    category: "Entertainment",
    dueDate: "2026-10-20",
    amount: 1500,
    paidAmount: 0,
    status: "SCHEDULED",
    card: "Visa •••• 4242",
  },
  {
    id: 2,
    name: "Spotify Premium",
    category: "Entertainment",
    dueDate: "2026-10-22",
    amount: 499,
    paidAmount: 0,
    status: "SCHEDULED",
    card: "Mastercard •••• 1234",
  },
  {
    id: 3,
    name: "Adobe Creative Cloud",
    category: "Software",
    dueDate: "2026-10-15",
    amount: 2500,
    paidAmount: 0,
    status: "OVERDUE",
    card: "Visa •••• 4242",
  },
  {
    id: 4,
    name: "YouTube Premium",
    category: "Entertainment",
    dueDate: "2026-10-25",
    amount: 239,
    paidAmount: 239,
    status: "PAID",
    card: "Visa •••• 4242",
  },
  {
    id: 5,
    name: "iCloud+",
    category: "Cloud Storage",
    dueDate: "2026-10-18",
    amount: 149,
    paidAmount: 50,
    status: "PARTIALLY_PAID",
    card: "Mastercard •••• 1234",
  },
];

const demoCards: CardInfo[] = [
  {
    id: 1,
    bank: "BPI",
    network: "VISA",
    lastFour: "4242",
    creditLimit: 100000,
    outstanding: 18500,
  },
  {
    id: 2,
    bank: "BDO",
    network: "MASTERCARD",
    lastFour: "1234",
    creditLimit: 50000,
    outstanding: 8750,
  },
];

const monthlyData = [
  { month: "May", billed: 6500, paid: 6100 },
  { month: "Jun", billed: 6800, paid: 6600 },
  { month: "Jul", billed: 7200, paid: 7100 },
  { month: "Aug", billed: 6900, paid: 6900 },
  { month: "Sep", billed: 7900, paid: 7200 },
  { month: "Oct", billed: 8249, paid: 4800 },
];

const categoryData = [
  { name: "Entertainment", value: 4200 },
  { name: "Software", value: 2500 },
  { name: "Cloud Storage", value: 849 },
  { name: "Others", value: 700 },
];

const CHART_COLORS = [
  "#6366f1",
  "#06b6d4",
  "#f59e0b",
  "#94a3b8",
];

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

function StatusBadge({ status }: { status: BillingStatus }) {
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

export default function DashboardSubscriptionView() {
  const [billingFilter, setBillingFilter] = useState<
    "ALL" | BillingStatus
  >("ALL");

  const billings = demoBillings;
  const cards = demoCards;

  const summary = useMemo(() => {
    const totalBilled = billings
      .filter((bill) => bill.status !== "CANCELLED")
      .reduce((sum, bill) => sum + bill.amount, 0);

    const totalPaid = billings
      .filter((bill) => bill.status !== "CANCELLED")
      .reduce((sum, bill) => sum + bill.paidAmount, 0);

    const outstanding = totalBilled - totalPaid;

    const overdue = billings
      .filter((bill) => bill.status === "OVERDUE")
      .reduce(
        (sum, bill) => sum + bill.amount - bill.paidAmount,
        0
      );

    const totalCreditLimit = cards.reduce(
      (sum, card) => sum + card.creditLimit,
      0
    );

    const totalCardOutstanding = cards.reduce(
      (sum, card) => sum + card.outstanding,
      0
    );

    return {
      totalBilled,
      totalPaid,
      outstanding,
      overdue,
      totalCreditLimit,
      totalCardOutstanding,
      availableCredit:
        totalCreditLimit - totalCardOutstanding,
    };
  }, [billings, cards]);

  const filteredBillings = billings.filter(
    (bill) =>
      billingFilter === "ALL" ||
      bill.status === billingFilter
  );

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor subscriptions, billings, and credit cards.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600">
            <CalendarClock className="h-4 w-4" />
            <span>
              {new Date().toLocaleDateString("en-PH", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* SUMMARY CARDS */}
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

        {/* CHARTS */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
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
                <BarChart data={monthlyData} barGap={6}>
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
                  <Tooltip formatter={(value) => peso(Number(value))} />
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
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => peso(Number(value))} />
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
                          CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {peso(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CREDIT CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Credit Card Overview
              </h2>
              <p className="text-sm text-slate-500">
                Credit limits and outstanding balances
              </p>
            </div>
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
                      <p className="text-slate-500">Outstanding</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {peso(card.outstanding)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500">Credit Limit</p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {peso(card.creditLimit)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BILLING TABLE */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Subscription</th>
                  <th className="px-5 py-4">Due Date</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Paid</th>
                  <th className="px-5 py-4">Outstanding</th>
                  <th className="px-5 py-4">Status</th>
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
                      {peso(Math.max(0, bill.amount - bill.paidAmount))}
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
