import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginRequest } from "../api/auth.api";
import useAuthStore from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values) => {
    try {
      const response = await loginRequest(values);
      setSession(response.data.accessToken, response.data.admin);
      toast.success("Login successful.");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#090c17] px-4 py-6 sm:py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/5 bg-panelSoft shadow-panel lg:grid-cols-[1.05fr_0.95fr] lg:rounded-[2rem]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.3),transparent_35%),linear-gradient(180deg,#111628_0%,#0b0f1d_100%)] p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-red-300">CineStream</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl lg:mt-6 lg:text-5xl">
            Manage your streaming directory with calm, fast control.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 lg:mt-6">
            Add movies, update posters, tune publishing status, and monitor language coverage from
            one secure dashboard.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin Sign In</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
              />
              {errors.email ? <p className="mt-2 text-sm text-red-400">{errors.email.message}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full rounded-2xl border border-stroke bg-panel px-4 py-3 text-white outline-none transition focus:border-accent"
              />
              {errors.password ? (
                <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
