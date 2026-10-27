
"use client";

import { BillingQuery, BillingStatus } from "@repo/shared";



type Props = {
  filters: BillingQuery;
  onChange: (filters: BillingQuery) => void;
};

export function BillingFilters({
  filters,
  onChange,
}: Props) {
  function updateFilters(
    patch: Partial<BillingQuery>
  ) {
    onChange({
      ...filters,
      ...patch,
      page: 1,
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="min-w-[170px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          Billing Status
        </label>

        <select
          value={filters.status ?? ""}
          onChange={(event) =>
            updateFilters({
              status:
                (event.target.value as BillingStatus) ||
                undefined,
            })
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="min-w-[160px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          From Date
        </label>

        <input
          type="date"
          value={filters.fromDate ?? ""}
          onChange={(event) =>
            updateFilters({
              fromDate: event.target.value || undefined,
            })
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <div className="min-w-[160px] flex-1">
        <label className="mb-1.5 block text-xs font-medium text-slate-500">
          To Date
        </label>

        <input
          type="date"
          value={filters.toDate ?? ""}
          onChange={(event) =>
            updateFilters({
              toDate: event.target.value || undefined,
            })
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <button
        type="button"
        onClick={() =>
          onChange({
            page: 1,
            limit: filters.limit ?? 10,
          })
        }
        className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
      >
        Reset
      </button>
    </div>
  );
}
