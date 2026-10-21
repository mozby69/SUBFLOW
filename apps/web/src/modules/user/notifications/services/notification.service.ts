import api from "@/lib/api/api-client";
import { NotificationListResponse, NotificationPreference, NotificationQuery, UpdateNotificationPreference } from "@repo/shared";




const BASE_URL = "/notifications";

export const notificationService = {
  async getNotifications(
    params: NotificationQuery = {}
  ): Promise<NotificationListResponse> {
    const response = await api.get(BASE_URL, {
      params,
    });

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get(
      `${BASE_URL}/unread-count`
    );

    return response.data.data.count;
  },

  async markAsRead(id: number) {
    const response = await api.patch(
      `${BASE_URL}/${id}/read`
    );

    return response.data;
  },

  async markAllAsRead() {
    const response = await api.patch(
      `${BASE_URL}/read-all`
    );

    return response.data;
  },

  async deleteNotification(id: number) {
    const response = await api.delete(
      `${BASE_URL}/${id}`
    );

    return response.data;
  },

  async getPreferences(): Promise<NotificationPreference> {
    const response = await api.get(
      `${BASE_URL}/preferences`
    );

    return response.data.data;
  },

  async updatePreferences(
    data: UpdateNotificationPreference
  ): Promise<NotificationPreference> {
    const response = await api.patch(
      `${BASE_URL}/preferences`,
      data
    );

    return response.data.data;
  },
};
