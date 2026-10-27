
import { z } from "zod";

export const notificationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  unreadOnly: z.coerce.boolean().optional(),
});

export const notificationIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateNotificationPreferenceSchema = z.object({
  subscriptionReminder: z.boolean().optional(),
  billingReminder: z.boolean().optional(),
  overdueAlert: z.boolean().optional(),
  cardReminder: z.boolean().optional(),
  paymentConfirmation: z.boolean().optional(),
  reminderDays: z.number().int().min(1).max(30).optional(),
}).strict();

export type NotificationQueryInput =
  z.infer<typeof notificationQuerySchema>;

export type UpdateNotificationPreferenceInput =
  z.infer<typeof updateNotificationPreferenceSchema>;
