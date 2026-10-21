import { authenticate } from "@/middleware/authenticate.middleware";
import { authorize } from "@/middleware/authorize.middleware";
import { Router } from "express";
import { createCreditCardController, getCreditCardsController } from "./credit-card.controller";

const router = Router();

router.use(authenticate);


router.post("/create-card",authorize({roles:["ADMIN","USER"]}),createCreditCardController);
router.get("/credit-list",authorize({ roles: ["ADMIN", "USER"] }),getCreditCardsController);



export default router;