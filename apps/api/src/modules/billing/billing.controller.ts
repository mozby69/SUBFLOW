
import type { Request, Response } from "express";
import { z } from "zod";



import {
  BillingError,
  getBillingsService,
  getBillingByIdService,
  generateBillingsService,
  cancelBillingService,
  recordBillingPaymentService,
} from "./billing.service";
import { billingIdSchema, billingQuerySchema, generateBillingSchema, recordBillingPaymentSchema } from "@repo/shared";

function handleBillingError(
  error: unknown,
  res: Response
) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof BillingError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Billing error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export async function getBillingsController(
  req: Request,
  res: Response
) {
  try {
    const query = billingQuerySchema.parse(req.query);
    const result = await getBillingsService(query);

    return res.status(200).json({
      success: true,
      message: "Billings retrieved successfully",
      ...result,
    });
  } catch (error) {
    return handleBillingError(error, res);
  }
}

export async function getBillingByIdController(
  req: Request,
  res: Response
) {
  try {
    const { id } = billingIdSchema.parse(req.params);

    const result = await getBillingByIdService(id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleBillingError(error, res);
  }
}

export async function generateBillingsController(
  req: Request,
  res: Response
) {
  try {
    const { throughDate } =
      generateBillingSchema.parse(req.body);

    const result =
      await generateBillingsService(throughDate);

    return res.status(200).json({
      success: true,
      message: "Billing generation completed",
      data: result,
    });
  } catch (error) {
    return handleBillingError(error, res);
  }
}

export async function cancelBillingController(
  req: Request,
  res: Response
) {
  try {
    const { id } = billingIdSchema.parse(req.params);

    const result = await cancelBillingService(id);

    return res.status(200).json({
      success: true,
      message: "Billing cancelled successfully",
      data: result,
    });
  } catch (error) {
    return handleBillingError(error, res);
  }
}


export async function recordBillingPaymentController(
  req: Request,
  res: Response
) {
  try {
    // Validate authenticated user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = billingIdSchema.parse(req.params);

    const input = recordBillingPaymentSchema.parse(req.body);

    const result = await recordBillingPaymentService(
      id,
      input,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: result,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    if (error instanceof BillingError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Record billing payment:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record payment",
    });
  }
}