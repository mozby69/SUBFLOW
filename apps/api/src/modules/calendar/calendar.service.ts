import * as calendarRepositoryList from './calendar.repository';






export type CalendarBillingIndicator =
  | "PAID"
  | "OVERDUE"
  | "DUE_SOON"
  | "UPCOMING"
  | "CANCELLED";

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getCalendarIndicator(
  dueDate: Date,
  paidAmount: number,
  amount: number,
  billingStatus: string,
  subscriptionStatus: string,
  today: Date
): CalendarBillingIndicator {


  if (billingStatus === "PAID" || paidAmount >= amount) {
    return "PAID";
  }

  if (subscriptionStatus === "CANCELLED") {
    return "CANCELLED";
  }

  const due = Date.UTC(
    dueDate.getUTCFullYear(),
    dueDate.getUTCMonth(),
    dueDate.getUTCDate()
  );

  const current = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const daysUntilDue = Math.round(
    (due - current) / 86_400_000
  );

  if (daysUntilDue < 0) {
    return "OVERDUE";
  }

  if (daysUntilDue <= 7) {
    return "DUE_SOON";
  }

  return "UPCOMING";
}

export async function getBillingCalendarService(params: calendarRepositoryList.CalendarQueryParams) {
  const records = await calendarRepositoryList.getBillingCalendarRepository(params);

  const today = new Date();

  const data = records.map((billing) => {
    const amount = Number(billing.amount);
    const paidAmount = Number(billing.paidAmount);

    return {
      id: billing.id,
      subscriptionId: billing.subscriptionId,
      subscriptionName:billing.subscription.subscriptionName,
      dueDate: toDateOnly(billing.dueDate),
      amount,
      paidAmount,
      currencyCode: billing.currencyCode,
      billingStatus: billing.status,
      subscriptionStatus: billing.subscription.status,

      calendarIndicator: getCalendarIndicator(
        billing.dueDate,
        paidAmount,
        amount,
        billing.status,
        billing.subscription.status,
        today
      ),

      billingCycle: billing.subscription.billingCycle,
      category: billing.subscription.category,

      creditCard: {
        id: billing.subscription.creditCardId,
        bank: billing.subscription.card.bank,
        network: billing.subscription.card.network,
        lastFourDigit:
          billing.subscription.card.last_four_digit,
      },
    };
  });

  return {
    year: params.year,
    month: params.month,
    data,
    summary: {
      totalBills: data.length,
      totalAmount: data.reduce(
        (sum, item) => sum + item.amount,
        0
      ),
      overdueCount: data.filter(
        (item) => item.calendarIndicator === "OVERDUE"
      ).length,
      dueSoonCount: data.filter(
        (item) => item.calendarIndicator === "DUE_SOON"
      ).length,
    },
  };
}
