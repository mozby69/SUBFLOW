
import cron from "node-cron";
import { generateBillingsService } from "@/modules/billing/billing.service";
import { logger } from "@/lib/logger/logger";

const TIMEZONE = "Asia/Manila";

let isBillingRunning = false;

export async function runBillingGeneration() {
  if (isBillingRunning) {
    logger.warn("[BILLING JOB] Already running. Skipping.");
    return;
  }

  isBillingRunning = true;

  try {
    logger.info("[BILLING JOB] Starting generation");

    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);

    const getPart = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);

    const year = getPart("year");
    const month = getPart("month");
    const day = getPart("day");

    // Generate billings 30 days ahead
    const horizon = new Date(
      Date.UTC(year, month - 1, day + 30)
    );

    const throughDate = horizon.toISOString().slice(0, 10);

    const result = await generateBillingsService(throughDate);

    logger.info(
      `[BILLING JOB] Completed: ${JSON.stringify(result)}`
    );
  } catch (error) {
    logger.error(
      `[BILLING JOB] Generation failed: ${String(error)}`
    );
  } finally {
    isBillingRunning = false;
  }
}

export function startBillingJob() {
  cron.schedule(
    "5 0 * * *",
    runBillingGeneration,
    {
      timezone: TIMEZONE,
      noOverlap: true,
    }
  );

  logger.info(
    "[BILLING JOB] Scheduled daily at 12:05 AM Asia/Manila"
  );
}
