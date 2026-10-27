
"use client";

import type { ReactNode } from "react";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

import {
  SidebarProvider,
  useSidebar,
} from "@/components/layout/Sidebar-Context";

function ProtectedLayoutContent({
  children,
}: {
  children: ReactNode;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-dvh overflow-hidden bg-[#F8F9FB]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main workspace */}
      <div
        className={`
          flex h-full min-w-0 flex-1 flex-col
          transition-[margin] duration-300 ease-in-out
          ml-0
          ${
            collapsed
              ? "lg:ml-[72px]"
              : "lg:ml-[224px]"
          }
        `}
      >
        {/* Fixed within workspace */}
        <Header />

        {/* Only this section scrolls */}
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <ProtectedLayoutContent>
        {children}
      </ProtectedLayoutContent>
    </SidebarProvider>
  );
}
