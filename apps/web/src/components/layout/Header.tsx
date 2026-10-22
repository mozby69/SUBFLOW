
"use client";

import { usePathname } from "next/navigation";
import {
  Menu,
} from "lucide-react";

import { navigation } from "@/config/navigation.config";
import { useSidebar } from "./Sidebar-Context";

import NotificationBell from "@/modules/user/notifications/components/NotificationBell";

export default function Header() {
  const pathname = usePathname();

  const currentPage = navigation.find(
    (item) =>
      pathname === item.href ||
      (
        item.href !== "/" &&
        pathname.startsWith(`${item.href}/`)
      )
  );

  const pageTitle = currentPage?.title ?? "Overview";

  const {
    collapsed,
    toggleSidebar,
    toggleMobile,
  } = useSidebar();

  return (
    <header className="flex h-20.5 shrink-0 items-center justify-between border-b border-[#DDDED8] bg-[#F8F9F6] px-8">
      {/* SIDEBAR TOGGLE */}
      <button
        type="button"
        onClick={() => {
          if (window.innerWidth < 1024) {
            toggleMobile();
          } else {
            toggleSidebar();
          }
        }}
        aria-label="Toggle sidebar"
        aria-expanded={!collapsed}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#26342F] transition-colors hover:bg-[#E2E5DF]"
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>

      {/* PAGE TITLE */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#929A93]">
          User Workspace
        </p>

        <h1 className="text-[17px] font-semibold leading-tight tracking-tight text-[#26342F]">
          {pageTitle}
        </h1>
      </div>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  );
}
