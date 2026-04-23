"use client";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            {...props}
            className={`w-full rounded-xl border bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 outline-none
              ${icon ? "pl-11" : ""}
              ${error ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"}
              ${className}`}
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;
