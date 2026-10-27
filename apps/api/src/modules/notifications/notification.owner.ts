import { prisma } from "@/lib/database/prisma";

export async function resolveSubscriptionOwner(
  subscriptionId: number
): Promise<number | null> {
  const subscription = await prisma.subscription.findUnique({
    where: {
      id: subscriptionId,
    },
    select: {
      userId: true,
    },
  });

  return subscription?.userId ?? null;
}