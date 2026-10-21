
import cron from "node-cron";

import {
  Prisma,
  type NotificationType,
} from "../../../generated/prisma/client";
import { prisma } from "@/lib/database/prisma";


// Replace this import with your actual Prisma client path.

type ReminderKind = "UPCOMING" | "OVERDUE";

type BillingReminderCandidate = {
  id: number;
  subscriptionId: number;
  dueDate: Date;
  amount: Prisma.Decimal;
  paidAmount: Prisma.Decimal;
  currencyCode: string;
  status: string;
  subscription: {
    subscriptionName: string;
  };
};

type BillingOwnerResolver = (
  subscriptionId: number
) => Promise<number | null>;

function dateOnlyUTC(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    )
  );
}

function daysBetweenUTC(
  today: Date,
  dueDate: Date
): number {
  const difference =
    dateOnlyUTC(dueDate).getTime() -
    dateOnlyUTC(today).getTime();

  return Math.round(
    difference / (24 * 60 * 60 * 1000)
  );
}

async function createReminder(
  billing: BillingReminderCandidate,
  userId: number,
  kind: ReminderKind,
  daysUntilDue: number
) {
  const notificationType: NotificationType =
    kind === "UPCOMING"
      ? "BILLING_REMINDER"
      : "PAYMENT_DUE";

  const key =
    `billing:${billing.id}:` +
    `${kind.toLowerCase()}`;

  const amount = billing.amount
    .minus(billing.paidAmount)
    .toFixed(2);

  const subscriptionName =
    billing.subscription.subscriptionName;

  const title =
    kind === "UPCOMING"
      ? "Upcoming Subscription Billing"
      : "Overdue Subscription Payment";

  const message =
    kind === "UPCOMING"
      ? `${subscriptionName} has an outstanding ` +
        `billing of ${billing.currencyCode} ${amount} ` +
        `due in ${daysUntilDue} day(s).`
      : `${subscriptionName} has an overdue ` +
        `billing of ${billing.currencyCode} ${amount}.`;

  try {
    await prisma.notification.create({
      data: {
        userId,
        subscriptionId: billing.subscriptionId,
        type: notificationType,
        title,
        message,
        scheduledFor: null,
        sentAt: new Date(),
        deduplicationKey: key,
      },
    });

    return true;
  } catch (error) {
    // Another scheduler instance already created it.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return false;
    }

    throw error;
  }
}

export async function generateBillingReminders(
  resolveOwner: BillingOwnerResolver
) {
  const today = dateOnlyUTC(new Date());

  const maxReminderDays = 30;

  const horizon = new Date(today);
  horizon.setUTCDate(
    horizon.getUTCDate() + maxReminderDays
  );

  const billings = await prisma.subscriptionBilling.findMany({
    where: {
      status: {
        in: ["SCHEDULED", "PARTIALLY_PAID", "OVERDUE"],
      },
      dueDate: {
        lte: horizon,
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
          subscriptionName: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  let created = 0;
  let skipped = 0;

  for (const billing of billings) {
    const outstanding = billing.amount.minus(
      billing.paidAmount
    );

    if (outstanding.lte(0)) {
      skipped++;
      continue;
    }

    const userId = await resolveOwner(
      billing.subscriptionId
    );

    if (!userId) {
      skipped++;
      continue;
    }

    const preferences =
      await prisma.notificationPreference.findUnique({
        where: { userId },
      });

    const reminderDays =
      preferences?.reminderDays ?? 3;

    const billingReminder =
      preferences?.billingReminder ?? true;

    const overdueAlert =
      preferences?.overdueAlert ?? true;

    const daysUntilDue = daysBetweenUTC(
      today,
      billing.dueDate
    );

    if (daysUntilDue < 0) {
      if (!overdueAlert) {
        skipped++;
        continue;
      }

      const inserted = await createReminder(
        billing,
        userId,
        "OVERDUE",
        daysUntilDue
      );

      if (inserted) created++;
      else skipped++;

      continue;
    }

    if (
      billingReminder &&
      daysUntilDue <= reminderDays
    ) {
      const inserted = await createReminder(
        billing,
        userId,
        "UPCOMING",
        daysUntilDue
      );

      if (inserted) created++;
      else skipped++;
    } else {
      skipped++;
    }
  }

  return {
    checked: billings.length,
    created,
    skipped,
  };
}

export function startNotificationScheduler(
  resolveOwner: BillingOwnerResolver
) {
  const task = cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        const result =
          await generateBillingReminders(
            resolveOwner
          );

        console.info(
          "[Notification Scheduler]",
          result
        );
      } catch (error) {
        console.error(
          "[Notification Scheduler] Failed:",
          error
        );
      }
    },
    {
      timezone: "Asia/Manila",
      noOverlap: true,
    }
  );

  console.info(
    "Notification scheduler started: daily at 8 AM"
  );

  return task;
}
