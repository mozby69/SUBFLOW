
import { z } from "zod";

export const billingCycleSchema = z.enum([
  "MONTHLY",
  "YEARLY",
]);

export const subscriptionStatusSchema = z.enum([
  "ACTIVE",
  "PAUSED",
  "CANCELLED",
  "TRIAL",
]);

const dateSchema = z.string().refine(
  (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  },
  {
    message: "Invalid date. Use YYYY-MM-DD",
  }
);

export const createSubscriptionSchema = z
  .object({
    subscriptionName: z
      .string()
      .trim()
      .min(1, "Subscription name is required")
      .max(100),

    description: z
      .string()
      .trim()
      .optional()
      .nullable(),

    amount: z.coerce
      .number()
      .finite()
      .positive("Amount must be greater than zero"),

    billingCycle: billingCycleSchema,

    nextBilling: dateSchema,

    currencyCode: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("PHP"),

    categoryId: z.coerce
      .number()
      .int()
      .positive()
      .optional()
      .nullable(),

    category: z
      .string()
      .trim()
      .optional()
      .nullable(),

    status: subscriptionStatusSchema,

    creditCardId: z.coerce
      .number()
      .int()
      .positive(),

    startDate: dateSchema.optional().nullable(),

    endDate: dateSchema.optional().nullable(),

    anchorDay: z.coerce
      .number()
      .int()
      .min(1)
      .max(31)
      .optional(),

    autoRenew: z.boolean().default(true),

    website: z
      .string()
      .url()
      .max(255)
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.startDate &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date cannot be before start date",
      });
    }

    if (
      data.endDate &&
      data.nextBilling > data.endDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nextBilling"],
        message: "Next billing cannot be after end date",
      });
    }

    if (
      data.startDate &&
      data.nextBilling < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nextBilling"],
        message: "Next billing cannot be before start date",
      });
    }
  });

// Raw React Hook Form values
export type CreateSubscriptionFormInput = z.input<
  typeof createSubscriptionSchema
>;

// Validated output used by API, service and repository
export type CreateSubscriptionInput = z.output<
  typeof createSubscriptionSchema
>;

