"use client";
import DataTable from "@/components/common/Datatable/Datatable";
import Modal from "@/components/common/ModalHeader";
import { TableColumn } from "@/components/common/Table";
import { useDisclosure } from "@/hooks/useDisclosure";
import type { AddSubscriptionValues, Subscription, SubscriptionStatus } from "@repo/shared"; 
import { Plus, RefreshCw } from "lucide-react";
import { useCallback, useState } from "react";
import AddModalSubscription from "../components/modal/AddSubscription";
import { useCreateSubscription } from "../hooks/useSubscription";
import {  toast } from 'sonner'

export const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    name: "Netflix Premium",
    amount: 549,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-25",
    status: "ACTIVE",
    paymentCard: "Visa •••• 4242",
    category: "Entertainment",
    department: "Personal",
  },
  {
    id: 2,
    name: "Spotify Premium",
    amount: 149,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-18",
    status: "DUE_SOON",
    paymentCard: "Mastercard •••• 8891",
    category: "Entertainment",
    department: "Personal",
  },
  {
    id: 3,
    name: "Adobe Creative Cloud",
    amount: 3200,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-08",
    status: "OVERDUE",
    paymentCard: "Visa •••• 4242",
    category: "Software",
    department: "IT",
  },
  {
    id: 4,
    name: "Microsoft 365",
    amount: 4699,
    billingCycle: "YEARLY",
    nextBilling: "2027-02-15",
    status: "ACTIVE",
    paymentCard: "Mastercard •••• 1122",
    category: "Productivity",
    department: "Administration",
  },
  {
    id: 5,
    name: "Canva Pro",
    amount: 299,
    billingCycle: "MONTHLY",
    nextBilling: "2026-11-01",
    status: "ACTIVE",
    paymentCard: "Visa •••• 4242",
    category: "Design",
    department: "Marketing",
  },
  {
    id: 6,
    name: "ChatGPT Plus",
    amount: 1200,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-20",
    status: "DUE_SOON",
    paymentCard: "Visa •••• 4242",
    category: "AI Tools",
    department: "IT",
  },
  {
    id: 7,
    name: "YouTube Premium",
    amount: 159,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-12",
    status: "OVERDUE",
    paymentCard: "Mastercard •••• 8891",
    category: "Entertainment",
    department: "Personal",
  },
  {
    id: 8,
    name: "Dropbox",
    amount: 1199,
    billingCycle: "YEARLY",
    nextBilling: "2027-04-10",
    status: "ACTIVE",
    paymentCard: "Visa •••• 4242",
    category: "Cloud Storage",
    department: "IT",
  },
  {
    id: 9,
    name: "Zoom Pro",
    amount: 899,
    billingCycle: "MONTHLY",
    nextBilling: "2026-11-05",
    status: "ACTIVE",
    paymentCard: "Mastercard •••• 1122",
    category: "Communication",
    department: "Administration",
  },
  {
    id: 10,
    name: "Notion Plus",
    amount: 499,
    billingCycle: "MONTHLY",
    nextBilling: "2026-10-22",
    status: "ACTIVE",
    paymentCard: "Visa •••• 4242",
    category: "Productivity",
    department: "IT",
  },
  {
    id: 11,
    name: "Figma Professional",
    amount: 850,
    billingCycle: "MONTHLY",
    nextBilling: "2026-11-15",
    status: "ACTIVE",
    paymentCard: "Mastercard •••• 8891",
    category: "Design",
    department: "Marketing",
  },
  {
    id: 12,
    name: "Grammarly Premium",
    amount: 700,
    billingCycle: "MONTHLY",
    nextBilling: "2026-09-30",
    status: "CANCELLED",
    paymentCard: "Visa •••• 4242",
    category: "Productivity",
    department: "Administration",
  },
];







const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  {
    style: "currency",
    currency: "PHP",
  }
);

const dateFormatter = new Intl.DateTimeFormat(
  "en-PH",
  {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }
);

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
  DUE_SOON: {
    label: "Due soon",
    className:
      "border-[#EBDFC9] bg-[#F5EFE4] text-[#9C8055]",
  },
  OVERDUE: {
    label: "Overdue",
    className:
      "border-[#E8DADA] bg-[#F2EAEA] text-[#A46B6B]",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "border-[#DDE0DB] bg-[#ECEDEB] text-[#818881]",
  },
};

const columns: TableColumn<Subscription>[] = [
  {
    key: "name",
    header: "Subscription Name",
    render: (row) => (
      <span className="font-semibold text-[#26342F]">
        {row.name}
      </span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (row) => (
      <span className="font-medium text-[#26342F]">
        {currencyFormatter.format(row.amount)}
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
      dateFormatter.format(
        new Date(`${row.nextBilling}T00:00:00Z`)
      ),
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
    render: (row) => row.paymentCard,
  },
  {
    key: "category",
    header: "Category",
    render: (row) => row.category,
  },
  {
    key: "department",
    header: "Department",
    render: (row) => row.department,
  },
];




export default function SubscriptionView(){
    const [isAddOpen, setIsAddOpen] = useState(false);


    const [saveError, setSaveError] = useState<string | null>(null);

    const createSubscription = useCreateSubscription();

    const handleCreateSubscription = async (
    values: AddSubscriptionValues
  ): Promise<void> => {
    try {
      await createSubscription.mutateAsync(values);
      toast.success("Subscription created successfully!");

      setIsAddOpen(false);
    } catch (error: unknown) {
      console.error("Failed to create subscription:", error);

      toast.error("Failed to create subscription. Please try again.");
    }
  };





     const searchSubscriptions = useCallback(
    (row: Subscription, search: string) => {
      const searchableValues = [
        row.name,
        row.billingCycle,
        row.status,
        row.paymentCard,
        row.category,
        row.department,
      ];

      return searchableValues.some((value) =>
        value.toLowerCase().includes(search)
      );
    },
    []
  );

  const filterSubscriptions = useCallback(
    (row: Subscription, filter: string) =>
      row.status === filter,
    []
  );





  





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
      data={mockSubscriptions}
      getRowId={(row) => row.id}
      searchPlaceholder="Search subscriptions..."
      searchFn={searchSubscriptions}
      filterOptions={[
        {
          label: "All statuses",
          value: "all",
        },
        {
          label: "Active",
          value: "ACTIVE",
        },
        {
          label: "Due soon",
          value: "DUE_SOON",
        },
        {
          label: "Overdue",
          value: "OVERDUE",
        },
        {
          label: "Cancelled",
          value: "CANCELLED",
        },
      ]}
      filterFn={filterSubscriptions}
      pageSize={10}
      onRowClick={(row) => {
        console.log("Selected subscription:", row);
      }}
    />




        <Modal
        isOpen={isAddOpen}
        onClose={() => {
          if (!createSubscription.isPending) {
            setIsAddOpen(false);
          }
        }}
        title="Add New Subscription"
        size="lg"
      >
        {saveError && (
          <div
            role="alert"
            className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {saveError}
          </div>
        )}

        <AddModalSubscription
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleCreateSubscription}
          isSaving={createSubscription.isPending}
        />
      </Modal>



  </div>
);

}