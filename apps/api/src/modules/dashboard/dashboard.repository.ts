
import { prisma } from "@/lib/database/prisma";

export type DashboardPeriod = "month" | "year" | "all";

export type DashboardDateRange = {
  start?: Date;
  end?: Date;
};

export async function getDashboardBillingsRepo(
  userId: number,
  range: DashboardDateRange
) {
  return prisma.subscriptionBilling.findMany({
    where: {
      subscription: {
        userId,
      },

      currencyCode: "PHP",

      ...(range.start || range.end
        ? {
            dueDate: {
              ...(range.start && {
                gte: range.start,
              }),
              ...(range.end && {
                lt: range.end,
              }),
            },
          }
        : {}),
    },

    select: {
      id: true,
      dueDate: true,
      amount: true,
      paidAmount: true,
      status: true,
      currencyCode: true,

      subscription: {
        select: {
          id: true,
          subscriptionName: true,
          category: true,

          subscriptionCategory: {
            select: {
              name: true,
            },
          },

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
      dueDate: "desc",
    },
  });
}

export async function getDashboardCardsRepo(
  userId: number,
  asOf: Date
) {
  return prisma.creditCard.findMany({
    where: {
      userId,
      currencyCode: "PHP",
    },

    select: {
      id: true,
      bank: true,
      network: true,
      last_four_digit: true,
      creditLimit: true,
      currencyCode: true,
      status: true,

      charges: {
        where: {
          currencyCode: "PHP",
          transactionDate: {
            lte: asOf,
          },
        },
        select: {
          postedAmount: true,
        },
      },

      cardPayments: {
        where: {
          currencyCode: "PHP",
          paymentDate: {
            lte: asOf,
          },
        },
        select: {
          amount: true,
        },
      },
    },

    orderBy: {
      id: "desc",
    },
  });
}
