import RoleGuard from "@/components/guards/RoleGuard";
import CalendarView from "@/modules/user/calendar/views/calendarView";




export default function AccessControlPage() {
    return (
        <RoleGuard roles={["USER"]}>
            <CalendarView />
        </RoleGuard>
    );
}

