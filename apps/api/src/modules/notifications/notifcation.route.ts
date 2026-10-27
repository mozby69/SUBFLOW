
import { Router } from "express";
import { deleteNotificationController, getNotificationsController, getPreferencesController, getUnreadCountController, markAllReadController, markNotificationReadController, updatePreferencesController } from "./notifcation.controller";

const router = Router();

// Apply your existing authentication middleware
// when mounting this router in the application.

router.get("/", getNotificationsController);

router.get(
  "/unread-count",
  getUnreadCountController
);

router.get(
  "/preferences",
  getPreferencesController
);

router.patch(
  "/preferences",
  updatePreferencesController
);

router.patch(
  "/read-all",
  markAllReadController
);

router.patch(
  "/:id/read",
  markNotificationReadController
);

router.delete(
  "/:id",
  deleteNotificationController
);

export default router;
