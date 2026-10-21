
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { Billing } from "@repo/shared";

import {
  X,
  Wallet,
  CreditCard,
  CalendarDays,
  Hash,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { toast } from "sonner";

import { useRecordBillingPayment } from "../hooks/useBilling";

import {
  formatMoney,
  getOutstanding,
} from "../utils/billing.utils";

type Props = {
  billing: Billing | null;
  onClose: () => void;
};

type PaymentType = "FULL" | "PARTIAL";

function getLocalDate() {
  const now = new Date();

  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  );

  return local.toISOString().slice(0, 10);
}

export function RecordPaymentModal({
  billing,
  onClose,
}: Props) {
  if (!billing) return null;

  return (
    <RecordPaymentForm
      key={billing.id}
      billing={billing}
      onClose={onClose}
    />
  );
}

type FormProps = {
  billing: Billing;
  onClose: () => void;
};

function RecordPaymentForm({
  billing,
  onClose,
}: FormProps) {
  const outstanding = getOutstanding(billing);

  const [paymentType, setPaymentType] =
    useState<PaymentType>("FULL");

  const [amount, setAmount] = useState(
    () => outstanding.toFixed(2)
  );

  const [paymentDate, setPaymentDate] = useState(
    getLocalDate
  );

  const [referenceNumber, setReferenceNumber] =
    useState("");

  const [remarks, setRemarks] = useState("");

  const recordPayment = useRecordBillingPayment();

  const paymentAmount = Number(amount);

  const validAmount =
    amount.trim() !== "" &&
    Number.isFinite(paymentAmount) &&
    paymentAmount > 0 &&
    paymentAmount <= outstanding &&
    Math.abs(
      paymentAmount * 100 -
        Math.round(paymentAmount * 100)
    ) < 1e-7;

  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(paymentDate) &&
    !Number.isNaN(
      new Date(`${paymentDate}T00:00:00Z`).getTime()
    );

  const isValid =
    validAmount &&
    validDate &&
    billing.status !== "PAID" &&
    billing.status !== "CANCELLED";

  const remainingBalance = validAmount
    ? Math.max(0, outstanding - paymentAmount)
    : outstanding;

  const willBeFullyPaid =
    validAmount && remainingBalance < 0.005;

  function changePaymentType(type: PaymentType) {
    setPaymentType(type);

    if (type === "FULL") {
      setAmount(outstanding.toFixed(2));
    } else {
      setAmount("");
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!isValid || recordPayment.isPending) {
      toast.error("Please enter valid payment details");
      return;
    }

    try {
      await recordPayment.mutateAsync({
        billingId: billing.id,
        amount: paymentAmount,
        paymentDate,
        referenceNumber:
          referenceNumber.trim() || undefined,
        remarks: remarks.trim() || undefined,
      });

      toast.success("Payment recorded successfully");
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to record payment"
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-payment-title"
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="record-payment-title"
                className="text-lg font-bold text-slate-900"
              >
                Record Payment
              </h2>

              <p className="text-xs text-slate-500">
                Billing #{billing.id}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={recordPayment.isPending}
            aria-label="Close payment modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-5 overflow-y-auto p-6">
            {/* SUBSCRIPTION */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Subscription
              </p>

              <p className="mt-1 text-base font-bold text-slate-900">
                {billing.subscription.subscriptionName}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <CreditCard className="h-4 w-4" />

                <span>
                  {billing.subscription.card.bank}
                </span>

                <span>
                  ••••{" "}
                  {String(
                    billing.subscription.card.last_four_digit
                  ).padStart(4, "0")}
                </span>
              </div>
            </div>

            {/* AMOUNT SUMMARY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-500">
                  Billing Amount
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {formatMoney(
                    billing.amount,
                    billing.currencyCode
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                <p className="text-xs text-amber-700">
                  Outstanding Balance
                </p>

                <p className="mt-2 text-lg font-bold text-amber-800">
                  {formatMoney(
                    outstanding,
                    billing.currencyCode
                  )}
                </p>
              </div>
            </div>

            {/* PAYMENT TYPE */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-700">
                Payment Type
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={recordPayment.isPending}
                  onClick={() => changePaymentType("FULL")}
                  className={`rounded-xl border p-4 text-left transition ${
                    paymentType === "FULL"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle2
                    className={`mb-2 h-5 w-5 ${
                      paymentType === "FULL"
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    Full Payment
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pay remaining balance
                  </p>
                </button>

                <button
                  type="button"
                  disabled={recordPayment.isPending}
                  onClick={() => changePaymentType("PARTIAL")}
                  className={`rounded-xl border p-4 text-left transition ${
                    paymentType === "PARTIAL"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Wallet
                    className={`mb-2 h-5 w-5 ${
                      paymentType === "PARTIAL"
                        ? "text-emerald-600"
                        : "text-slate-400"
                    }`}
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    Partial Payment
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Enter custom amount
                  </p>
                </button>
              </div>
            </div>

            {/* PAYMENT AMOUNT */}
            <div>
              <label
                htmlFor="payment-amount"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Payment Amount
              </label>

              <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-emerald-500">
                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-600">
                  {billing.currencyCode}
                </span>

                <input
                  id="payment-amount"
                  type="number"
                  min="0.01"
                  max={outstanding}
                  step="0.01"
                  value={amount}
                  disabled={
                    paymentType === "FULL" ||
                    recordPayment.isPending
                  }
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  className="w-full px-4 py-3 text-sm font-semibold outline-none disabled:bg-slate-50"
                  placeholder="0.00"
                  required
                />
              </div>

              {!validAmount && amount !== "" && (
                <p className="mt-2 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Enter an amount greater than zero, with
                  at most two decimal places, not exceeding
                  the outstanding balance.
                </p>
              )}
            </div>

            {/* PAYMENT DATE + REFERENCE */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="payment-date"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <CalendarDays className="h-4 w-4" />
                  Payment Date
                </label>

                <input
                  id="payment-date"
                  type="date"
                  value={paymentDate}
                  onChange={(event) =>
                    setPaymentDate(event.target.value)
                  }
                  disabled={recordPayment.isPending}
                  required
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="payment-reference"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Hash className="h-4 w-4" />
                  Reference Number
                </label>

                <input
                  id="payment-reference"
                  type="text"
                  maxLength={100}
                  value={referenceNumber}
                  onChange={(event) =>
                    setReferenceNumber(event.target.value)
                  }
                  disabled={recordPayment.isPending}
                  placeholder="Optional reference"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* REMARKS */}
            <div>
              <label
                htmlFor="payment-remarks"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Remarks
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                id="payment-remarks"
                value={remarks}
                onChange={(event) =>
                  setRemarks(event.target.value)
                }
                disabled={recordPayment.isPending}
                rows={3}
                placeholder="Payment reference or notes..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            {/* PAYMENT PREVIEW */}
            <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Payment Summary
              </h3>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Payment Amount
                </span>

                <span className="font-semibold">
                  {formatMoney(
                    validAmount ? paymentAmount : 0,
                    billing.currencyCode
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  Remaining Balance
                </span>

                <span className="font-semibold">
                  {formatMoney(
                    remainingBalance,
                    billing.currencyCode
                  )}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3 text-sm">
                <span className="text-slate-500">
                  Resulting Status
                </span>

                <span
                  className={`font-semibold ${
                    !validAmount
                      ? "text-slate-500"
                      : willBeFullyPaid
                        ? "text-emerald-600"
                        : "text-amber-600"
                  }`}
                >
                  {!validAmount
                    ? "—"
                    : willBeFullyPaid
                      ? "PAID"
                      : "PARTIALLY PAID"}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white p-5">
            <button
              type="button"
              onClick={onClose}
              disabled={recordPayment.isPending}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid || recordPayment.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {recordPayment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}

              {recordPayment.isPending
                ? "Recording..."
                : "Record Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
