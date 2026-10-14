"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import {
  SidebarProvider,
  useSidebar,
} from "./Sidebar-Context";

function DashboardContent({
  children,
}: {
  children: ReactNode;
}) {
  const {
    collapsed,
    toggleMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <div className="min-h-dvh bg-[#F8F9F6]">
      <Sidebar />

      <div
        className={`
          min-w-0 transition-[margin] duration-300 ease-in-out
          ${
            collapsed
              ? "lg:ml-[72px]"
              : "lg:ml-[224px]"
          }
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-[#E4E6E0] bg-[#F8F9F6]/95 px-4 backdrop-blur-sm md:px-6">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={toggleMobile}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#26342F] hover:bg-[#E2E5DF] lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* Desktop hamburger */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-[#26342F] hover:bg-[#E2E5DF] lg:flex"
          >
            <Menu size={21} />
          </button>

          <div>
            <p className="text-sm font-semibold text-[#26342F]">
              LPCS Workspace
            </p>
            <p className="text-xs text-[#929992]">
              Administration dashboard
            </p>
          </div>
        </header>

        <main className="min-w-0 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}