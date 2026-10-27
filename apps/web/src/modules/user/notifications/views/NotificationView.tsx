
"use client";

import { useState } from "react";

import {
  Bell,
  CheckCheck,
  RefreshCw,
  Settings2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";

import {
  useGetNotifications,
  useGetUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from "../hooks/useNotifications";

import NotificationItem from "../components/NotificationItem";
import NotificationSettings from "../components/NotificationSettings";

type Filter = "ALL" | "UNREAD";

export default function NotificationView() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [showSettings, setShowSettings] =
    useState(false);

  const query = {
    page,
    limit: 10,
    unreadOnly: filter === "UNREAD",
  };

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetNotifications(query);

  const { data: unreadCount = 0 } =
    useGetUnreadNotificationCount();

  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();

  async function handleMarkRead(id: number) {
    try {
      await markRead.mutateAsync(id);
    } catch {
      toast.error("Failed to update notification");
    }
  }

  async function handleMarkAll() {
    try {
      await markAll.mutateAsync();
      toast.success("All notifications marked as read");
      setPage(1);
    } catch {
      toast.error("Failed to update notifications");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteNotification.mutateAsync(id);
      toast.success("Notification deleted");
      if (data?.data.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch {
      toast.error("Failed to delete notification");
    }
  }

  function changeFilter(value: Filter) {
    setFilter(value);
    setPage(1);
  }

  return (
    <div className="min-h-full w-full min-w-0 space-y-6 bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Bell className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your reminders and alerts
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Settings2 className="h-4 w-4" />
            Settings
          </button>

          <button
            type="button"
            onClick={handleMarkAll}
            disabled={
              unreadCount === 0 || markAll.isPending
            }
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Total Notifications
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {filter === "ALL"
              ? (data?.pagination.total ?? 0)
              : "—"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">
            Unread Notifications
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            {unreadCount}
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => changeFilter("ALL")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                filter === "ALL"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => changeFilter("UNREAD")}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                filter === "UNREAD"
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <p className="text-xs text-slate-500">
            {data?.pagination.total ?? 0} results
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-16">
            <Loader2 className="h-7 w-7 animate-spin text-slate-400" />
          </div>
        ) : isError ? (
          <div className="p-16 text-center">
            <p className="text-sm text-red-600">
              Failed to load notifications.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-medium text-blue-600"
            >
              Try again
            </button>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="mx-auto mb-4 h-10 w-10 text-slate-300" />

            <h3 className="font-semibold text-slate-800">
              No notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {filter === "UNREAD"
                ? "You have no unread notifications."
                : "Your notifications will appear here."}
            </p>
          </div>
        ) : (
          data?.data.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={handleMarkRead}
              onDelete={handleDelete}
              isLoading={
                markRead.isPending ||
                deleteNotification.isPending
              }
            />
          ))
        )}

        {/* PAGINATION */}
        {(data?.pagination.totalPages ?? 0) > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Page {page} of{" "}
              {data?.pagination.totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.max(1, value - 1))
                }
                disabled={page <= 1}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPage((value) => value + 1)
                }
                disabled={
                  page >=
                  (data?.pagination.totalPages ?? 1)
                }
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Notification settings"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
          >
            <NotificationSettings
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
