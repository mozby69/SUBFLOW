
"use client";

import { Eye, Wallet, XCircle } from "lucide-react";



import {
  formatBillingDate,
  formatMoney,
  getEffectiveStatus,
  getOutstanding,
} from "../utils/billing.utils";
import { Billing, BillingPagination } from "@repo/shared";

type Props = {
  billings: Billing[];
  pagination: BillingPagination;
  onPageChange: (page: number) => void;
  onView: (id: number) => void;
  onCancel: (billing: Billing) => void;
  onPay: (billing: Billing) => void;
  isCancelling: boolean;
};

const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-50 text-blue-700",
  PAID: "bg-emerald-50 text-emerald-700",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700",
  OVERDUE: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export function BillingTable({
  billings,
  pagination,
  onPageChange,
  onView,
  onCancel,
  onPay,
  isCancelling,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-900">
          Billing Records
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {pagination.total} billing records found
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">Subscription</th>
              <th className="px-5 py-4">Credit Card</th>
              <th className="px-5 py-4">Due Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Outstanding</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {billings.map((billing) => {
              const status = getEffectiveStatus(billing);

              return (
                <tr
                  key={billing.id}
                  className="hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {billing.subscription.subscriptionName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      #{billing.id} ·{" "}
                      {billing.subscription.billingCycle}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">
                      {billing.subscription.card.bank}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      ••••{" "}
                      {String(
                        billing.subscription.card.last_four_digit
                      ).padStart(4, "0")}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatBillingDate(billing.dueDate)}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-900">
                    {formatMoney(
                      billing.amount,
                      billing.currencyCode
                    )}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-700">
                    {formatMoney(
                      getOutstanding(billing),
                      billing.currencyCode
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        statusColors[status]
                      }`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onView(billing.id)}
                        title="View details"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {billing.status !== "PAID" &&
                            billing.status !== "CANCELLED" &&
                            getOutstanding(billing) > 0 && (
                                <button
                                type="button"
                                onClick={() => onPay(billing)}
                                title="Record payment"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                                >
                                <Wallet className="h-4 w-4" />
                                Record Payment
                                </button>
                            )}

                      {billing.status === "SCHEDULED" &&
                        Number(billing.paidAmount) === 0 && (
                          <button
                            type="button"
                            disabled={isCancelling}
                            onClick={() => onCancel(billing)}
                            title="Cancel billing"
                            className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {billings.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No billing records found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 p-4">
        <p className="text-xs text-slate-500">
          Page {pagination.page} of{" "}
          {Math.max(1, pagination.totalPages)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() =>
              onPageChange(pagination.page - 1)
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={
              pagination.page >= pagination.totalPages
            }
            onClick={() =>
              onPageChange(pagination.page + 1)
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
