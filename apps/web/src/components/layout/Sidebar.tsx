
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
          border-r border-[#DDDED8]
          bg-[#EEEFEA]
          transition-[width,transform] duration-300 ease-in-out
          w-56
          ${collapsed ? "lg:w-[72px]" : "lg:w-[224px]"}
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
            border-b border-[#DDDED8]
            ${collapsed ? "lg:justify-center lg:px-2" : "px-5"}
          `}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#26342F] text-white">
            <Layers3 size={18} strokeWidth={1.7} />
          </div>

          <div
            className={`
              ml-3 min-w-0 overflow-hidden
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            <h2 className="text-[16px] font-semibold leading-tight text-[#202A26]">
              SUBFLOW
            </h2>
            <p className="mt-0.5 whitespace-nowrap text-[10px] text-[#929992]">
              User workspace
            </p>
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-1.5 text-[#526B5D] hover:bg-[#DCE1DA] lg:hidden"
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
                      ? "bg-[#DCE1DA] text-[#26342F]"
                      : "text-[#858D86] hover:bg-[#E2E5DF] hover:text-[#26342F]"
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
              border border-[#D9DDD6]
              bg-[#F5F6F2] p-3
              ${collapsed ? "lg:hidden" : ""}
            `}
          >
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-lg bg-[#E0E6DE]">
              <Layers3
                size={14}
                className="text-[#526B5D]"
              />
            </div>

            <p className="text-[12px] font-semibold text-[#27332C]">
              Workspace overview
            </p>

            <p className="mt-1 text-[11px] leading-relaxed text-[#929A93]">
              Manage your workspace and access controls.
            </p>
          </div>

          {/* Profile */}
          <div className="border-t border-[#D9DDD6] pt-3">
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
                  bg-[#D8DFD8] text-[10px]
                  font-semibold text-[#26342F]
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
                <p className="truncate text-[11px] font-semibold text-[#26342F]">
                  {user?.name ?? "User"}
                </p>
                <p className="truncate text-[10px] text-[#909890]">
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
                text-[#7F8880] transition-colors
                hover:bg-[#E2E5DF] hover:text-[#26342F]
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
