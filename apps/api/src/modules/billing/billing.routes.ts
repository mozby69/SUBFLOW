
import { Router } from "express";

import {
  getBillingsController,
  getBillingByIdController,
  generateBillingsController,
  cancelBillingController,
} from "./billing.controller";

const router = Router();

// Attach your existing authentication and permission
// middleware to these routes before mounting them.

router.get("/", getBillingsController);

router.post(
  "/generate",
  generateBillingsController
);

router.get(
  "/:id",
  getBillingByIdController
);

router.patch(
  "/:id/cancel",
  cancelBillingController
);

export default router;
