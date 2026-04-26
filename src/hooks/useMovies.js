import { useQuery } from "@tanstack/react-query";
import { getMovieById, getMovies } from "../api/movies.api";

export const useMoviesList = (params) =>
  useQuery({
    queryKey: ["admin-movies", params],
    queryFn: () => getMovies(params),
    placeholderData: (previousData) => previousData
  });

export const useMovieDetails = (id) =>
  useQuery({
    queryKey: ["admin-movie", id],
    queryFn: () => getMovieById(id),
    enabled: Boolean(id)
  });
