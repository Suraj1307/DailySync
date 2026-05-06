import { motion } from "framer-motion";

function SectionCard({ title, subtitle, action, children, className = "" }) {
  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`dashboard-card p-5 md:p-6 ${className}`.trim()}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white md:text-[1.2rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

export default SectionCard;
