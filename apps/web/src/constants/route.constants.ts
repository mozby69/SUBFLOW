export const ROUTES = {
    LOGIN: "/login",
    DASHBOARD: "/dashboard",
    UNAUTHORIZED: "/unauthorized",

    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        ACCESS_CONTROL: "/admin/access-control",
    },
    USER:{
        DASHBOARD: "/user/dashboard",
        SUBSCRIPTION: "/user/subscription",
        CREDIT_CARD: "/user/credit-card",
        BILLING: "/user/billing",
        NOTIFICATIONS: "/user/notification",
    }
} as const;