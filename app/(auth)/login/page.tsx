"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email)    e.email    = "Email is required";
    if (!password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setErrors({});
    try {
      await login(email, password);
      toast("Welcome back!", "success");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Login failed";
      toast(msg, "error");
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
          T
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to your TaskFlow account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.form && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errors.form}
          </div>
        )}
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" isLoading={loading} className="mt-2 w-full py-3">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
