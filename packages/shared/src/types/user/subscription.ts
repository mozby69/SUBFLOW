export type SubscriptionStatus =
  | "ACTIVE"
  | "PAUSED"
  | "TRIAL"
  | "CANCELLED";

export type BillingCycle =
  | "MONTHLY"
  | "YEARLY";

export interface Subscription {
  id: number;
  subscriptionName: string;
  amount: number;
  billingCycle: BillingCycle;
  nextBilling: string | null;
  status: SubscriptionStatus;
  paymentCard?: string;
  category: string;

  creditCardId: number;

  card: {
    id: number;
    bank: string;
    network: string;
    last_four_digit: number;
    nickname: string | null;
  };
}


export interface SubscriptionPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubscriptionListResult {
  data: Subscription[];
  pagination: SubscriptionPagination;
}




export interface CreditCard2 {
  id: number;
  bank: string;
  last_four_digit: number;
  network: string;
  nickname?: string | null;
  subscriptionCount?: number;
  monthlyEquivalent?: number;
}

