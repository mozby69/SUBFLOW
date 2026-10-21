
import { prisma } from "@/lib/database/prisma";

import type {
  CreateCreditCardInput,
} from "@repo/shared";

type CreateCreditCardData = Omit<
  CreateCreditCardInput,
  "nickname" |
  "statementDay" |
  "dueDay" |
  "expiryMonth" |
  "expiryYear"
> & {
  userId: number,
  nickname: string | null;
  statementDay: number | null;
  dueDay: number | null;
  expiryMonth: number | null;
  expiryYear: number | null;
};

export async function addCreditCardRepo(
  data: CreateCreditCardData,
) {
  return prisma.creditCard.create({
    data: {
       user: {
        connect: {
          id: data.userId,
        },
      },
      bank: data.bank,
      last_four_digit: data.last_four_digit,
      network: data.network,
      nickname: data.nickname,

      creditLimit: data.creditLimit,
      currencyCode: data.currencyCode,

      statementDay: data.statementDay,
      dueDay: data.dueDay,

      status: data.status,

      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
    },
  });

}

export async function getCreditCardsRepo() {
  const cards = await prisma.creditCard.findMany({
    select: {
      id: true,
      bank: true,
      last_four_digit: true,
      network: true,
      nickname: true,

      // New credit card fields
      creditLimit: true,
      currencyCode: true,
      statementDay: true,
      dueDay: true,
      status: true,
      expiryMonth: true,
      expiryYear: true,

      createdAt: true,
      updatedAt: true,

      // Related subscriptions
      subscriptions: {
        select: {
          id: true,
          amount: true,
          currencyCode: true,
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
    const activeSubscriptions =
      card.subscriptions.filter(
        (subscription) =>
          subscription.status === "ACTIVE"
      );

    // Only calculate subscriptions matching
    // the card currency.
    const monthlyEquivalent =
      activeSubscriptions.reduce(
        (total, subscription) => {
          if (
            subscription.currencyCode !==
            card.currencyCode
          ) {
            return total;
          }

          const amount = Number(
            subscription.amount ?? 0
          );

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

      creditLimit: Number(card.creditLimit),
      currencyCode: card.currencyCode,

      statementDay: card.statementDay,
      dueDay: card.dueDay,
      status: card.status,

      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,

      // Subscription information
      subscriptionCount:
        card.subscriptions.length,

      activeSubscriptionCount:
        activeSubscriptions.length,

      monthlyEquivalent:
        Math.round(monthlyEquivalent * 100) / 100,

      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    };
  });
}

