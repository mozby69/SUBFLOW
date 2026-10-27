
"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { navigation } from "@/config/navigation.config";
import { useSidebar } from "./Sidebar-Context";

export default function Header() {
  const pathname = usePathname();

  const currentPage = navigation.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" &&
        pathname.startsWith(`${item.href}/`))
  );

  const pageTitle = currentPage?.title ?? "Overview";

  const { collapsed, toggleSidebar, toggleMobile } = useSidebar();

  return (
    <header className="flex h-20.5 shrink-0 items-center justify-between border-b border-[#E1E5ED] bg-[#F8FAFD] px-8">
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
        className="
          flex h-9 w-9 shrink-0 items-center justify-center
          rounded-lg text-[#344054]
          transition-colors hover:bg-[#E9EDF5]
        "
      >
        <Menu size={20} strokeWidth={1.8} />
      </button>

      <div className="flex flex-col gap-0.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#667085]">
          User Workspace
        </p>

        <h1 className="text-[17px] font-semibold leading-tight tracking-tight text-[#101828]">
          {pageTitle}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#E1E5ED] bg-transparent text-[#475467] transition-colors hover:bg-[#EEF1F8]"
        >
          <Bell size={17} strokeWidth={1.7} />
        </button>

        {/* <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-[10px] bg-[#171B4B] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#303C87]"
        >
          <Plus size={15} strokeWidth={1.8} />
          New Record
        </button> */}
      </div>
    </header>
  );
}
