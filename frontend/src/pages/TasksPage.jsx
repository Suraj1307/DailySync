import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { taskService } from "../services/taskService";

const getTaskId = (task) => task?._id || task?.id;

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await taskService.list();
      setTasks(response.tasks);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (location.state?.openNewTask) {
      setActiveTask(null);
      setOpenModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const highPriority = tasks.filter((task) => task.priority === "high" && !task.completed).length;

    return {
      total: tasks.length,
      completed,
      open: tasks.length - completed,
      highPriority
    };
  }, [tasks]);

  const saveTask = async (form) => {
    try {
      const payload = {
        ...form,
        dueDate: form.dueDate || null
      };

      if (activeTask) {
        const activeTaskId = getTaskId(activeTask);

        if (!activeTaskId) {
          throw new Error("Task id is missing");
        }

        await taskService.update(activeTaskId, payload);
        toast.success("Task updated");
      } else {
        await taskService.create(payload);
        toast.success("Task created");
      }

      setOpenModal(false);
      setActiveTask(null);
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save task");
    }
  };

  const deleteTask = async (id) => {
    try {
      if (!id) {
        throw new Error("Task id is missing");
      }
      await taskService.remove(id);
      toast.success("Task deleted");
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const toggleComplete = async (task) => {
    try {
      const taskId = getTaskId(task);

      if (!taskId) {
        throw new Error("Task id is missing");
      }

      await taskService.update(taskId, {
        completed: !task.completed,
        status: !task.completed ? "completed" : "pending"
      });
      loadTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="dashboard-surface px-5 py-5 md:px-6"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Tasks</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              All tasks
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              Keep the list short, clear, and easy to update.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Open</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.open}</p>
            </div>
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Completed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.completed}</p>
            </div>
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">High priority</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.highPriority}</p>
            </div>
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Tracked</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.total}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <SectionCard
        title="Task list"
        subtitle="Everything you are currently tracking"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTask(null);
                setOpenModal(true);
              }}
              className="primary-button gap-2 bg-gradient-to-r from-brand-500 to-brand-400 px-4 py-2.5 text-sm text-white dark:text-white"
            >
              <Plus size={16} />
              Add task
            </button>
          </div>
        }
      >
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="dashboard-card-muted flex flex-col items-start gap-3 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
              <Target size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No tasks yet</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Add the first task you want to finish next.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard
                key={getTaskId(task)}
                task={task}
                onToggleComplete={toggleComplete}
                onEdit={(selected) => {
                  setActiveTask(selected);
                  setOpenModal(true);
                }}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </SectionCard>

      <TaskModal
        open={openModal}
        task={activeTask}
        onClose={() => {
          setOpenModal(false);
          setActiveTask(null);
        }}
        onSubmit={saveTask}
      />
    </div>
  );
}

export default TasksPage;
