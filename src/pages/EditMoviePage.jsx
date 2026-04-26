import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MovieForm from "../components/MovieForm";
import { updateMovie } from "../api/movies.api";
import { useMovieDetails } from "../hooks/useMovies";

export default function EditMoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMovieDetails(id);

  const updateMutation = useMutation({
    mutationFn: (values) => updateMovie(id, values),
    onSuccess: () => {
      toast.success("Movie updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      queryClient.invalidateQueries({ queryKey: ["admin-movie", id] });
      navigate("/movies");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update movie.");
    }
  });

  if (isLoading) {
    return (
      <div className="rounded-[1.75rem] border border-white/5 bg-panelSoft p-6 text-sm text-slate-300 shadow-panel sm:rounded-[2rem] sm:p-8">
        Loading movie details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Movies</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Edit movie</h1>
      </div>

      <MovieForm
        initialValues={data?.data}
        onSubmit={(values) => updateMutation.mutate(values)}
        isSubmitting={updateMutation.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
