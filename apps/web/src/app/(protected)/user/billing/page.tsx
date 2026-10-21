import RoleGuard from "@/components/guards/RoleGuard";
import BillingView from "@/modules/user/billing/views/BillingView";

export default function BillingPage() {
    return (
          <RoleGuard roles={["USER"]}>
              <BillingView />
          </RoleGuard>
      );
}