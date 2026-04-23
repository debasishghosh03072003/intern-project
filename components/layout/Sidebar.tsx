"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { href: "/dashboard",   label: "Dashboard",   icon: "⊞" },
  { href: "/tasks",       label: "Tasks",       icon: "✓" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800/50 bg-slate-950">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-slate-800/50 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg font-bold shadow-lg shadow-indigo-500/20">
          T
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-100">TaskFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu
        </p>
        {navItems.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          ⎋ Logout
        </button>
      </div>
    </aside>
  );
}
