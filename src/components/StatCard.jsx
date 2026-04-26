export default function StatCard({ label, value, icon, tone = "default" }) {
  const toneStyles = {
    default: "from-white/10 to-white/0 border-white/10",
    success: "from-emerald-500/20 to-transparent border-emerald-400/20",
    warning: "from-amber-500/20 to-transparent border-amber-400/20",
    accent: "from-red-500/20 to-transparent border-red-400/20"
  };

  return (
    <div
      className={`rounded-[1.5rem] border bg-gradient-to-br p-4 shadow-panel sm:rounded-[1.75rem] sm:p-5 ${toneStyles[tone] || toneStyles.default}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{value}</p>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold uppercase tracking-[0.18em] sm:h-12 sm:w-12">
          {icon}
        </div>
      </div>
    </div>
  );
}
