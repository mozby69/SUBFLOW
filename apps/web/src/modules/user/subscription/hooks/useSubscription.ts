"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {  UpdateSubscriptionSchema } from "@repo/shared";
import * as serviceSubscription from '../services/subscription.service';




export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceSubscription.addSubscriptionService.create,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscription-display"],
      });
        await queryClient.invalidateQueries({
        queryKey: ["credit-card-list"],
      });
    },
  });
}


export function useGetSubscription(
  params: serviceSubscription.SubscriptionQueryParams
) {
  return useQuery<serviceSubscription.SubscriptionListResponse>({
    queryKey: [
      "subscription-display",
      params.page,
      params.limit,
      params.search ?? "",
    ],

    queryFn: () => serviceSubscription.getSubscriptionService(params),

 

    staleTime: 30_000,
  });
}



export function useEditSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateSubscriptionSchema;
    }) =>
      serviceSubscription.updateSubscriptionService(
        id,
        data
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["subscription-display"],
      });
       await queryClient.invalidateQueries({
        queryKey: ["credit-card-list"],
      });
    },
  });
}



export function useDeleteSubscription(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(id:number) => 
            serviceSubscription.deleteSubscriptionService(id),

          onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["subscription-display"],
            });
            queryClient.invalidateQueries({
                queryKey: ["credit-card-list"],
            });
            
        },
    })
}





 
export function useGetCreditCards() {
  return useQuery({
    queryKey: ["credit-card-list"],
    queryFn: serviceSubscription.getCreditCardsService,
    staleTime: 1000 * 60 * 5,
  });
}