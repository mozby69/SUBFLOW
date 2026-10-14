export type SubscriptionStatus =
  | "ACTIVE"
  | "DUE_SOON"
  | "OVERDUE"
  | "CANCELLED";

export type BillingCycle =
  | "MONTHLY"
  | "QUARTERLY"
  | "YEARLY";

export interface Subscription {
  id: number;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBilling: string;
  status: SubscriptionStatus;
  paymentCard: string;
  category: string;
  department: string;
}