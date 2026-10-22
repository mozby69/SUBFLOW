import { prisma } from "@/lib/database/prisma";




export interface CalendarQueryParams {
  year: number;
  month: number;
}

export async function getBillingCalendarRepository({year,month}: CalendarQueryParams) {
    
  const startDate = new Date(
    Date.UTC(year, month - 1, 1)
  );

  const endDate = new Date(
    Date.UTC(year, month, 1)
  );

  return prisma.subscriptionBilling.findMany({
    where: {
      dueDate: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      id: true,
      subscriptionId: true,
      dueDate: true,
      amount: true,
      paidAmount: true,
      currencyCode: true,
      status: true,
      subscription: {
        select: {
          id: true,
          subscriptionName: true,
          status: true,
          billingCycle: true,
          category: true,
          creditCardId: true,
          card: {
            select: {
              bank: true,
              network: true,
              last_four_digit: true,
            },
          },
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });
}