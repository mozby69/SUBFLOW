import { prisma } from "@/lib/database/prisma";
import { NotificationQueryInput, UpdateNotificationPreferenceInput } from "@repo/shared";


export async function findNotifications(
  userId: number,
  query: NotificationQueryInput
) {
  const { page, limit, unreadOnly } = query;

  const where = {
    userId,
    ...(unreadOnly ? { isRead: false } : {}),
    OR: [
      { scheduledFor: null },
      { scheduledFor: { lte: new Date() } },
    ],
  };

  const [data, total] = await prisma.$transaction([
    prisma.notification.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        subscriptionId: true,
        type: true,
        title: true,
        message: true,
        isRead: true,
        scheduledFor: true,
        sentAt: true,
        readAt: true,
        createdAt: true,
      },
    }),

    prisma.notification.count({ where }),
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

export async function countUnreadNotifications(
  userId: number
) {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
      OR: [
        { scheduledFor: null },
        { scheduledFor: { lte: new Date() } },
      ],
    },
  });
}

export async function markNotificationRead(
  userId: number,
  id: number
) {
  return prisma.notification.updateMany({
    where: {
      id,
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function markAllNotificationsRead(
  userId: number
) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      OR: [
        { scheduledFor: null },
        { scheduledFor: { lte: new Date() } },
      ],
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function deleteNotification(
  userId: number,
  id: number
) {
  return prisma.notification.deleteMany({
    where: {
      id,
      userId,
    },
  });
}

export async function findNotificationPreferences(
  userId: number
) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function updateNotificationPreferences(
  userId: number,
  data: UpdateNotificationPreferenceInput
) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: {
      userId,
      ...data,
    },
    update: data,
  });
}
