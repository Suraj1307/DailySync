import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { BellRing, BriefcaseBusiness, Mail, ShieldCheck } from "lucide-react";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../hooks/useAuth";
import { dashboardService } from "../services/dashboardService";

function ProfilePage() {
  const { user, clerkUser } = useAuth();
  const [telegramStatus, setTelegramStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadTelegramStatus = async () => {
      setStatusLoading(true);
      try {
        const response = await dashboardService.telegramStatus();
        if (active) {
          setTelegramStatus(response);
        }
      } catch (error) {
        if (active) {
          setTelegramStatus({ connected: false, error: true });
          toast.error(error.response?.data?.message || "Could not load Telegram status");
        }
      } finally {
        if (active) {
          setStatusLoading(false);
        }
      }
    };

    loadTelegramStatus();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="dashboard-surface px-5 py-6 md:px-7"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || clerkUser?.imageUrl}
              alt={user?.name}
              className="h-20 w-20 rounded-[24px] object-cover ring-1 ring-white/10"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
                Account profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {user?.name}
              </h1>
              <p className="mt-2 text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Role</p>
              <p className="mt-2 font-medium text-slate-900 dark:text-white">Workspace owner</p>
            </div>
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Status</p>
              <p className="mt-2 font-medium text-emerald-500">Active</p>
            </div>
            <div className="dashboard-card-muted px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Workspace</p>
              <p className="mt-2 font-medium text-slate-900 dark:text-white">Personal</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Profile details" subtitle="Core identity data used inside the workspace">
          <div className="space-y-3">
            <div className="dashboard-card-muted flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <BriefcaseBusiness size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Display identity</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {user?.name || "DailySync user"}
                </p>
              </div>
            </div>
            <div className="dashboard-card-muted flex items-start gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                <Mail size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Primary email</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Connection status" subtitle="What is active around your workspace">
          <div className="space-y-4 text-sm">
            <div className="dashboard-card-muted flex gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Authentication</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Clerk is handling secure sessions and route protection.
                </p>
              </div>
            </div>
            <div className="dashboard-card-muted flex gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400">
                <BellRing size={18} />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Telegram</p>
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  {statusLoading
                    ? "Checking connection..."
                    : telegramStatus?.connected
                      ? `Connected to ${telegramStatus.chatId}`
                      : telegramStatus?.error
                        ? "Status unavailable right now"
                        : "Not connected"}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default ProfilePage;
