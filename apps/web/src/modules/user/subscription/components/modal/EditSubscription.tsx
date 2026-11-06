
"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, X } from "lucide-react";

import {
  createSubscriptionSchema,
  UpdateSubscriptionSchema,
  type CreateSubscriptionFormInput,
  type CreateSubscriptionInput,
  type Subscription,
} from "@repo/shared";

import { useGetCreditCards } from "@/modules/user/credit-card/hooks/useCreditCard";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface ModalEditSubscriptionProps {
  subscription: Subscription;
  onClose: () => void;
   onSubmit: (values: UpdateSubscriptionSchema) => Promise<void>;
  isSaving?: boolean;
}

// --------------------------------------------------
// DATE HELPER
// --------------------------------------------------

function toDateInput(
  value: string | number | Date | null | undefined
): string {
  if (value == null || value === "") {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

// --------------------------------------------------
// DEFAULT VALUES
// --------------------------------------------------

function getSubscriptionDefaults(
  subscription: Subscription
): CreateSubscriptionFormInput {
  return {
    subscriptionName: subscription.subscriptionName,

    description: subscription.description ?? null,

    amount: Number(subscription.amount),

    currencyCode: subscription.currencyCode ?? "PHP",

    billingCycle: subscription.billingCycle,

    nextBilling: toDateInput(subscription.nextBilling),

    status: subscription.status,

    creditCardId: subscription.creditCardId,

    category: subscription.category ?? null,

    categoryId: subscription.categoryId ?? null,

    startDate:
      toDateInput(subscription.startDate) || null,

    endDate:
      toDateInput(subscription.endDate) || null,

    anchorDay: Number(subscription.anchorDay),

    autoRenew: subscription.autoRenew,

    website: subscription.website ?? null,
  };
}

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function ModalEditSubscription({
  subscription,
  onClose,
  onSubmit,
  isSaving = false,
}: ModalEditSubscriptionProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<
    CreateSubscriptionFormInput,
    unknown,
    CreateSubscriptionInput
  >({
    resolver: zodResolver(createSubscriptionSchema),
    defaultValues: getSubscriptionDefaults(subscription),
  });

  // Reset when selected subscription changes
  useEffect(() => {
    reset(getSubscriptionDefaults(subscription));
  }, [subscription, reset]);

  // Watch selected currency
  const currencyCode = useWatch({
    control,
    name: "currencyCode",
  });

  const {
    data: creditCardResponse,
    isPending: isCardsLoading,
  } = useGetCreditCards();

  const creditCards = creditCardResponse?.data ?? [];

  const submitting = isSaving || isSubmitting;

  // --------------------------------------------------
  // STYLES
  // --------------------------------------------------

  const inputClass =
    "h-10 w-full rounded-lg border border-[#DCE2D9] " +
    "bg-white px-3 text-[13px] text-[#26342F] " +
    "outline-none transition " +
    "focus:border-[#526B5D] " +
    "focus:ring-2 focus:ring-[#526B5D]/10 " +
    "disabled:cursor-not-allowed " +
    "disabled:bg-slate-50 disabled:opacity-70";

  const labelClass =
    "mb-1.5 block text-[12px] font-medium text-[#526057]";

  const errorClass =
    "mt-1 text-[11px] text-red-600";

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------


const handleEditSubmit = async (
  values: CreateSubscriptionInput
): Promise<void> => {
  const updateValues: UpdateSubscriptionSchema = {
    subscriptionName: values.subscriptionName,
    amount: values.amount,
    currencyCode: values.currencyCode,
    billingCycle: values.billingCycle,
    nextBilling: values.nextBilling,
    status: values.status,
    creditCardId: values.creditCardId,
    category: values.category ?? "",
    description: values.description ?? null,
    startDate: values.startDate ?? null,
    endDate: values.endDate ?? null,
    anchorDay: values.anchorDay,
    autoRenew: values.autoRenew,
    website: values.website ?? null,
  };

  await onSubmit(updateValues);
};


  return (
    <form
     onSubmit={handleSubmit(handleEditSubmit)}
      className="space-y-5 p-5"
    >
      {/* HEADER */}
      <div>
        <h3 className="text-[15px] font-semibold text-[#26342F]">
          Subscription Information
        </h3>

        <p className="mt-1 text-[12px] text-[#8A958C]">
          Update subscription details, payment information,
          and billing preferences.
        </p>
      </div>

      {/* SUBSCRIPTION NAME */}
      <div>
        <label
          htmlFor="edit-subscription-name"
          className={labelClass}
        >
          Subscription Name
        </label>

        <input
          id="edit-subscription-name"
          {...register("subscriptionName")}
          className={inputClass}
          placeholder="e.g. Netflix Premium"
          disabled={submitting}
        />

        {errors.subscriptionName && (
          <p className={errorClass}>
            {errors.subscriptionName.message}
          </p>
        )}
      </div>

      {/* DESCRIPTION */}
      <div>
        <label
          htmlFor="edit-description"
          className={labelClass}
        >
          Description
        </label>

        <textarea
          id="edit-description"
          {...register("description")}
          rows={3}
          placeholder="Optional subscription description"
          disabled={submitting}
          className={
            "w-full rounded-lg border border-[#DCE2D9] " +
            "bg-white px-3 py-2 text-[13px] text-[#26342F] " +
            "outline-none focus:border-[#526B5D] " +
            "focus:ring-2 focus:ring-[#526B5D]/10"
          }
        />

        {errors.description && (
          <p className={errorClass}>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* AMOUNT AND CURRENCY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* AMOUNT */}
        <div>
          <label
            htmlFor="edit-amount"
            className={labelClass}
          >
            Amount ({currencyCode || "PHP"})
          </label>

          <input
            id="edit-amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register("amount")}
            className={inputClass}
            disabled={submitting}
          />

          {errors.amount && (
            <p className={errorClass}>
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* CURRENCY */}
        <div>
          <label
            htmlFor="edit-currency"
            className={labelClass}
          >
            Currency
          </label>

          <select
            id="edit-currency"
            {...register("currencyCode")}
            className={inputClass}
            disabled={submitting}
          >
            <option value="PHP">
              PHP - Philippine Peso
            </option>

            <option value="USD">
              USD - US Dollar
            </option>

            <option value="EUR">
              EUR - Euro
            </option>

            <option value="GBP">
              GBP - British Pound
            </option>
          </select>

          {errors.currencyCode && (
            <p className={errorClass}>
              {errors.currencyCode.message}
            </p>
          )}
        </div>
      </div>

      {/* BILLING CYCLE AND NEXT BILLING */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* BILLING CYCLE */}
        <div>
          <label
            htmlFor="edit-billing-cycle"
            className={labelClass}
          >
            Billing Cycle
          </label>

          <select
            id="edit-billing-cycle"
            {...register("billingCycle")}
            className={inputClass}
            disabled={submitting}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="YEARLY">Yearly</option>
          </select>

          {errors.billingCycle && (
            <p className={errorClass}>
              {errors.billingCycle.message}
            </p>
          )}
        </div>

        {/* NEXT BILLING */}
        <div>
          <label
            htmlFor="edit-next-billing"
            className={labelClass}
          >
            Next Billing Date
          </label>

          <input
            id="edit-next-billing"
            type="date"
            {...register("nextBilling")}
            className={inputClass}
            disabled={submitting}
          />

          {errors.nextBilling && (
            <p className={errorClass}>
              {errors.nextBilling.message}
            </p>
          )}
        </div>
      </div>

      {/* STATUS AND CATEGORY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* STATUS */}
        <div>
          <label
            htmlFor="edit-status"
            className={labelClass}
          >
            Status
          </label>

          <select
            id="edit-status"
            {...register("status")}
            className={inputClass}
            disabled={submitting}
          >
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="TRIAL">Trial</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {errors.status && (
            <p className={errorClass}>
              {errors.status.message}
            </p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <label
            htmlFor="edit-category"
            className={labelClass}
          >
            Category
          </label>

          <select
            id="edit-category"
            {...register("category")}
            className={inputClass}
            disabled={submitting}
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
      </div>

      {/* PAYMENT CREDIT CARD */}
      <div>
        <label
          htmlFor="edit-credit-card"
          className={labelClass}
        >
          Payment Credit Card
          <span className="ml-1 text-red-500">*</span>
        </label>

        <select
          id="edit-credit-card"
          {...register("creditCardId")}
          className={inputClass}
          disabled={isCardsLoading || submitting}
        >
          <option value="">
            {isCardsLoading
              ? "Loading credit cards..."
              : "Select a credit card"}
          </option>

          {creditCards.map((card) => (
            <option
              key={card.id}
              value={card.id}
            >
              {card.bank} - {card.network.toUpperCase()}
              {" •••• "}
              {String(card.last_four_digit).padStart(4, "0")}
              {card.nickname ? ` (${card.nickname})` : ""}
            </option>
          ))}
        </select>

        {errors.creditCardId && (
          <p className={errorClass}>
            {errors.creditCardId.message}
          </p>
        )}
      </div>

      {/* START DATE AND END DATE */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* START DATE */}
        <div>
          <label
            htmlFor="edit-start-date"
            className={labelClass}
          >
            Start Date
          </label>

          <input
            id="edit-start-date"
            type="date"
            {...register("startDate", {
              setValueAs: (value: string) =>
                value === "" ? null : value,
            })}
            className={inputClass}
            disabled={submitting}
          />

          {errors.startDate && (
            <p className={errorClass}>
              {errors.startDate.message}
            </p>
          )}
        </div>

        {/* END DATE */}
        <div>
          <label
            htmlFor="edit-end-date"
            className={labelClass}
          >
            End Date
          </label>

          <input
            id="edit-end-date"
            type="date"
            {...register("endDate", {
              setValueAs: (value: string) =>
                value === "" ? null : value,
            })}
            className={inputClass}
            disabled={submitting}
          />

          {errors.endDate && (
            <p className={errorClass}>
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      {/* ANCHOR DAY */}
      <div>
        <label
          htmlFor="edit-anchor-day"
          className={labelClass}
        >
          Billing Anchor Day
        </label>

        <input
          id="edit-anchor-day"
          type="number"
          min={1}
          max={31}
          {...register("anchorDay", {
            setValueAs: (value: string) =>
              value === "" ? undefined : Number(value),
          })}
          className={inputClass}
          disabled={submitting}
        />

        <p className="mt-1 text-[11px] text-[#8A958C]">
          Day of the month used to calculate recurring billing dates.
        </p>

        {errors.anchorDay && (
          <p className={errorClass}>
            {errors.anchorDay.message}
          </p>
        )}
      </div>

      {/* AUTO RENEW */}
      <div className="flex items-center justify-between rounded-xl border border-[#E3E7E0] bg-[#F8FAF7] p-4">
        <div>
          <p className="text-[13px] font-medium text-[#26342F]">
            Auto Renew
          </p>

          <p className="mt-1 text-[11px] text-[#8A958C]">
            Enable automatic subscription renewal.
          </p>
        </div>

        <input
          type="checkbox"
          {...register("autoRenew")}
          disabled={submitting}
          className="h-4 w-4 accent-[#526B5D]"
        />
      </div>

      {/* WEBSITE */}
      <div>
        <label
          htmlFor="edit-website"
          className={labelClass}
        >
          Website
        </label>

        <input
          id="edit-website"
          type="url"
          {...register("website", {
            setValueAs: (value: string) =>
              value === "" ? null : value,
          })}
          className={inputClass}
          placeholder="https://example.com"
          disabled={submitting}
        />

        {errors.website && (
          <p className={errorClass}>
            {errors.website.message}
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 border-t border-[#E3E7E0] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DCE2D9] px-4 text-[12px] font-medium text-[#526057] transition hover:bg-[#F2F4F0] disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || !isDirty}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#4F46E5] px-5 text-[12px] font-semibold text-white transition hover:bg-[#4338CA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}

          {submitting ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
