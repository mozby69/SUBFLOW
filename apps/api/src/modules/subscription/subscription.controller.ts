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