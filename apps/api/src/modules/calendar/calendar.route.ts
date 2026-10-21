import { Router } from "express";
import * as CalendarControllerList from "./calendar.controller";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";


const router = Router();

router.use(authenticate);

router.get("/calendar-view",authorize({ roles: ["USER"] }),CalendarControllerList.getBillingCalendarController);


export default router;
