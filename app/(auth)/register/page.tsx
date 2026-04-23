"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { ApiError } from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("user");
  const [errors,   setErrors]   = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();
  const { toast }    = useToast();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())          e.name     = "Name is required";
    if (!email)                e.email    = "Email is required";
    if (password.length < 6)   e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    setErrors({});
    try {
      await register(name, email, password, role);
      toast("Account created! Please sign in.", "success");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Registration failed";
      toast(msg, "error");
      setErrors({ form: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
          T
        </div>
        <h1 className="text-2xl font-bold text-slate-100">Create account</h1>
        <p className="mt-1 text-sm text-slate-400">Join TaskFlow to manage your tasks</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {errors.form && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {errors.form}
          </div>
        )}
        <Input id="name" label="Full name" placeholder="John Doe" value={name}
          onChange={(e) => setName(e.target.value)} error={errors.name} />

        <Input id="email" type="email" label="Email address" placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

        <Input id="password" type="password" label="Password" placeholder="Min 6 characters"
          value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button type="submit" isLoading={loading} className="mt-2 w-full py-3">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
