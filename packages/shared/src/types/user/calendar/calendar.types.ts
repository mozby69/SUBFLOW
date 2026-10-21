
import type {
  BillingCycle,
  SubscriptionStatus,
} from "@repo/shared";

export type CalendarIndicator =
  | "PAID"
  | "OVERDUE"
  | "DUE_SOON"
  | "UPCOMING"
  | "CANCELLED";

export interface CalendarBilling {
  id: number;
  subscriptionId: number;
  subscriptionName: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  currencyCode: string;
  billingStatus: string;
  subscriptionStatus: SubscriptionStatus;
  calendarIndicator: CalendarIndicator;
  billingCycle: BillingCycle;
  category: string | null;
  creditCard: {
    id: number;
    bank: string;
    network: string;
    lastFourDigit: number;
  };
}

export interface CalendarSummary {
  totalBills: number;
  totalAmount: number;
  overdueCount: number;
  dueSoonCount: number;
}

export interface BillingCalendarResult {
  year: number;
  month: number;
  data: CalendarBilling[];
  summary: CalendarSummary;
}

export interface BillingCalendarResponse {
  success: boolean;
  data: BillingCalendarResult;
}
