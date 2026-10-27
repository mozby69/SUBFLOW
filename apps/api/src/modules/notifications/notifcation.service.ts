
import type {
  NotificationQueryInput,
  UpdateNotificationPreferenceInput,
} from "@repo/shared";

import type {
  NotificationType,
} from "../../../generated/prisma/client";

import * as repository from "./notification.repository";
import { prisma } from "@/lib/database/prisma";

export class NotificationError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "NotificationError";
  }
}

export async function getNotificationsService(
  userId: number,
  query: NotificationQueryInput
) {
  return repository.findNotifications(userId, query);
}

export async function getUnreadCountService(
  userId: number
) {
  const count =
    await repository.countUnreadNotifications(userId);

  return { count };
}

export async function markNotificationReadService(
  userId: number,
  id: number
) {
  const result = await repository.markNotificationRead(
    userId,
    id
  );

  if (result.count === 0) {
    const existing = await prisma.notification.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotificationError(
        404,
        "Notification not found"
      );
    }
  }

  return { id, isRead: true };
}

export async function markAllReadService(
  userId: number
) {
  const result =
    await repository.markAllNotificationsRead(userId);

  return { updatedCount: result.count };
}

export async function deleteNotificationService(
  userId: number,
  id: number
) {
  const result = await repository.deleteNotification(
    userId,
    id
  );

  if (result.count === 0) {
    throw new NotificationError(
      404,
      "Notification not found"
    );
  }

  return { deleted: true };
}

export async function getPreferencesService(
  userId: number
) {
  return repository.findNotificationPreferences(userId);
}

export async function updatePreferencesService(
  userId: number,
  data: UpdateNotificationPreferenceInput
) {
  return repository.updateNotificationPreferences(
    userId,
    data
  );
}

// Reusable helper for other backend modules.
// Call this only after the relevant business action succeeds.
export async function createNotificationService(
  params: {
    userId: number;
    subscriptionId?: number | null;
    type: NotificationType;
    title: string;
    message: string;
    scheduledFor?: Date | null;
  }
) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      subscriptionId: params.subscriptionId ?? null,
      type: params.type,
      title: params.title,
      message: params.message,
      scheduledFor: params.scheduledFor ?? null,
      sentAt: params.scheduledFor ? null : new Date(),
    },
  });
}

