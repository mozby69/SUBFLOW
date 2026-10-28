import api from "@/lib/api/api-client";

export type DashboardPeriod = "month" | "year" | "all";

export async function getDashboardOverview(
  period: DashboardPeriod
) {
  const response = await api.get(
    "/dashboard/overview",
    {
      params: { period },
    }
  );

  return response.data.data;
}