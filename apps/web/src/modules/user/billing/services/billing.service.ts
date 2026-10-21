import api from "@/lib/api/api-client";
import { ApiResponse, Billing, BillingApiResponse, BillingDetails, BillingListResult, BillingQueryInput, GenerateBillingResult } from "@repo/shared";



// Match these paths to billing.routes.ts.
const ENDPOINTS = {
  list: "/billing",
  details: (id: number) => `/billing/${id}`,
  cancel: (id: number) => `/billing/${id}/cancel`,
  generate: "/billing/generate",
};

export const billingService = {
  async getBillings(
    query: BillingQueryInput
  ): Promise<BillingListResult> {
    const response = await api.get<BillingApiResponse>(
      ENDPOINTS.list,
      {
        params: query,
      }
    );

    return {
      data: response.data.data,
      pagination: response.data.pagination,
    };
  },

  async getBillingById(
    id: number
  ): Promise<BillingDetails> {
    const response = await api.get<
      ApiResponse<BillingDetails>
    >(ENDPOINTS.details(id));

    return response.data.data;
  },

  async cancelBilling(id: number): Promise<Billing> {
    const response = await api.patch<ApiResponse<Billing>>(
      ENDPOINTS.cancel(id)
    );

    return response.data.data;
  },

  async generateBillings(
    throughDate: string
  ): Promise<GenerateBillingResult> {
    const response = await api.post<
      ApiResponse<GenerateBillingResult>
    >(ENDPOINTS.generate, {
      throughDate,
    });

    return response.data.data;
  },

  
async recordPayment(params: {
  billingId: number;
  amount: number;
  paymentDate: string;
  referenceNumber?: string;
  remarks?: string;
}) {
  const response = await api.post(
    `/billing/${params.billingId}/payments`,
    {
      amount: params.amount,
      paymentDate: params.paymentDate,
      referenceNumber: params.referenceNumber,
      remarks: params.remarks,
    }
  );

  return response.data;
},
};
