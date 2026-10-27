
import {
  AlertCircle,
  CheckCircle2,
  Receipt,
  Wallet,
} from "lucide-react";

import {
  formatMoney,
  getEffectiveStatus,
  getOutstanding,
} from "../utils/billing.utils";
import { Billing } from "@repo/shared";

type Props = {
  billings: Billing[];
  totalRecords: number;
};

export function BillingSummaryCards({
  billings,
  totalRecords,
}: Props) {
  const active = billings.filter(
    (billing) => billing.status !== "CANCELLED"
  );

  const paid = active.reduce(
    (sum, billing) => sum + Number(billing.paidAmount),
    0
  );

  const outstanding = active.reduce(
    (sum, billing) => sum + getOutstanding(billing),
    0
  );

  const overdue = active
    .filter(
      (billing) => getEffectiveStatus(billing) === "OVERDUE"
    )
    .reduce(
      (sum, billing) => sum + getOutstanding(billing),
      0
    );

  const cards = [
    {
      label: "Total Records",
      value: totalRecords.toLocaleString(),
      icon: Receipt,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Paid Amount",
      value: formatMoney(paid),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Outstanding",
      value: formatMoney(outstanding),
      icon: Wallet,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Overdue",
      value: formatMoney(overdue),
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {card.label}
              </p>

              <div className={`rounded-xl p-2.5 ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
