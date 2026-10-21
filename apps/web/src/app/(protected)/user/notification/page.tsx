import RoleGuard from "@/components/guards/RoleGuard";
import NotificationView from "@/modules/user/notifications/views/NotificationView";

export default function NotificationsPage() {
  return (
    <RoleGuard roles={["USER"]}>
      <NotificationView />
    </RoleGuard>
  );
}