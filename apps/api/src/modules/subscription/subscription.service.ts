import { SubscriptionSchemaType } from '@repo/shared';
import * as subscriptionRepositoryList from './subscription.repository';




export async function createSubscription(params: SubscriptionSchemaType) {
    const {
        subscriptionName,
        amount,
        billingCycle,
        nextBilling,
        paymentCard,
        category,
        status,
    } = params;

    const user = await subscriptionRepositoryList.addSubscription({
            subscriptionName,
            amount,
            billingCycle,
            nextBilling:new Date(`${nextBilling}T00:00:00.000Z`),
            paymentCard,
            category,
            status,

        });

    return user;
}
