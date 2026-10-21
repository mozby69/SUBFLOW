import { Router } from "express";
import * as SubscriptionControllerList from "./subscription.controller";
import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";


const router = Router();

router.use(authenticate);

router.post("/create-subscription",authorize({roles:["ADMIN","USER"]}),SubscriptionControllerList.createSubscriptionController);
router.get("/display-sub",authorize({roles:["ADMIN","USER"]}),SubscriptionControllerList.getSubscriptionController);
router.patch('/update-sub/:id',authorize({roles:["USER"]}),SubscriptionControllerList.updatePensionerController);
router.delete('/delete-sub/:id',authorize({roles:["USER"]}),SubscriptionControllerList.deleteSubscriptionController);
router.patch('/update-card/:id',authorize({roles:["USER"]}),SubscriptionControllerList.updateCardController);

export default router;
