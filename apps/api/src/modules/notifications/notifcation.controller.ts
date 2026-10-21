
import type { Request, Response } from "express";
import { z } from "zod";

import {
  notificationQuerySchema,
  notificationIdSchema,
  updateNotificationPreferenceSchema,
} from "@repo/shared";

import * as service from "./notifcation.service";

function getUserId(req: Request): number {
  const userId = req.user?.id;

  if (userId == null) {
    throw new service.NotificationError(
      401,
      "Unauthorized"
    );
  }

  return Number(userId);
}

function handleError(error: unknown, res: Response) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  if (error instanceof service.NotificationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error("Notification error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}

export async function getNotificationsController(
  req: Request,
  res: Response
) {
  try {
    const userId = getUserId(req);

    const query = notificationQuerySchema.parse(
      req.query
    );

    const result =
      await service.getNotificationsService(
        userId,
        query
      );

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      ...result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getUnreadCountController(
  req: Request,
  res: Response
) {
  try {
    const result =
      await service.getUnreadCountService(
        getUserId(req)
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function markNotificationReadController(
  req: Request,
  res: Response
) {
  try {
    const { id } = notificationIdSchema.parse(
      req.params
    );

    const result =
      await service.markNotificationReadService(
        getUserId(req),
        id
      );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function markAllReadController(
  req: Request,
  res: Response
) {
  try {
    const result = await service.markAllReadService(
      getUserId(req)
    );

    return res.status(200).json({
      success: true,
      message: "Notifications marked as read",
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function deleteNotificationController(
  req: Request,
  res: Response
) {
  try {
    const { id } = notificationIdSchema.parse(
      req.params
    );

    const result =
      await service.deleteNotificationService(
        getUserId(req),
        id
      );

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function getPreferencesController(
  req: Request,
  res: Response
) {
  try {
    const result =
      await service.getPreferencesService(
        getUserId(req)
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}

export async function updatePreferencesController(
  req: Request,
  res: Response
) {
  try {
    const data =
      updateNotificationPreferenceSchema.parse(
        req.body
      );

    const result =
      await service.updatePreferencesService(
        getUserId(req),
        data
      );

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated",
      data: result,
    });
  } catch (error) {
    return handleError(error, res);
  }
}
