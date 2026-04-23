"use client";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps { title: string; }

export default function Navbar({ title }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-slate-100">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
