
import { z } from "zod";

const dateString = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be in YYYY-MM-DD format"
);

export const generateBillingSchema = z.object({
  throughDate: dateString,
});

export const billingQuerySchema = z.object({
  status: z.enum([
    "SCHEDULED",
    "PARTIALLY_PAID",
    "PAID",
    "OVERDUE",
    "CANCELLED",
  ]).optional(),

  subscriptionId: z.coerce.number().int().positive().optional(),

  fromDate: dateString.optional(),
  toDate: dateString.optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const billingIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type GenerateBillingInput =
  z.infer<typeof generateBillingSchema>;

export type BillingQueryInput =
  z.infer<typeof billingQuerySchema>;
