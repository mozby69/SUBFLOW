
"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationService } from "../services/notification.service";
import { NotificationQuery, UpdateNotificationPreference } from "@repo/shared";



export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () => ["notifications", "list"] as const,

  list: (query: NotificationQuery) =>
    ["notifications", "list", query] as const,

  unreadCount: () =>
    ["notifications", "unread-count"] as const,

  preferences: () =>
    ["notifications", "preferences"] as const,
};

export function useGetNotifications(
  query: NotificationQuery = {}
) {
  return useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () =>
      notificationService.getNotifications(query),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}

export function useGetUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: notificationService.getUnreadCount,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      notificationService.markAsRead(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      notificationService.markAllAsRead(),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      notificationService.deleteNotification(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
}

export function useGetNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: notificationService.getPreferences,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UpdateNotificationPreference
    ) => notificationService.updatePreferences(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: notificationKeys.preferences(),
      });
    },
  });
}
