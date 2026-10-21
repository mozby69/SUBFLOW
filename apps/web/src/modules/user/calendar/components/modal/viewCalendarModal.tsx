
"use client";

import { CalendarDays, CreditCard } from "lucide-react";

type CalendarIndicator =
  | "PAID"
  | "OVERDUE"
  | "DUE_SOON"
  | "UPCOMING"
  | "CANCELLED";

interface CalendarBillingEvent {
  id: number;
  subscriptionName: string;
  subscriptionStatus: string;
  billingStatus: string;
  amount: number;
  paidAmount: number;
  currencyCode: string;
  calendarIndicator: CalendarIndicator;
  creditCard: {
    bank: string;
    network: string;
    lastFourDigit: number;
  };
}

interface ModalViewCalendarProps {
  selectedDate: string;
  events: CalendarBillingEvent[];
  onClose: () => void;
}

const statusStyles: Record<CalendarIndicator, string> = {
  PAID: "bg-blue-50 text-blue-700 border-blue-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
  DUE_SOON: "bg-amber-50 text-amber-700 border-amber-200",
  UPCOMING: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-slate-50 text-slate-600 border-slate-200",
};

function formatMoney(
  amount: number,
  currencyCode: string
): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export default function ModalViewCalendar({
  selectedDate,
  events,
  onClose,
}: ModalViewCalendarProps) {
  const formattedDate = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-5 p-5">
      <div className="border-b border-[#E8EBE5] pb-4">
        <div className="flex items-center gap-2">
          <CalendarDays
            size={17}
            className="text-[#526B5D]"
          />

          <h3 className="text-[15px] font-semibold text-[#26342F]">
            {formattedDate}
          </h3>
        </div>

        <p className="mt-2 text-[12px] text-[#8A958C]">
          {events.length} billing record(s) scheduled
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-[#E8EBE5] p-8 text-center">
          <CalendarDays
            size={28}
            className="mx-auto mb-3 text-[#9BA79E]"
          />

          <p className="text-[13px] text-[#8A958C]">
            No billing records for this date.
          </p>
        </div>
      ) : (
        <div className="max-h-[430px] space-y-3 overflow-y-auto">
          {events.map((event) => {
            const remaining = Math.max(
              0,
              event.amount - event.paidAmount
            );

            return (
              <div
                key={event.id}
                className="rounded-xl border border-[#E3E8E1] bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E9EEE8]">
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

                  <div className="text-right">
                    <p className="text-[15px] font-bold text-[#26342F]">
                      {formatMoney(
                        event.amount,
                        event.currencyCode
                      )}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-md border px-2.5 py-1 text-[10px] font-semibold ${
                        statusStyles[event.calendarIndicator]
                      }`}
                    >
                      {event.calendarIndicator.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#E8EBE5] pt-4 sm:grid-cols-3">
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

                    <p className="mt-1 text-[13px] font-semibold text-blue-700">
                      {formatMoney(
                        event.paidAmount,
                        event.currencyCode
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] text-[#8A958C]">
                      Remaining Balance
                    </p>

                    <p className="mt-1 text-[13px] font-semibold text-[#26342F]">
                      {formatMoney(
                        remaining,
                        event.currencyCode
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end border-t border-[#E8EBE5] pt-4">
        <button
          type="button"
          onClick={onClose}
          className="h-10 rounded-lg bg-[#26342F] px-6 text-[12px] font-semibold text-white transition hover:bg-[#374B40]"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export type { CalendarBillingEvent };
