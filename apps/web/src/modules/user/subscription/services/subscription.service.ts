import api from "@/lib/api/api-client";
import type {
  AddSubscriptionValues,
  ApiResponse,
  CreditCard2,
  Subscription,
  UpdateSubscriptionSchema,
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

export type Params = {
    search?: string;
};


export const addSubscriptionService = {
  async create(payload: AddSubscriptionValues): Promise<AddSubscriptionValues> {
    const response = await api.post<ApiResponse<AddSubscriptionValues>>(
      "/subscription/create-subscription",
      payload
    );

    return response.data.data;
  },
};


export interface SubscriptionListResponse {
  success: boolean;
  data: Subscription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SubscriptionQueryParams {
  page: number;
  limit: number;
  search?: string;
}

export const getSubscriptionService = async (
  params: SubscriptionQueryParams
): Promise<SubscriptionListResponse> => {
  const response = await api.get<SubscriptionListResponse>(
    "/subscription/display-sub",
    {
      params,
    }
  );

  return response.data;
};





export const updateSubscriptionService = async (
  id: number,
  data: UpdateSubscriptionSchema
): Promise<ApiResponse<Subscription>> => {
  const response = await api.patch<ApiResponse<Subscription>>(
    `/subscription/update-sub/${id}`,
    data
  );

  return response.data;
};



export async function deleteSubscriptionService(id: number): Promise<ApiResponse<UpdateSubscriptionSchema>> {
  const res = await api.delete<ApiResponse<UpdateSubscriptionSchema>
  >(
    `/subscription/delete-sub/${id}`
  );
  return res.data;
}





export async function getCreditCardsService():
  Promise<ApiResponse<CreditCard2[]>> {

  const response = await api.get<ApiResponse<CreditCard2[]>>(
    "/subscription/credit-list"
  );

  return response.data;
}