"use client";
import DataTable from "@/components/common/Datatable/Datatable";
import Modal from "@/components/common/ModalHeader";
import { TableColumn } from "@/components/common/Table";
// import { useDisclosure } from "@/hooks/useDisclosure";
import { CreateSubscriptionInput, dateFormatter, formatCurrency, UpdateSubscriptionSchema, type AddSubscriptionValues, type Subscription, type SubscriptionStatus } from "@repo/shared"; 
import { CreditCard, Plus, RefreshCw } from "lucide-react";
import {  useState } from "react";
import AddModalSubscription from "../components/modal/AddSubscription";
import { useCreateSubscription, useDeleteSubscription, useEditSubscription, useGetSubscription } from "../hooks/useSubscription";
import {  toast } from 'sonner'
import { useDebounce } from "@/hooks/useDebounce";
import SubscriptionActions from "@/components/ui/dropdownAction";
import { useDisclosure } from "@/hooks/useDisclosure";
import ModalEditSubscription from "../components/modal/EditSubscription";
import SweetAlert from "@/lib/alerts/alert";
import { useGetCreditCards } from "../../credit-card/hooks/useCreditCard";







  const statusConfig: Record<
    SubscriptionStatus,
    {
      label: string;
      className: string;
    }
  > = {
    ACTIVE: {
      label: "Active",
      className:
        "border-[#D5E3D7] bg-[#E8F0E9] text-[#52745E]",
    },
    PAUSED: {
      label: "Paused",
      className:
        "border-[#EBDFC9] bg-[#F5EFE4] text-[#9C8055]",
    },
    TRIAL: {
      label: "Trial",
      className:
        "border-[#E8DADA] bg-[#F2EAEA] text-[#A46B6B]",
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "border-[#DDE0DB] bg-[#ECEDEB] text-[#818881]",
    },
  };




