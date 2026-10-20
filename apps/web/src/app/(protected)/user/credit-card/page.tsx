import RoleGuard from "@/components/guards/RoleGuard";
import CreditCardView from "@/modules/user/credit-card/views/creditCardView";



export default function AccessControlPage() {
    return (
        <RoleGuard roles={["USER"]}>
            <CreditCardView />
        </RoleGuard>
    );
}

