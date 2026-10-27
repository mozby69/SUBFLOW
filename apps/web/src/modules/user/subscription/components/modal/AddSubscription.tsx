
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  FileText,
  Loader2,
  Plus,
  Settings2,
} from "lucide-react";

import {
  createSubscriptionSchema,
  type CreateSubscriptionFormInput,
  type CreateSubscriptionInput,
} from "@repo/shared";

interface CreditCardOption {
  id: number;
  bank: string;
  network: string;
  last_four_digit: number;
  status?: string;
}

interface AddModalSubscriptionProps {
  onClose: () => void;
  onSubmit: (
    values: CreateSubscriptionInput
  ) => Promise<void> | void;
  isSaving?: boolean;
  creditCards: CreditCardOption[];
}

const inputClass = `
  h-10 w-full rounded-[9px]
  border border-[#DCE2D9]
  bg-[#FCFCFA] px-3
  text-[13px] text-[#26342F]
  outline-none transition
  placeholder:text-[#A5ADA5]
  focus:border-[#8DAA98]
  focus:ring-2 focus:ring-[#8DAA98]/15
  disabled:cursor-not-allowed
  disabled:opacity-60
`;

const labelClass =
  "mb-1.5 block text-[12px] font-medium text-[#46574C]";

const errorClass = "mt-1 text-[11px] text-red-600";

export default function AddModalSubscription({
  onClose,
  onSubmit,
  isSaving = false,
  creditCards,
}: AddModalSubscriptionProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<
    CreateSubscriptionFormInput,
    unknown,
    CreateSubscriptionInput
  >({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: {
      subscriptionName: "",
      description: "",
      amount: 0,
      billingCycle: "MONTHLY",
      nextBilling: "",
      currencyCode: "PHP",
      category: "",
      status: "ACTIVE",
      creditCardId: 0,
      startDate: null,
      endDate: null,
      autoRenew: true,
      website: null,
    },
  });

  const busy = isSaving || isSubmitting;
  const currencyCode = watch("currencyCode");

  const submitForm = async (
    values: CreateSubscriptionInput
  ): Promise<void> => {
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 p-4"
      noValidate
    >
      <p className="text-[12px] leading-relaxed text-[#8A958C]">
        Add a recurring payment to monitor billing
        schedules and subscription expenses.
      </p>

      {/* SUBSCRIPTION DETAILS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <FileText size={16} className="text-[#526B5D]" />
          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Subscription Details
          </h3>
        </div>

        <div>
          <label htmlFor="subscription-name" className={labelClass}>
            Subscription Name *
          </label>
          <input
            id="subscription-name"
            {...register("subscriptionName")}
            placeholder="e.g. Netflix Premium"
            className={inputClass}
          />
          {errors.subscriptionName && (
            <p className={errorClass}>
              {errors.subscriptionName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subscription-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="subscription-description"
            {...register("description")}
            placeholder="Optional description"
            rows={3}
            className={`${inputClass} h-auto py-2`}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="subscription-amount" className={labelClass}>
              Amount ({currencyCode}) *
            </label>
            <input
              id="subscription-amount"
              type="number"
              min="0.01"
              step="0.01"
              {...register("amount")}
              placeholder="0.00"
              className={inputClass}
            />
            {errors.amount && (
              <p className={errorClass}>
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-currency" className={labelClass}>
              Currency *
            </label>
            <select
              id="subscription-currency"
              {...register("currencyCode")}
              className={inputClass}
            >
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label htmlFor="billing-cycle" className={labelClass}>
              Billing Cycle *
            </label>
            <select
              id="billing-cycle"
              {...register("billingCycle")}
              className={inputClass}
            >
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>

          <div>
            <label htmlFor="next-billing" className={labelClass}>
              First Billing Date *
            </label>
            <input
              id="next-billing"
              type="date"
              {...register("nextBilling")}
              className={inputClass}
            />
            {errors.nextBilling && (
              <p className={errorClass}>
                {errors.nextBilling.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-status" className={labelClass}>
              Status *
            </label>
            <select
              id="subscription-status"
              {...register("status")}
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="TRIAL">Trial</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* PAYMENT & ORGANIZATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <CreditCard size={16} className="text-[#526B5D]" />
          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Payment & Organization
          </h3>
        </div>

        <div>
          <label htmlFor="credit-card" className={labelClass}>
            Payment Card *
          </label>
          <select
            id="credit-card"
            {...register("creditCardId")}
            disabled={creditCards.length === 0}
            className={inputClass}
          >
            <option value="0">Select payment card</option>
            {creditCards
              .filter(
                (card) =>
                  !card.status || card.status === "ACTIVE"
              )
              .map((card) => (
                <option key={card.id} value={card.id}>
                  {card.bank} - {card.network} ••••
                  {String(card.last_four_digit).padStart(4, "0")}
                </option>
              ))}
          </select>

          {errors.creditCardId && (
            <p className={errorClass}>
              {errors.creditCardId.message}
            </p>
          )}

          {creditCards.length === 0 && (
            <p className="mt-2 text-xs text-amber-700">
              No credit cards available. Add a credit card first.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subscription-category" className={labelClass}>
            Category
          </label>
          <select
            id="subscription-category"
            {...register("category")}
            className={inputClass}
          >
            <option value="">Select category</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Software">Software</option>
            <option value="Productivity">Productivity</option>
            <option value="AI Tools">AI Tools</option>
            <option value="Cloud Storage">Cloud Storage</option>
            <option value="Design">Design</option>
            <option value="Communication">Communication</option>
          </select>
          {errors.category && (
            <p className={errorClass}>
              {errors.category.message}
            </p>
          )}
        </div>
      </section>

      {/* SUBSCRIPTION SETTINGS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <Settings2 size={16} className="text-[#526B5D]" />
          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Subscription Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start-date" className={labelClass}>
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              {...register("startDate", {
                setValueAs: (value) => value || null,
              })}
              className={inputClass}
            />
            {errors.startDate && (
              <p className={errorClass}>
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="end-date" className={labelClass}>
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              {...register("endDate", {
                setValueAs: (value) => value || null,
              })}
              className={inputClass}
            />
            {errors.endDate && (
              <p className={errorClass}>
                {errors.endDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="anchor-day" className={labelClass}>
              Billing Anchor Day
            </label>
            <input
              id="anchor-day"
              type="number"
              min="1"
              max="31"
              {...register("anchorDay", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
              placeholder="Defaults to first billing day"
              className={inputClass}
            />
            {errors.anchorDay && (
              <p className={errorClass}>
                {errors.anchorDay.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="subscription-website" className={labelClass}>
              Website
            </label>
            <input
              id="subscription-website"
              type="url"
              {...register("website", {
                setValueAs: (value) => value || null,
              })}
              placeholder="https://example.com"
              className={inputClass}
            />
            {errors.website && (
              <p className={errorClass}>
                {errors.website.message}
              </p>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-[12px] text-[#46574C]">
          <input
            type="checkbox"
            {...register("autoRenew")}
          />
          Automatically renew subscription
        </label>
      </section>

      {/* FOOTER */}
      <div className="flex flex-col-reverse gap-2 border-t border-[#E8EBE5] pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="h-10 rounded-[9px] border border-[#DCE2D9] bg-white px-5 text-[12px] font-medium text-[#526058] transition hover:bg-[#F2F4EF] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={busy || creditCards.length === 0}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#4F46E5] px-5 text-[12px] font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Plus size={16} />
              Save Subscription
            </>
          )}
        </button>
      </div>
    </form>
  );
}
