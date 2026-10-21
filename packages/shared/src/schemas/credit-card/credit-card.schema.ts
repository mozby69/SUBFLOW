
import { z } from "zod";

export const cardStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
  "EXPIRED",
]);

export const createCreditCardSchema = z
  .object({
    bank: z
      .string()
      .trim()
      .min(1, "Bank is required")
      .max(100),

last_four_digit: z
  .union([
    z.string().regex(
      /^\d{4}$/,
      "Enter exactly 4 digits"
    ),
    z.number().int().min(0).max(9999),
  ])
  .transform((value) => Number(value)),

    network: z
      .string()
      .trim()
      .min(1, "Card network is required")
      .max(100),

    nickname: z
      .string()
      .trim()
      .max(100)
      .optional()
      .nullable(),

    creditLimit: z.coerce
      .number()
      .finite()
      .min(0, "Credit limit cannot be negative")
      .default(0),

    currencyCode: z
      .string()
      .trim()
      .length(3)
      .transform((value) => value.toUpperCase())
      .default("PHP"),

    statementDay: z.coerce
      .number()
      .int()
      .min(1)
      .max(31)
      .optional()
      .nullable(),

    dueDay: z.coerce
      .number()
      .int()
      .min(1)
      .max(31)
      .optional()
      .nullable(),

    status: cardStatusSchema.default("ACTIVE"),

    expiryMonth: z.coerce
      .number()
      .int()
      .min(1)
      .max(12)
      .optional()
      .nullable(),

    expiryYear: z.coerce
      .number()
      .int()
      .min(2000)
      .max(2100)
      .optional()
      .nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.expiryMonth == null) !==
      (data.expiryYear == null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryMonth"],
        message:
          "Expiry month and year must be provided together",
      });
    }
  });

// Form input: last_four_digit is string
export type CreateCreditCardFormInput = z.input<
  typeof createCreditCardSchema
>;

// Validated output: last_four_digit is number
export type CreateCreditCardInput = z.output<
  typeof createCreditCardSchema
>;