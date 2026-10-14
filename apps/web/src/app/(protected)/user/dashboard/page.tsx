import RoleGuard from "@/components/guards/RoleGuard";
import DashboardSubscriptionView from "@/modules/user/dashboard/views/dashboardView";



export default function AccessControlPage() {
    return (
        <RoleGuard roles={["USER"]}>
            <DashboardSubscriptionView />
        </RoleGuard>
    );
}