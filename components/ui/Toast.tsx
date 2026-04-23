"use client";
import { useEffect } from "react";
import { useToast, Toast as ToastType } from "@/context/ToastContext";

const icons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};
const colors = {
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  error:   "border-red-500/50 bg-red-500/10 text-red-300",
  info:    "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { dismiss } = useToast();
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-sm ${colors[toast.type]} animate-in slide-in-from-right-5 duration-300`}>
      <span className="mt-0.5 text-sm font-bold">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={() => dismiss(toast.id)} className="text-current opacity-60 hover:opacity-100 transition-opacity">✕</button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
