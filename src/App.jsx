import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MoviesPage from "./pages/MoviesPage";
import AddMoviePage from "./pages/AddMoviePage";
import EditMoviePage from "./pages/EditMoviePage";
import useAuth from "./hooks/useAuth";

const AppLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#090c17] text-white">
    <div className="rounded-3xl border border-stroke bg-panelSoft px-6 py-5 shadow-panel">
      <p className="text-lg font-semibold">Restoring admin session...</p>
    </div>
  </div>
);

export default function App() {
  const { isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppLoader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/new" element={<AddMoviePage />} />
          <Route path="/movies/:id/edit" element={<EditMoviePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
