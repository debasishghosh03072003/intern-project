"use client";
import { useState, useEffect } from "react";
import { Task, TaskPayload } from "@/services/api";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface TaskFormProps {
  initial?: Task | null;
  onSubmit: (data: TaskPayload) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [title,       setTitle]       = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status,      setStatus]      = useState<TaskPayload["status"]>(initial?.status ?? "pending");
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [loading,     setLoading]     = useState(false);

  useEffect(() => {
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setStatus(initial?.status ?? "pending");
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (title.length > 100) e.title = "Title must be ≤ 100 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), status });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="task-title"
        label="Title *"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-300">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskPayload["status"])}
          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <Button variant="secondary" onClick={onCancel} type="button">Cancel</Button>
        <Button type="submit" isLoading={loading}>
          {initial ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
