
"use client";

import { useEffect } from "react";
import {
  X,
  CalendarDays,
  CreditCard,
  ReceiptText,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock3,
  History,
  ArrowUpRight,
  Building2,
} from "lucide-react";

import { useGetBillingById } from "../hooks/useBilling";

import {
  formatBillingDate,
  formatMoney,
  getEffectiveStatus,
  getOutstanding,
} from "../utils/billing.utils";

type Props = {
  billingId: number | null;
  onClose: () => void;
};

const statusStyles = {
  SCHEDULED: "bg-blue-50 text-blue-700 ring-blue-100",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 ring-amber-100",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  OVERDUE: "bg-red-50 text-red-700 ring-red-100",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-200",
};

const statusIcons = {
  SCHEDULED: Clock3,
  PARTIALLY_PAID: Wallet,
  PAID: CheckCircle2,
  OVERDUE: AlertCircle,
  CANCELLED: X,
};

export function BillingDetailsModal({
  billingId,
  onClose,
}: Props) {
  const { data, isLoading, isError } =
    useGetBillingById(billingId);

  useEffect(() => {
    if (billingId === null) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [billingId, onClose]);

  if (billingId === null) return null;

  const status = data ? getEffectiveStatus(data) : "SCHEDULED";
  const StatusIcon = statusIcons[status];

  const amount = Number(data?.amount ?? 0);
  const paidAmount = Number(data?.paidAmount ?? 0);
  const outstanding = data ? getOutstanding(data) : 0;

  const paymentProgress =
    amount > 0
      ? Math.min(100, Math.max(0, (paidAmount / amount) * 100))
      : 0;

  const card = data?.subscription.card;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[3px] sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="billing-details-title"
        className="flex max-h-[92vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ReceiptText className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="billing-details-title"
                className="text-lg font-bold tracking-tight text-slate-900"
              >
                Billing Details
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Billing Reference #{billingId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close billing details"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-28 rounded-2xl bg-slate-100" />
              <div className="h-24 rounded-2xl bg-slate-100" />
              <div className="h-36 rounded-2xl bg-slate-100" />
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              Failed to load billing details. Please try again.
            </div>
          )}

          {data && !isError && (
            <>
              {/* SUBSCRIPTION OVERVIEW */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg font-bold text-slate-700">
                    {data.subscription.subscriptionName
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      SUBSCRIPTION
                    </p>

                    <h3 className="text-lg font-bold text-slate-900">
                      {data.subscription.subscriptionName}
                    </h3>

                    <p className="text-xs capitalize text-slate-500">
                      {data.subscription.billingCycle.toLowerCase()} billing
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
                    statusStyles[status]
                  }`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.replaceAll("_", " ")}
                </span>
              </div>

              {/* AMOUNT SUMMARY */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Outstanding Balance
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                      {formatMoney(outstanding, data.currencyCode)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Remaining amount to be paid
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-3 text-indigo-600 shadow-sm">
                    <Wallet className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      Payment Progress
                    </span>
                    <span className="font-semibold text-slate-700">
                      {paymentProgress.toFixed(0)}% Paid
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-valuenow={paymentProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="h-2.5 overflow-hidden rounded-full bg-indigo-100"
                  >
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${paymentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* PAYMENT BREAKDOWN */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ReceiptText className="h-4 w-4" />
                    <span className="text-xs">Billing Amount</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-slate-900">
                    {formatMoney(data.amount, data.currencyCode)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-xs">Paid Amount</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-emerald-600">
                    {formatMoney(data.paidAmount, data.currencyCode)}
                  </p>
                </div>
              </div>

              {/* BILLING INFORMATION */}
              <section>
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                  Billing Information
                </h3>

                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 px-4">
                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-sm">Due Date</span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900">
                      {formatBillingDate(data.dueDate)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <ReceiptText className="h-4 w-4" />
                      <span className="text-sm">Billing Cycle</span>
                    </div>

                    <span className="text-sm font-semibold capitalize text-slate-900">
                      {data.subscription.billingCycle.toLowerCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-sm">Payment Card</span>
                    </div>

                    <span className="text-right text-sm font-semibold text-slate-900">
                      {card?.nickname || card?.bank || "N/A"}
                      {card && (
                        <span className="ml-1 font-normal text-slate-500">
                          •••• {String(card.last_four_digit).padStart(4, "0")}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Bank</span>
                    </div>

                    <span className="text-sm font-semibold text-slate-900">
                      {card?.bank ?? "N/A"}
                    </span>
                  </div>
                </div>
              </section>

              {/* PAYMENT HISTORY */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <History className="h-4 w-4 text-slate-500" />
                    Payment History
                  </h3>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                    {data.payments?.length ?? 0} Records
                  </span>
                </div>

                {!data.payments?.length ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center">
                    <div className="mb-3 rounded-full bg-white p-3 text-slate-400 shadow-sm">
                      <History className="h-5 w-5" />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      No payment history yet
                    </p>

                    <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                      Payments recorded for this billing will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Payment #{payment.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {new Date(
                                payment.createdAt
                              ).toLocaleString("en-PH", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>

                        {payment.amount !== undefined && (
                          <span className="text-sm font-bold text-emerald-600">
                            {formatMoney(
                              payment.amount,
                              data.currencyCode
                            )}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* REMARKS */}
              {data.remarks && (
                <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-semibold text-slate-500">
                    Remarks
                  </p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {data.remarks}
                  </p>
                </section>
              )}
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
          <p className="text-xs text-slate-400">
            Billing #{billingId}
          </p>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
