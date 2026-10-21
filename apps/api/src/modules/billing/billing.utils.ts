
import { billing_cycle } from "../../../generated/prisma/client";

export function dateOnlyUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

export function addBillingCycle(
  date: Date,
  cycle: billing_cycle,
  anchorDay: number
): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const targetMonth =
    cycle === "MONTHLY" ? month + 1 : month;

  const targetYear =
    cycle === "YEARLY" ? year + 1 : year;

  const lastDay = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      Math.min(anchorDay, lastDay)
    )
  );
}

export function getTodayUTC(): Date {
  return dateOnlyUTC(new Date());
}

export function isOverdue(
  dueDate: Date,
  paidAmount: number,
  amount: number
): boolean {
  return (
    dateOnlyUTC(dueDate) < getTodayUTC() &&
    paidAmount < amount
  );
}




export function calculateNextBillingDate(
  date: Date,
  cycle: billing_cycle,
  anchorDay: number
): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();

  const targetYear =
    cycle === "YEARLY" ? year + 1 : year;

  const targetMonth =
    cycle === "MONTHLY" ? month + 1 : month;

  const lastDay = new Date(
    Date.UTC(targetYear, targetMonth + 1, 0)
  ).getUTCDate();

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      Math.min(anchorDay, lastDay)
    )
  );
}