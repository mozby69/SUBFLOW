"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  CreditCard as CreditCardIcon,
  Wallet,
  Layers3,

} from "lucide-react";

import { useDisclosure } from "@/hooks/useDisclosure";
import Modal from "@/components/common/ModalHeader";

import {
  useCreateCreditCard,
  useEditCard,
  useGetCreditCards,
} from "../hooks/useCreditCard";



import AddModalCreditCard from "../components/modal/addCard";
import CreditCardItem, {
  type CreditCardItemData,
} from "../components/ui/creditCardItem";

import type { CreateCreditCardInput, CreditCardSchema } from "@repo/shared";
import EditCard from "../components/modal/editCard";

export default function CreditCardView() {
    const userModal = useDisclosure();
    const userModal2 = useDisclosure();
    const createCreditCard = useCreateCreditCard();
    const [selectedCard, setSelectedCard] = useState<CreditCardItemData | null>(null);
    const editModal = useDisclosure();
    const editCreditCard = useEditCard();

    const {
        data: creditCardResponse,
        isPending,
        isFetching,
        isError,
        refetch,
    } = useGetCreditCards();


const handleEdit = (
  card: CreditCardItemData
): void => {
  setSelectedCard(card);
  editModal.open();
};

const closeEditModal = (): void => {
  if (editCreditCard.isPending) return;

  editModal.close();
  setSelectedCard(null);
};

const handleUpdateCreditCard = async (
  values: CreditCardSchema
): Promise<void> => {
  if (!selectedCard) return;

  try {
    await editCreditCard.mutateAsync({
      id: selectedCard.id,
      data: values,
    });

    toast.success("Credit card updated successfully!");

    editModal.close();
    setSelectedCard(null);
  } catch (error: unknown) {
    console.error("Failed to update credit card:", error);

    toast.error("Failed to update credit card.");
    throw error;
  }
};

  // Assumes the GET service returns { success, data: CreditCard[] }.
  const creditCards: CreditCardItemData[] =
    creditCardResponse?.data ?? [];

  const totalCards = creditCards.length;

  // Only count values actually provided by the API.
  const hasSubscriptionStats = creditCards.every(
    (card) => card.subscriptionCount !== undefined
  );

  const totalSubscriptions = hasSubscriptionStats
    ? creditCards.reduce(
        (total, card) => total + (card.subscriptionCount ?? 0),
        0
      )
    : null;

 const handleCreateCreditCard = async (
  values: CreateCreditCardInput
): Promise<void> => {
  try {
    await createCreditCard.mutateAsync(values);

    toast.success("Credit card added successfully!", {
      duration: 3000,
    });

    userModal.close();
  } catch (error: unknown) {
    console.error("Failed to create credit card:", error);

    toast.error("Failed to add credit card.", {
      duration: 4000,
    });

    throw error;
  }
};

  const closeModal = (): void => {
    if (createCreditCard.isPending) return;
    userModal.close();
  };
  
   const closeModal2 = (): void => {
    userModal2.close();
  };



  return (
    <div className="w-full min-w-0 space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DCE2D9] bg-[#E9EEE8]">
            <CreditCardIcon
              size={20}
              strokeWidth={1.7}
              className="text-[#526B5D]"
            />
          </div>

          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#26342F]">
              Credit Card Management
            </h1>

            <p className="mt-1 text-[13px] text-[#8A958C]">
              Manage your cards and keep subscriptions
              organized by payment method.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={userModal.open}
          className="
            inline-flex h-10 items-center justify-center
            gap-2 rounded-[10px] bg-[#26342F]
            px-5 text-[12px] font-semibold text-white
            shadow-sm transition-all duration-200
            hover:bg-[#374B40] hover:shadow-md
            active:scale-[0.98]
          "
        >
          <Plus size={17} />
          Add Credit Card
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#E1E6DE] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#89958B]">
              Total Credit Cards
            </span>

            <div className="rounded-lg bg-[#E9EEE8] p-2 text-[#526B5D]">
              <CreditCardIcon size={17} />
            </div>
          </div>

          <p className="mt-3 text-[28px] font-semibold tracking-tight text-[#26342F]">
            {isPending ? "—" : totalCards}
          </p>

          <p className="mt-1 text-[11px] text-[#8A958C]">
            Registered payment cards
          </p>
        </div>

        <div className="rounded-xl border border-[#E1E6DE] bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] text-[#89958B]">
              Linked Subscriptions
            </span>

            <div className="rounded-lg bg-[#E9EEE8] p-2 text-[#526B5D]">
              <Layers3 size={17} />
            </div>
          </div>

          <p className="mt-3 text-[28px] font-semibold tracking-tight text-[#26342F]">
            {totalSubscriptions ?? "—"}
          </p>

          <p className="mt-1 text-[11px] text-[#8A958C]">
            {totalSubscriptions === null
              ? "Requires subscription statistics"
              : "Subscriptions assigned to cards"}
          </p>
        </div>
      </div>

      {/* Card collection */}
      <section className="overflow-hidden rounded-2xl border border-[#E1E6DE] bg-[#FAFBF8]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EBE5] bg-white px-5 py-4">
          <div>
            <h2 className="text-[14px] font-semibold text-[#26342F]">
              Your Credit Cards
            </h2>

            <p className="mt-1 text-[12px] text-[#8A958C]">
              Your saved payment methods and assigned subscriptions.
            </p>
          </div>

          <span className="rounded-full border border-[#DCE6DB] bg-[#EEF3ED] px-3 py-1 text-[11px] font-medium text-[#526B5D]">
            {totalCards} {totalCards === 1 ? "Card" : "Cards"}
          </span>
        </div>

        <div className="p-5">
          {isPending ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-[#E1E6DE] bg-white p-5"
                >
                  <div className="aspect-[1.75/1] rounded-2xl bg-[#E6EBE5]" />
                  <div className="mt-5 h-4 w-3/4 rounded bg-[#E6EBE5]" />
                  <div className="mt-5 h-4 w-1/2 rounded bg-[#E6EBE5]" />
                  <div className="mt-6 h-10 rounded-lg bg-[#E6EBE5]" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-16 text-center">
              <p className="text-[14px] font-semibold text-[#26342F]">
                Unable to load credit cards
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 text-[12px] font-semibold text-[#526B5D] underline"
              >
                Try again
              </button>
            </div>
          ) : creditCards.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9EEE8] text-[#526B5D]">
                <Wallet size={28} strokeWidth={1.5} />
              </div>

              <h3 className="mt-5 text-[16px] font-semibold text-[#26342F]">
                No credit cards added yet
              </h3>

              <p className="mt-2 max-w-sm text-[12px] leading-6 text-[#8A958C]">
                Add your first credit card to organize subscriptions
                and track which payment method is used.
              </p>

              <button
                type="button"
                onClick={userModal.open}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#26342F] px-5 py-2.5 text-[12px] font-semibold text-white hover:bg-[#374B40]"
              >
                <Plus size={15} />
                Add Your First Card
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {creditCards.map((card) => (
                <CreditCardItem
                  key={card.id}
                  card={card}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#DCE9DF] bg-[#EDF4EE] px-4 py-3">
        <CreditCardIcon
          size={17}
          className="mt-0.5 shrink-0 text-[#52745E]"
        />

        <p className="text-[12px] leading-5 text-[#52745E]">
          Card details are limited to the bank, network, nickname,
          and last four digits. Full card numbers and security codes
          are not required.
        </p>
      </div>

      <Modal
        isOpen={userModal.isOpen}
        onClose={closeModal}
        title="Add New Credit Card"
        size="lg">
        <AddModalCreditCard
          onClose={closeModal}
          onSubmit={handleCreateCreditCard}
          isSaving={createCreditCard.isPending}
        />
      </Modal>


        <Modal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        title="Edit Credit Card"
        size="lg"
        >
        {selectedCard && (
            <EditCard
            key={selectedCard.id}
            card={selectedCard}
            onClose={closeEditModal}
            onSubmit={handleUpdateCreditCard}
            isSaving={editCreditCard.isPending}
            />
        )}
        </Modal>




    </div>
  );
}