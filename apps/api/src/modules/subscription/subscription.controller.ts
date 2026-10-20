import { sendSuccess } from '@/lib/http/response';
import * as subscriptionServiceList from './subscription.service';
import type { NextFunction, Request, Response } from "express";


export async function createSubscriptionController(req:Request,res:Response){
    try{
        const data = await subscriptionServiceList.createSubscription(req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occured in controller ${error}`);
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




export async function createCreditCardController(req:Request,res:Response){
    try{
        const data = await subscriptionServiceList.createCreditCard(req.body);
          sendSuccess(res, data)
    }
    catch(error){
        console.error(`error occured in controller ${error}`);
    }
}




export async function getCreditCardsController( req: Request,res: Response): Promise<void> {
  try {
    const cards = await subscriptionServiceList.getCreditCards();

    sendSuccess(res, cards);
  } catch (error: unknown) {
    console.error("Failed to fetch credit cards:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch credit cards",
    });
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
