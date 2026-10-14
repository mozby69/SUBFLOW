import { Router } from "express";
import * as SubscriptionControllerList from "./subscription.controller";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";


const router = Router();

router.use(authenticate);

router.post("/create-subscription",authorize({roles:["ADMIN","USER"]}),SubscriptionControllerList.createSubscriptionController);




export default router;
