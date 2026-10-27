
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Building2,
  CreditCard,
  Loader2,
  Plus,
  CalendarDays,
  Wallet,
} from "lucide-react";

import {
  CreateCreditCardFormInput,
  createCreditCardSchema,
  type CreateCreditCardInput,
} from "@repo/shared";

interface AddModalCreditCardProps {
  onClose: () => void;
  onSubmit: (
    values: CreateCreditCardInput
  ) => Promise<void> | void;
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

export default function AddModalCreditCard({
  onClose,
  onSubmit,
  isSaving = false,
}: AddModalCreditCardProps) {
const {
  register,
  handleSubmit,
  formState: {
    errors,
    isSubmitting,
  },
} = useForm<
  CreateCreditCardFormInput,
  unknown,
  CreateCreditCardInput
>({
  resolver: zodResolver(createCreditCardSchema),

  defaultValues: {
    bank: "",
    last_four_digit: "",
    network: "",
    nickname: "",

    creditLimit: 0,
    currencyCode: "PHP",

    statementDay: null,
    dueDay: null,

    status: "ACTIVE",

    expiryMonth: null,
    expiryYear: null,
  },
});

  const busy = isSaving || isSubmitting;

  const submitForm = async (
    values: CreateCreditCardInput
  ) => {
    await onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="space-y-5 p-4"
      noValidate
    >
      <p className="text-[12px] leading-relaxed text-[#8A958C]">
        Register a credit card to manage
        subscriptions, billing statements,
        and recurring expenses.
      </p>

      {/* BANK INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <Building2
            size={16}
            className="text-[#526B5D]"
          />

          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Bank Information
          </h3>
        </div>

        <div>
          <label htmlFor="bank" className={labelClass}>
            Bank Name *
          </label>

          <input
            id="bank"
            {...register("bank")}
            placeholder="e.g. BDO, BPI, Metrobank"
            className={inputClass}
          />

          {errors.bank && (
            <p className={errorClass}>
              {errors.bank.message}
            </p>
          )}
        </div>
      </section>

      {/* CARD INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <CreditCard
            size={16}
            className="text-[#526B5D]"
          />

          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Card Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="network"
              className={labelClass}
            >
              Card Network *
            </label>

            <select
              id="network"
              {...register("network")}
              className={inputClass}
            >
              <option value="">Select network</option>
              <option value="VISA">Visa</option>
              <option value="MASTERCARD">
                Mastercard
              </option>
              <option value="JCB">JCB</option>
              <option value="AMEX">
                American Express
              </option>
              <option value="UNIONPAY">
                UnionPay
              </option>
            </select>

            {errors.network && (
              <p className={errorClass}>
                {errors.network.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_four_digit"
              className={labelClass}
            >
              Last 4 Digits *
            </label>

        <input
          id="last_four_digit"
          type="text"
          inputMode="numeric"
          maxLength={4}
          {...register("last_four_digit")}
          placeholder="4242"
          className={inputClass}
        />

            {errors.last_four_digit && (
              <p className={errorClass}>
                {errors.last_four_digit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="nickname"
            className={labelClass}
          >
            Card Nickname
          </label>

          <input
            id="nickname"
            {...register("nickname")}
            placeholder="e.g. Personal Visa"
            className={inputClass}
          />

          {errors.nickname && (
            <p className={errorClass}>
              {errors.nickname.message}
            </p>
          )}
        </div>
      </section>

      {/* CREDIT INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <Wallet
            size={16}
            className="text-[#526B5D]"
          />

          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Credit Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="creditLimit"
              className={labelClass}
            >
              Credit Limit
            </label>

            <input
              id="creditLimit"
              type="number"
              step="0.01"
              min="0"
              {...register("creditLimit", {
                valueAsNumber: true,
              })}
              placeholder="100000.00"
              className={inputClass}
            />

            {errors.creditLimit && (
              <p className={errorClass}>
                {errors.creditLimit.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="currencyCode"
              className={labelClass}
            >
              Currency
            </label>

            <select
              id="currencyCode"
              {...register("currencyCode")}
              className={inputClass}
            >
              <option value="PHP">PHP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>

            {errors.currencyCode && (
              <p className={errorClass}>
                {errors.currencyCode.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* BILLING INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <CalendarDays
            size={16}
            className="text-[#526B5D]"
          />

          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Billing Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="statementDay"
              className={labelClass}
            >
              Statement Day
            </label>

            <input
              id="statementDay"
              type="number"
              min="1"
              max="31"
              {...register("statementDay", {
                setValueAs: (value) =>
                  value === ""
                    ? null
                    : Number(value),
              })}
              placeholder="e.g. 15"
              className={inputClass}
            />

            {errors.statementDay && (
              <p className={errorClass}>
                {errors.statementDay.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDay"
              className={labelClass}
            >
              Payment Due Day
            </label>

            <input
              id="dueDay"
              type="number"
              min="1"
              max="31"
              {...register("dueDay", {
                setValueAs: (value) =>
                  value === ""
                    ? null
                    : Number(value),
              })}
              placeholder="e.g. 5"
              className={inputClass}
            />

            {errors.dueDay && (
              <p className={errorClass}>
                {errors.dueDay.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-[11px] text-[#929A93]">
          Enter the statement closing day and
          payment due day provided by your bank.
        </p>
      </section>

      {/* EXPIRY INFORMATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E8EBE5] pb-3">
          <CalendarDays
            size={16}
            className="text-[#526B5D]"
          />

          <h3 className="text-[13px] font-semibold text-[#26342F]">
            Card Expiration
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="expiryMonth"
              className={labelClass}
            >
              Expiry Month
            </label>

            <select
              id="expiryMonth"
              {...register("expiryMonth", {
                setValueAs: (value) =>
                  value === ""
                    ? null
                    : Number(value),
              })}
              className={inputClass}
            >
              <option value="">Select month</option>
              {Array.from(
                { length: 12 },
                (_, i) => i + 1
              ).map((month) => (
                <option
                  key={month}
                  value={month}
                >
                  {String(month).padStart(2, "0")}
                </option>
              ))}
            </select>

            {errors.expiryMonth && (
              <p className={errorClass}>
                {errors.expiryMonth.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="expiryYear"
              className={labelClass}
            >
              Expiry Year
            </label>

            <input
              id="expiryYear"
              type="number"
              {...register("expiryYear", {
                setValueAs: (value) =>
                  value === ""
                    ? null
                    : Number(value),
              })}
              placeholder="e.g. 2029"
              className={inputClass}
            />

            {errors.expiryYear && (
              <p className={errorClass}>
                {errors.expiryYear.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CARD STATUS */}
      <section>
        <label
          htmlFor="status"
          className={labelClass}
        >
          Card Status
        </label>

        <select
          id="status"
          {...register("status")}
          className={inputClass}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLOCKED">Blocked</option>
          <option value="EXPIRED">Expired</option>
        </select>

        {errors.status && (
          <p className={errorClass}>
            {errors.status.message}
          </p>
        )}
      </section>

      {/* SECURITY NOTE */}
      <div className="rounded-[10px] border border-[#DCE6DC] bg-[#F3F7F2] px-4 py-3">
        <p className="text-[12px] font-semibold text-[#405B49]">
          Card Information Security
        </p>

        <p className="mt-1 text-[11px] leading-relaxed text-[#728579]">
          Only enter the last four digits
          of your credit card. Never enter
          your full card number, CVV, or PIN.
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col-reverse gap-2 border-t border-[#E8EBE5] pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={busy}
          className="h-10 rounded-[9px] border border-[#DCE2D9] bg-white px-5 text-[12px] font-medium text-[#526058] hover:bg-[#F2F4EF] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[9px] bg-[#4F46E5] px-5 text-[12px] font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2
                size={16}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Plus size={16} />
              Save Credit Card
            </>
          )}
        </button>
      </div>
    </form>
  );
}
