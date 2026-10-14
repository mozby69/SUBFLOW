import api from "@/lib/api/api-client";
import type {
  AddSubscriptionValues,
  ApiResponse,
} from "@repo/shared";


export interface CreatedSubscription {
  id: string | number;
  subscriptionName: string;
  amount: number | string;
  billingCycle: string;
  nextBilling: string;
  status: AddSubscriptionValues["status"];
  paymentCard: string;
  category: string;
}



export const subscriptionService = {create: async (payload: AddSubscriptionValues): Promise<CreatedSubscription> => {
    const response = await api.post<ApiResponse<CreatedSubscription>>(
      "/subscription/create-subscription",
      payload
    );

    return response.data.data;
  },
};