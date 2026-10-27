"use client";

import { CreditCard2 } from "@repo/shared";
import {
  CreditCard as CreditCardIcon,
  Pencil,
  Layers3,
  Wallet,
} from "lucide-react";

// export interface CreditCardItemData {
//   id: number;
//   bank: string;
//   last_four_digit: number;
//   network: string;
//   nickname?: string | null;
//   subscriptionCount?: number;
//   monthlyEquivalent?: number;
// }

interface CreditCardItemProps {
  card: CreditCard2;
  onEdit?: (card: CreditCard2) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
});

function getCardTheme(network: string): string {
  const normalized = network.toUpperCase();

  if (normalized.includes("VISA")) {
    return "from-[#164B43] via-[#235D50] to-[#102F2C]";
  }

  if (normalized.includes("MASTER")) {
    return "from-[#24395F] via-[#344C77] to-[#172843]";
  }

  if (normalized.includes("AMEX")) {
    return "from-[#234F77] via-[#326C96] to-[#173955]";
  }

  if (normalized.includes("UNIONPAY")) {
  return "from-[#A71930] via-[#D93848] to-[#761426]";
}

  return "from-[#293B36] via-[#41564B] to-[#202F29]";
}

export default function CreditCardItem({
  card,
  onEdit,
}: CreditCardItemProps) {
  const lastFour = String(card.last_four_digit).padStart(4, "0");

  return (
    <div
      className="
        group flex h-full flex-col overflow-hidden
        rounded-2xl border border-[#E1E6DE]
        bg-white p-5
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-[#C7D4C9]
        hover:shadow-lg hover:shadow-[#26342F]/5
      "
    >
      {/* Visual credit card */}
      <div
        className={`
          relative aspect-1.75/1 overflow-hidden
          rounded-2xl bg-linear-to-br
          ${getCardTheme(card.network)}
          p-5 text-white shadow-md
        `}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-white/5" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[17px] font-bold tracking-wide">
                {card.bank}
              </p>
              <p className="mt-1 text-[10px] text-white/55">
                Credit Card
              </p>
            </div>

            <span className="text-[13px] font-semibold italic tracking-wide">
              {card.network}
            </span>
          </div>

          <div className="space-y-3">
            {/* Decorative chip */}
            <div className="flex h-7 w-10 items-center justify-center rounded-md border border-[#E2D6AC]/70 bg-linear-to-br from-[#E9D9A9] to-[#A89967]">
              <div className="h-4 w-6 rounded-sm border border-[#8C7E58]/50">
                <div className="mx-auto h-full w-px bg-[#8C7E58]/50" />
              </div>
            </div>

            <p className="font-mono text-[clamp(15px,2vw,21px)] font-medium tracking-[0.12em]">
              •••• •••• •••• {lastFour}
            </p>
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/50">
                Card nickname
              </p>
              <p className="mt-1 truncate text-[12px] font-medium">
                {card.nickname?.trim() || "My Credit Card"}
              </p>
            </div>

            <CreditCardIcon
              size={25}
              strokeWidth={1.4}
              className="shrink-0 text-white/65"
            />
          </div>
        </div>
      </div>

      {/* Card information */}
      <div className="mt-5 flex-1 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#89958B]">
            <Layers3 size={15} />
            <span>Linked subscriptions</span>
          </div>

          <span className="text-[13px] font-semibold text-[#26342F]">
            {card.subscriptionCount ?? "—"}
          </span>
        </div>

        <div className="border-t border-[#EDF0EB]" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[12px] text-[#89958B]">
            <Wallet size={15} />
            <span>Monthly equivalent</span>
          </div>

          <span className="text-[13px] font-semibold text-[#26342F]">
            {card.monthlyEquivalent == null
              ? "—"
              : currencyFormatter.format(card.monthlyEquivalent)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-[#EDF0EB] pt-4">
        <button
          type="button"
          onClick={() => onEdit?.(card)}
          disabled={!onEdit}
          className="
            inline-flex h-10 w-full items-center
            justify-center gap-2 rounded-lg
            border border-[#DCE2D9] bg-[#FCFCFA]
            text-[12px] font-semibold text-[#46574C]
            transition-colors
            hover:border-[#4F46E5]
            hover:bg-[#F8F9FB]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <Pencil size={14} />
          Edit Card
        </button>
      </div>
    </div>
  );
}