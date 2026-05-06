import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { CheckCheck, Clock3, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import SectionCard from "../components/SectionCard";
import TaskCard from "../components/TaskCard";
import { dashboardService } from "../services/dashboardService";
import { taskService } from "../services/taskService";
import { formatRelativeTime } from "../utils/formatters";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.get();
      setData(response);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const derived = useMemo(() => {
    if (!data) return null;

    const total = data.stats.total || 0;
    const completed = data.stats.completed || 0;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    const dueTodayCount = data.todayTasks.length;
    const upcomingCount = data.upcomingTasks.length;
    const openCount = total - completed;

    const summary =
      dueTodayCount >= 3
        ? "You have a busy day ahead. Start with the highest-priority task."
        : completed >= 3
          ? "You are making steady progress this week."
          : "A lighter schedule gives you room to focus on one clear win today.";

    return {
      completionRate,
      dueTodayCount,
      upcomingCount,
      openCount,
      summary
    };
  }, [data]);

  const toggleTask = async (task) => {
    await taskService.update(task._id || task.id, {
      completed: !task.completed,
      status: !task.completed ? "completed" : "pending"
    });
    loadDashboard();
  };

  if (loading) {
    return (
      <div className="grid gap-4">
        <div className="dashboard-card h-72 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="dashboard-surface px-5 py-5 md:px-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Overview</p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white md:text-[2rem]">
              {derived.dueTodayCount} task{derived.dueTodayCount === 1 ? "" : "s"} due today
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {derived.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="micro-pill px-3 py-1.5">
                <Clock3 size={16} className="text-brand-400" />
                {derived.upcomingCount} upcoming
              </div>
              <div className="micro-pill px-3 py-1.5">
                <ListTodo size={16} className="text-slate-400" />
                {derived.openCount} open
              </div>
            </div>
          </div>
          <Link
            to="/tasks"
            className="secondary-button inline-flex w-full items-center justify-center px-4 py-3 text-sm md:w-auto"
          >
            View all tasks
          </Link>
        </div>
      </motion.section>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Open tasks"
          value={derived.openCount}
          hint="Items that still need attention."
        />
        <StatCard
          label="Completed"
          value={data.stats.completed}
          hint={`Completion rate is ${derived.completionRate}% so far.`}
          accent="from-emerald-300/0 via-emerald-400/80 to-emerald-300/0"
        />
      </div>

      <SectionCard
        title="Today's plan"
        subtitle={`${derived.dueTodayCount} task${derived.dueTodayCount === 1 ? "" : "s"} queued for today`}
      >
        <div className="space-y-4">
          {data.todayTasks.length ? (
            data.todayTasks.map((task) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                onToggleComplete={toggleTask}
              />
            ))
          ) : (
            <div className="dashboard-card-muted p-5 text-[13px] leading-6 text-slate-500 dark:text-slate-400">
              No tasks scheduled for today. Add one high-confidence task to create momentum.
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Upcoming tasks" subtitle="What is coming next">
        <div className="space-y-4">
          {data.upcomingTasks.length ? (
            data.upcomingTasks.map((task) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                onToggleComplete={toggleTask}
              />
            ))
          ) : (
            <div className="dashboard-card-muted p-5 text-[13px] leading-6 text-slate-500 dark:text-slate-400">
              No upcoming tasks yet.
            </div>
          )}
        </div>
      </SectionCard>

      {data.completedTasks.length ? (
        <SectionCard title="Completed tasks" subtitle="Recently finished">
          <div className="space-y-3">
            {data.completedTasks.map((task) => (
              <div key={task._id || task.id} className="dashboard-card-muted flex items-start gap-3 p-4">
                <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CheckCheck size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white">{task.title}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {task.updatedAt ? formatRelativeTime(task.updatedAt) : "Completed"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

export default Dashboard;
