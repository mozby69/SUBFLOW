import { AddSubscriptionValues, CreateSubscriptionInput, CreditCard2, CreditCardSchema, UpdateSubscriptionSchema } from '@repo/shared';
import * as subscriptionRepositoryList from './subscription.repository';
import { QueryParams } from '../../../../../packages/shared/src/types/query.types';


export async function createSubscription(
  params: CreateSubscriptionInput
) {
  const billingDate = new Date(
    `${params.nextBilling}T00:00:00.000Z`
  );

  return subscriptionRepositoryList.addSubscription({
    subscriptionName: params.subscriptionName,
    description: params.description ?? null,

    amount: params.amount,
    billingCycle: params.billingCycle,
    nextBilling: billingDate,

    currencyCode: params.currencyCode,

    categoryId: params.categoryId ?? null,
    category: params.category ?? null,

    status: params.status,
    creditCardId: params.creditCardId,

    startDate: params.startDate
      ? new Date(`${params.startDate}T00:00:00.000Z`)
      : null,

    endDate: params.endDate
      ? new Date(`${params.endDate}T00:00:00.000Z`)
      : null,

    anchorDay:
      params.anchorDay ?? billingDate.getUTCDate(),

    autoRenew: params.autoRenew,
    website: params.website ?? null,
  });
}


export async function getSubscriptionService(params: QueryParams) {
  const result =
    await subscriptionRepositoryList.displaySubscription(params);

  const normalized = result.data.map((sub) => ({
    id: sub.id,

    subscriptionName: sub.subscriptionName,

    amount: Number(sub.amount ?? 0),

    billingCycle: sub.billingCycle,

    nextBilling: sub.nextBilling
      ? sub.nextBilling.toISOString()
      : null,

    paymentCard: sub.paymentCard ?? "",

    category: sub.category ?? "",

    status: sub.status,


    creditCardId: sub.creditCardId,

    startDate: sub.startDate,
    endDate: sub.endDate,
    anchorDay: Number(sub.anchorDay ?? 0),


    card: {
      id: sub.card.id,
      bank: sub.card.bank,
      network: sub.card.network,
      last_four_digit: sub.card.last_four_digit,
      nickname: sub.card.nickname,
    },
  }));

  return {
    data: normalized,
    pagination: result.pagination,
  };
}



export async function updateSubscription(id:number, data:UpdateSubscriptionSchema){
    const result = await subscriptionRepositoryList.editSubscription(id,data);
    return result;
}


export async function deleteSubscription(id:number){
    const result = await subscriptionRepositoryList.deleteSubscription(id);
    return result;
}







export async function updateCard(id:number, data:CreditCard2){
    const result = await subscriptionRepositoryList.editCard(id,data);
    return result;
}

