
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,

} from "lucide-react";

import { useBillingCalendar } from "../hooks/useCalendar";


import type { CalendarBilling, CalendarIndicator } from "@repo/shared";
import Modal from "@/components/common/ModalHeader";

const weekdays = [
  "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
];

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format(amount);
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const indicatorStyles: Record<CalendarIndicator, string> = {
  PAID: "border-blue-100 bg-blue-50 text-blue-700",
  OVERDUE: "border-red-200 bg-red-50 text-red-700",
  DUE_SOON: "border-amber-200 bg-amber-50 text-amber-800",
  UPCOMING: "border-emerald-100 bg-emerald-50 text-emerald-800",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-500",
};

export default function CalendarView() {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const {
    data: calendar,
    isPending,
    isFetching,
    isError,
    refetch,
  } = useBillingCalendar({
    year,
    month: month + 1,
  });

  const today = toDateKey(new Date());

  const monthLabel = visibleMonth.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates: (Date | null)[] = [];

    for (let i = 0; i < firstWeekday; i++) {
      dates.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(new Date(year, month, day));
    }

    while (dates.length % 7 !== 0) {
      dates.push(null);
    }

    return dates;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const result = new Map<string, CalendarBilling[]>();

    for (const billing of calendar?.data ?? []) {
      const existing = result.get(billing.dueDate) ?? [];

      existing.push(billing);
      result.set(billing.dueDate, existing);
    }

    return result;
  }, [calendar]);

  const selectedEvents = selectedDate
    ? eventsByDate.get(selectedDate) ?? []
    : [];

  function navigateMonth(offset: number): void {
    setVisibleMonth(new Date(year, month + offset, 1));
    setSelectedDate(null);
  }

  function navigateToday(): void {
    const now = new Date();

    setVisibleMonth(
      new Date(now.getFullYear(), now.getMonth(), 1)
    );

    setSelectedDate(toDateKey(now));
  }


  const closeBillingModal = (): void => {
  setSelectedDate(null);
};

  return (
    <div className="w-full min-w-0 space-y-6 p-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DCE2D9] bg-[#E9EEE8]">
            <CalendarDays size={20} className="text-[#526B5D]" />
          </div>

          <div>
            <h1 className="text-[22px] font-semibold text-[#26342F]">
              Billing Calendar
            </h1>

            <p className="mt-1 text-[13px] text-[#8A958C]">
              Track scheduled subscription payments and due dates.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={navigateToday}
          className="rounded-lg border border-[#DCE2D9] bg-white px-4 py-2.5 text-xs font-medium text-[#526057] hover:bg-[#F2F4EF]"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Scheduled Bills"
          value={String(calendar?.summary.totalBills ?? 0)}
        />

        <SummaryCard
          title="Overdue Bills"
          value={String(calendar?.summary.overdueCount ?? 0)}
        />

        <SummaryCard
          title="Due Soon"
          value={String(calendar?.summary.dueSoonCount ?? 0)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E1E6DF] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8EBE5] px-5 py-5">
          <button
            type="button"
            onClick={() => navigateMonth(-1)}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E1E6DF] hover:bg-[#F2F4EF]"
          >
            <ChevronLeft size={17} />
          </button>

          <div className="text-center">
            <h2 className="text-[16px] font-semibold text-[#26342F]">
              {monthLabel}
            </h2>

            {isFetching && (
              <p className="mt-1 text-[10px] text-[#8A958C]">
                Updating calendar...
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigateMonth(1)}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E1E6DF] hover:bg-[#F2F4EF]"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        {isError && (
          <div className="flex items-center justify-between gap-3 border-b border-red-100 bg-red-50 p-4">
            <p className="text-xs text-red-700">
              Failed to load billing calendar.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="text-xs font-semibold text-red-700 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-175 p-4 sm:p-5">
            <div className="grid grid-cols-7 border-l border-t border-[#E5E9E4]">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="border-b border-r border-[#E5E9E4] bg-[#F7F9F6] py-3 text-center text-[11px] font-semibold text-[#526057]"
                >
                  {day}
                </div>
              ))}

              {cells.map((date, index) => {
                if (!date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-31.25 border-b border-r border-[#E5E9E4] bg-[#FAFBF9]"
                    />
                  );
                }

                const key = toDateKey(date);
                const events = eventsByDate.get(key) ?? [];
                const isToday = key === today;
                const isSelected = key === selectedDate;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDate(key)}
                    className={`min-h-31.25 min-w-0 border-b border-r border-[#E5E9E4] p-2 text-left align-top transition hover:bg-[#F7FAF7] ${
                      isSelected ? "bg-[#F0F6F0]" : "bg-white"
                    }`}
                  >
                    <span
                      className={`mb-2 flex h-7 w-7 items-center justify-center rounded-full text-[12px] ${
                        isToday
                          ? "bg-[#26342F] font-semibold text-white"
                          : "text-[#526057]"
                      }`}
                    >
                      {date.getDate()}
                    </span>

                    <div className="space-y-1.5">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`rounded-md border px-2 py-1.5 ${
                            indicatorStyles[event.calendarIndicator]
                          }`}
                        >
                          <p className="truncate text-[10px] font-medium">
                            {event.subscriptionName}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] font-semibold">
                            {formatMoney(event.amount, event.currencyCode)}
                          </p>
                        </div>
                      ))}

                      {events.length > 3 && (
                        <p className="pl-1 text-[10px] font-medium text-[#526B5D]">
                          +{events.length - 3} more
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 border-t border-[#E8EBE5] px-5 py-4">
          <Legend color="bg-blue-500" label="Paid" />
          <Legend color="bg-red-500" label="Overdue" />
          <Legend color="bg-amber-500" label="Due Soon" />
          <Legend color="bg-emerald-500" label="Upcoming" />
          <Legend color="bg-slate-400" label="Cancelled" />
        </div>
      </div>

                {/* modal */}



<Modal
  isOpen={selectedDate !== null}
  onClose={closeBillingModal}
  title="Billing Details"
  size="lg"
>
  <div className="space-y-5 p-5">

    <div className="border-b border-[#E8EBE5] pb-4">
      <p className="text-[12px] font-medium text-[#8A958C]">
        Billing Date
      </p>

      <h3 className="mt-1 text-[16px] font-semibold text-[#26342F]">
        {selectedDate
          ? new Date(
              `${selectedDate}T00:00:00`
            ).toLocaleDateString("en-PH", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : ""}
      </h3>

      <p className="mt-1 text-[12px] text-[#8A958C]">
        {selectedEvents.length} billing record(s)
      </p>
    </div>

    {/* Billing Records */}
    {selectedEvents.length === 0 ? (
      <div className="rounded-xl border border-[#E8EBE5] bg-[#F7F9F6] p-6 text-center">
        <CalendarDays
          size={24}
          className="mx-auto mb-3 text-[#8A958C]"
        />

        <p className="text-[13px] text-[#8A958C]">
          No billing records scheduled for this date.
        </p>
      </div>
    ) : (
      <div className="max-h-105 space-y-3 overflow-y-auto">
        {selectedEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-xl border border-[#E8EBE5] bg-white p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* Subscription Information */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E9EEE8]">
                  <CreditCard
                    size={19}
                    className="text-[#526B5D]"
                  />
                </div>

                <div>
                  <h4 className="text-[14px] font-semibold text-[#26342F]">
                    {event.subscriptionName}
                  </h4>

                  <p className="mt-1 text-[12px] text-[#8A958C]">
                    {event.creditCard.bank} ·{" "}
                    {event.creditCard.network} ••••{" "}
                    {String(
                      event.creditCard.lastFourDigit
                    ).padStart(4, "0")}
                  </p>

                  <p className="mt-2 text-[11px] text-[#8A958C]">
                    Subscription: {event.subscriptionStatus}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8A958C]">
                    Billing: {event.billingStatus}
                  </p>
                </div>
              </div>

              {/* Amount and Status */}
              <div className="text-right">
                <p className="text-[16px] font-bold text-[#26342F]">
                  {formatMoney(
                    event.amount,
                    event.currencyCode
                  )}
                </p>

                <span
                  className={`mt-2 inline-flex rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
                    indicatorStyles[event.calendarIndicator]
                  }`}
                >
                  {event.calendarIndicator.replaceAll(
                    "_",
                    " "
                  )}
                </span>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#E8EBE5] pt-4">
              <div>
                <p className="text-[11px] text-[#8A958C]">
                  Billing Amount
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#26342F]">
                  {formatMoney(
                    event.amount,
                    event.currencyCode
                  )}
                </p>
              </div>

              <div>
                <p className="text-[11px] text-[#8A958C]">
                  Paid Amount
                </p>

                <p className="mt-1 text-[13px] font-semibold text-[#26342F]">
                  {formatMoney(
                    event.paidAmount,
                    event.currencyCode
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Footer */}
    <div className="flex justify-end border-t border-[#E8EBE5] pt-4">
      <button
        type="button"
        onClick={closeBillingModal}
        className="h-10 rounded-lg bg-[#26342F] px-6 text-[12px] font-semibold text-white transition hover:bg-[#374B40]"
      >
        Close
      </button>
    </div>
  </div>
</Modal>




      <p className="text-[11px] text-[#8A958C]">
        Showing actual subscription billing records based on their due dates.
        {isPending ? " Loading..." : ""}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#E1E6DF] bg-white p-5 shadow-sm">
      <p className="text-[12px] font-medium text-[#8A958C]">
        {title}
      </p>

      <p className="mt-3 text-[24px] font-semibold tracking-tight text-[#26342F]">
        {value}
      </p>
    </div>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      <span className="text-[11px] text-[#526057]">{label}</span>
    </div>
  );
}
