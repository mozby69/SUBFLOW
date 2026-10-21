import { Billing } from "@repo/shared";


export function formatMoney(
  amount: string | number,
  currencyCode = "PHP"
) {
  const value = Number(amount);

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatBillingDate(date: string) {
  return new Date(date).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function toDateOnly(date: string) {
  return date.slice(0, 10);
}

export function getEffectiveStatus(
  billing: Pick<Billing, "status" | "dueDate">
) {
  if (
    billing.status === "PAID" ||
    billing.status === "CANCELLED"
  ) {
    return billing.status;
  }

  const today = new Date().toISOString().slice(0, 10);

  if (toDateOnly(billing.dueDate) < today) {
    return "OVERDUE" as const;
  }

  return billing.status;
}

export function getOutstanding(
  billing: Pick<Billing, "amount" | "paidAmount">
) {
  return Math.max(
    0,
    Number(billing.amount) - Number(billing.paidAmount)
  );
}
