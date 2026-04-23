"use client";
import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useToast } from "@/context/ToastContext";
import { ApiError, Task, TaskPayload } from "@/services/api";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

const STATUSES = ["all", "pending", "in-progress", "completed"] as const;
type Filter = (typeof STATUSES)[number];

export default function TasksPage() {
  const [filter,      setFilter]      = useState<Filter>("all");
  const [page,        setPage]        = useState(1);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editTask,    setEditTask]    = useState<Task | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const { toast } = useToast();

  const { tasks, isLoading, total, totalPages, createTask, updateTask, deleteTask } = useTasks({
    status: filter === "all" ? undefined : filter,
    page,
    limit: 9,
  });

  const openCreate = () => { setEditTask(null); setModalOpen(true); };
  const openEdit   = (t: Task) => { setEditTask(t); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditTask(null); };

  const handleSubmit = async (data: TaskPayload) => {
    try {
      if (editTask) await updateTask(editTask._id, data);
      else          await createTask(data);
      closeModal();
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Operation failed", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteTask(id); }
    catch (err) { toast(err instanceof ApiError ? err.message : "Delete failed", "error"); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Tasks</h2>
          <p className="text-sm text-slate-400">{total} task{total !== 1 ? "s" : ""} total</p>
        </div>
        <Button onClick={openCreate}>+ New Task</Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all ${
              filter === s
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {s.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Task grid */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-900 py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium text-slate-300">No tasks found</p>
          <p className="mt-1 text-sm text-slate-500">
            {filter !== "all" ? "Try a different filter" : "Create your first task"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              isDeleting={deletingId === task._id}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            ← Prev
          </Button>
          <span className="text-sm text-slate-400">
            Page {page} of {totalPages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next →
          </Button>
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          initial={editTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
