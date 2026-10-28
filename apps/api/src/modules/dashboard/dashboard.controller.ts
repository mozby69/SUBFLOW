import type { Request, Response, NextFunction } from "express";

import { getDashboardOverviewService } from "./dashboard.service";

import type { DashboardPeriod } from "./dashboard.repository";

export async function getDashboardOverviewController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const period = req.query.period ?? "month";

    if (
      typeof period !== "string" ||
      !["month", "year", "all"].includes(period)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reporting period",
      });
    }

    const data = await getDashboardOverviewService(
      userId,
      period as DashboardPeriod
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}