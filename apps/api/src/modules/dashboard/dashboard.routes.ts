import { Router } from "express";

import { getDashboardOverviewController } from "./dashboard.controller";
import { authenticate } from "@/middleware/authenticate.middleware";


const router = Router();

router.get(
  "/overview",
  authenticate,
  getDashboardOverviewController
);

export default router;