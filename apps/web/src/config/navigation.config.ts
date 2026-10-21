import {
    LayoutDashboard,
    Users,
    Truck,
    ClipboardList,
    Settings,
    BookText,
    Library,
    RefreshCcw,
    CreditCard,
    ReceiptText,
    Bell
} from "lucide-react";

import { NavigationItem } from "@/types/navigation.types";
import { ROUTES } from "@/constants/route.constants";

export const navigation: NavigationItem[] = [
    {
        title: "Management",
        href: ROUTES.ADMIN.ACCESS_CONTROL,
        icon: LayoutDashboard,
        roles: ["ADMIN"],
    },
    {
        title: "Dashboard",
        href: ROUTES.ADMIN.DASHBOARD,
        icon: ClipboardList,
        roles: ["ADMIN"],
    },
    {
        title: "Dashboard",
        href: ROUTES.USER.DASHBOARD, // temporary
        icon: LayoutDashboard,
        roles: ["USER"],
    },
    {
        title: "Subscription",
        href: ROUTES.USER.SUBSCRIPTION, // temporary
        icon: RefreshCcw,
        roles: ["USER"],
    },
     {
        title: "Credit Card",
        href: ROUTES.USER.CREDIT_CARD, // temporary
        icon: CreditCard,
        roles: ["USER"],
    },
      {
        title: "Billing",
        href: ROUTES.USER.BILLING, // temporary
        icon: ReceiptText,
        roles: ["USER"],
    },

      {
        title: "Notifications",
        href: ROUTES.USER.NOTIFICATIONS, // temporary
        icon: Bell,
        roles: ["USER"],
    },
   
    {
        title: "Settings",
        href: ROUTES.UNAUTHORIZED, // temporary
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
];