import { z } from "zod";

// ─── Auth Schemas ──────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ error: "Password is required" })
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be at most 72 characters"),
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export const LoginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .toLowerCase()
    .trim(),
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

// ─── Task Schemas ──────────────────────────────────────────────────────────────

export const CreateTaskSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .trim()
    .optional()
    .default(""),
  status: z.enum(["pending", "in-progress", "completed"]).optional().default("pending"),
});

export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .trim()
    .optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput   = z.infer<typeof LoginSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
