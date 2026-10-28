import { useQuery } from "@tanstack/react-query";
import { DashboardPeriod, getDashboardOverview } from "../services/dashboard.service";



export function useDashboard(
  period: DashboardPeriod
) {
  return useQuery({
    queryKey: ["dashboard", "overview", period],
    queryFn: () => getDashboardOverview(period),
    staleTime: 60 * 1000,
  });
}