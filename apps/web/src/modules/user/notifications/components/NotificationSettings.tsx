
"use client";

import { useState } from "react";
import { Loader2, Save, Settings2 } from "lucide-react";
import { toast } from "sonner";

import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from "../hooks/useNotifications";
import { NotificationPreference, UpdateNotificationPreference } from "@repo/shared";



const settingFields = [
  {
    key: "subscriptionReminder",
    label: "Subscription Reminders",
    description: "Subscription expiration reminders",
  },
  {
    key: "billingReminder",
    label: "Billing Reminders",
    description: "Upcoming billing notifications",
  },
  {
    key: "overdueAlert",
    label: "Overdue Alerts",
    description: "Unpaid and overdue bills",
  },
  {
    key: "cardReminder",
    label: "Credit Card Reminders",
    description: "Card statements and payment reminders",
  },
  {
    key: "paymentConfirmation",
    label: "Payment Confirmations",
    description: "Successful payment notifications",
  },
] as const;

type Props = {
  onClose: () => void;
};

export default function NotificationSettings({
  onClose,
}: Props) {
  const { data, isLoading, isError } =
    useGetNotificationPreferences();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="p-6 text-sm text-red-600">
        Failed to load notification settings.
      </p>
    );
  }

  return (
    <NotificationSettingsForm
      key={data.id}
      preferences={data}
      onClose={onClose}
    />
  );
}

function NotificationSettingsForm({
  preferences,
  onClose,
}: {
  preferences: NotificationPreference;
  onClose: () => void;
}) {
  const [form, setForm] =
    useState<UpdateNotificationPreference>({
      subscriptionReminder:
        preferences.subscriptionReminder,
      billingReminder:
        preferences.billingReminder,
      overdueAlert:
        preferences.overdueAlert,
      cardReminder:
        preferences.cardReminder,
      paymentConfirmation:
        preferences.paymentConfirmation,
      reminderDays:
        preferences.reminderDays,
    });

  const updatePreferences =
    useUpdateNotificationPreferences();

  async function handleSave() {
    try {
      await updatePreferences.mutateAsync(form);
      toast.success("Notification preferences saved");
      onClose();
    } catch {
      toast.error("Failed to save preferences");
    }
  }

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center gap-3">
        <Settings2 className="h-5 w-5 text-slate-600" />

        <h2 className="text-lg font-bold text-slate-900">
          Notification Preferences
        </h2>
      </div>

      <div className="divide-y divide-slate-100">
        {settingFields.map((setting) => (
          <label
            key={setting.key}
            className="flex cursor-pointer items-center justify-between gap-4 py-4"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {setting.label}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {setting.description}
              </p>
            </div>

            <input
              type="checkbox"
              checked={form[setting.key] ?? false}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  [setting.key]: event.target.checked,
                }))
              }
              className="h-4 w-4 accent-emerald-600"
            />
          </label>
        ))}
      </div>

      <div>
        <label
          htmlFor="reminder-days"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Remind Me Before Due Date
        </label>

        <select
          id="reminder-days"
          value={form.reminderDays ?? 3}
          onChange={(event) =>
            setForm((previous) => ({
              ...previous,
              reminderDays: Number(event.target.value),
            }))
          }
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        >
          <option value={1}>1 day before</option>
          <option value={3}>3 days before</option>
          <option value={7}>7 days before</option>
          <option value={14}>14 days before</option>
          <option value={30}>30 days before</option>
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={updatePreferences.isPending}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {updatePreferences.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          Save Preferences
        </button>
      </div>
    </div>
  );
}
