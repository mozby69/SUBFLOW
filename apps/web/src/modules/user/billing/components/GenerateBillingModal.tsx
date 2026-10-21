
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useGenerateBillings } from "../hooks/useBilling";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function GenerateBillingModal({
  open,
  onClose,
}: Props) {
  const [throughDate, setThroughDate] = useState("");
  const generate = useGenerateBillings();

  if (!open) return null;

  async function handleGenerate() {
    if (!throughDate) {
      toast.error("Please select a generation date");
      return;
    }

    try {
      const result = await generate.mutateAsync(
        throughDate
      );

      toast.success(
        `${result.generated} billing(s) generated successfully`
      );

      onClose();
    } catch {
      toast.error("Failed to generate billings");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Generate Billings
          </h2>

          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Generate recurring billings through the selected
          date for eligible active subscriptions.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium">
            Generate Through
          </label>

          <input
            type="date"
            value={throughDate}
            onChange={(event) =>
              setThroughDate(event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={generate.isPending}
            onClick={handleGenerate}
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {generate.isPending
              ? "Generating..."
              : "Generate Billings"}
          </button>
        </div>
      </div>
    </div>
  );
}
