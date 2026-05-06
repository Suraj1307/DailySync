import { motion } from "framer-motion";

function StatCard({ label, value, hint, accent, meta }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="dashboard-card relative overflow-hidden p-5"
    >
      <div
        className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${accent || "from-brand-300/0 via-brand-400/80 to-violet-300/0"}`}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {meta ? (
          <span className="rounded-full border border-white/10 bg-white/70 px-2.5 py-1 text-xs text-slate-500 dark:bg-white/[0.05] dark:text-slate-400">
            {meta}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{hint}</p>
    </motion.div>
  );
}

export default StatCard;
