import api from "@/lib/api/api-client";
import { ApiResponse, CreditCard2, CreditCardSchema } from "@repo/shared";









export const createAddCardService = async (params: CreditCardSchema): Promise<ApiResponse<CreditCardSchema>> => {
    const res = await api.post<ApiResponse<CreditCardSchema>>(
        "/subscription/create-card",
        params  
    );

    return res.data;
};



export const updateCreditCardService = async (
  id: number,
  data: CreditCardSchema
): Promise<ApiResponse<CreditCard2>> => {
  const response = await api.patch<ApiResponse<CreditCard2>>(
    `/subscription/update-card/${id}`,
    data
  );

  return response.data;
};