import { Router } from 'express';
import authRoutes from "../modules/auth/auth.routes";
import accessControlRoutes from "@/modules/admin/access-control/access-control.routes";
import dashboardRoutes from "@/modules/admin/dashboard/dashboard.routes";
import subscriptionRoutes from "@/modules/subscription/subscription.routes";
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


export default router;