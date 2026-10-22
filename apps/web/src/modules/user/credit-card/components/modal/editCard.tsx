"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  Building2,
  Loader2,
  Save,
} from "lucide-react";

import {
  CreditCard2,
  creditCardSchema,
  type CreditCardSchema,
} from "@repo/shared";


interface EditCardProps {
  card: CreditCard2;
  onClose: () => void;
  onSubmit: (values: CreditCardSchema) => Promise<void>;
  isSaving?: boolean;
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

export default function EditCard({
  card,
  onClose,
  onSubmit,
  isSaving = false,
}: EditCardProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<CreditCardSchema>({
    resolver: zodResolver(creditCardSchema),

    defaultValues: {
      bank: card.bank,
      last_four_digit: card.last_four_digit,
      network: card.network,
      nickname: card.nickname ?? "",
      creditLimit: card.creditLimit ?? 0,
      currencyCode: card.currencyCode,
      statementDay: card.statementDay ?? 0,
      dueDay: card.dueDay ?? 0,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      status: card.status,
    },
  });

  const busy = isSaving || isSubmitting;

  const submitForm = async (
    values: CreditCardSchema
  ): Promise<void> => {
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 p-5"
      noValidate
    >
      <p className="text-[12px] leading-relaxed text-[#8A958C]">
        Update your credit card information.
        Changes will be reflected across your workspace.
      </p>

      {/* Section heading */}
      <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
        <CreditCard
          size={17}
          className="text-[#526B5D]"
        />

        <h3 className="text-[13px] font-semibold text-[#26342F]">
          Card Information
        </h3>
      </div>

      {/* Bank */}
      <div>
        <label htmlFor="edit-bank" className={labelClass}>
          Bank Name <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <Building2
            size={16}
            className="absolute left-3 top-3 text-[#8A958C]"
          />

          <input
            id="edit-bank"
            {...register("bank")}
            placeholder="e.g. BDO, BPI, Metrobank"
            className={`${inputClass} pl-10`}
            aria-invalid={!!errors.bank}
          />
        </div>

        {errors.bank && (
          <p className={errorClass}>
            {errors.bank.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Last four digits */}
        <div>
          <label
            htmlFor="edit-last-four"
            className={labelClass}
          >
            Last 4 Digits *
          </label>

          <input
            id="edit-last-four"
            type="text"
            inputMode="numeric"
            maxLength={4}
            {...register("last_four_digit")}
            placeholder="e.g. 4242"
            className={inputClass}
            aria-invalid={!!errors.last_four_digit}
          />

          {errors.last_four_digit && (
            <p className={errorClass}>
              {errors.last_four_digit.message}
            </p>
          )}
        </div>

        {/* Network */}
        <div>
          <label
            htmlFor="edit-network"
            className={labelClass}
          >
            Card Network *
          </label>

          <select
            id="edit-network"
            {...register("network")}
            className={inputClass}
          >
            <option value="">Select network</option>
            <option value="VISA">Visa</option>
            <option value="MASTERCARD">Mastercard</option>
            <option value="AMEX">American Express</option>
            <option value="JCB">JCB</option>
            <option value="UNIONPAY">UnionPay</option>
          </select>

          {errors.network && (
            <p className={errorClass}>
              {errors.network.message}
            </p>
          )}
        </div>
      </div>

      {/* Nickname */}
      <div>
        <label
          htmlFor="edit-nickname"
          className={labelClass}
        >
          Card Nickname
          <span className="ml-1 text-[#A5ADA5]">
            (Optional)
          </span>
        </label>

        <input
          id="edit-nickname"
          {...register("nickname")}
          placeholder="e.g. Personal Expenses"
          className={inputClass}
        />

        {errors.nickname && (
          <p className={errorClass}>
            {errors.nickname.message}
          </p>
        )}

        <p className="mt-1.5 text-[11px] text-[#9AA49B]">
          A friendly name to help identify this card.
        </p>
      </div>

      {/*credit limit currency */}


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label
            htmlFor="edit-credit-limit"
            className={labelClass}
          >
            Credit Limit
          </label>

          <input
            id="edit-credit-limit"
            type="number"
            inputMode="numeric"
            maxLength={4}
            {...register("creditLimit")}
            className={inputClass}
            aria-invalid={!!errors.creditLimit}
          />

          {errors.creditLimit && (
            <p className={errorClass}>
              {errors.creditLimit.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="edit-currency-code"
            className={labelClass}
          >
            Currency
          </label>

          <select
            id="edit-currency-code"
            {...register("currencyCode")}
            className={inputClass}>
            <option value="">Select currency</option>
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>

          {errors.currencyCode && (
            <p className={errorClass}>
              {errors.currencyCode.message}
            </p>
          )}
        </div>
      </div>

      {/* billing info */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label
            htmlFor="edit-statement-day"
            className={labelClass}
          >
            Statement Day
          </label>

         <input
            id="edit-statement-day"
            type="number"
            min={1}
            max={31}
            {...register("statementDay", {
              setValueAs: (value: string) =>
                value === "" ? null : Number(value),
            })}
            className={inputClass}
            aria-invalid={!!errors.statementDay}
          />

          {errors.statementDay && (
            <p className={errorClass}>
              {errors.statementDay.message}
            </p>
          )}
        </div>

         <div>
          <label
            htmlFor="edit-due-day"
            className={labelClass}
          >
            Payment Due Date
          </label>

        <input
          id="edit-due-day"
          type="number"
          min={1}
          max={31}
          {...register("dueDay", {
            setValueAs: (value: string) =>
              value === "" ? null : Number(value),
          })}
          className={inputClass}
          aria-invalid={!!errors.dueDay}
        />

          {errors.dueDay && (
            <p className={errorClass}>
              {errors.dueDay.message}
            </p>
          )}
        </div>
      </div>

      {/* card expiration */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        <div>
          <label
            htmlFor="edit-expiry-month"
            className={labelClass}>
            Expiry Month
          </label>

         <input
            id="edit-expiry-month"
            type="number"
            min={1}
            max={12}
            {...register("expiryMonth", {
              setValueAs: (value: string) =>
                value === "" ? null : Number(value),
            })}
            className={inputClass}
            aria-invalid={!!errors.expiryMonth}
          />

          {errors.expiryMonth && (
            <p className={errorClass}>
              {errors.expiryMonth.message}
            </p>
          )}
        </div>

         <div>
          <label
            htmlFor="edit-expiry-year"
            className={labelClass}>
            Expiry Year
          </label>

        <input
          id="edit-expiry-year"
          type="number"
          min={1}
          max={31}
          {...register("expiryYear", {
            setValueAs: (value: string) =>
              value === "" ? null : Number(value),
          })}
          className={inputClass}
          aria-invalid={!!errors.expiryYear}
        />

          {errors.expiryYear && (
            <p className={errorClass}>
              {errors.expiryYear.message}
            </p>
          )}
        </div>


          <div>
            <label
              htmlFor="edit-status"
              className={labelClass}>
              Card Status
            </label>

            <select
              id="edit-status"
              {...register("status")}
              className={inputClass}>
              <option value="">Select currency</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="INACTIVE">Inactive</option>
              <option value="EXPIRED">Expired</option>
            </select>

            {errors.status && (
              <p className={errorClass}>
                {errors.status.message}
              </p>
            )}
        </div>
      </div>



      {/* Footer */}
      <div className="flex flex-col-reverse gap-2 border-t border-[#E8EBE5] pt-5 sm:flex-row sm:justify-end">
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
          disabled={busy || !isDirty}
          className="
            inline-flex h-10 items-center justify-center
            gap-2 rounded-[9px]
            bg-[#26342F] px-5
            text-[12px] font-semibold text-white
            transition hover:bg-[#374B40]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {busy ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Saving Changes...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}