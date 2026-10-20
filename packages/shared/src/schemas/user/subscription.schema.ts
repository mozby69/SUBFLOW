
import { z } from "zod";

export const addSubscriptionSchema = z.object({
  subscriptionName: z.string().trim().min(2, "Enter a subscription name"),
  amount: z.coerce.number().positive("Amount must be greater than zero").finite("Enter a valid amount"),
  billingCycle: z.enum(["MONTHLY","YEARLY"]),
  nextBilling: z.string().date("Enter a valid billing date"),
  status: z.enum([
    "ACTIVE",
    "PAUSED",
    "TRIAL",
    "CANCELLED",
  ]),

  category: z.string().min(1, "Select a category"),
  creditCardId: z.coerce.number().int().positive("Select a credit card"),
});


// Update uses the same editable fields
export const updateSubscriptionSchema = addSubscriptionSchema;

export type UpdateSubscriptionSchema = z.infer<typeof updateSubscriptionSchema>
export type AddSubscriptionInput = z.input<typeof addSubscriptionSchema>;
export type AddSubscriptionValues = z.infer<typeof addSubscriptionSchema>









export const creditCardSchema = z.object({
  bank: z.string().trim().min(2, "Enter a bank name"),
  last_four_digit: z.coerce.number().positive("Amount must be greater than zero").finite("Enter a valid amount"),
  network: z.string().min(1,"network is required"),
  nickname: z.string().trim().optional(),
});



export type CreditCardInput = z.input<typeof creditCardSchema>;
export type CreditCardSchema = z.output<typeof creditCardSchema>;
