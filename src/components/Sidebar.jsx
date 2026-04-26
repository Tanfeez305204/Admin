import { NavLink } from "react-router-dom";

const navigation = [
  { to: "/dashboard", label: "Dashboard", icon: "DB" },
  { to: "/movies", label: "Movies", icon: "MV" },
  { to: "/movies/new", label: "Add Movie", icon: "+" }
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        role="presentation"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[86vw] max-w-[20rem] overflow-y-auto border-r border-stroke bg-panel/95 px-5 py-6 backdrop-blur transition-transform duration-300 lg:w-72 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">CineStream</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Admin Panel</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 lg:hidden"
            aria-label="Close sidebar"
          >
            X
          </button>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-white shadow-[0_12px_30px_rgba(239,68,68,0.28)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold uppercase tracking-[0.18em]">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
