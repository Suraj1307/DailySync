import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  const [openMenu, setOpenMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem("dailysync_sidebar_collapsed");
    return stored ? stored === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("dailysync_sidebar_collapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />

      {openMenu && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md lg:hidden"
          onClick={() => setOpenMenu(false)}
        >
          <div
            className="h-full w-72"
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar mobile onNavigate={() => setOpenMenu(false)} />
          </div>
        </div>
      )}

      <main
        className={`min-w-0 overflow-x-hidden px-4 pb-6 pt-4 transition-[padding-left] duration-200 md:px-6 md:pb-8 md:pt-5 ${
          sidebarCollapsed ? "lg:pl-[112px]" : "lg:pl-[252px]"
        }`}
      >
        <Navbar onOpenMenu={() => setOpenMenu(true)} />
        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
