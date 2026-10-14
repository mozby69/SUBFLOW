"use client";

import {useMutation, useQueryClient} from "@tanstack/react-query";
import { subscriptionService } from "../services/subscription.service";



export const subscriptionQueryKeys = {
  all: ["subscriptions"] as const,

  lists: () =>
    [...subscriptionQueryKeys.all, "list"] as const,
};



export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscriptionService.create,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subscriptionQueryKeys.all,
      });
    },
  });
}