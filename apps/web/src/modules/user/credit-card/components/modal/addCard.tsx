
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CreditCard,
  Loader2,
  Plus,
} from "lucide-react";

import {
  creditCardSchema,
  type CreditCardInput,
  type CreditCardSchema,
} from "@repo/shared";

interface AddModalCreditCardProps {
  onClose: () => void;
  onSubmit: (
    values: CreditCardSchema
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

export default function AddModalCreditCard({onClose,onSubmit,isSaving = false}: AddModalCreditCardProps) {
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<
    CreditCardInput,
    unknown,
    CreditCardSchema
  >({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      bank: "",
      last_four_digit: 0,
      network: "",
      nickname: "",
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
      className="space-y-5 p-4"
      noValidate
    >
      <p className="text-[12px] leading-relaxed text-[#8A958C]">
        Register a credit card to organize
        subscription payments and track
        recurring expenses.
      </p>

      {/* Bank Information */}
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

        {/* Bank Name */}
        <div>
          <label
            htmlFor="bank"
            className={labelClass}
          >
            Bank Name
            <span className="ml-1 text-red-500">
              *
            </span>
          </label>

          <input
            id="bank"
            {...register("bank")}
            placeholder="e.g. BDO, BPI, Metrobank"
            aria-invalid={!!errors.bank}
            className={inputClass}
          />

          {errors.bank && (
            <p className={errorClass}>
              {errors.bank.message}
            </p>
          )}
        </div>
      </section>

      {/* Card Information */}
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
          {/* Card Network */}
          <div>
            <label
              htmlFor="network"
              className={labelClass}
            >
              Card Network
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              id="network"
              {...register("network")}
              aria-invalid={!!errors.network}
              className={inputClass}
            >
              <option value="">
                Select network
              </option>
              <option value="VISA">
                Visa
              </option>
              <option value="MASTERCARD">
                Mastercard
              </option>
              <option value="JCB">
                JCB
              </option>
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

          {/* Last 4 Digits */}
          <div>
            <label
              htmlFor="last-four-digit"
              className={labelClass}
            >
              Last 4 Digits
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#8A958C]">
                ••••
              </span>

              <input
                id="last-four-digit"
                type="text"
                inputMode="numeric"
                maxLength={4}
                {...register("last_four_digit", {
                  validate: (value) =>
                    /^\d{4}$/.test(String(value)) ||
                    "Enter exactly 4 digits",
                })}
                placeholder="4242"
                aria-invalid={
                  !!errors.last_four_digit
                }
                className={`${inputClass} pl-12`}
              />
            </div>

            {errors.last_four_digit && (
              <p className={errorClass}>
                {errors.last_four_digit.message}
              </p>
            )}
          </div>
        </div>

        {/* Nickname */}
        <div>
          <label
            htmlFor="nickname"
            className={labelClass}
          >
            Card Nickname
            <span className="ml-2 text-[10px] font-normal text-[#929A93]">
              Optional
            </span>
          </label>

          <input
            id="nickname"
            {...register("nickname")}
            placeholder="e.g. Personal Visa, Work Card"
            className={inputClass}
          />

          {errors.nickname && (
            <p className={errorClass}>
              {errors.nickname.message}
            </p>
          )}

          <p className="mt-1.5 text-[11px] text-[#929A93]">
            Use a nickname to identify this
            card when assigning subscriptions.
          </p>
        </div>
      </section>

      {/* Security Note */}
      <div className="rounded-[10px] border border-[#DCE6DC] bg-[#F3F7F2] px-4 py-3">
        <div className="flex items-start gap-3">
          <CreditCard
            size={17}
            className="mt-0.5 shrink-0 text-[#526B5D]"
          />

          <div>
            <p className="text-[12px] font-semibold text-[#405B49]">
              Card Information
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#728579]">
              Only enter the last four digits
              of your card. Never enter your
              full card number, CVV, or PIN.
            </p>
          </div>
        </div>
      </div>

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
            inline-flex h-10 items-center
            justify-center gap-2
            rounded-[9px] bg-[#26342F]
            px-5 text-[12px] font-semibold
            text-white transition
            hover:bg-[#374B40]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
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
