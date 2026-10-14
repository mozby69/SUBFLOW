import RoleGuard from "@/components/guards/RoleGuard";
import SubscriptionView from "@/modules/user/subscription/views/subscriptionView";



export default function AccessControlPage() {
    return (
        <RoleGuard roles={["USER"]}>
            <SubscriptionView />
        </RoleGuard>
    );
}

