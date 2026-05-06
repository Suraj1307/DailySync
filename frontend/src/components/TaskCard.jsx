import { motion } from "framer-motion";
import { CalendarCheck2, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { formatDate, priorityStyles } from "../utils/formatters";

function TaskCard({ task, onToggleComplete, onEdit, onDelete }) {
  const taskId = task?._id || task?.id;
  const showEdit = typeof onEdit === "function";
  const showDelete = typeof onDelete === "function";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="dashboard-card group p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-brand-400 to-violet-400 opacity-80" />
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
              {task.completed ? "Completed task" : "Planned task"}
            </p>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-7 text-slate-900 dark:text-white">
            {task.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {task.description || "No description"}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
          <CalendarCheck2 size={15} />
          {formatDate(task.dueDate)}
        </div>
        {task.metadata?.timeText ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
            <Clock3 size={15} />
            {task.metadata.timeText}
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className="secondary-button px-3 py-2 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            {task.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            {task.completed ? "Completed" : "Mark complete"}
          </span>
        </button>
        {showEdit ? (
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="secondary-button px-3 py-2 text-sm"
          >
            Edit
          </button>
        ) : null}
        {showDelete ? (
          <button
            type="button"
            onClick={() => onDelete(taskId)}
            disabled={!taskId}
            className="rounded-2xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-sm font-medium text-rose-600 transition hover:-translate-y-0.5 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15"
          >
            Delete
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

export default TaskCard;
