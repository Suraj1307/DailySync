import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const initialState = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "pending",
  source: "manual",
  metadata: {
    timeText: ""
  }
};

function TaskModal({ open, task, onClose, onSubmit }) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
      return;
    }

    if (!task) {
      setForm(initialState);
      return;
    }

    setForm({
      title: task.title || "",
      description: task.description || "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
      priority: task.priority || "medium",
      status: task.status || "pending",
      source: task.source || "manual",
      metadata: {
        timeText: task.metadata?.timeText || ""
      }
    });
  }, [open, task]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="auth-panel w-full max-w-2xl p-6 md:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-[11px] uppercase tracking-[0.3em] text-brand-500">Task composer</p>
        <h3 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
          {task ? "Edit task" : "Create task"}
        </h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Capture the next meaningful piece of work with a clear due moment and priority.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
        >
          <input
            className="field-input"
            placeholder="Task title"
            value={form.title}
            onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
          />
          <textarea
            className="field-input h-28 resize-none"
            placeholder="Description"
            value={form.description}
            onChange={(event) =>
              setForm((state) => ({ ...state, description: event.target.value }))
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="datetime-local"
              className="field-input"
              value={form.dueDate}
              onChange={(event) => setForm((state) => ({ ...state, dueDate: event.target.value }))}
            />
            <select
              className="field-input"
              value={form.priority}
              onChange={(event) => setForm((state) => ({ ...state, priority: event.target.value }))}
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
          </div>
          <input
            className="field-input"
            placeholder="Time label, e.g. 2 PM"
            value={form.metadata.timeText}
            onChange={(event) =>
              setForm((state) => ({
                ...state,
                metadata: { ...state.metadata, timeText: event.target.value }
              }))
            }
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button bg-gradient-to-r from-brand-500 to-brand-400 text-white dark:text-white"
            >
              Save task
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default TaskModal;
