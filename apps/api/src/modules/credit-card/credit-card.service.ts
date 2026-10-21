
import type {
  CreateCreditCardInput,
} from "@repo/shared";
import { addCreditCardRepo, getCreditCardsRepo } from "./credit-card.repository";

export async function createCreditCardService(
  params: CreateCreditCardInput
) {
  return addCreditCardRepo({
    bank: params.bank,
    last_four_digit: params.last_four_digit,
    network: params.network,
    nickname: params.nickname?.trim() || null,

    creditLimit: params.creditLimit,
    currencyCode: params.currencyCode,

    statementDay: params.statementDay ?? null,
    dueDay: params.dueDay ?? null,

    status: params.status,

    expiryMonth: params.expiryMonth ?? null,
    expiryYear: params.expiryYear ?? null,
  });
}




export async function getCreditCardsService() {
  return getCreditCardsRepo();
}

