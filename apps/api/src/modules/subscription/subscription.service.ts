import { AddSubscriptionValues, CreditCard2, CreditCardSchema, UpdateSubscriptionSchema } from '@repo/shared';
import * as subscriptionRepositoryList from './subscription.repository';
import { QueryParams } from '../../../../../packages/shared/src/types/query.types';


export async function createSubscription(params: AddSubscriptionValues) {
  const {
    subscriptionName,
    amount,
    billingCycle,
    nextBilling,
    category,
    status,
    creditCardId,
  } = params;

  return subscriptionRepositoryList.addSubscription({
    subscriptionName,
    amount,
    billingCycle,
    nextBilling: new Date(`${nextBilling}T00:00:00.000Z`),
    category,
    status,
    creditCardId,
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


export async function createCreditCard( params: CreditCardSchema) {
  const {
    bank,
    last_four_digit,
    network,
    nickname,
  } = params;

  return subscriptionRepositoryList.addCard({
    bank,
    last_four_digit,
    network,
    nickname: nickname ?? "",
  });
}




export async function getCreditCards() {
  return subscriptionRepositoryList.getCreditCards();
}



export async function updateCard(id:number, data:CreditCard2){
    const result = await subscriptionRepositoryList.editCard(id,data);
    return result;
}

