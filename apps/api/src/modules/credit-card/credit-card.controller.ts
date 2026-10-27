
import type { Request, Response } from "express";
import { z } from "zod";

import {
  createCreditCardSchema,
} from "@repo/shared";
import { createCreditCardService, getCreditCardsService } from "./credit-card.service";
import { sendSuccess } from "@/lib/http/response";

export async function createCreditCardController(
  req: Request,
  res: Response
) {
  try {
      if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validatedData =
      createCreditCardSchema.parse(req.body);

    const result =
      await createCreditCardService(
        validatedData,
        req.user.id
      );

    return res.status(201).json({
      success: true,
      message: "Credit card created successfully",
      data: result,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error("Create credit card error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create credit card",
    });
  }
}



export async function getCreditCardsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const cards =
      await getCreditCardsService();

    sendSuccess(res, cards);
  } catch (error: unknown) {
    console.error("Failed to fetch credit cards:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch credit cards",
    });
  }
}