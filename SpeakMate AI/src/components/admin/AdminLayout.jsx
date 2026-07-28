import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  School,
  Bot,
  CreditCard,
  FileBarChart,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useTheme } from "@context/ThemeContext";

import ROUTES from "@constants/routes";

const navItems = [
  { label: "Dashboard", href: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: "Schools", href: "/admin/schools", icon: School },
  { label: "Users", href: ROUTES.ADMIN_USERS, icon: Users },
  { label: "Lessons", href: ROUTES.ADMIN_LESSONS, icon: BookOpen },
  { label: "AI Configuration", href: "/admin/ai-configuration", icon: Bot },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: CreditCard },
  { label: "Reports", href: ROUTES.ADMIN_ANALYTICS, icon: FileBarChart },
  { label: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.name || "Admin";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  const pageTitle = navItems.find((item) => location.pathname === item.href || (item.href !== ROUTES.ADMIN && location.pathname.startsWith(item.href)))?.label || "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col transform border-r border-slate-200 bg-white transition-transform duration-200 ease-out dark:border-slate-700 dark:bg-slate-900 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto lg:flex-shrink-0`}
      >
        <div className="flex h-16 flex-shrink-0 items-center gap-2 border-b border-slate-200 px-5 dark:border-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold">
            S
          </div>
          <span className="text-base font-bold tracking-tight text-slate-950 dark:text-white">SpeakMateAI</span>
          <span className="ml-auto rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700 uppercase tracking-wider dark:bg-purple-900/40 dark:text-purple-300">
            Admin
          </span>
          <button
            className="lg:hidden ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.5} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-shrink-0 border-t border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {initials || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-slate-950 dark:text-white">
                {fullName}
              </p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
            <h1 className="min-w-0 truncate text-base font-bold text-slate-950 dark:text-white">{pageTitle}</h1>
          </div>

          <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
            <div className="relative hidden w-40 sm:block md:w-52 lg:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
                aria-label="Search admin"
              />
            </div>

            <button type="button" onClick={toggleTheme} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
              aria-label="Notifications"
            >
              <Bell size={18} strokeWidth={1.5} />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                3
              </span>
            </button>

            <button type="button" className="flex flex-shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:border-indigo-200 hover:shadow-sm dark:border-slate-600 dark:bg-slate-800" aria-label="Open admin profile menu">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 text-xs font-bold text-white">
                {initials || "A"}
              </div>
              <span className="hidden max-w-[100px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:block">
                {fullName}
              </span>
              <ChevronDown size={14} className="hidden flex-shrink-0 text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
