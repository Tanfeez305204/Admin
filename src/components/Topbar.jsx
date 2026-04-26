import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutRequest } from "../api/auth.api";
import useAuthStore from "../store/authStore";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      await Promise.resolve();
    } finally {
      clearSession();
      toast.success("Logged out successfully.");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#090c17]/80 backdrop-blur-xl">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3 xl:hidden">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white lg:hidden"
              aria-label="Open sidebar"
            >
              |||
            </button>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Control Room</p>
              <h2 className="truncate text-lg font-semibold text-white sm:text-xl">Welcome back</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Logout
          </button>
        </div>

        <div className="mt-3 xl:hidden">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-left">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admin</p>
            <p className="truncate text-sm font-medium text-white">{admin?.email || "Unknown admin"}</p>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-6 xl:flex">
          <div className="flex min-w-0 items-start gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Control Room</p>
              <h2 className="text-xl font-semibold text-white">Welcome back</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="min-w-[15rem] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admin</p>
              <p className="truncate text-sm font-medium text-white">{admin?.email || "Unknown admin"}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
