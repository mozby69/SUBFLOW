
"use client";

import {
  AlertCircle,
  CheckCircle2,
  Receipt,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import {
  formatCurrency,
  type BillingSummary,
} from "@repo/shared";

type Props = {
  summary: BillingSummary;
};

type AmountKey = "paid" | "outstanding" | "overdue";

type SummaryCardConfig = {
  label: string;
  key: AmountKey;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  accentColor: string;
};

const summaryCards: SummaryCardConfig[] = [
  {
    label: "Paid Amount",
    key: "paid",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accentColor: "bg-emerald-500",
  },
  {
    label: "Outstanding",
    key: "outstanding",
    icon: Wallet,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    accentColor: "bg-amber-500",
  },
  {
    label: "Overdue",
    key: "overdue",
    icon: AlertCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    accentColor: "bg-red-500",
  },
];

export function BillingSummaryCards({ summary }: Props) {
  // Keep PHP first, followed by other currencies.
  const currencies = [...summary.currencies].sort((a, b) => {
    if (a.currencyCode === "PHP") return -1;
    if (b.currencyCode === "PHP") return 1;

    return a.currencyCode.localeCompare(b.currencyCode);
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

      {/* TOTAL RECORDS */}
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">

        <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Records
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Billing records found
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Receipt className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
            {summary.totalRecords.toLocaleString()}
          </p>
        </div>

        <div className="mt-auto pt-4">
          <p className="text-xs text-slate-400">
            Based on selected filters
          </p>
        </div>
      </div>

      {/* CURRENCY SUMMARY CARDS */}
      {summaryCards.map((card) => {
        const Icon = card.icon;

        const hasNonZeroBalance = currencies.some(
          (currency) => Number(currency[card.key]) !== 0
        );

        return (
          <div
            key={card.key}
            className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            {/* TOP ACCENT */}
            <div
              className={`absolute inset-x-0 top-0 h-0.5 ${card.accentColor}`}
            />

            {/* HEADER */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {card.key === "paid"
                    ? "Payments recorded"
                    : card.key === "outstanding"
                      ? "Remaining balances"
                      : "Past due balances"}
                </p>
              </div>

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>

            {/* AMOUNTS */}
            <div className="mt-5 flex-1">
              {currencies.length === 0 ? (
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-400 tabular-nums">
                    {formatCurrency(0, "PHP")}
                  </p>

                  <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-400">
                    PHP
                  </span>
                </div>
              ) : (
                <div className="space-y-0">
                  {currencies.map((currency, index) => {
                    const amount = Number(currency[card.key]);
                    const isZero = amount === 0;

                    return (
                      <div
                        key={currency.currencyCode}
                        className={`
                          flex min-w-0 items-center justify-between gap-2 py-2
                          ${index === 0 ? "pt-0" : "border-t border-slate-100"}
                        `}
                      >
                        <p
                          className={`
                            min-w-0 break-words text-xl font-bold tracking-tight tabular-nums
                            ${isZero ? "text-slate-400" : "text-slate-900"}
                          `}
                        >
                          {formatCurrency(
                            currency[card.key],
                            currency.currencyCode
                          )}
                        </p>

                        <span className="shrink-0 rounded-md bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500">
                          {currency.currencyCode}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-auto border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasNonZeroBalance
                      ? card.accentColor
                      : "bg-slate-300"
                  }`}
                />

                <p className="text-[11px] text-slate-400">
                  {card.key === "paid"
                    ? "Total payments received"
                    : card.key === "outstanding"
                      ? "Unpaid billing balances"
                      : "Overdue unpaid balances"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
