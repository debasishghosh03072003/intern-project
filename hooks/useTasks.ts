"use client";
import { useState, useEffect, useCallback } from "react";
import { tasksApi, Task, TaskPayload, ApiError } from "@/services/api";
import { useToast } from "@/context/ToastContext";

interface UseTasksOptions {
  status?: string;
  page?: number;
  limit?: number;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await tasksApi.list({
        status: options.status || undefined,
        page: options.page ?? 1,
        limit: options.limit ?? 10,
      });
      setTasks(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
      setTotalPages(res.meta?.totalPages ?? 1);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to load tasks";
      toast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.page, options.limit]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload: TaskPayload) => {
    const res = await tasksApi.create(payload);
    toast("Task created!", "success");
    await fetchTasks();
    return res.data;
  };

  const updateTask = async (id: string, payload: Partial<TaskPayload>) => {
    await tasksApi.update(id, payload);
    toast("Task updated!", "success");
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await tasksApi.delete(id);
    toast("Task deleted!", "success");
    await fetchTasks();
  };

  return { tasks, isLoading, total, totalPages, fetchTasks, createTask, updateTask, deleteTask };
}
