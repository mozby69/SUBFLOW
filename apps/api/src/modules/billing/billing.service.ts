
import { BillingQueryInput } from "@repo/shared";
import { Prisma } from "../../../generated/prisma/client";


import {
  findBillings,
  findBillingById,
} from "./billing.repository";
import { addBillingCycle, dateOnlyUTC, getTodayUTC } from "./billing.utils";
import { prisma } from "@/lib/database/prisma";



export class BillingError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "BillingError";
  }
}

export async function getBillingsService(
  query: BillingQueryInput
) {
  return findBillings(query);
}

export async function getBillingByIdService(id: number) {
  const billing = await findBillingById(id);

  if (!billing) {
    throw new BillingError(404, "Billing not found");
  }

  return billing;
}

export async function generateBillingsService(
  throughDate: string
) {
  const horizon = dateOnlyUTC(
    new Date(`${throughDate}T00:00:00Z`)
  );

  const today = getTodayUTC();

  const maxHorizon = new Date(today);
  maxHorizon.setUTCFullYear(
    maxHorizon.getUTCFullYear() + 1
  );

  if (horizon < today || horizon > maxHorizon) {
    throw new BillingError(
      400,
      "Billing horizon must be between today and one year ahead"
    );
  }

  const subscriptions = await prisma.subscription.findMany({
    where: {
      status: "ACTIVE",
      nextBilling: { not: null, lte: horizon },
      amount: { not: null },
    },
    select: { id: true },
  });

  let generated = 0;
  let skipped = 0;

  for (const item of subscriptions) {
    const result = await prisma.$transaction(
      async (tx) => {
        // Serialize billing generation for this subscription.
        await tx.$queryRaw`
          SELECT subscription_id
          FROM subscription
          WHERE subscription_id = ${item.id}
          FOR UPDATE
        `;

        const subscription = await tx.subscription.findUnique({
          where: { id: item.id },
        });

        if (
          !subscription ||
          subscription.status !== "ACTIVE" ||
          !subscription.nextBilling ||
          subscription.amount === null ||
          subscription.nextBilling > horizon
        ) {
          return { generated: 0, skipped: 0 };
        }

        let dueDate = dateOnlyUTC(
          subscription.nextBilling
        );

        const anchorDay =
          subscription.anchorDay ??
          dueDate.getUTCDate();

        if (anchorDay < 1 || anchorDay > 31) {
          throw new BillingError(
            400,
            "Invalid subscription billing anchor"
          );
        }

        let created = 0;
        let duplicates = 0;
        let iterations = 0;

        while (dueDate <= horizon) {
          if (++iterations > 24) {
            throw new BillingError(
              400,
              "Billing generation limit exceeded"
            );
          }

          if (
            subscription.endDate &&
            dueDate > subscription.endDate
          ) {
            break;
          }

          const result = await tx.subscriptionBilling.createMany({
            data: [{
              subscriptionId: subscription.id,
              dueDate,
              amount: subscription.amount,
              currencyCode: subscription.currencyCode,
              status: "SCHEDULED",
              paidAmount: new Prisma.Decimal(0),
            }],
            skipDuplicates: true,
          });

          created += result.count;
          duplicates += 1 - result.count;

          if (!subscription.autoRenew) {
            break;
          }

          dueDate = addBillingCycle(
            dueDate,
            subscription.billingCycle,
            anchorDay
          );
        }

        const nextBilling =
          !subscription.autoRenew ||
          (subscription.endDate &&
            dueDate > subscription.endDate)
            ? null
            : dueDate;

        await tx.subscription.update({
          where: { id: subscription.id },
          data: { nextBilling },
        });

        return {
          generated: created,
          skipped: duplicates,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout: 15000,
      }
    );

    generated += result.generated;
    skipped += result.skipped;
  }

  return {
    generated,
    skipped,
    processedSubscriptions: subscriptions.length,
    throughDate,
  };
}

export async function cancelBillingService(id: number) {
  return prisma.$transaction(async (tx) => {
    const billing = await tx.subscriptionBilling.findUnique({
      where: { id },
    });

    if (!billing) {
      throw new BillingError(404, "Billing not found");
    }

    if (billing.status !== "SCHEDULED") {
      throw new BillingError(
        409,
        "Only scheduled bills can be cancelled"
      );
    }

    if (!billing.paidAmount.isZero()) {
      throw new BillingError(
        409,
        "Cannot cancel a bill with recorded payments"
      );
    }

    const updated = await tx.subscriptionBilling.updateMany({
      where: {
        id,
        status: "SCHEDULED",
        paidAmount: new Prisma.Decimal(0),
      },
      data: { status: "CANCELLED" },
    });

    if (updated.count !== 1) {
      throw new BillingError(
        409,
        "Billing was modified by another request"
      );
    }

    return tx.subscriptionBilling.findUniqueOrThrow({
      where: { id },
    });
  });
}
