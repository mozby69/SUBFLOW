import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as serviceCard from '../services/creditCard';
import { CreditCard2, CreditCardSchema } from "@repo/shared";




export function useCreateCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: serviceCard.createAddCardService,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["credit-card-list"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["subscription-display"],
        }),
      ]);
    },
  });
}





export function useEditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreditCardSchema;
    }) =>
      serviceCard.updateCreditCardService(id, data),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["credit-card-list"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["subscription-display"],
        }),
      ]);
    },
  });
}


export function useGetCreditCards() {
  return useQuery({
    queryKey: ["credit-card-list"],
    queryFn: serviceCard.getCreditCardsService,
    staleTime: 1000 * 60 * 5,
  });
}