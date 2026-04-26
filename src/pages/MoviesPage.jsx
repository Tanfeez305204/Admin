import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMovie } from "../api/movies.api";
import ConfirmDialog from "../components/ConfirmDialog";
import MovieTable from "../components/MovieTable";
import Pagination from "../components/Pagination";
import { useMoviesList } from "../hooks/useMovies";

const PAGE_SIZE = 20;

export default function MoviesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIds, setSelectedIds] = useState([]);
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      lang: language || undefined,
      sortBy,
      sortOrder
    }),
    [language, page, search, sortBy, sortOrder]
  );

  const queryKey = ["admin-movies", queryParams];

  const { data, isLoading, isFetching } = useMoviesList(queryParams);

  useEffect(() => {
    setSelectedIds((current) =>
      current.filter((id) => (data?.data || []).some((movie) => movie.id === id))
    );
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(ids.map((id) => deleteMovie(id)));
      return ids;
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ["admin-movies"] });
      const previousData = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (currentData) => {
        if (!currentData) {
          return currentData;
        }

        const nextMovies = currentData.data.filter((movie) => !ids.includes(movie.id));
        const nextTotal = Math.max(0, currentData.total - ids.length);

        return {
          ...currentData,
          data: nextMovies,
          total: nextTotal,
          totalPages: Math.ceil(nextTotal / currentData.limit)
        };
      });

      return { previousData };
    },
    onError: (error, ids, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast.error(error.response?.data?.message || "Failed to delete movie.");
    },
    onSuccess: (ids) => {
      toast.success(ids.length > 1 ? "Movies deleted successfully." : "Movie deleted successfully.");
      setSelectedIds((current) => current.filter((id) => !ids.includes(id)));
    },
    onSettled: () => {
      setPendingDeleteIds([]);
      queryClient.invalidateQueries({ queryKey: ["admin-movies"] });
    }
  });

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(field);
    setSortOrder("asc");
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleToggleSelectAll = (checked) => {
    if (!checked) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds((data?.data || []).map((movie) => movie.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Movies</p>
          <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Manage catalog</h1>
        </div>

        <button
          type="button"
          onClick={() => navigate("/movies/new")}
          className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500 sm:w-auto"
        >
          Add Movie
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-[1.75rem] border border-white/5 bg-panelSoft p-6 text-sm text-slate-300 shadow-panel sm:rounded-[2rem] sm:p-8">
          Loading movies...
        </div>
      ) : (
        <>
          {isFetching ? (
            <div className="rounded-2xl border border-white/5 bg-panel px-4 py-3 text-sm text-slate-300">
              Refreshing movie list...
            </div>
          ) : null}

          <MovieTable
            movies={data?.data || []}
            search={search}
            language={language}
            selectedIds={selectedIds}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            onLanguageChange={(value) => {
              setLanguage(value);
              setPage(1);
            }}
            onSortChange={handleSortChange}
            onSortByChange={(value) => {
              setSortBy(value);
              setPage(1);
            }}
            onSortOrderChange={(value) => {
              setSortOrder(value);
              setPage(1);
            }}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onEdit={(id) => navigate(`/movies/${id}/edit`)}
            onDelete={(id) => setPendingDeleteIds([id])}
            onDeleteSelected={() => setPendingDeleteIds(selectedIds)}
          />

          <Pagination
            page={page}
            totalPages={data?.totalPages || 0}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </>
      )}

      <ConfirmDialog
        open={pendingDeleteIds.length > 0}
        title={pendingDeleteIds.length > 1 ? "Delete selected movies?" : "Delete movie?"}
        description={
          pendingDeleteIds.length > 1
            ? "This action will remove all selected movies from the catalog."
            : "This action will remove the selected movie from the catalog."
        }
        confirmLabel={pendingDeleteIds.length > 1 ? "Delete Movies" : "Delete Movie"}
        isLoading={deleteMutation.isPending}
        onCancel={() => {
          if (!deleteMutation.isPending) {
            setPendingDeleteIds([]);
          }
        }}
        onConfirm={() => deleteMutation.mutate(pendingDeleteIds)}
      />
    </div>
  );
}
