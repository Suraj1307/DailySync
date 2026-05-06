import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import SectionCard from "../components/SectionCard";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { authService } from "../services/authService";

function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const [form, setForm] = useState({
    morningSummaryTime: user?.preferences?.morningSummaryTime || "08:00",
    timezone: user?.preferences?.timezone || "Asia/Calcutta",
    telegramChatId: user?.telegramChatId || ""
  });

  useEffect(() => {
    setForm({
      morningSummaryTime: user?.preferences?.morningSummaryTime || "08:00",
      timezone: user?.preferences?.timezone || "Asia/Calcutta",
      telegramChatId: user?.telegramChatId || ""
    });
  }, [user]);

  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      await authService.updatePreferences({
        ...form,
        darkMode
      });
      await refreshUser();
      toast.success("Settings updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="dashboard-surface px-5 py-6 md:px-7"
      >
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
          Settings
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Daily preferences
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Save the reminder time, timezone, and theme you want to use every day.
        </p>
      </motion.section>

      <div className="grid gap-6">
        <SectionCard title="Preferences" subtitle="Your reminder and interface defaults">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={saveSettings}>
        <label className="space-y-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Morning summary time</span>
          <input
            type="time"
            value={form.morningSummaryTime}
            onChange={(event) =>
              setForm((state) => ({ ...state, morningSummaryTime: event.target.value }))
            }
            className="field-input"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Timezone</span>
          <input
            value={form.timezone}
            onChange={(event) => setForm((state) => ({ ...state, timezone: event.target.value }))}
            className="field-input"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-500 dark:text-slate-400">Telegram Chat ID</span>
          <input
            value={form.telegramChatId}
            onChange={(event) =>
              setForm((state) => ({ ...state, telegramChatId: event.target.value }))
            }
            className="field-input"
          />
        </label>

        <label className="dashboard-card-muted flex items-center gap-3 px-4 py-3">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={(event) => setDarkMode(event.target.checked)}
          />
          <span>Enable dark mode</span>
        </label>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="primary-button bg-gradient-to-r from-brand-500 to-brand-400 text-white dark:text-white"
          >
            Save settings
          </button>
        </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}

export default SettingsPage;
