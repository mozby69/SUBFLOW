import api from "@/lib/api/api-client";
import { ApiResponse, BillingCalendarResponse, BillingCalendarResult, CreateCreditCardInput, CreditCard2, CreditCardSchema } from "@repo/shared";




export interface BillingCalendarParams {
  year: number;
  month: number;
}

export async function getBillingCalendarService(
  params: BillingCalendarParams
): Promise<BillingCalendarResult> {
  const response = await api.get<BillingCalendarResponse>(
    "/calendar/calendar-view",
    {
      params,
    }
  );

  return response.data.data;
}
