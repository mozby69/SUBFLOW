import api from "@/lib/api/api-client";
import { ApiResponse, CreateCreditCardInput, CreditCard2, CreditCardSchema } from "@repo/shared";









export const createAddCardService = async (
  params: CreateCreditCardInput
) => {
  const res = await api.post(
    "/credit-card/create-card",
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


export async function getCreditCardsService():
  Promise<ApiResponse<CreditCard2[]>> {

  const response = await api.get<ApiResponse<CreditCard2[]>>(
    "/credit-card/credit-list"
  );

  return response.data;
}