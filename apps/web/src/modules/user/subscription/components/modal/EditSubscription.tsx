

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import {
  addSubscriptionSchema,
  dateFormatter,
  type AddSubscriptionValues,
} from "@repo/shared";

import type { Subscription } from "@repo/shared";
import { useEffect } from "react";
import { useGetCreditCards } from "@/modules/user/credit-card/hooks/useCreditCard";

interface ModalEditSubscriptionProps {
  subscription: Subscription;
  onClose: () => void;
  onSubmit: (
    values: AddSubscriptionValues
  ) => Promise<void>;
  isSaving?: boolean;
}

export function formatBillingDate(
  value: string | null | undefined
): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return dateFormatter.format(date);
}

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
    formState: { errors, isSubmitting },
  } = useForm<AddSubscriptionValues>({
    resolver: zodResolver(addSubscriptionSchema),

    defaultValues: {
      subscriptionName: subscription.subscriptionName,
      amount: Number(subscription.amount),
      billingCycle: subscription.billingCycle,
      nextBilling: toDateInput(subscription.nextBilling),
      status: subscription.status,
      creditCardId: subscription.creditCardId,
      category: subscription.category,
      startDate: toDateInput(subscription.startDate),
      endDate: toDateInput(subscription.endDate),
      anchorDay: Number(subscription.anchorDay),
    },
  });

  useEffect(() => {
  reset({
    subscriptionName: subscription.subscriptionName,
    amount: Number(subscription.amount),
    billingCycle: subscription.billingCycle,
    nextBilling: toDateInput(subscription.nextBilling),
    status: subscription.status,
    creditCardId: subscription.creditCardId,
    category: subscription.category,
    startDate: toDateInput(subscription.startDate),
    endDate: toDateInput(subscription.endDate),
    anchorDay: Number(subscription.anchorDay),
  });
}, [subscription, reset]);

  const {
  data: creditCardResponse,
  isPending: isCardsLoading,
} = useGetCreditCards();

const creditCards = creditCardResponse?.data ?? [];

  const inputClass =
    "h-10 w-full rounded-lg border border-[#DCE2D9] bg-white px-3 text-[13px] text-[#26342F] outline-none transition focus:border-[#526B5D] focus:ring-2 focus:ring-[#526B5D]/10";

  const labelClass =
    "mb-1.5 block text-[12px] font-medium text-[#526057]";

  const errorClass =
    "mt-1 text-[11px] text-red-600";

  const submitting = isSaving || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-5"
    >
      <div>
        <h3 className="text-[15px] font-semibold text-[#26342F]">
          Subscription Information
        </h3>

        <p className="mt-1 text-[12px] text-[#8A958C]">
          Update the subscription details and billing information.
        </p>
      </div>

      {/* Subscription Name */}
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
        />

        {errors.subscriptionName && (
          <p className={errorClass}>
            {errors.subscriptionName.message}
          </p>
        )}
      </div>

      {/* Amount and Billing Cycle */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="edit-amount"
            className={labelClass}
          >
            Amount (PHP)
          </label>

          <input
            id="edit-amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register("amount", {
              valueAsNumber: true,
            })}
            className={inputClass}
          />

          {errors.amount && (
            <p className={errorClass}>
              {errors.amount.message}
            </p>
          )}
        </div>

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
      </div>


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          />

          {errors.nextBilling && (
            <p className={errorClass}>
              {errors.nextBilling.message}
            </p>
          )}
        </div>

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
      </div>

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
          {...register("creditCardId", {
            setValueAs: (value: string) =>
              value === "" ? 0 : Number(value),
          })}
          className={inputClass}
          disabled={isCardsLoading || submitting}
        >
          <option value="0">
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

      {/* Category */}
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




      {/* billing */}
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            {...register("startDate")}
            className={inputClass}
          />

          {errors.startDate && (
            <p className={errorClass}>
              {errors.startDate.message}
            </p>
          )}
        </div>

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
            {...register("endDate")}
            className={inputClass}
          />

          {errors.endDate && (
            <p className={errorClass}>
              {errors.endDate.message}
            </p>
          )}
        </div>

   
      </div>

      {/* billing */}


         <div>
          <label
            htmlFor="edit-start-date"
            className={labelClass}
          >
            Billing Anchor Day
          </label>

          <input
            id="edit-anchor-day"
            type="number"
            {...register("anchorDay")}
            className={inputClass}
          />

          {errors.anchorDay && (
            <p className={errorClass}>
              {errors.anchorDay.message}
            </p>
          )}
        </div>


      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-[#E3E7E0] pt-5">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#DCE2D9] px-4 text-[12px] font-medium text-[#526057] hover:bg-[#F2F4F0] disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#26342F] px-5 text-[12px] font-semibold text-white transition hover:bg-[#374B40] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} />

          {submitting
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}