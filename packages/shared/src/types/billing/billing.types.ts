import { BillingQueryInput } from "../../schemas";
import { BillingCycle } from "../user/subscription";

export type BillingStatus =
  | "SCHEDULED"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";


export interface BillingCreditCard {
  id: number;
  bank: string;
  nickname: string | null;
  last_four_digit: number;
}

export interface BillingSubscription {
  id: number;
  subscriptionName: string;
  billingCycle: BillingCycle;
  currencyCode: string;
  card: BillingCreditCard;
}

export interface Billing {
  id: number;
  subscriptionId: number;
  dueDate: string;
  amount: string;
  currencyCode: string;
  paidAmount: string;
  status: BillingStatus;
  remarks: string | null;
  createdAt: string;
  updatedAt?: string;
  subscription: BillingSubscription;
}

export interface BillingPayment {
  id: number;
  amount?: string | number;
  createdAt: string;
  [key: string]: unknown;
}

export interface BillingDetails extends Billing {
  payments: BillingPayment[];
}

export interface BillingPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BillingListResult {
  data: Billing[];
  pagination: BillingPagination;
}



export interface GenerateBillingResult {
  generated: number;
  skipped: number;
  processedSubscriptions: number;
  throughDate: string;
}



export type BillingQuery = BillingQueryInput;


export interface BillingApiResponse {
  success: boolean;
  message: string;
  data: Billing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
