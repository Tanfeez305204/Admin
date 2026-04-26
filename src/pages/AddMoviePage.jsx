import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MovieForm from "../components/MovieForm";
import { createMovie } from "../api/movies.api";

export default function AddMoviePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      toast.success("Movie created successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
      navigate("/movies");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create movie.");
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Movies</p>
        <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Add new movie</h1>
      </div>

      <MovieForm
        onSubmit={(values) => createMutation.mutate(values)}
        isSubmitting={createMutation.isPending}
        submitLabel="Create Movie"
      />
    </div>
  );
}
