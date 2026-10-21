
import { BillingQueryInput } from "@repo/shared";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "@/lib/database/prisma";

export async function findBillings(
  query: BillingQueryInput
) {
  const { page, limit, subscriptionId, status } = query;

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    )
  );

  const where: Prisma.SubscriptionBillingWhereInput = {
    ...(subscriptionId && { subscriptionId }),

    ...(query.fromDate || query.toDate
      ? {
          dueDate: {
            ...(query.fromDate && {
              gte: new Date(`${query.fromDate}T00:00:00Z`),
            }),
            ...(query.toDate && {
              lte: new Date(`${query.toDate}T00:00:00Z`),
            }),
          },
        }
      : {}),

    ...(status === "OVERDUE"
      ? {
          status: {
            in: ["SCHEDULED", "PARTIALLY_PAID"],
          },
          dueDate: { lt: todayUTC },
        }
      : status
        ? { status }
        : {}),
  };

  const [data, total] = await prisma.$transaction([
    prisma.subscriptionBilling.findMany({
      where,
      include: {
        subscription: {
          select: {
            id: true,
            subscriptionName: true,
            billingCycle: true,
            currencyCode: true,
            card: {
              select: {
                id: true,
                bank: true,
                nickname: true,
                last_four_digit: true,
              },
            },
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { id: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.subscriptionBilling.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function findBillingById(id: number) {
  return prisma.subscriptionBilling.findUnique({
    where: { id },
    include: {
      subscription: {
        include: { card: true },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });
}
