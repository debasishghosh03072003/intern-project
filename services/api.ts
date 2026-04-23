const BASE_URL = "/api/v1";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  userId: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
}

export interface TaskPayload {
  title: string;
  description?: string;
  status?: "pending" | "in-progress" | "completed";
}

// ── Error class ────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Base request ───────────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message ?? "Something went wrong", res.status, data.errors);
  }
  return data;
}

// ── Auth API ───────────────────────────────────────────────────────────────────
export const authApi = {
  register: (name: string, email: string, password: string, role = "user") =>
    request<ApiResponse<User>>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    }),

  login: (email: string, password: string) =>
    request<ApiResponse<{ token: string; user: User }>>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

// ── Tasks API ──────────────────────────────────────────────────────────────────
export const tasksApi = {
  list: (filters?: TaskFilters) => {
    const q = new URLSearchParams();
    if (filters?.page)   q.set("page",   String(filters.page));
    if (filters?.limit)  q.set("limit",  String(filters.limit));
    if (filters?.status) q.set("status", filters.status);
    return request<ApiResponse<Task[]>>(`/tasks?${q.toString()}`);
  },

  create: (payload: TaskPayload) =>
    request<ApiResponse<Task>>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: Partial<TaskPayload>) =>
    request<ApiResponse<Task>>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request<ApiResponse<null>>(`/tasks/${id}`, { method: "DELETE" }),
};
