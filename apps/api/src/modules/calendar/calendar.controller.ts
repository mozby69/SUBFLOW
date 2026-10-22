import type { Request, Response } from "express";
import { z } from "zod";

import * as calendarServiceList from './calendar.service';


const calendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export async function getBillingCalendarController( req: Request, res: Response): Promise<void> {
  const parsed = calendarQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Invalid calendar month or year",
      errors: parsed.error.flatten(),
    });
    return;
  }

  try {
    const result = await calendarServiceList.getBillingCalendarService(parsed.data);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    console.error("Billing calendar error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve billing calendar",
    });
  }
}
