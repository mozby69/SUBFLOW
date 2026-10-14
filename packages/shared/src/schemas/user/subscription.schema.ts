
import { z } from "zod";

export const addSubscriptionSchema = z.object({
  subscriptionName: z.string().trim().min(2, "Enter a subscription name"),
  amount: z.coerce.number().positive("Amount must be greater than zero").finite("Enter a valid amount"),

  billingCycle: z.enum([
    "MONTHLY",
    "YEARLY",
  ]),

  nextBilling: z.string().date("Enter a valid billing date"),

  status: z.enum([
    "ACTIVE",
    "DUE_SOON",
    "OVERDUE",
    "CANCELLED",
  ]),

  paymentCard: z.string().min(1, "Select a payment card"),
  category: z.string().min(1, "Select a category"),

});

export type AddSubscriptionInput = z.input<typeof addSubscriptionSchema>;
export type AddSubscriptionValues = z.output<typeof addSubscriptionSchema>;
export type SubscriptionSchemaType = z.infer<typeof addSubscriptionSchema>
