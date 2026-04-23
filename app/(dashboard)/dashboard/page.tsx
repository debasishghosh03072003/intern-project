"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import Spinner from "@/components/ui/Spinner";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: string;
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div className={`rounded-2xl border bg-slate-900/50 p-6 transition-all duration-300 hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-950/50 ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/50 text-2xl shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, isLoading, total } = useTasks({ limit: 100 });

  const pending    = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed  = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Welcome */}
      <div className="rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600/10 to-violet-600/10 p-6">
        <h2 className="text-2xl font-bold text-slate-100">
          Welcome back, {user?.name} 👋
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Here's an overview of your task board.
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Tasks"   value={total}      color="border-slate-700"              icon="📋" />
          <StatCard label="Pending"       value={pending}    color="border-slate-600"              icon="⏳" />
          <StatCard label="In Progress"   value={inProgress} color="border-amber-500/30"           icon="🔄" />
          <StatCard label="Completed"     value={completed}  color="border-emerald-500/30"         icon="✅" />
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Recent Tasks
        </h3>
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900 py-12 text-center">
            <p className="text-slate-400">No tasks yet.</p>
            <a href="/tasks" className="mt-2 inline-block text-sm text-indigo-400 hover:underline">
              Create your first task →
            </a>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="px-4 py-3 text-left font-medium text-slate-400">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-400 hidden md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task) => (
                  <tr key={task._id} className="border-b border-slate-700/50 hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200 truncate max-w-xs">{task.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.status === "completed"   ? "bg-emerald-500/15 text-emerald-400" :
                        task.status === "in-progress" ? "bg-amber-500/15 text-amber-400" :
                                                        "bg-slate-700 text-slate-400"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden md:table-cell">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasks.length > 5 && (
              <div className="border-t border-slate-700 px-4 py-3 text-center">
                <a href="/tasks" className="text-sm text-indigo-400 hover:underline">
                  View all {total} tasks →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
