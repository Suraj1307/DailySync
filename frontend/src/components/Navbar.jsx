import {
  Menu,
  Moon,
  Plus,
  Sun
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

function Navbar({ onOpenMenu }) {
  const { darkMode, setDarkMode } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="dashboard-surface sticky top-3 z-30 overflow-hidden px-4 py-3 md:px-5"
    >
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="secondary-button p-2 lg:hidden"
            onClick={onOpenMenu}
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">DailySync</p>
            <h2 className="mt-1 text-[1.05rem] font-semibold tracking-tight text-slate-900 dark:text-white">
              Good to see you, {user?.name?.split(" ")[0] || "there"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="primary-button gap-2 px-3 py-2 text-sm whitespace-nowrap bg-gradient-to-r from-brand-500 to-brand-400 text-white dark:text-white"
            title="Add task"
            onClick={() => navigate("/tasks", { state: { openNewTask: true } })}
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add task</span>
          </button>
          <button
            type="button"
            className="secondary-button p-2 shrink-0"
            onClick={() => setDarkMode((value) => !value)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="shrink-0 rounded-[16px] bg-white/65 p-1 dark:bg-white/[0.04]">
            <UserButton afterSignOutUrl="/login" />
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
