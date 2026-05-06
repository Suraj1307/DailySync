function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-[18px] bg-gradient-to-br from-brand-400/90 via-brand-500/78 to-brand-600/68 text-white shadow-[0_10px_28px_rgba(67,78,176,0.22)]">
        <div className="absolute inset-[1px] rounded-[15px] bg-white/8" />
        <div className="relative grid h-5 w-5 grid-cols-2 gap-1">
          <span className="rounded-[4px] bg-white/90" />
          <span className="rounded-[4px] bg-white/65" />
          <span className="rounded-[4px] bg-white/55" />
          <span className="rounded-[4px] bg-white/90" />
        </div>
      </div>
      {!compact ? (
        <div>
          <p className="text-[11px] uppercase tracking-[0.34em] text-brand-400/90 dark:text-brand-300">
            DailySync
          </p>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">
            Organize smarter. Focus deeper.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default BrandMark;
