type Status = "pending" | "in-progress" | "completed";

const map: Record<Status, { label: string; className: string }> = {
  "pending":     { label: "Pending",     className: "bg-slate-700 text-slate-300 border border-slate-600" },
  "in-progress": { label: "In Progress", className: "bg-amber-500/15 text-amber-400 border border-amber-500/30" },
  "completed":   { label: "Completed",   className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" },
};

export default function Badge({ status }: { status: Status }) {
  const styles = {
    pending: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    "in-progress": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-colors ${styles[status]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
        status === 'completed' ? 'bg-emerald-400' :
        status === 'in-progress' ? 'bg-amber-400' :
        'bg-slate-400'
      }`} />
      {status.replace("-", " ")}
    </span>
  );
}
