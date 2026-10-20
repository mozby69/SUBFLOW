"use client";

import {
  Ellipsis,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Subscription } from "@repo/shared";

interface SubscriptionActionsProps {
  subscription: Subscription;
  onView?: (subscription: Subscription) => void;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
}

export default function SubscriptionActions({
  subscription,
  onView,
  onEdit,
  onDelete,
}: SubscriptionActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Subscription actions"
          onClick={(event) => event.stopPropagation()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7F8880] hover:bg-[#E9EEE8]"
        >
          <Ellipsis size={19} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44"
        onClick={(event) => event.stopPropagation()}
      >
        {onView && (
          <DropdownMenuItem
            onSelect={() => onView(subscription)}
          >
            <Eye size={15} />
            View Details
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onSelect={() => onEdit(subscription)}
          >
            <Pencil size={15} />
            Edit Subscription
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            {(onView || onEdit) && (
              <DropdownMenuSeparator />
            )}

            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(subscription)}
            >
              <Trash2 size={15} />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}