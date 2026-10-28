
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layers3,
  LogOut,
  X,
} from "lucide-react";

import { navigation } from "@/config/navigation.config";
import { useAuth } from "@/modules/authentication/hooks/useAuth";
import { useSidebar } from "./Sidebar-Context";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const {
    collapsed,
    mobileOpen,
    closeMobile,
  } = useSidebar();

  const menu = navigation.filter((item) => {
    if (
      item.roles &&
      !item.roles.some((role) =>
        user?.roles?.includes(role)
      )
    ) {
      return false;
    }

    if (
      item.permissions &&
      !item.permissions.some((permission) =>
        user?.permissions?.includes(permission)
      )
    ) {
      return false;
    }

    return true;
  });

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase() || "U";

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-dvh flex-col
          border-r border-[#DCE2EC]
          bg-[#EDF1F9]
          transition-[width,transform] duration-300 ease-in-out
          w-56
          ${collapsed ? "lg:w-18" : "lg:w-56"}
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Branding */}
        <div
          className={`
            flex h-20.5 shrink-0 items-center
            border-b border-[#DCE2EC]
            ${collapsed ? "lg:justify-center lg:px-2" : "px-5"}
          `}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#171B4B] text-white">
            <Layers3 size={18} strokeWidth={1.7} />
          </div>

          <div
            className={`
              ml-3 min-w-0 overflow-hidden
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            <h2 className="text-[16px] font-semibold leading-tight text-[#171B35]">
              SMS
            </h2>
            <p className="mt-0.5 whitespace-nowrap text-[10px] text-[#667085]">
              Subscription Monitoring
            </p>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-1.5 text-[#475467] hover:bg-[#E2E7F7] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className={`
            flex-1 space-y-1 overflow-y-auto pt-4
            ${collapsed ? "lg:px-3" : "px-4"}
          `}
        >
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/" &&
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={`${item.title}-${item.href}`}
                href={item.href}
                onClick={closeMobile}
                title={collapsed ? item.title : undefined}
                aria-label={item.title}
                aria-current={active ? "page" : undefined}
                className={`
                  flex h-10 items-center gap-3
                  rounded-[10px] px-3
                  text-[13px] font-medium
                  transition-colors duration-150
                  ${collapsed ? "lg:justify-center lg:px-0" : ""}
                  ${
                    active
                      ? "bg-[#DCE2FF] text-[#171B4B]"
                      : "text-[#344054] hover:bg-[#E2E7F7] hover:text-[#171B4B]"
                  }
                `}
              >
                <Icon
                  size={18}
                  strokeWidth={1.7}
                  className="shrink-0"
                />

                <span
                  className={`
                    truncate whitespace-nowrap
                    ${collapsed ? "lg:hidden" : ""}
                  `}
                >
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          className={`
            shrink-0 pb-4
            ${collapsed ? "lg:px-3" : "px-4"}
          `}
        >
          {/* Workspace overview */}
          <div
            className={`
              mb-4 rounded-[14px]
              border border-[#DCE2EC]
              bg-[#F8FAFD] p-3
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#E4E9FA]">
              <Layers3
                size={14}
                className="text-[#303C87]"
              />
            </div>

            <p className="text-[12px] font-semibold text-[#171B35]">
              Workspace overview
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#667085]">
              Manage your workspace and access controls.
            </p>
          </div>

          {/* Profile */}
          <div className="border-t border-[#DCE2EC] pt-3">
            <div
              className={`
                flex items-center gap-2 rounded-lg px-1 py-2
                ${collapsed ? "lg:justify-center" : ""}
              `}
            >
              <div
                title={user?.name ?? "User"}
                className="
                  flex h-8 w-8 shrink-0 items-center
                  justify-center rounded-full
                  bg-[#E0E5FF] text-[10px]
                  font-semibold text-[#303C87]
                "
              >
                {initials}
              </div>

              <div
                className={`
                  min-w-0 flex-1
                  ${collapsed ? "lg:hidden" : ""}
                `}
              >
                <p className="truncate text-[11px] font-semibold text-[#171B35]">
                  {user?.name ?? "User"}
                </p>
                <p className="truncate text-[10px] text-[#667085]">
                  {user?.username ?? "Account"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              title="Sign out"
              aria-label="Sign out"
              className={`
                mt-1 flex w-full items-center gap-3
                rounded-lg px-3 py-2 text-[12px]
                text-[#667085] transition-colors
                hover:bg-[#E2E7F7] hover:text-[#171B4B]
                ${collapsed ? "lg:justify-center lg:px-0" : ""}
              `}
            >
              <LogOut size={17} className="shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>
                Sign out
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
