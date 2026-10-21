
export type NotificationType =
  | "BILLING_REMINDER"
  | "PAYMENT_DUE"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "BUDGET_WARNING"
  | "SUBSCRIPTION_EXPIRING"
  | "CARD_STATEMENT"
  | "SYSTEM";

export interface Notification {
  id: number;
  subscriptionId: number | null;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  scheduledFor: string | null;
  sentAt: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationQuery {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}

export interface NotificationListResponse {
  data: Notification[];
  pagination: NotificationPagination;
}

export interface NotificationPreference {
  id: number;
  userId: number;
  subscriptionReminder: boolean;
  billingReminder: boolean;
  overdueAlert: boolean;
  cardReminder: boolean;
  paymentConfirmation: boolean;
  reminderDays: number;
  createdAt: string;
  updatedAt: string;
}

export type UpdateNotificationPreference = Partial<
  Pick<
    NotificationPreference,
    | "subscriptionReminder"
    | "billingReminder"
    | "overdueAlert"
    | "cardReminder"
    | "paymentConfirmation"
    | "reminderDays"
  >
>;
