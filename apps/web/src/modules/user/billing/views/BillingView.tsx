
"use client";

import { useState } from "react";
import { CalendarPlus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useCancelBilling, useGetBillings } from "../hooks/useBilling";


import { BillingSummaryCards } from "../components/BillingSummaryCards";
import { BillingFilters } from "../components/BillingFilters";
import { BillingTable } from "../components/BillingTable";
import { BillingDetailsModal } from "../components/BillingDetailsModal";
import { GenerateBillingModal } from "../components/GenerateBillingModal";
import { Billing, BillingQuery } from "@repo/shared";
import { RecordPaymentModal } from "../components/RecordPaymentModal";

export default function BillingView() {
  const [filters, setFilters] = useState<BillingQuery>({
    page: 1,
    limit: 10,
  });

  const [selectedBillingId, setSelectedBillingId] =
    useState<number | null>(null);

  const [isGenerateOpen, setIsGenerateOpen] =
    useState(false);

    const [paymentBilling, setPaymentBilling] =
  useState<Billing | null>(null);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetBillings(filters);

  const cancelBilling = useCancelBilling();

  async function handleCancel(billing: Billing) {
    const confirmed = window.confirm(
      `Cancel billing #${billing.id} for ${billing.subscription.subscriptionName}?`
    );

    if (!confirmed) return;

    try {
      await cancelBilling.mutateAsync(billing.id);

      toast.success("Billing cancelled successfully");
    } catch {
      toast.error("Failed to cancel billing");
    }
  }

  return (
     <div className="w-full min-w-0 min-h-full  p-4 md:p-6 lg:p-8">
    <div className="w-full min-w-0 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
             <h1 className="text-[22px] font-semibold tracking-tight text-[#26342F]">
              Billing Management
            </h1>
          <p className="mt-1 text-[13px] text-[#8A958C]">
              Monitor subscription billings, payments,
              and upcoming due dates.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isFetching ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setIsGenerateOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <CalendarPlus className="h-4 w-4" />
              Generate Billings
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <BillingFilters
          filters={filters}
          onChange={setFilters}
        />

        {/* LOADING */}
        {isLoading && (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading billings...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            Failed to load billing records. Please retry.
          </div>
        )}

        {/* BILLING DATA */}
        {data && !isError && (
          <>
            <BillingSummaryCards
              billings={data.data}
              totalRecords={data.pagination.total}
            />

            <BillingTable
              billings={data.data}
              pagination={data.pagination}
              onPageChange={(page) =>
                setFilters((previous) => ({
                  ...previous,
                  page,
                }))
              }
              onView={setSelectedBillingId}
              onCancel={handleCancel}
            onPay={setPaymentBilling}
              isCancelling={cancelBilling.isPending}
            />
          </>
        )}

        {/* MODALS */}
        <BillingDetailsModal
          billingId={selectedBillingId}
          onClose={() => setSelectedBillingId(null)}
        />

        <GenerateBillingModal
          open={isGenerateOpen}
          onClose={() => setIsGenerateOpen(false)}
        />

        <RecordPaymentModal
            billing={paymentBilling}
            onClose={() => setPaymentBilling(null)}
        />
      </div>
    </div>
  );
}
