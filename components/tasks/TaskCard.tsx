"use client";
import { Task } from "@/services/api";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export default function TaskCard({ task, onEdit, onDelete, isDeleting }: TaskCardProps) {
  const owner = typeof task.userId === "object" ? task.userId : null;
  const date = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5 transition-all duration-300 hover:border-indigo-500/30 hover:bg-slate-900/60 hover:shadow-2xl hover:shadow-indigo-500/5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex-1 text-sm font-semibold text-slate-100 leading-snug line-clamp-2">
          {task.title}
        </h3>
        <Badge status={task.status} />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-700/40">
        <div className="flex flex-col gap-0.5">
          {owner && <p className="text-xs text-slate-500">{owner.name}</p>}
          <p className="text-xs text-slate-600">{date}</p>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
            ✎ Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={isDeleting}
            onClick={() => onDelete(task._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
