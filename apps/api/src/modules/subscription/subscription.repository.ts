import { prisma } from "@/lib/database/prisma";
import { billing_cycle, status_subscription } from "../../../generated/prisma/enums";
import { QueryParams } from "../../../../../packages/shared/src/types/query.types";
import { Prisma } from "../../../generated/prisma/client";



export async function addSubscription(data: {
    subscriptionName: string;
    amount: number;
    billingCycle: billing_cycle;
    nextBilling:Date;
    paymentCard:string;
    category:string;
    status:status_subscription;
}) {
   return prisma.$transaction(async (tx) => {

    const subdata = await tx.subscription.create({
            data: {
                subscriptionName: data.subscriptionName,
                amount: data.amount,
                billingCycle: data.billingCycle,
                nextBilling: data.nextBilling,
                paymentCard: data.paymentCard,
                category: data.category,
                status: data.status,
            },
        });

    return subdata;
});
}




export async function displayPensioner(params: QueryParams) {
    const {
        page = 1,
        limit = 10,
        search
    } = params;

    const where: Prisma.SubscriptionWhereInput = {};

    if (search?.trim()) {
        where.OR = [
            {
                subscriptionName: {
                    contains: search,

                },
            },
            {
                category: {
                    contains: search,

                },
            },
        ];
    }


    const [subdata, total] =
        await prisma.$transaction([
            prisma.subscription.findMany({
                where,
                select: {
                    id: true,
                    legacyPensionerId: true,
                    lastName: true,
                    firstName: true,
                    actualPension: true,
                    contingencyDate:true,
                    bankName:true,
                    birthDate:true,
                },

                skip: (page - 1) * limit,
                take: limit,
               orderBy:{
                createdAt:"desc"
               }
            }),

            prisma.subscription.count({
                where,
            }),
        ]);

    return {
        data: subdata,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(
                total / limit
            ),
        },
    };
}




