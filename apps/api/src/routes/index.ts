import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes";
import accessControlRoutes from "@/modules/admin/access-control/access-control.routes";
import dashboardRoutes from "@/modules/admin/dashboard/dashboard.routes";
import subscriptionRoutes from "@/modules/subscription/subscription.routes";
import bilingRoutes from "@/modules/billing/billing.routes";
import creditCardRoutes from "@/modules/credit-card/credit-card.route";
import notificationRoutes from "@/modules/notifications/notifcation.route";
import calendarRoutes from "@/modules/calendar/calendar.route";
import { authenticate } from '@/middleware/authenticate.middleware';

const router = Router();

router.use("/auth", authRoutes);

router.use(
    "/admin/access-control",
    authenticate,
    accessControlRoutes
);

router.use(
    "/admin/dashboard",
    authenticate,
    dashboardRoutes
);

router.use("/subscription",authenticate,subscriptionRoutes);

router.use("/billing", authenticate, bilingRoutes )
router.use("/credit-card", authenticate, creditCardRoutes )
router.use("/notifications", authenticate, notificationRoutes )
router.use("/calendar",authenticate,calendarRoutes);


export default router;