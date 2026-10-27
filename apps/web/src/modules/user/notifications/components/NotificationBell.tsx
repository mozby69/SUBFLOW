
"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Bell,
  CheckCheck,
  Loader2,
  ArrowRight,
} from "lucide-react";

import { toast } from "sonner";

import {
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "../hooks/useNotifications";

import NotificationItem from "./NotificationItem";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0 } =
    useGetUnreadNotificationCount();

  const {
    data,
    isLoading,
  } = useGetNotifications({
    page: 1,
    limit: 5,
  });

  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  async function handleMarkRead(id: number) {
    try {
      await markRead.mutateAsync(id);
    } catch {
      toast.error("Failed to mark notification as read");
    }
  }

  async function handleMarkAll() {
    try {
      await markAll.mutateAsync();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div className="absolute right-0 top-12 z-50 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div>
                <h3 className="font-bold text-slate-900">
                  Notifications
                </h3>

                <p className="text-xs text-slate-500">
                  {unreadCount} unread notifications
                </p>
              </div>

              <button
                type="button"
                disabled={
                  unreadCount === 0 ||
                  markAll.isPending
                }
                onClick={handleMarkAll}
                title="Mark all as read"
                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-40"
              >
                <CheckCheck className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : data?.data.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <Bell className="mx-auto mb-3 h-8 w-8 text-slate-300" />

                  <p className="text-sm font-medium text-slate-700">
                    No notifications yet
                  </p>
                </div>
              ) : (
                data?.data.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleMarkRead}
                    isLoading={markRead.isPending}
                    compact
                  />
                ))
              )}
            </div>

            <Link
              href="/user/notification"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 border-t border-slate-100 p-4 text-sm font-semibold text-blue-600 hover:bg-slate-50"
            >
              View All Notifications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
