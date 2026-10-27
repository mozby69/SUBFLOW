import { BillingQueryInput, RecordBillingPaymentInput } from "@repo/shared";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "@/lib/database/prisma";
import { BillingError } from "./billing.service";

/**
 * Get paginated subscription billings with filters.
 */
export async function findBillings(query: BillingQueryInput) {
  const {
    page,
    limit,
    subscriptionId,
    status,
    fromDate,
    toDate,
  } = query;

  const now = new Date();

  const todayUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )
  );

  // Build date filters without overwriting existing conditions.
  const dueDateFilter: Prisma.DateTimeFilter = {};

  if (fromDate) {
    dueDateFilter.gte = new Date(`${fromDate}T00:00:00.000Z`);
  }

  if (toDate) {
    dueDateFilter.lte = new Date(`${toDate}T00:00:00.000Z`);
  }

  // OVERDUE is calculated from due date and unpaid status.
  if (status === "OVERDUE") {
    dueDateFilter.lt = todayUTC;
  }

  const where: Prisma.SubscriptionBillingWhereInput = {
    ...(subscriptionId !== undefined && {
      subscriptionId,
    }),

    ...(status === "OVERDUE"
      ? {
          status: {
            in: ["SCHEDULED", "PARTIALLY_PAID"],
          },
        }
      : status
        ? { status }
        : {}),

    ...(Object.keys(dueDateFilter).length > 0 && {
      dueDate: dueDateFilter,
    }),
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

      orderBy: [
        { dueDate: "asc" },
        { id: "asc" },
      ],

      skip: (page - 1) * limit,
      take: limit,
    }),

    prisma.subscriptionBilling.count({
      where,
    }),
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

/**
 * Get billing details with subscription,
 * credit card, and payment history.
 */
export async function findBillingById(id: number) {
  return prisma.subscriptionBilling.findUnique({
    where: {
      id,
    },

    include: {
      subscription: {
        include: {
          card: true,
        },
      },

      payments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}


export async function recordBillingPayment(
  billingId: number,
  input: RecordBillingPaymentInput
) {
  return prisma.$transaction(
    async (tx) => {
      // Lock the billing to prevent concurrent payments
      await tx.$queryRaw`
        SELECT id
        FROM subscription_billings
        WHERE id = ${billingId}
        FOR UPDATE
      `;

      const billing = await tx.subscriptionBilling.findUnique({
        where: { id: billingId },
      });

      if (!billing) {
        throw new BillingError(404, "Billing not found");
      }

      if (
        billing.status === "PAID" ||
        billing.status === "CANCELLED"
      ) {
        throw new BillingError(
          409,
          "Cannot record payment for paid or cancelled billing"
        );
      }

      const paymentAmount = new Prisma.Decimal(
        input.amount.toFixed(2)
      );

      const outstanding = billing.amount.minus(
        billing.paidAmount
      );

      if (
        paymentAmount.lessThanOrEqualTo(0) ||
        paymentAmount.greaterThan(outstanding)
      ) {
        throw new BillingError(
          400,
          "Payment amount must not exceed outstanding balance"
        );
      }

      // Optional duplicate request protection
      if (input.idempotencyKey) {
        const existing = await tx.subscriptionPayment.findUnique({
          where: {
            idempotencyKey: input.idempotencyKey,
          },
        });

        if (existing) {
          throw new BillingError(
            409,
            "Payment request already processed"
          );
        }
      }

      // Replace COMPLETED with your actual confirmed
      // PaymentStatus enum value if different.
      const payment = await tx.subscriptionPayment.create({
        data: {
          subscriptionId: billing.subscriptionId,
          billingId: billing.id,

          amount: paymentAmount,
          currencyCode: billing.currencyCode,

          paymentDate: new Date(),
          status: "COMPLETED",

          referenceNumber:
            input.referenceNumber || null,

          idempotencyKey:
            input.idempotencyKey || null,

          remarks: input.remarks || null,
        },
      });

      const newPaidAmount = billing.paidAmount.plus(
        paymentAmount
      );

      const newStatus =
        newPaidAmount.greaterThanOrEqualTo(billing.amount)
          ? "PAID"
          : "PARTIALLY_PAID";

      const updatedBilling = await tx.subscriptionBilling.update({
        where: { id: billing.id },
        data: {
          paidAmount: newPaidAmount,
          status: newStatus,
        },
      });

      return {
        payment,
        billing: updatedBilling,
      };
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.ReadCommitted,
      timeout: 15000,
    }
  );
}