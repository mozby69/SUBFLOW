
"use client";



import {  Notification as SubscriptionNotification, NotificationType } from "@repo/shared";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  AlertTriangle,
  ReceiptText,
  Trash2,
} from "lucide-react";

type Props = {
  notification: SubscriptionNotification;
  onRead: (id: number) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
  compact?: boolean;
};

function NotificationIcon({
  type,
}: {
  type: NotificationType;
}) {
  switch (type) {
    case "BILLING_REMINDER":
      return <CalendarClock className="h-5 w-5" />;

    case "PAYMENT_DUE":
      return <ReceiptText className="h-5 w-5" />;

    case "PAYMENT_SUCCESS":
      return <CheckCircle2 className="h-5 w-5" />;

    case "PAYMENT_FAILED":
    case "BUDGET_WARNING":
      return <AlertTriangle className="h-5 w-5" />;

    case "CARD_STATEMENT":
      return <CreditCard className="h-5 w-5" />;

    case "SUBSCRIPTION_EXPIRING":
      return <CalendarClock className="h-5 w-5" />;

    case "SYSTEM":
    default:
      return <Bell className="h-5 w-5" />;
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
  isLoading = false,
  compact = false,
}: Props) {
  return (
    <div
      className={`flex gap-3 border-b border-slate-100 p-4 transition ${
        notification.isRead
          ? "bg-white"
          : "bg-blue-50/60"
      }`}
    >
      {/* ICON */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        <NotificationIcon type={notification.type} />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {notification.title}
          </p>

          {!notification.isRead && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
          )}
        </div>

        <p
          className={`mt-1 text-sm text-slate-500 ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {notification.message}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {formatDate(notification.createdAt)}
        </p>

        {/* ACTIONS */}
        <div className="mt-3 flex items-center gap-4">
          {!notification.isRead && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onRead(notification.id)}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              Mark as read
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => onDelete(notification.id)}
              className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
