import { sendSuccess } from '@/lib/http/response';
import * as subscriptionServiceList from './subscription.service';
import type { NextFunction, Request, Response } from "express";
import { createSubscriptionSchema } from '@repo/shared';
import z from 'zod';


export async function createSubscriptionController(
  req: Request,
  res: Response
) {
  try {

   if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validated =
      createSubscriptionSchema.parse(req.body);

    const result =
      await subscriptionServiceList.createSubscription(
        validated,
         req.user.id
      );

    return res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    console.error("Create subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create subscription",
    });
  }
}


export async function getSubscriptionController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const result = await subscriptionServiceList.getSubscriptionService({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,

            search:
                typeof req.query.search === "string"
                    ? req.query.search.trim()
                    : undefined,
        
        });

        sendSuccess(res, result.data,{
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
}






export async function updatePensionerController(req:Request,res:Response){
    try{
        const data = await subscriptionServiceList.updateSubscription(Number(req.params.id), req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occure in controller ${error}`);
    }
}



export async function deleteSubscriptionController(req:Request, res:Response){
  try{
     const id = Number(req.params.id);
      const data = await subscriptionServiceList.deleteSubscription(id);
      sendSuccess(res,data);
  } 
  catch(error){ 
    console.log(`error occured ${error}`);
  }
}









export async function updateCardController(req:Request,res:Response){
    try{
        const data = await subscriptionServiceList.updateCard(Number(req.params.id), req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occure in controller ${error}`);
    }
}
