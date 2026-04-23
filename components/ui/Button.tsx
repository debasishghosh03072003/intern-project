"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "@/components/ui/Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary:   "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]",
  secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 active:scale-[0.98]",
  danger:    "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 active:scale-[0.98]",
  ghost:     "hover:bg-slate-800 text-slate-400 hover:text-slate-100 active:bg-slate-800/80",
};
const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary", size = "md", isLoading, disabled, children, className = "", ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
