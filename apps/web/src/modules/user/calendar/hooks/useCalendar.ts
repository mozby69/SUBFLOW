
import { useQuery } from "@tanstack/react-query";

import * as calendarService from "../services/calendar";

export function useBillingCalendar(
  params: calendarService.BillingCalendarParams
) {
  return useQuery({
    queryKey: [
      "billing-calendar",
      params.year,
      params.month,
    ],
    queryFn: () => calendarService.getBillingCalendarService(params),
    staleTime: 30_000,
  });
}
