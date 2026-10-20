



"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";

import {
  addSubscriptionSchema,
  CreditCard2,
  type AddSubscriptionInput,
  type AddSubscriptionValues,
} from "@repo/shared"; 
import { useGetCreditCards } from "../../hooks/useSubscription";


interface AddModalSubscriptionProps {
  onClose: () => void;
  onSubmit: (values: AddSubscriptionValues) => Promise<void> | void;
  isSaving?: boolean;
  creditCards: CreditCard2[];
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

const errorClass =
  "mt-1 text-[11px] text-red-600";

export default function AddModalSubscription({
  onClose,
  onSubmit,
  isSaving = false,
  creditCards,
}: AddModalSubscriptionProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<
    AddSubscriptionInput,
    unknown,
    AddSubscriptionValues
  >({
    resolver: zodResolver(addSubscriptionSchema),
    defaultValues: {
      subscriptionName: "",
      amount: 0,
      billingCycle: "MONTHLY",
      nextBilling: "",
      status: "ACTIVE",
      category: "",
      creditCardId:0,
    },
  });

  const busy = isSaving || isSubmitting;

  const submitForm = async (
    values: AddSubscriptionValues
  ) => {
    await onSubmit(values);

  };




  const {
    data: creditCardResponse,
    isPending: isCardsLoading,
    isError: isCardsError,
  } = useGetCreditCards();

  const creditCards2 = creditCardResponse?.data ?? [];

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 p-4"
      noValidate
    >
      {/* Introduction */}
      <p className="text-[12px] leading-relaxed text-[#8A958C]">
        Add a recurring payment to monitor billing
        schedules and subscription expenses.
      </p>

      {/* Subscription Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <FileText
            size={16}
            className="text-[#526B5D]"
          />
          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Subscription Details
          </h3>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="subscription-name"
            className={labelClass}
          >
            Subscription Name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="subscription-name"
            {...register("subscriptionName")}
            placeholder="e.g. Netflix Premium"
            aria-invalid={!!errors.subscriptionName}
            className={inputClass}
          />

          {errors.subscriptionName && (
            <p className={errorClass}>
              {errors.subscriptionName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Amount */}
          <div>
            <label
              htmlFor="subscription-amount"
              className={labelClass}
            >
              Amount (PHP) *
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#8A958C]">
                ₱
              </span>

              <input
                id="subscription-amount"
                type="number"
                min="0.01"
                step="0.01"
                {...register("amount")}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
              />
            </div>

            {errors.amount && (
              <p className={errorClass}>
                {errors.amount.message}
              </p>
            )}
          </div>

          {/* Billing Cycle */}
          <div>
            <label
              htmlFor="billing-cycle"
              className={labelClass}
            >
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

          {/* Next Billing */}
          <div>
            <label
              htmlFor="next-billing"
              className={labelClass}
            >
              Next Billing *
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

          {/* Status */}
          <div>
            <label
              htmlFor="subscription-status"
              className={labelClass}
            >
              Status *
            </label>

            <select
              id="subscription-status"
              {...register("status")}
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="DUE_SOON">Due soon</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Payment & Organization */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <CreditCard
            size={16}
            className="text-[#526B5D]"
          />
          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Payment & Organization
          </h3>
        </div>

        {/* Payment Card */}
        <div>
  <label htmlFor="credit-card" className={labelClass}>
    Payment Card <span className="text-red-500">*</span>
  </label>

  <select
    id="credit-card"
    {...register("creditCardId")}
    disabled={isCardsLoading || isCardsError}
    className={inputClass}
  >
    <option value="">
      {isCardsLoading
        ? "Loading credit cards..."
        : isCardsError
          ? "Unable to load credit cards"
          : "Select payment card"}
    </option>

    {creditCards2.map((card) => (
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

  {!isCardsLoading && !isCardsError && creditCards.length === 0 && (
    <p className="mt-2 text-xs text-amber-700">
      No credit cards available. Add a credit card first.
    </p>
  )}
</div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Category */}
          <div>
            <label
              htmlFor="subscription-category"
              className={labelClass}
            >
              Category *
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

          {/* Department */}
          {/* <div>
            <label
              htmlFor="subscription-department"
              className={labelClass}
            >
              Department *
            </label>

            <select
              id="subscription-department"
              {...register("department")}
              className={inputClass}
            >
              <option value="">Select department</option>
              <option value="Personal">MIS</option>
              <option value="IT">AUDIT</option>
              <option value="Marketing">MANAGEMENT</option>
              <option value="Administration">FINANCIAL</option>
            </select>

            {errors.department && (
              <p className={errorClass}>
                {errors.department.message}
              </p>
            )}
          </div> */}
        </div>
      </section>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse gap-2 border-t border-[#E8EBE5] pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="
            h-10 rounded-[9px]
            border border-[#DCE2D9]
            bg-white px-5 text-[12px]
            font-medium text-[#526058]
            transition hover:bg-[#F2F4EF]
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={busy}
          className="
            inline-flex h-10 items-center justify-center
            gap-2 rounded-[9px]
            bg-[#26342F] px-5
            text-[12px] font-semibold text-white
            transition hover:bg-[#374B40]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
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
