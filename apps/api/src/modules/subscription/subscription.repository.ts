import { prisma } from "@/lib/database/prisma";
import { billing_cycle, status_subscription } from "../../../generated/prisma/enums";
import { QueryParams } from "../../../../../packages/shared/src/types/query.types";
import { Prisma, Subscription } from "../../../generated/prisma/client";
import { AddSubscriptionValues, CreditCard2, UpdateSubscriptionSchema } from "@repo/shared";





interface CreateSubscriptionData {
  subscriptionName: string;
  amount: number;
  billingCycle: billing_cycle;
  nextBilling: Date;

  category: string;
  status: status_subscription;
  creditCardId: number;
}

export async function addSubscription(data: CreateSubscriptionData) {
  return prisma.subscription.create({
    data: {
      subscriptionName: data.subscriptionName,
      amount: data.amount,
      billingCycle: data.billingCycle,
      nextBilling: data.nextBilling,

      category: data.category,
      status: data.status,

      card: {
        connect: {
          id: data.creditCardId,
        },
      },
    },
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







export async function addCard(data: {
    bank: string;
    last_four_digit: number;
    network: string;
    nickname:string;

}) {
   return prisma.$transaction(async (tx) => {

    const carddata = await tx.creditCard.create({
            data: {
                bank: data.bank,
                last_four_digit: data.last_four_digit,
                network: data.network,
                nickname: data.nickname?.trim() || null,
            },
        });

    return carddata;
});
}







export async function getCreditCards() {
  const cards = await prisma.creditCard.findMany({
    select: {
      id: true,
      bank: true,
      last_four_digit: true,
      network: true,
      nickname: true,

      subscription: {
        select: {
          amount: true,
          billingCycle: true,
          status: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return cards.map((card) => {
    const activeSubscriptions = card.subscription.filter(
      (subscription) => subscription.status === "ACTIVE"
    );

    const monthlyEquivalent = activeSubscriptions.reduce(
      (total, subscription) => {
        const amount = Number(subscription.amount ?? 0);

        return (
          total +
          (subscription.billingCycle === "YEARLY"
            ? amount / 12
            : amount)
        );
      },
      0
    );

    return {
      id: card.id,
      bank: card.bank,
      last_four_digit: card.last_four_digit,
      network: card.network,
      nickname: card.nickname,
      subscriptionCount: card.subscription.length,
      monthlyEquivalent: Math.round(monthlyEquivalent * 100) / 100,
    };
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