export default function SubscriptionView(){
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [userPage, setUserPage] = useState(1);
    const [userLimit, setUserLimit] = useState(10);
    const [userSearch, setUserSearch] = useState("");
    const debouncedSearch = useDebounce(userSearch, 500);
    const userModal = useDisclosure();
    const [saveError, setSaveError] = useState<string | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const editSubscription = useEditSubscription();
    const { mutateAsync: deleteSubscription } = useDeleteSubscription();

    const {
  data: creditCardResponse,
  isPending: isCardsLoading,
} = useGetCreditCards();

const creditCards = creditCardResponse?.data ?? [];

    const openEditModal = (subscription: Subscription) => {
      setSelectedSubscription(subscription);
      setSaveError(null);
      userModal.open();
    };

    const closeEditModal = () => {
      if (editSubscription.isPending) return;

      userModal.close();
      setSelectedSubscription(null);
      setSaveError(null);
    };

    const {
        data: subscriptionResponse,
        isPending,
        isFetching,

      } = useGetSubscription({
        page: userPage,
        limit: userLimit,
        search: debouncedSearch,
      });

      const openModal = () => {
        userModal.open();
        setSelectedSubscription(null);
      }

      const closeModal = () => {
          userModal.close();
          setSelectedSubscription(null);
      }


      const handleEditSubscription = async (
      values: UpdateSubscriptionSchema
    ): Promise<void> => {
      if (!selectedSubscription) return;

      try {
        setSaveError(null);

        await editSubscription.mutateAsync({
          id: selectedSubscription.id,
          data: values,
        });

        toast.success("Subscription updated successfully!", {
          duration: 3000,
        });

        userModal.close();
        setSelectedSubscription(null);
        setSaveError(null);

        closeEditModal();
      } catch (error: unknown) {
        console.error(
          "Failed to update subscription:",
          error
        );

        setSaveError(
          "Failed to update subscription. Please try again."
        );

        toast.error("Failed to update subscription.", {
          duration: 4000,
        });
      }
    };





      const columns: TableColumn<Subscription>[] = [
        {
          key: "subscriptionName",
          header: "Subscription Name",
          render: (row) => (
            <span className="font-semibold text-[#26342F]">
              {row.subscriptionName}
            </span>
          ),
        },
        {
          key: "amount",
          header: "Amount",
          render: (row) => (
            <span className="font-medium text-[#26342F]">
              {formatCurrency(row.amount)}
            </span>
          ),
        },
        {
          key: "billingCycle",
          header: "Billing Cycle",
          render: (row) => (
            <span className="capitalize">
              {row.billingCycle.toLowerCase()}
            </span>
          ),
        },
       {
            key: "nextBilling",
            header: "Next Billing",
            render: (row) =>
              row.nextBilling
                ? dateFormatter.format(new Date(row.nextBilling))
                : "—",
          },
        {
          key: "status",
          header: "Status",
          render: (row) => {
            const status = statusConfig[row.status];

            return (
              <span
                className={`
                  inline-flex rounded-full border
                  px-2.5 py-1 text-[10px] font-medium
                  ${status.className}
                `}
              >
                {status.label}
              </span>
            );
          },
        },
      {
          key: "paymentCard",
          header: "Payment Card",
          render: (row) => {
            const card = creditCards.find(
              (card) => Number(card.id) === Number(row.creditCardId)
            );

            if (!card) {
              return (
                <span className="text-xs text-gray-400">
                  {isCardsLoading ? "Loading..." : "No card assigned"}
                </span>
              );
            }

            return (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E9EEE8]">
                  <CreditCard
                    size={16}
                    className="text-[#526B5D]"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-[#26342F]">
                    {card.bank} - {card.network.toUpperCase()}
                  </span>

                  <span className="text-[11px] text-[#8A958C]">
                    •••• {String(card.last_four_digit).padStart(4, "0")}
                  </span>
                </div>
              </div>
            );
          },
        },
        {
          key: "category",
          header: "Category",
          render: (row) => row.category,
        },
       {
          key: "action",
          header: "Action",
          render: (row) => (
            <SubscriptionActions
              subscription={row}
              onEdit={(subscription) => {
                openEditModal(subscription);
              }}
              onDelete={(subscription) => {
                handleDelete(subscription)
              }}
            />
          ),
        }
      ];


    const subscriptions = subscriptionResponse?.data ?? [];
    const totalRecords = subscriptionResponse?.pagination?.total ?? 0;
    const createSubscription = useCreateSubscription();

          const handleCreateSubscription = async (
          values: CreateSubscriptionInput
        ): Promise<void> => {
          try {
            await createSubscription.mutateAsync(values);

            toast.success("Subscription created successfully!");

            setIsAddOpen(false);
          } catch (error: unknown) {
            console.error("Failed to create subscription:", error);

            toast.error(
              "Failed to create subscription. Please try again."
            );

            throw error;
          }
        };
          





      async function handleDelete(data: Subscription) {
        SweetAlert.confirmationAlert(
            "Are you sure you want to delete?",
            "This will delete the subscription data.",
            async () => {
            try {
                await deleteSubscription(data.id);
                SweetAlert.successAlert(
                "Success",
                "Subscription deleted successfully"
                );
            } catch (error) {
                SweetAlert.errorAlert(
                "Failed",
                `Failed to delete subscription ${error}`
                );
            }
            }
        );
        }

return (
  <div className="w-full min-w-0 space-y-6 p-2">


    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


      <div className="flex min-w-0 items-start gap-3">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DCE2D9] bg-[#E9EEE8]">
          <RefreshCw
            size={20}
            strokeWidth={1.7}
            className="text-[#526B5D]"
          />
        </div>

        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#26342F]">
            Subscription Management
          </h1>

          <p className="mt-1 text-[13px] leading-relaxed text-[#8A958C]">
            Track recurring expenses, billing schedules,
            and payment activity.
          </p>
        </div>
      </div>


      <button
        type="button"
        onClick={() => {
              setSaveError(null);
              setIsAddOpen(true);
            }}
        className="
          inline-flex h-10 shrink-0 items-center
          justify-center gap-2 rounded-[10px]
          bg-[#26342F] px-4
          text-[12px] font-semibold text-white
          shadow-sm transition-all duration-200
          hover:bg-[#374B40]
          hover:shadow-md
          active:scale-[0.98]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#526B5D]
          focus-visible:ring-offset-2
          sm:w-auto
        "
      >
        <Plus size={17} strokeWidth={2} />
        Add Subscription
      </button>
    </div>



    <DataTable<Subscription>
      title="All Subscriptions"
      description="Manage and monitor recurring payments across your departments."
      columns={columns}
      data={subscriptions}
      getRowId={(row) => row.id}
      manualPagination
      page={userPage}
      pageSize={userLimit}
      totalRows={totalRecords}
      onPageChange={setUserPage}
      searchPlaceholder="Search subscriptions..."
      searchValue={userSearch}
      onSearchChange={(value) => {
        setUserSearch(value);
        setUserPage(1);
      }}
      isLoading={isPending || isFetching}
      // onRowClick={(row) => {
      //   console.log("Selected subscription:", row);
      // }}
    />




       <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Subscription"
        size="lg"
      >
        {isCardsLoading ? (
          <p className="p-4 text-sm text-[#8A958C]">
            Loading credit cards...
          </p>
        ) : (
          <AddModalSubscription
            onClose={() => setIsAddOpen(false)}
            onSubmit={handleCreateSubscription}
            isSaving={createSubscription.isPending}
            creditCards={creditCards}
          />
        )}
      </Modal>



     <Modal
            isOpen={userModal.isOpen}
            onClose={closeEditModal}
            title="Edit Subscription"
            size="lg"
          >
            {saveError && (
              <div
                role="alert"
                className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700"
              >
                {saveError}
              </div>
            )}

            {selectedSubscription && (
              <ModalEditSubscription
                key={selectedSubscription.id}
                subscription={selectedSubscription}
                onClose={closeEditModal}
                onSubmit={handleEditSubscription}
                isSaving={editSubscription.isPending}
              />
            )}
          </Modal>

  </div>
);

}