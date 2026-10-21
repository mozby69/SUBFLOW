import { prisma } from "@/lib/database/prisma";
import { billing_cycle, status_subscription } from "../../../generated/prisma/enums";
import { QueryParams } from "../../../../../packages/shared/src/types/query.types";
import { Prisma, Subscription } from "../../../generated/prisma/client";
import { AddSubscriptionValues, CreateSubscriptionInput, CreditCard2, UpdateSubscriptionSchema } from "@repo/shared";
import { calculateNextBillingDate } from "../billing/billing.utils";



export interface CreateSubscriptionData
  extends Omit<
    CreateSubscriptionInput,
    "nextBilling" | "startDate" | "endDate"
  > {
  userId: number;
  nextBilling: Date;
  startDate: Date | null;
  endDate: Date | null;
}



export async function addSubscription(
  data: CreateSubscriptionData
) {
  return prisma.$transaction(async (tx) => {
    // The supplied nextBilling is the first due date.

    const shouldCreateBilling =
      data.status === "ACTIVE";

const firstBillingDate = data.nextBilling;

const nextBilling = shouldCreateBilling
  ? data.autoRenew
    ? calculateNextBillingDate(
        firstBillingDate,
        data.billingCycle,
        data.anchorDay ?? firstBillingDate.getUTCDate()
      )
    : null
  : firstBillingDate;
    // STEP 1: Create the subscription.
    const subscription = await tx.subscription.create({
      data: {


        subscriptionName: data.subscriptionName,
        description: data.description,

        amount: data.amount,
        billingCycle: data.billingCycle,
        nextBilling,

        currencyCode: data.currencyCode,

        category: data.category,

        ...(data.categoryId !== null && {
          subscriptionCategory: {
            connect: {
              id: data.categoryId,
            },
          },
        }),

        status: data.status,

        card: {
          connect: {
            id: data.creditCardId,
          },
        },

        user: {
          connect: {
            id: data.userId,
          },
        },

        startDate: data.startDate,
        endDate: data.endDate,

        anchorDay: data.anchorDay,
        autoRenew: data.autoRenew,
        website: data.website,
      },
    });

    // STEP 2: Create the first billing record.
    if (!shouldCreateBilling) {
      return {
        subscription,
        billing: null,
      };
    }

    const billing = await tx.subscriptionBilling.create({
      data: {
        subscriptionId: subscription.id,
        dueDate: firstBillingDate,
        amount: data.amount,
        currencyCode: data.currencyCode,
        paidAmount: 0,
        status: "SCHEDULED",
      },
    });

    // Both records are committed together.
    return {
      subscription,
      billing,
    };
  });
}

export async function displaySubscription(params: QueryParams) {
  const {
    page = 1,
    limit = 10,
    search,
  } = params;

  const where: Prisma.SubscriptionWhereInput = {};

  if (search?.trim()) {
    where.OR = [
      {
        subscriptionName: {
          contains: search.trim(),
        },
      },
      {
        category: {
          contains: search.trim(),
        },
      },
    ];
  }

  const [subdata, total] = await prisma.$transaction([
    prisma.subscription.findMany({
      where,
      select: {
        id: true,
        subscriptionName: true,
        amount: true,
        billingCycle: true,
        nextBilling: true,
        paymentCard: true,
        category: true,
        status: true,

        // Foreign key
        creditCardId: true,

        // Related credit card information
        card: {
          select: {
            id: true,
            bank: true,
            network: true,
            last_four_digit: true,
            nickname: true,
          },
        },
      },

      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.subscription.count({
      where,
    }),
  ]);

  return {
    data: subdata,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}





export async function editSubscription(
  id: number,
  data: UpdateSubscriptionSchema
) {
  return prisma.subscription.update({
    where: {
      id,
    },
    data: {
      subscriptionName: data.subscriptionName,
      amount: data.amount,
      billingCycle: data.billingCycle,

      nextBilling: new Date(
        `${data.nextBilling}T00:00:00.000Z`
      ),

      category: data.category,
      status: data.status,

      // Update the credit card foreign key
      card: {
        connect: {
          id: data.creditCardId,
        },
      },
    },
    include: {
      card: true,
    },
  });
}




export async function deleteSubscription(id: number) {
  return prisma.$transaction(async (tx) => {
    const subdata = await tx.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!subdata) {
      throw new Error("subscription not found");
    }


    await tx.subscription.delete({
      where: {
        id,
      },
    });

    return subdata;
  });
}



















export async function editCard(id: number,data: CreditCard2) {
  return prisma.$transaction(async (tx) => {
    const cardata = await tx.creditCard.update({
      where: {
        id,
      },
      data: {
        bank: data.bank,
        last_four_digit: data.last_four_digit,
        network: data.network,
        nickname: data.nickname,

      },
    });


    return cardata;
  });
}
