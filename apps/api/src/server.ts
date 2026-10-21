import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { initializeSocket } from "./config/socket.config";
import { logger } from "@/lib/logger/logger";
import { generateBillingReminders, startNotificationScheduler } from "./modules/notifications/notifcation.scheduler";
import { resolveSubscriptionOwner } from "./modules/notifications/notification.owner";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

// ---------------------------
// Socket.io
// ---------------------------
export const io = initializeSocket(server);

// ---------------------------
// Start Server (LAN Ready)
// ---------------------------
logger.info("Server started");

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);

   // ---------------------------
  // Notification Scheduler
  // ---------------------------
  if (process.env.RUN_NOTIFICATION_SCHEDULER === "true") {
    startNotificationScheduler(resolveSubscriptionOwner);

    logger.info("Notification scheduler initialized");

    // TEMPORARY: Test immediately
  void generateBillingReminders(resolveSubscriptionOwner)
    .then((result) => {
      logger.info(
        { result },
        "Notification scheduler test completed"
      );
    })
    .catch((error) => {
      logger.error(
        { error },
        "Notification scheduler test failed"
      );
    });
  }
});