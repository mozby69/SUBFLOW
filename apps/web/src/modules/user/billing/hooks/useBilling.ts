
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { billingService } from "../services/billing.service";
import { BillingQuery } from "@repo/shared";

export const billingKeys = {
  all: ["billing"] as const,
  lists: () => [...billingKeys.all, "list"] as const,
  list: (query: BillingQuery) =>
    [...billingKeys.lists(), query] as const,
  details: () => [...billingKeys.all, "detail"] as const,
  detail: (id: number) =>
    [...billingKeys.details(), id] as const,
};

export function useGetBillings(query: BillingQuery) {
  return useQuery({
    queryKey: billingKeys.list(query),
    queryFn: () => billingService.getBillings(query),
    placeholderData: (previousData) => previousData,
  });
}

export function useGetBillingById(id: number | null) {
  return useQuery({
    queryKey: billingKeys.detail(id ?? 0),
    queryFn: () => billingService.getBillingById(id!),
    enabled: id !== null,
  });
}

export function useCancelBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billingService.cancelBilling,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: billingKeys.all,
      });
    },
  });
}

export function useGenerateBillings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: billingService.generateBillings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: billingKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: ["subscription-display"],
        }),
      ]);
    },
  });
}



export function useRecordBillingPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      billingId: number;
      amount: number;
      paymentDate: string;
      referenceNumber?: string;
      remarks?: string;
    }) => billingService.recordPayment(params),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: billingKeys.all,
      });
    },
  });
}