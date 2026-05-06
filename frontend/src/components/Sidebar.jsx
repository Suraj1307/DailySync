import { ChevronLeft, ChevronRight, LayoutDashboard, ListTodo, Settings, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import BrandMark from "./BrandMark";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ListTodo },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/profile", label: "Profile", icon: User }
];

function Sidebar({ mobile = false, onNavigate, collapsed = false, onToggleCollapse }) {
  const { user } = useAuth();

  return (
    <aside
      className={`${
        mobile
          ? "h-full w-full bg-ink-900/95 p-4 text-white backdrop-blur-xl"
          : `fixed left-0 top-0 z-20 hidden h-screen shrink-0 border-r border-slate-200/55 bg-white/18 p-3 backdrop-blur-sm transition-[width] duration-200 dark:border-white/5 dark:bg-white/[0.02] lg:block ${
              collapsed ? "w-[88px]" : "w-[228px]"
            }`
      }`}
    >
      <div className="flex h-full flex-col">
        <div className={`flex items-center ${collapsed && !mobile ? "justify-center" : "justify-between"} rounded-[18px] bg-transparent p-2`}>
          <BrandMark compact={collapsed && !mobile} />
          {!mobile ? (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="secondary-button hidden h-9 w-9 p-0 lg:inline-flex"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          ) : null}
        </div>

        <nav className="mt-3 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center rounded-[14px] px-2.5 py-2 text-sm font-medium transition ${
                  collapsed && !mobile ? "justify-center" : "gap-3"
                } ${
                  isActive
                    ? "bg-slate-950 text-white shadow-[0_8px_22px_rgba(8,12,28,0.14)] dark:bg-white dark:text-slate-950"
                    : mobile
                      ? "text-slate-300 hover:bg-white/5"
                      : "text-slate-500 hover:bg-white/45 dark:text-slate-300 dark:hover:bg-white/[0.045]"
                }`
              }
              onClick={onNavigate}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-[12px] transition ${
                      isActive
                        ? "bg-white/15 dark:bg-slate-900/10"
                        : "bg-slate-100/80 group-hover:bg-white dark:bg-white/[0.04] dark:group-hover:bg-white/[0.07]"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  {!collapsed || mobile ? label : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mt-auto rounded-[16px] bg-white/36 p-3 dark:bg-white/[0.03]"
        >
          <div className={`flex items-center ${collapsed && !mobile ? "justify-center" : "gap-3"}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-brand-400/85 to-brand-600/70 text-sm font-semibold text-white">
              {(user?.name || "D").charAt(0)}
            </div>
            {!collapsed || mobile ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{user?.name || "DailySync"}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || "Personal workspace"}
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </aside>
  );
}

export default Sidebar;
